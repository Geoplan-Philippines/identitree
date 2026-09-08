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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { parseSafeDate, getInclusiveDateRange } from "@/lib/utils/date";
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
  const [filters, setFilters] = useState<AnalyticsFilters>(getInclusiveDateRange(30));

  const { data: profiles } = useProfiles();
  const { data, isLoading, error, isFetching } = useAnalyticsStats(slug, filters);

  const handleRangeChange = (value: string) => {
    let range = getInclusiveDateRange(30);

    if (value === "7d") range = getInclusiveDateRange(7);
    if (value === "30d") range = getInclusiveDateRange(30);
    if (value === "90d") range = getInclusiveDateRange(90);
    if (value === "24h") {
      const to = new Date();
      const from = subDays(to, 1);
      range = {
        from: format(from, "yyyy-MM-dd"),
        to: format(to, "yyyy-MM-dd"),
      };
    }

    setFilters((prev) => ({
      ...prev,
      ...range,
    }));
  };

  const clearFilters = () => {
    setFilters(getInclusiveDateRange(30));
  };



  const formattedData = data?.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d"),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 ml-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Period</p>
              {isFetching && <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground" />}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[260px] justify-start text-left text-xs font-bold uppercase tracking-wider rounded-lg border-foreground/10",
                    !filters.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {filters.from ? (
                    filters.to ? (
                      <>
                        {format(parseSafeDate(filters.from)!, "LLL dd, y")} -{" "}
                        {format(parseSafeDate(filters.to)!, "LLL dd, y")}
                      </>
                    ) : (
                      format(parseSafeDate(filters.from)!, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-lg border-border shadow-2xl" align="start">
                <div className="flex divide-x divide-border">
                  <div className="flex flex-col gap-1 p-2 bg-muted/20 min-w-[140px]">
                    {[
                      { label: "Last 24 Hours", value: "24h" },
                      { label: "Last 7 Days", value: "7d" },
                      { label: "Last 30 Days", value: "30d" },
                      { label: "Last 90 Days", value: "90d" },
                    ].map((preset) => (
                      <Button
                        key={preset.value}
                        variant="ghost"
                        size="sm"
                        className="justify-start text-[10px] font-black uppercase tracking-widest h-8 rounded-lg px-2"
                        onClick={() => handleRangeChange(preset.value)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={new Date()}
                    selected={{
                      from: parseSafeDate(filters.from),
                      to: parseSafeDate(filters.to),
                    }}
                    onSelect={(range: DateRange | undefined) => {
                      if (range?.from) {
                        setFilters((prev) => ({
                          ...prev,
                          from: format(range.from!, "yyyy-MM-dd"),
                          to: range.to ? format(range.to, "yyyy-MM-dd") : format(range.from!, "yyyy-MM-dd"),
                        }));
                      }
                    }}
                    numberOfMonths={2}
                    showOutsideDays={false}
                    className="rounded-lg"
                  />
                </div>
              </PopoverContent>
            </Popover>
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
            className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <FilterX className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* ... skeletons ... */}
          <Card className="rounded-2xl overflow-hidden">
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl overflow-hidden">
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
        <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Failed to load analytics data</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6 lg:grid-cols-2 transition-opacity duration-200",
          isFetching && "opacity-60 pointer-events-none"
        )}>
          {/* Interaction Chart */}
          <Card className="rounded-2xl overflow-hidden">
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
          <Card className="rounded-2xl overflow-hidden">
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
