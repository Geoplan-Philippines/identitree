import { AuthCard } from "@/components/auth/auth-card";
import { OrganizationSetupForm } from "@/components/auth/organization-setup-form";

export default function OrganizationSetupPage() {
  return (
    <AuthCard
      title="Set up your organization"
      description="Create your organization and slug before accessing your dashboard."
      footerLabel="Already have a workspace?"
      footerHref="/login"
      footerActionText="Sign in"
    >
      <OrganizationSetupForm />
    </AuthCard>
  );
}
