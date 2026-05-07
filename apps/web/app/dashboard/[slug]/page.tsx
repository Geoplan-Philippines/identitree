import { cookies } from "next/headers";
import { CreditCard, Activity, CheckCircle2, XCircle } from "lucide-react";

import { requireOrganizationAccess } from "@/lib/auth/redirects";
import { PageHeader } from "@/components/shared/page-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { getNfcCards } from "@/lib/services/nfc-cards.service";
import { analyticsService } from "@/lib/services/analytics.service";
import { getInclusiveDateRange } from "@/lib/utils/date";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

type DashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DashboardSlugPage({ params }: DashboardPageProps) {
  const { slug } = await params;
  await requireOrganizationAccess(slug);

  const cookieHeader = (await cookies()).toString();
  const headers = { Cookie: cookieHeader };
  const dateRange = getInclusiveDateRange(30);

  // Fetch data in parallel
  const [cards, analyticsData] = await Promise.all([
    getNfcCards(headers).catch(() => []),
    analyticsService.getStats(slug, dateRange, headers).catch(() => []),
  ]);

  // Calculate metrics
  const totalTaps = analyticsData.reduce((acc, curr) => acc + curr.views, 0);
  const totalCards = cards.length;
  const activeCards = cards.filter((c) => c.status === "ACTIVE").length;
  const inactiveCards = cards.filter((c) => c.status === "INACTIVE").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description={`Welcome back to your ${slug} workspace. Here's what's happening.`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Taps"
          value={totalTaps}
          icon={Activity}
          description="Profile views (Last 30 days)"
          href={`/dashboard/${slug}/analytics`}
        />
        <StatsCard
          title="Active Cards"
          value={activeCards}
          icon={CheckCircle2}
          description="Hardware currently active"
          href={`/dashboard/${slug}/cards`}
        />
        <StatsCard
          title="Inactive Cards"
          value={inactiveCards}
          icon={XCircle}
          description="Cards waiting or lost"
          href={`/dashboard/${slug}/cards`}
        />
        <StatsCard
          title="Card Fleet"
          value={totalCards}
          icon={CreditCard}
          description="Total physical cards managed"
          href={`/dashboard/${slug}/cards`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart data={analyticsData} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
