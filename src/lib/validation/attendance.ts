import { z } from "zod";

// ============= RESPONSE SCHEMAS =============
export const attendanceStatusSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.string().datetime().or(z.string()),
  log_in_time: z.string().nullable(),
  log_out_time: z.string().nullable(),
  duration: z.string().nullable(),
  status: z.enum(["present", "absent", "half_day", "leave"]).optional(),
});

export const logInResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.string(),
  log_in_time: z.string(),
  message: z.string().optional(),
});

export const logOutResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.string(),
  log_out_time: z.string(),
  duration: z.string().nullable(),
  message: z.string().optional(),
});

export const attendanceStatusResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date: z.string(),
  log_in_time: z.string().nullable(),
  log_out_time: z.string().nullable(),
  duration: z.string().nullable(),
  status: z.string().optional(),
});

// ============= TYPES =============
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
export type LogInResponse = z.infer<typeof logInResponseSchema>;
export type LogOutResponse = z.infer<typeof logOutResponseSchema>;
export type AttendanceStatusResponse = z.infer<
  typeof attendanceStatusResponseSchema
>;
