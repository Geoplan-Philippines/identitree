"use client";

import { useAnalyticsStats, AnalyticsFilters } from "@/hooks/use-analytics";
import { useProfiles } from "@/hooks/use-profiles";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, FilterX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [filters, setFilters] = useState<AnalyticsFilters>({
    from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  const { data: profiles } = useProfiles();
  const { data, isLoading, error, isFetching } = useAnalyticsStats(slug, filters);

  const handleRangeChange = (value: string) => {
    const to = new Date();
    let from = subDays(to, 30);

    if (value === "7d") from = subDays(to, 7);
    if (value === "30d") from = subDays(to, 30);
    if (value === "90d") from = subDays(to, 90);
    if (value === "24h") from = subDays(to, 1);

    setFilters((prev) => ({
      ...prev,
      from: format(from, "yyyy-MM-dd"),
      to: format(to, "yyyy-MM-dd"),
    }));
  };

  const clearFilters = () => {
    setFilters({
      from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const formattedData = data?.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d"),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 ml-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Period</p>
              {isFetching && <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground" />}
            </div>
            <Select defaultValue="30d" onValueChange={handleRangeChange}>
              <SelectTrigger className="w-[160px] h-9 text-xs font-bold uppercase tracking-wider">
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h" className="text-xs font-bold uppercase">Last 24 Hours</SelectItem>
                <SelectItem value="7d" className="text-xs font-bold uppercase">Last 7 Days</SelectItem>
                <SelectItem value="30d" className="text-xs font-bold uppercase">Last 30 Days</SelectItem>
                <SelectItem value="90d" className="text-xs font-bold uppercase">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Channel</p>
            <Select
              value={filters.channel || "ALL"}
              onValueChange={(val) => setFilters(prev => ({ ...prev, channel: val === "ALL" ? undefined : val as any }))}
            >
              <SelectTrigger className="w-[140px] h-9 text-xs font-bold uppercase tracking-wider">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs font-bold uppercase">All Channels</SelectItem>
                <SelectItem value="NFC_TAP" className="text-xs font-bold uppercase">NFC Taps</SelectItem>
                <SelectItem value="QR_SCAN" className="text-xs font-bold uppercase">QR Scans</SelectItem>
                <SelectItem value="DIRECT_LINK" className="text-xs font-bold uppercase">Direct Links</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profile</p>
            <Select
              value={filters.profileId || "ALL"}
              onValueChange={(val) => setFilters(prev => ({ ...prev, profileId: val === "ALL" ? undefined : val }))}
            >
              <SelectTrigger className="w-[180px] h-9 text-xs font-bold uppercase tracking-wider">
                <SelectValue placeholder="All Profiles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs font-bold uppercase">All Profiles</SelectItem>
                {profiles?.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id} className="text-xs font-bold uppercase">
                    {profile.firstName} {profile.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filters.channel || filters.profileId) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <FilterX className="mr-2 h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* ... skeletons ... */}
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
      ) : error || !data ? (
        <div className="h-[400px] flex items-center justify-center border border-dashed rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Failed to load analytics data</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6 lg:grid-cols-2 transition-opacity duration-200",
          isFetching && "opacity-60 pointer-events-none"
        )}>
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
      )}
    </div>
  );
}
