"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/zod/auth";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        throw new Error(error.message || "Failed to send reset link.");
      }

      setIsSubmitted(true);
      setEmailSent(data.email);
      toast.success("Reset link sent!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send reset link.";
      toast.error("Error", {
        description: message,
      });
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Check your email</h2>
          <p className="text-sm text-muted-foreground px-6">
            We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{emailSent}</span>.
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-primary hover:underline font-medium"
          >
            try again
          </button>
        </p>
        <div className="pt-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 size-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
              <Input
                {...field}
                id="forgot-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            Back to login
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
