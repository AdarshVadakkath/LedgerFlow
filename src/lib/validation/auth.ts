import { z } from "zod";

// ============= INPUT SCHEMAS =============
export const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

// ============= RESPONSE SCHEMAS =============
export const userSchema = z.object({
  id: z.number(),
  username: z.string().nullable().optional(),
  email: z.string().email(),
  full_name: z.string().nullable().optional(),
  role: z.string(),
  phone: z.string().nullable().optional(),
});

export const loginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
  user: userSchema,
  is_admin: z.boolean(),
  has_active_session: z.boolean(),
});

// ============= TYPES =============
export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
