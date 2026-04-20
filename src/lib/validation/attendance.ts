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
  session_id: z.number(),
  work_location: z.string(),
  work_location_display: z.string(),
  login_time: z.string(),
});

export const logOutResponseSchema = z.object({
  session_id: z.number(),
  login_time: z.string(),
  logout_time: z.string(),
  time_today: z.string(),
  total_seconds: z.number(),
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

// ============= WORK LOCATION ENUM =============
export const workLocationSchema = z.enum(["OFFICE", "REMOTE", "FIELD"]);

// ============= TYPES =============
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
export type LogInResponse = z.infer<typeof logInResponseSchema>;
export type LogOutResponse = z.infer<typeof logOutResponseSchema>;
export type AttendanceStatusResponse = z.infer<
  typeof attendanceStatusResponseSchema
>;
export type WorkLocation = z.infer<typeof workLocationSchema>;
