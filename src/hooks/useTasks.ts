import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  createSubtask,
  createComment,
  getComments,
  replyToComment,
  updateComment,
  deleteComment,
  getTasks,
} from "@/lib/api/tasks";
import type { CreateTaskInput, CreateSubtaskInput, CreateCommentInput, PaginatedTasksResponse } from "@/lib/validation/task";

// ============= CREATE TASK MUTATION =============
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
};

// ============= CREATE SUBTASK MUTATION =============
export const useCreateSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      parentId,
      input,
    }: {
      parentId: number;
      input: CreateSubtaskInput;
    }) => createSubtask(parentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
};

// ============= CREATE COMMENT MUTATION =============
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      input,
    }: {
      taskId: number;
      input: CreateCommentInput;
    }) => createComment(taskId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useGetComments = (taskId: string | number) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(taskId),
    enabled: !!taskId,
  });
};

export const useReplyToComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      commentId,
      input,
    }: {
      taskId: number | string;
      commentId: number | string;
      input: CreateCommentInput;
    }) => replyToComment(taskId, commentId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      commentId,
      input,
    }: {
      taskId: number | string;
      commentId: number | string;
      input: CreateCommentInput;
    }) => updateComment(taskId, commentId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      commentId,
    }: {
      taskId: number | string;
      commentId: number | string;
    }) => deleteComment(taskId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
    },
  });
};


// ============= TASKS LIST QUERY =============
export const useTasksList = () => {
  return useQuery<PaginatedTasksResponse>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes – avoids re-fetch on every navigation
  });
};
