import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/api/clients";
import type { CreateClientInput } from "@/lib/validation/client";

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateClientInput) => createClient(input),
    onSuccess: () => {
      // Invalidate the clients list so it refetches with the new client
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
