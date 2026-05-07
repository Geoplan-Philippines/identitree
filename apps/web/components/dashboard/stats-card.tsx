import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  href?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  href,
  trend,
}: StatsCardProps) {
  const content = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span
              className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded-full",
                trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
            <span className="text-[10px] text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block group/stats-card">
        <Card className={cn("overflow-hidden transition-all group-hover/stats-card:border-primary group-hover/stats-card:shadow-sm", className)}>
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {content}
    </Card>
  );
}
