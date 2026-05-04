import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/lib/services/profile.service";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => profileService.getProfiles(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20,
  });
}
