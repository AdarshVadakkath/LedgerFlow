import { z } from "zod";

// ============= RESPONSE SCHEMAS =============
export const dashboardSummarySchema = z.object({
  total_tasks: z.coerce.number().optional().nullable(),
  completed_tasks: z.coerce.number().optional().nullable(),
  pending_tasks: z.coerce.number().optional().nullable(),
  overdue_tasks: z.coerce.number().optional().nullable(),
  today_attendance: z
    .object({
      log_in_time: z.string().nullable().optional(),
      log_out_time: z.string().nullable().optional(),
      status: z.string().nullable().optional(),
    })
    .optional()
    .nullable(),
  recent_activities: z.array(z.unknown()).optional().nullable(),
}).catchall(z.any());

// ============= TYPES =============
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
