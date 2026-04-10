import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/lib/api/auth";
import { loginSchema } from "@/lib/validation/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      try {
        const parsed = loginSchema.parse(data);
        return await loginUser(parsed);
      } catch (error: any) {
        // If it's a Zod validation error
        if (error.errors) {
          throw new Error(error.errors[0]?.message || "Validation failed");
        }
        throw error;
      }
    },

    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Invalidate all queries to refetch with new auth token
      queryClient.invalidateQueries();
    },

    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });
};
