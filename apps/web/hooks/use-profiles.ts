import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/lib/services/profile.service";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const res = await fetch("/api/profiles");
      if (!res.ok) throw new Error("Failed to fetch profiles");
      
      const json = await res.json();
      return (json?.data ?? json) as Profile[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20,
  });
}
