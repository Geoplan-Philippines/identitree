"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/zod/auth";

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    try {
      setError(null);

      if (!token) {
        throw new Error("Invalid or missing reset token. Please request a new link.");
      }

      const { error: resetError } = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (resetError) {
        throw new Error(resetError.message || "Failed to reset password.");
      }

      setIsSuccess(true);
      toast.success("Password reset successfully!");
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset password.";
      setError(message);
      toast.error("Error", { description: message });
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Password updated</h2>
          <p className="text-sm text-muted-foreground px-6">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </p>
        </div>
        <div className="pt-4">
          <Button asChild className="w-full">
            <Link href="/login">Login now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 flex items-start gap-3 mb-4">
          <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-medium leading-relaxed">
            {error}. The link might be expired or invalid. 
            <Link href="/forgot-password" size-xs className="ml-1 underline hover:no-underline">Request a new one</Link>
          </p>
        </div>
      )}

      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirm-password">Confirm New Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Updating password..." : "Reset password"}
        </Button>
      </FieldGroup>
    </form>
  );
}
