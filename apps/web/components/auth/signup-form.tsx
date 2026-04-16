"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { authService } from "@/lib/services/auth.service";
import { signupSchema, type SignupFormValues } from "@/lib/zod/auth";

export function SignupForm() {
  const router = useRouter();

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
      toast.success("Account created");

      if (result.organizationSlug) {
        router.push(`/dashboard/${result.organizationSlug}`);
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

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <FieldSeparator>OR</FieldSeparator>

        <Button type="button" variant="outline" className="w-full" disabled>
          Continue with Google (soon)
        </Button>
      </FieldGroup>
    </form>
  );
}
