"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginFormValues } from "@/lib/zod/auth";
import Link from "next/link";
import posthog from "posthog-js";

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (errorParam === "account_not_linked" || errorParam === "ACCOUNT_NOT_LINKED") {
      toast.error("Account linking blocked", {
        description: "This email is already registered with a password. Please log in using your email and password instead.",
      });
    } else if (errorParam === "SOCIAL_LOGIN_ONLY") {
      toast.error("Social login required", {
        description: "This account uses Google Sign-In. Please log in using Google instead.",
      });
    } else if (errorParam) {
      toast.error("Authentication error", {
        description: errorParam.replace(/_/g, " "),
      });
    }
  }, [errorParam]);

  async function onSubmit(data: LoginFormValues) {
    try {
      const { data: session, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message || "Login failed");
      }

      // Fetch organizations - handle case where user just signed up with no organizations
      let organizationSlug: string | null = null;
      try {
        const { data: orgs, error: orgsError } =
          await authClient.organization.list();

        if (orgsError) {
          console.warn("Failed to fetch organizations:", orgsError);
        } else if (orgs && orgs.length > 0 && orgs[0]) {
          organizationSlug = orgs[0].slug;
          // Explicitly set the active organization so hooks and sub-requests are consistent
          await authClient.organization.setActive({
            organizationId: orgs[0].id,
          });
        }
      } catch (orgError) {
        console.warn("Error fetching organizations:", orgError);
      }

      toast.success("Login successful");
      posthog.capture("user_signed_in", {
        method: "email",
        $set: { login_method: "email" },
      });

      if (organizationSlug) {
        window.location.assign(`/dashboard/${organizationSlug}`);
        return;
      }

      // User has no organization yet - redirect to setup
      window.location.assign(`/organization/setup?userId=${session?.user.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error("Login failed", {
        description: message,
      });
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
      });
      posthog.capture("user_signed_in", {
        method: "google",
        $set: { login_method: "google" },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google sign-in failed.";
      toast.error("Google sign-in failed", {
        description: message,
      });
      setIsGoogleLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      <FieldGroup className="gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="login-email"
                className="text-[12px] font-medium text-foreground/80"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-11 px-3"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel
                  htmlFor="login-password"
                  className="text-[12px] font-medium text-foreground/80"
                >
                  Password
                </FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...field}
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  className="h-11 px-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full text-[13.5px] font-medium shadow-sm"
          disabled={form.formState.isSubmitting || isGoogleLoading}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </FieldGroup>

      <FieldSeparator className="text-[11px] uppercase tracking-[0.16em]">
        or
      </FieldSeparator>

      <Button
        type="button"
        variant="outline"
        className="w-full text-[13.5px] font-medium"
        onClick={() => void handleGoogleSignIn()}
        disabled={isGoogleLoading || form.formState.isSubmitting}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </Button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.39 3.57v2.97h3.86c2.26-2.09 3.58-5.17 3.58-8.78z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.32c-.25-.72-.38-1.49-.38-2.32 0-.81.14-1.6.38-2.32V6.59H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.41l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
