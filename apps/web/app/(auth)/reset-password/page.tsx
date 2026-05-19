import { Suspense } from "react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function ResetPasswordPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthSplitLayout
      eyebrow="Reset Password"
      title="Create new password"
      description="Your new password must be different from your previous password."
      footerAction={{
        label: "Need more help?",
        href: "mailto:support@geoplanph.com",
        actionText: "Contact support",
      }}
    >
      <Suspense
        fallback={(
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        )}
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
