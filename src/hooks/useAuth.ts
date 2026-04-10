import { useCallback, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/lib/api/auth";
import type { User } from "@/lib/validation/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
      // Clear all cached queries
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [queryClient]);

  const isAuthenticated = !!user && !!localStorage.getItem("accessToken");

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};
