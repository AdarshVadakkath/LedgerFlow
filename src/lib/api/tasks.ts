import { api } from "./axios";
import {
  createTaskSchema,
  createSubtaskSchema,
  taskResponseSchema,
} from "@/lib/validation/task";
import type {
  CreateTaskInput,
  CreateSubtaskInput,
  TaskResponse,
  PaginatedTasksResponse,
  CreateCommentInput,
} from "@/lib/validation/task";
import {
  paginatedTasksResponseSchema,
  createCommentSchema,
} from "@/lib/validation/task";

export const createTask = async (
  input: CreateTaskInput,
): Promise<TaskResponse> => {
  const validated = createTaskSchema.parse(input);

  const { data } = await api.post("/tasks/", validated);
  const response = taskResponseSchema.parse(data);
  return response;
};

export const getTasks = async (): Promise<PaginatedTasksResponse> => {
  const { data } = await api.get("/tasks/");
  return paginatedTasksResponseSchema.parse(data);
};

export const createSubtask = async (
  parentId: number,
  input: CreateSubtaskInput,
): Promise<TaskResponse> => {
  const validated = createSubtaskSchema.parse(input);

  const { data } = await api.post(`/tasks/${parentId}/subtasks/`, validated);
  const response = taskResponseSchema.parse(data);
  return response;
};

export const createComment = async (
  taskId: number,
  input: CreateCommentInput,
) => {
  const validated = createCommentSchema.parse(input);
  const { data } = await api.post(`/tasks/${taskId}/comments/`, validated);
  return data;
};

export const getComments = async (taskId: number | string) => {
  const { data } = await api.get(`/tasks/${taskId}/comments/`);
  return data;
};

export const replyToComment = async (
  taskId: number | string,
  commentId: number | string,
  input: CreateCommentInput,
) => {
  const validated = createCommentSchema.parse(input);
  const { data } = await api.post(
    `/tasks/${taskId}/comments/${commentId}/reply/`,
    validated,
  );
  return data;
};

export const updateComment = async (
  taskId: number | string,
  commentId: number | string,
  input: CreateCommentInput,
) => {
  const validated = createCommentSchema.parse(input);
  const { data } = await api.patch(
    `/tasks/${taskId}/comments/${commentId}/`,
    validated,
  );
  return data;
};

export const deleteComment = async (
  taskId: number | string,
  commentId: number | string,
) => {
  const { data } = await api.delete(`/tasks/${taskId}/comments/${commentId}/`);
  return data;
};
