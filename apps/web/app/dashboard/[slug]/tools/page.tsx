import { requireOrganizationAccess } from "@/lib/auth/redirects";
import Link from "next/link";
import { Nfc } from "lucide-react";
import { PageHeader } from "@/components/shared/page-shell";

type ToolsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tools"
        description="Utility tools for card management."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/activate"
          className="group flex flex-col gap-4 border border-border bg-background p-6 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="bg-foreground text-background p-2">
              <Nfc className="size-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
              Open →
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider">Card Activation</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Link a customer-owned NFC card to a profile by writing the URL directly to the chip.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
