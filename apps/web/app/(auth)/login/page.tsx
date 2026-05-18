import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { LoginForm } from "@/components/auth/login-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function LoginPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthSplitLayout
      eyebrow="Sign in"
      title="Welcome back."
      description="Sign in to manage your NFC credentials, digital profiles, and team workspace."
      secondaryAction={{
        label: "New to Identitree?",
        href: "/signup",
        actionText: "Create account",
      }}
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
