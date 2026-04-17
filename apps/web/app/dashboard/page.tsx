import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireOrganization } from "@/lib/auth/redirects";

export default async function DashboardIndexPage() {
  await requireOrganization();

  return (
    <section className="main-container flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-muted">
        <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="text-lg font-semibold text-foreground">
        No organization yet
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your organization to start managing digital business cards,
        contacts, and your team&apos;s identity.
      </p>
      <Button asChild className="mt-6 rounded-md">
        <Link href="/organization/setup">
          Set up organization
          <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}
