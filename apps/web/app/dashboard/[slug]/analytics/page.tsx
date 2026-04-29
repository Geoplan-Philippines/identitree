import { requireOrganizationAccess } from "@/lib/auth/redirects";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";

type AnalyticsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);

  return (
    <section className="main-container space-y-8 py-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground tracking-tight uppercase font-black">Analytics</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Monitor your organization's digital reach and engagement.
        </p>
      </div>

      <div className="grid gap-6">
        <AnalyticsChart slug={slug} />
      </div>
    </section>
  );
}
