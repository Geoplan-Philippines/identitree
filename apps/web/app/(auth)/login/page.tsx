import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
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
