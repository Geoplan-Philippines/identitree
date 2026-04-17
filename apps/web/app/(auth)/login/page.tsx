import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { redirectAuthenticatedUserAwayFromGuestPages } from "@/lib/auth/redirects";

export default async function LoginPage() {
  await redirectAuthenticatedUserAwayFromGuestPages();

  return (
    <AuthCard
      title="Sign in to your account"
      description="Use your email and password to access your workspace."
      footerLabel="Need an account?"
      footerHref="/signup"
      footerActionText="Create one"
    >
      <LoginForm />
    </AuthCard>
  );
}
