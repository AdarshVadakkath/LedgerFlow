import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/lib/api/clients";
import type { CreateClientInput } from "@/lib/validation/client";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string | number; input: CreateClientInput }) =>
      updateClient(id, input),
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific client query
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", variables.id.toString()] });
    },
  });
};
