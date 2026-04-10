import { useQuery } from "@tanstack/react-query";
import { getStaffActivity, type StaffActivity } from "@/lib/api/dashboard";

export const useStaffActivity = () => {
  return useQuery<StaffActivity[]>({
    queryKey: ["dashboard", "staff-activity"],
    queryFn: getStaffActivity,
  });
};
