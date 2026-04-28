import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNfcCards, createNfcCard, NfcCard, updateNfcCard, getPublicProfile } from "@/lib/services/nfc-cards.service";

export function useNfcCards() {
  return useQuery({
    queryKey: ["nfc-cards"],
    queryFn: getNfcCards,

    staleTime: 1000 * 60 * 5, // 5 minutes (data considered fresh)
    gcTime: 1000 * 60 * 10,   // cache kept for 10 minutes
  });
}

export function useCreateNfcCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNfcCard,
    onSuccess: (newCard) => {
      // Manually update the cache to include the new card at the top
      queryClient.setQueryData(["nfc-cards"], (oldData: NfcCard[] | undefined) => {
        if (!oldData) return [newCard];
        return [newCard, ...oldData];
      });
    },
  });
}

export function useUpdateNfcCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NfcCard> }) =>
      updateNfcCard(id, payload),
    onSuccess: (updatedCard) => {
      // Update the specific card in the cache
      queryClient.setQueryData(["nfc-cards"], (oldData: NfcCard[] | undefined) => {
        if (!oldData) return [updatedCard];
        return oldData.map(card => card.id === updatedCard.id ? updatedCard : card);
      });
    },
  });
}

export function usePublicProfile(orgSlug: string, profileSlug: string) {
  return useQuery({
    queryKey: ["public-profile", orgSlug, profileSlug],
    queryFn: () => getPublicProfile(orgSlug, profileSlug),
    enabled: !!orgSlug && !!profileSlug,
  });
}
