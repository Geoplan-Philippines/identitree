import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useOrganization(slug: string) {
  return useQuery({
    queryKey: ["organization", slug],
    queryFn: async () => {
      const { data, error } = await authClient.organization.getFullOrganization({
        query: { organizationSlug: slug },
      });
      if (error) throw new Error(error.message || "Failed to fetch organization");
      return data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20,
  });
}
