import { useQuery } from "@tanstack/react-query";
import { getClients, type Client } from "@/lib/api/clients";

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000, // 5 minutes – avoids re-fetch on every navigation
  });
};
