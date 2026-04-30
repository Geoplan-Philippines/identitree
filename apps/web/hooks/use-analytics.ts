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
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.profileId) params.append("profileId", filters.profileId);
      if (filters.channel) params.append("channel", filters.channel);

      const queryString = params.toString();
      const res = await fetch(`/api/analytics/stats/${slug}${queryString ? `?${queryString}` : ""}`);
      
      if (!res.ok) throw new Error("Failed to fetch analytics stats");
      
      const json = await res.json();
      // The Next.js route forwards the NestJS envelope; extract data if wrapped
      return (json?.data ?? json) as {
        date: string;
        views: number;
        saves: number;
        nfc: number;
        qr: number;
        direct: number;
      }[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes (data considered fresh)
    gcTime: 1000 * 60 * 10,   // cache kept for 10 minutes
    placeholderData: keepPreviousData,
    enabled: !!slug,
  });
}
