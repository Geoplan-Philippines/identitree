"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { getApiBasePath } from "@/lib/base-url";
import { authService } from "@/lib/services/auth.service";

type VerificationStatus =
  | "loading"
  | "verified"
  | "already-verified"
  | "expired"
  | "invalid-link"
  | "not-verified"
  | "no-session"
  | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = searchParams.get("token");
  const sent = searchParams.get("sent") === "1";
  const verified = searchParams.get("verified") === "1";
  const errorCode = searchParams.get("error");
  const emailFromQuery = searchParams.get("email");
  const apiBaseURL = getApiBasePath();

  const checkVerificationStatus = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const session = await authService.getSession();

      if (!session?.user) {
        setEmail(null);
        setStatus("no-session");
        return;
      }

      setEmail(session.user.email);
      setStatus(session.user.emailVerified ? "verified" : "not-verified");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not check email verification status.",
      );
    }
  }, []);

  useEffect(() => {
    if (errorCode === "TOKEN_EXPIRED") {
      setStatus("expired");
      return;
    }

    if (errorCode) {
      setStatus("invalid-link");
      return;
    }

    if (token) {
      void (async () => {
        const tokenStatus = await authService.getVerificationTokenStatus(token);

        if (tokenStatus.status === "already-verified") {
          setStatus("already-verified");
          setEmail(tokenStatus.email ?? emailFromQuery);
          return;
        }

        if (tokenStatus.status === "expired") {
          setStatus("expired");
          return;
        }

        if (tokenStatus.status === "invalid") {
          setStatus("invalid-link");
          return;
        }

        const callbackURL = `${window.location.origin}/verify-email?verified=1&email=${encodeURIComponent(tokenStatus.email ?? "")}`;
        const verifyURL = `${apiBaseURL}/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(callbackURL)}`;
        window.location.assign(verifyURL);
      })().catch((error: unknown) => {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not verify your email link.",
        );
      });
      return;
    }

    if (verified) {
      setStatus("verified");
      setEmail(emailFromQuery);
      return;
    }

    if (sent) {
      setStatus("not-verified");
      setEmail(emailFromQuery);
      return;
    }

    void checkVerificationStatus();
  }, [
    apiBaseURL,
    checkVerificationStatus,
    emailFromQuery,
    errorCode,
    sent,
    token,
    verified,
  ]);

  const description = useMemo(() => {
    if (status === "verified") {
      return "Your email is verified. You can continue to sign in.";
    }

    if (status === "already-verified") {
      return "This verification link was already used. Your email is already verified.";
    }

    if (status === "expired") {
      return "This verification link has expired. Please request a new verification email.";
    }

    if (status === "invalid-link") {
      return "This verification link is invalid.";
    }

    if (status === "not-verified") {
      return "We found your account, but your email is not verified yet.";
    }

    if (status === "no-session") {
      return "No active session was found. Please sign in again after verifying your email.";
    }

    if (status === "error") {
      return "We could not confirm your verification status right now.";
    }

    return "Checking your email verification status...";
  }, [status]);

  return (
    <AuthCard
      title="Email Verification Status"
      description={description}
      footerLabel="Back to"
      footerHref="/login"
      footerActionText="Sign in"
    >
      <div className="space-y-4">
        {status === "verified" && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Email verified successfully.
            </p>
            {email && (
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                Verified account: {email}
              </p>
            )}
          </div>
        )}

        {status === "not-verified" && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
              {sent
                ? "Verification email sent."
                : "Your email is still not verified."}
            </p>
            {email && (
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-400">
                Account email: {email}
              </p>
            )}
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-400">
              {sent
                ? "Please check your inbox and spam folder for the verification link."
                : "Check your inbox and spam folder, then click Refresh Status."}
            </p>
          </div>
        )}

        {status === "already-verified" && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
              This link was already used.
            </p>
            {email && (
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-400">
                Account email: {email}
              </p>
            )}
          </div>
        )}

        {status === "expired" && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-900 dark:text-red-300">
              Verification link expired.
            </p>
            <p className="mt-1 text-sm text-red-800 dark:text-red-400">
              Please sign in and request another verification email.
            </p>
          </div>
        )}

        {status === "invalid-link" && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-900 dark:text-red-300">
              Invalid verification link.
            </p>
            <p className="mt-1 text-sm text-red-800 dark:text-red-400">
              Please use the latest email link.
            </p>
          </div>
        )}

        {status === "no-session" && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Open your verification link from email, then return here and sign in.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-900 dark:text-red-300">
              Failed to check verification status.
            </p>
            {errorMessage && (
              <p className="mt-1 text-sm text-red-800 dark:text-red-400">{errorMessage}</p>
            )}
          </div>
        )}

        {status === "loading" && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Checking status...</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void checkVerificationStatus()}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Checking..." : "Refresh Status"}
        </Button>
      </div>
    </AuthCard>
  );
}
