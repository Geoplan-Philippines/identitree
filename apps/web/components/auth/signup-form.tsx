"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-fullName">Full name</FieldLabel>
              <Input
                {...field}
                id="signup-fullName"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <Input
                {...field}
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
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
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <FieldSeparator>OR</FieldSeparator>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void handleGoogleSignIn()}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
      </FieldGroup>
    </form>
  );
}
