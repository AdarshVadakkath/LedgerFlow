import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary, type DashboardSummary } from "@/lib/api/dashboard";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
};
