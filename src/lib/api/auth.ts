import { api } from "./axios";
import { loginResponseSchema } from "@/lib/validation/auth";
import type { LoginInput, LoginResponse } from "@/lib/validation/auth";

export const loginUser = async (data: LoginInput): Promise<LoginResponse> => {
  const res = await api.post("/auth/login/", data);
  // Validate response matches schema
  const validated = loginResponseSchema.parse(res.data);
  return validated;
};

export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};
