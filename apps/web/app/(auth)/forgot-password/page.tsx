import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function ForgotPasswordPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthSplitLayout
      eyebrow="Reset access"
      title="Forgot password?"
      description="Enter your email and we'll send you a link to reset your password."
      footerAction={{
        label: "Remember your password?",
        href: "/login",
        actionText: "Sign in",
      }}
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
