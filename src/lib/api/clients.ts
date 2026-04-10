import { api } from "./axios";
import { clientListSchema, clientSchema, type CreateClientInput } from "@/lib/validation/client";

// ===================== Client Types =====================

/** Frontend-friendly assigned-to model */
export interface AssignedToDetail {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

/** Frontend-friendly client model */
export interface Client {
  id: number;
  businessName: string;
  pan: string;
  tan: string;
  gstin: string;
  address: string;
  assignedTo: number;
  assignedToDetail: AssignedToDetail;
  openTasks: number;
  totalTasks: number;
  createdAt: string;
}

/** Map a single validated raw record → frontend model */
const mapClient = (raw: Record<string, any>): Client => ({
  id: raw.id,
  businessName: raw.business_name,
  pan: raw.pan,
  tan: raw.tan,
  gstin: raw.gstin,
  address: raw.address,
  assignedTo: raw.assigned_to,
  assignedToDetail: {
    id: raw.assigned_to_detail.id,
    fullName: raw.assigned_to_detail.full_name,
    email: raw.assigned_to_detail.email,
    role: raw.assigned_to_detail.role,
  },
  openTasks: raw.open_tasks,
  totalTasks: raw.total_tasks,
  createdAt: raw.created_at,
});

/** Fetches all clients, validates with Zod, and returns mapped results */
export const getClients = async (): Promise<Client[]> => {
  const { data } = await api.get("/clients/");
  const validated = clientListSchema.parse(data);
  return validated.map(mapClient);
};

/** Creates a new client via POST and returns the mapped result */
export const createClient = async (input: CreateClientInput): Promise<Client> => {
  // Clean payload: backend fails with 400 if we send empty strings for optional tax/document fields
  const payload = {
    ...input,
    pan: input.pan || undefined,
    tan: input.tan || undefined,
    gstin: input.gstin || undefined,
  };

  const { data } = await api.post("/clients/", payload);
  const validated = clientSchema.parse(data);
  return mapClient(validated);
};

/** Fetches a single client by ID, validates with Zod, and returns the mapped result */
export const getClient = async (id: string | number): Promise<Client> => {
  const { data } = await api.get(`/clients/${id}/`);
  const validated = clientSchema.parse(data);
  return mapClient(validated);
};

/** Updates an existing client via PATCH and returns the mapped result */
export const updateClient = async (id: string | number, input: CreateClientInput): Promise<Client> => {
  const payload = {
    ...input,
    pan: input.pan || undefined,
    tan: input.tan || undefined,
    gstin: input.gstin || undefined,
  };

  const { data } = await api.patch(`/clients/${id}/`, payload);
  const validated = clientSchema.parse(data);
  return mapClient(validated);
};
