"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { signupSchema, type SignupFormValues } from "@/lib/zod/auth";
import posthog from "posthog-js";

export function SignupForm() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "USER_ALREADY_EXISTS") {
      router.push("/login?error=USER_ALREADY_EXISTS");
    } else if (errorParam) {
      toast.error("Authentication failed", {
        description: errorParam,
      });
    }
  }, [errorParam, router]);

  async function onSubmit(data: SignupFormValues) {
    try {
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
      });

      if (response.error) {
        const isExistingUser =
          response.error.code === "USER_ALREADY_EXISTS" ||
          response.error.message?.toLowerCase().includes("exists") ||
          response.error.status === 422;

        if (isExistingUser) {
          toast.error("Account already exists", {
            description: "This email is already registered. Please log in instead.",
          });
          form.setError("email", {
            type: "manual",
            message: "Email already in use",
          });
          return;
        }
        throw new Error(response.error.message || "Signup failed");
      }

      toast.success("Account created");
      posthog.capture("user_signed_up", {
        method: "email",
        $set: { signup_method: "email", login_method: "email" },
      });

      // Email/password users must verify their email first
      router.push(`/verify-email?sent=1&email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      const rawMessage =
        error instanceof Error
          ? error.message
          : "Signup failed. Please check your data and try again.";

      const resendTestingRestriction =
        "You can only send testing emails to your own email address";

      const message = rawMessage.includes(resendTestingRestriction)
        ? "Resend is in testing mode. You can only send verification emails to your verified recipient email. Verify a domain in Resend to send to any address."
        : rawMessage;

      toast.error("Signup failed", {
        description: message,
      });
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/organization/setup`,
      });
      posthog.capture("user_signed_up", {
        method: "google",
        $set: { signup_method: "google", login_method: "google" },
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
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="signup-fullName"
                className="text-[12px] font-medium text-foreground/80"
              >
                Full name
              </FieldLabel>
              <Input
                {...field}
                id="signup-fullName"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                className="h-11 px-3 text-[14px]"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="signup-email"
                className="text-[12px] font-medium text-foreground/80"
              >
                Work email
              </FieldLabel>
              <Input
                {...field}
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-11 px-3 text-[14px]"
              />
              {fieldState.invalid && (
                <FieldError
                  errors={
                    fieldState.error?.message === "Email already in use"
                      ? []
                      : [fieldState.error]
                  }
                >
                  {fieldState.error?.message === "Email already in use" && (
                    <span className="flex items-center gap-1">
                      Email already in use.{" "}
                      <Link
                        href="/login"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                      >
                        Sign in instead?
                      </Link>
                    </span>
                  )}
                </FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="signup-password"
                className="text-[12px] font-medium text-foreground/80"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  className="h-11 px-3 pr-10 text-[14px]"
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
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create your account"
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
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            <GoogleIcon />
            Sign up with Google
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
