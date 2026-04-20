import { z } from "zod";

export const taskStatusSchema = z.enum([
  "UNASSIGNED",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "BLOCKED",
  "OVERDUE",
]);

export const taskTypeSchema = z.enum(["BILLABLE", "NON_BILLABLE"]);

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional().default(""),
  client: z
    .number({ error: "Client is required" })
    .positive("Client is required"),
  assigned_to: z
    .number({ error: "Assignee is required" })
    .positive("Assignee is required"),
  parent: z.number().positive().nullable().optional(),
  deadline: z.string().min(1, "Deadline is required"),
  status: taskStatusSchema.default("UNASSIGNED"),
  type: taskTypeSchema.default("BILLABLE"),
  priority: taskPrioritySchema.default("MEDIUM"),
  created_by: z.number().positive().optional(),
});

export const createSubtaskSchema = z.object({
  title: z.string().min(1, "Subtask title is required"),
  description: z.string().optional().default(""),
  client: z
    .number({ error: "Client is required" })
    .positive("Client is required"),
  assigned_to: z
    .number({ error: "Assignee is required" })
    .positive("Assignee is required"),
  parent: z.number().positive(),
  deadline: z.string().min(1, "Deadline is required"),
  status: taskStatusSchema.default("UNASSIGNED"),
  type: taskTypeSchema.default("BILLABLE"),
  priority: taskPrioritySchema.default("MEDIUM"),
  created_by: z.number().positive().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty"),
});

// ============= RESPONSE SCHEMAS =============

export const taskResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable().optional(),
    client: z.number(),
    assigned_to: z.number(),
    parent: z.number().nullable().optional(),
    deadline: z.string().nullable().optional(),
    status: z.string(),
    type: z.string(),
    priority: z.string(),
    created_by: z.number().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough(); // Allow additional fields from API

export const taskListResponseSchema = z.array(taskResponseSchema);

export const paginatedTasksResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
  results: taskListResponseSchema,
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskType = z.infer<typeof taskTypeSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type PaginatedTasksResponse = z.infer<
  typeof paginatedTasksResponseSchema
>;
