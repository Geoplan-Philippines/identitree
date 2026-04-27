import { useQuery } from "@tanstack/react-query";
import { fetchNfcCards } from "@/lib/services/fetch-nfc-cards.service";

export function useNfcCards() {
  return useQuery({
    queryKey: ["nfc-cards"],
    queryFn: fetchNfcCards,

    staleTime: 1000 * 60 * 5, // 5 minutes (data considered fresh)
    gcTime: 1000 * 60 * 10,   // cache kept for 10 minutes
  });
}
