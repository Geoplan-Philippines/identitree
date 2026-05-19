import { AuthCard } from "@/components/auth/auth-card";
import { OrganizationSetupForm } from "@/components/auth/organization-setup-form";
import { requireNoOrganization } from "@/lib/auth/redirects";

export default async function OrganizationSetupPage() {
  const session = await requireNoOrganization();
  const firstName = session.user.name?.trim().split(/\s+/)[0] ?? null;

  return (
    <AuthCard
      footerLabel="Already have a workspace?"
      footerHref="/login"
      footerActionText="Sign in"
    >
      <header className="mb-7 space-y-2 text-center">
        <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-primary" />
          {firstName ? `Welcome, ${firstName}` : "Welcome aboard"}
        </p>
        <h1 className="text-[24px] font-semibold leading-[1.15] tracking-tight text-foreground">
          Let&apos;s create your organization.
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          One last step — set up your workspace before heading to the dashboard.
        </p>
      </header>

      <OrganizationSetupForm userId={session.user.id} />
    </AuthCard>
  );
}
