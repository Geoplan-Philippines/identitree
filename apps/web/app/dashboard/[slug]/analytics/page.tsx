import { requireOrganizationAccess } from "@/lib/auth/redirects";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";

type AnalyticsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex flex-col gap-4 px-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight uppercase">Analytics</h1>
        </div>
      </div>

      <div className="grid gap-6">
        <AnalyticsChart slug={slug} />
      </div>
    </div>
  );
}
