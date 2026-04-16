"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { authService } from "@/lib/services/auth.service";
import { signupSchema, type SignupFormValues } from "@/lib/zod/auth";
import { useAuth } from "@/providers/auth-provider";

export function SignupForm() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    try {
      const result = await authService.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
      const organization = await authService.getUserOrganization(result.user.id);

      setAuth({
        ...result,
        organizationSlug: organization.organizationSlug,
      });
      toast.success("Account created");

      if (organization.organizationSlug) {
        router.push(`/dashboard/${organization.organizationSlug}`);
        return;
      }

      router.push(`/organization/setup?userId=${result.user.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Signup failed. Please check your data and try again.";

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
        callbackURL: window.location.origin,
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <Input
                {...field}
                id="signup-password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
              />
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
