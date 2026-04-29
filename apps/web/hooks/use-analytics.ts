import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/services/analytics.service";

export function useAnalyticsStats(slug: string) {
  return useQuery({
    queryKey: ["analytics-stats", slug],
    queryFn: () => analyticsService.getStats(slug),
    enabled: !!slug,
  });
}
