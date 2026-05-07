"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
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

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logging in..." : "Log in"}
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
