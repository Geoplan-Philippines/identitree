import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { analyticsService, AnalyticsChannel } from "@/lib/services/analytics.service";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  profileId?: string;
  channel?: AnalyticsChannel;
};

export function useAnalyticsStats(slug: string, filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: ["analytics-stats", slug, filters],
    queryFn: () => analyticsService.getStats(slug, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes (data considered fresh)
    gcTime: 1000 * 60 * 10,   // cache kept for 10 minutes
    placeholderData: keepPreviousData,
    enabled: !!slug,
  });
}
