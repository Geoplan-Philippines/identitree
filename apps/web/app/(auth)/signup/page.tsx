import Link from "next/link";

import { AuthFlowShell } from "@/components/auth/auth-flow-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function SignupPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthFlowShell
      currentStep={1}
      steps={[
        { number: "01", label: "Create account" },
        { number: "02", label: "Verify email" },
      ]}
      heading={
        <>
          Start your free
          <br />
          Identitree workspace.
        </>
      }
      subheading="No credit card required. Set up your team and issue your first credential in under a minute."
      navAction={{
        prompt: "Already a member?",
        label: "Sign in",
        href: "/login",
      }}
      finePrint={
        <>
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </>
      }
    >
      <SignupForm />
    </AuthFlowShell>
  );
}
