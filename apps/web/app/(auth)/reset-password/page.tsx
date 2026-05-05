import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function ResetPasswordPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthCard
      title="Create new password"
      description="Your new password must be different from your previous password."
      footerLabel="Need more help?"
      footerHref="mailto:support@geoplanph.com"
      footerActionText="Contact support"
    >
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
