import { useQuery } from "@tanstack/react-query";
import { getClient, type Client } from "@/lib/api/clients";

export const useClient = (id: string | number) => {
  return useQuery<Client>({
    queryKey: ["client", id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};
