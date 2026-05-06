import { requireOrganizationAccess } from "@/lib/auth/redirects";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { PageHeader } from "@/components/shared/page-shell";

type AnalyticsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Monitor your engagement and acquisition sources."
      />

      <div className="grid gap-6">
        <AnalyticsChart slug={slug} />
      </div>
    </div>
  );
}
