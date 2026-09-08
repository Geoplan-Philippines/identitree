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
    await authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => {
          // You can add a loading state here if needed
        },
        onSuccess: () => {
          setIsSubmitted(true);
          setEmailSent(data.email);
          toast.success("Reset link sent!");
        },
        onError: (ctx) => {
          toast.error("Error", {
            description: ctx.error.message || "Failed to send reset link.",
          });
        },
      },
    );
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 py-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Check your email</h2>
          <p className="px-6 text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{emailSent}</span>.
          </p>
        </div>
        <p className="pt-2 text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setIsSubmitted(false)}
            className="font-medium text-primary hover:underline"
          >
            try again
          </button>
        </p>
        <div className="pt-3">
          <Button
            asChild
            className="w-full bg-blue-600 text-[13.5px] font-medium text-white hover:bg-blue-700"
          >
            <Link href="/login">
              <ArrowLeft className="size-4" />
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
                className="h-11 px-3 text-[14px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full text-[13.5px] font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>

        <div className="mt-1 text-center">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="size-3.5" />
            Back to login
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
