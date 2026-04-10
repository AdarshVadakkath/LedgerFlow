import { z } from "zod";

// ============= RESPONSE SCHEMAS =============

export const assignedToDetailSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  email: z.string().email(),
  role: z.string(),
});

export const clientSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  pan: z.string(),
  tan: z.string(),
  gstin: z.string(),
  address: z.string(),
  assigned_to: z.number(),
  assigned_to_detail: assignedToDetailSchema,
  open_tasks: z.number().optional().default(0),
  total_tasks: z.number().optional().default(0),
  created_at: z.string(),
});

export const clientListSchema = z.array(clientSchema);

// ============= FORM VALIDATION SCHEMAS =============

export const createClientSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  pan: z.string().optional(),
  tan: z.string().optional(),
  gstin: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  assigned_to: z.number({ required_error: "Please assign a staff member" }).positive("Please assign a staff member"),
});

// ============= TYPES =============
export type ClientRaw = z.infer<typeof clientSchema>;
export type AssignedToDetailRaw = z.infer<typeof assignedToDetailSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
