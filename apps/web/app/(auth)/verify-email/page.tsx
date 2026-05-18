import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { AuthFlowShell } from "@/components/auth/auth-flow-shell";
import { VerifyEmailStatus } from "@/components/auth/verify-email-status";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function VerifyEmailPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthFlowShell
      currentStep={2}
      steps={[
        { number: "01", label: "Create account" },
        { number: "02", label: "Verify email" },
      ]}
      heading={
        <>
          Verify your email
          <br />
          to get started.
        </>
      }
      subheading="We sent a verification link to your inbox. Open it to activate your Identitree workspace — it takes about 10 seconds."
      navAction={{
        prompt: "Already verified?",
        label: "Sign in",
        href: "/login",
      }}
    >
      <Suspense
        fallback={
          <div
            className="flex items-center gap-3 border border-border bg-muted/40 p-4 text-[13.5px] text-muted-foreground"
            role="status"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking verification status…
          </div>
        }
      >
        <VerifyEmailStatus />
      </Suspense>
    </AuthFlowShell>
  );
}
