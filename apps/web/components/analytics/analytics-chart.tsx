"use client";

import { useAnalyticsStats } from "@/hooks/use-analytics";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface AnalyticsChartProps {
  slug: string;
}

const interactionConfig = {
  views: {
    label: "Profile Views",
    color: "var(--chart-1)",
  },
  saves: {
    label: "Contact Saves",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const channelConfig = {
  nfc: {
    label: "NFC Taps",
    color: "var(--chart-3)",
  },
  qr: {
    label: "QR Scans",
    color: "var(--chart-4)",
  },
  direct: {
    label: "Direct Links",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function AnalyticsChart({ slug }: AnalyticsChartProps) {
  const { data, isLoading, error } = useAnalyticsStats(slug);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-xl overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[400px] flex items-center justify-center border border-dashed rounded-xl bg-muted/50">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Failed to load analytics data</p>
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d"),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Interaction Chart */}
      <Card className="rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Engagement Activity</CardTitle>
          <CardDescription>Daily views and contact saves</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={interactionConfig} className="h-[300px] w-full">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                fill="var(--color-views)"
                fillOpacity={0.1}
                strokeWidth={2}
                animationDuration={1000}
              />
              <Area
                type="monotone"
                dataKey="saves"
                stroke="var(--color-saves)"
                fill="var(--color-saves)"
                fillOpacity={0.1}
                strokeWidth={2}
                animationDuration={1000}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Channel Breakdown */}
      <Card className="rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Acquisition Source</CardTitle>
          <CardDescription>Breakdown by entry point</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={channelConfig} className="h-[300px] w-full">
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="nfc" fill="var(--color-nfc)" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="qr" fill="var(--color-qr)" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="direct" fill="var(--color-direct)" stackId="a" radius={[0, 0, 0, 0]} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
