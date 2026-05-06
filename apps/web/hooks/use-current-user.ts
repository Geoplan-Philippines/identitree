import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import type { AuthUser } from "@/lib/services/auth.service";

export function useCurrentUser(initialData?: AuthUser) {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();
      if (error) throw new Error(error.message || "Failed to fetch session");
      if (!data?.user) throw new Error("No user in session");
      return data.user as AuthUser;
    },
    initialData,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20,
  });
}
