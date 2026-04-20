import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  logInAttendance,
  logOutAttendance,
  getAttendanceStatus,
} from "@/lib/api/attendance";
import type { WorkLocation } from "@/lib/validation/attendance";

// ============= LOG IN MUTATION =============
export const useLogIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workLocation?: WorkLocation) =>
      logInAttendance(workLocation),
    onSuccess: () => {
      // Invalidate attendance status query
      queryClient.invalidateQueries({ queryKey: ["attendance-status"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (error: any) => {
      console.error("Log in error:", error);
    },
  });
};

// ============= LOG OUT MUTATION =============
export const useLogOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOutAttendance,
    onSuccess: () => {
      // Invalidate attendance status query
      queryClient.invalidateQueries({ queryKey: ["attendance-status"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (error: any) => {
      console.error("Log out error:", error);
    },
  });
};

// ============= ATTENDANCE STATUS QUERY =============
export const useAttendanceStatus = () => {
  return useQuery({
    queryKey: ["attendance-status"],
    queryFn: getAttendanceStatus,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
