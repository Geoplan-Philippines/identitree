"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
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

interface OverviewChartProps {
  data: {
    date: string;
    views: number;
    saves: number;
  }[];
}

const chartConfig = {
  views: {
    label: "Profile Views",
    color: "var(--chart-1)",
  },
  saves: {
    label: "Contact Saves",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function OverviewChart({ data }: OverviewChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM d"),
  }));

  return (
    <Card className="rounded-xl overflow-hidden border-border bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Engagement Activity</CardTitle>
        <CardDescription>Daily views and contact saves (Last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
  );
}
