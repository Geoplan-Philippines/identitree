import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function ForgotPasswordPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthCard
      title="Forgot password?"
      description="Enter your email and we'll send you a link to reset your password."
      footerLabel="Remember your password?"
      footerHref="/login"
      footerActionText="Sign in"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
