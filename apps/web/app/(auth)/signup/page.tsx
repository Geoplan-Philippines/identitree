import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Register with your email and password to get started."
      footerLabel="Already have an account?"
      footerHref="/login"
      footerActionText="Sign in"
    >
      <SignupForm />
    </AuthCard>
  );
}
