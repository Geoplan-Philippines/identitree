import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTemplates, Template } from "@/lib/services/nfc-cards.service";
import { apiClient } from "@/lib/api/client";

export function useTemplates(initialData?: Template[]) {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => getTemplates(),
    initialData,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: Partial<Template>) => 
      apiClient.post<Template>("/templates", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Template> }) => 
      apiClient.patch<Template>(`/templates/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      apiClient.delete(`/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}
