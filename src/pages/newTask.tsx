import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  X,
  ClipboardList,
  UserCheck,
  CalendarIcon,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateTask, useTasksList } from "@/hooks/useTasks";
import { useClients } from "@/hooks/useClients";
import { createTaskSchema } from "@/lib/validation/task";
import type { TaskPriority, TaskType, TaskStatus } from "@/lib/validation/task";
import { toast } from "sonner";

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "URGENT", label: "Urgent", color: "bg-red-600" },
  { value: "HIGH", label: "High", color: "bg-red-500" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-500" },
  { value: "LOW", label: "Low", color: "bg-green-500" },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "UNASSIGNED", label: "Unassigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
];

const taskTypes: { value: TaskType; label: string }[] = [
  { value: "BILLABLE", label: "Billable" },
  { value: "NON_BILLABLE", label: "Non-Billable" },
];

export function NewTask({ open, onClose }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("UNASSIGNED");
  const [type, setType] = useState<TaskType>("BILLABLE");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [parentTask, setParentTask] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTaskMutation = useCreateTask();

  const { data: clientsList = [], isLoading: clientsLoading } = useClients();
  const { data: rawTasks, isLoading: tasksLoading } = useTasksList();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Get created_by from localStorage
    const storedUser = localStorage.getItem("user");
    let createdBy: number | undefined;
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        createdBy = user.id;
      } catch {
        // Ignore parse errors
      }
    }

    const payload = {
      title,
      description,
      client: client ? Number(client) : 0,
      assigned_to: assignedTo ? Number(assignedTo) : 0,
      deadline: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      status,
      type,
      priority,
      ...(parentTask && { parent: Number(parentTask) }),
      ...(createdBy && { created_by: createdBy }),
    };

    // Validate with Zod schema
    const result = createTaskSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      (result.error.issues ?? []).forEach((err: any) => {
        const field = err.path?.[0]?.toString() || "form";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    createTaskMutation.mutate(result.data, {
      onSuccess: () => {
        toast.success("Task created successfully", {
          description: `"${title}" has been added.`,
        });
        handleReset();
        onClose();
      },
      onError: (error: any) => {
        toast.error("Failed to create task", {
          description: error?.message || "Something went wrong",
        });
      },
    });
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setClient("");
    setAssignedTo("");
    setPriority("MEDIUM");
    setStatus("UNASSIGNED");
    setType("BILLABLE");
    setDueDate(undefined);
    setParentTask("");
    setErrors({});
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        // close when clicking outside the card
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Modal Card ── */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardList className="h-5 w-5" />
            Create New Task
          </CardTitle>
          <CardDescription>
            Fill in the task details and assign it to a team member
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Section 1: Task Information ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <ClipboardList className="h-4 w-4" />
                Task Information
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Task Title */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="taskTitle">
                    Task Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="taskTitle"
                    placeholder="e.g. Create Q2 GST reports"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={cn("h-10", errors.title && "border-destructive")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Parent Task */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="parentTask">Parent Task (Optional)</Label>
                  <Select
                    value={parentTask}
                    onValueChange={(value) => setParentTask(value)}
                  >
                    <SelectTrigger id="parentTask" className="h-10 w-full">
                      <SelectValue
                        placeholder={
                          tasksLoading ? "Loading tasks..." : "Select a parent task (if subtask)"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {rawTasks?.results?.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label htmlFor="client">
                    Client <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={client}
                    onValueChange={(value) => setClient(value)}
                  >
                    <SelectTrigger
                      id="client"
                      className={cn(
                        "h-10 w-full",
                        errors.client && "border-destructive",
                      )}
                    >
                      <SelectValue
                        placeholder={
                          clientsLoading ? "Loading clients..." : "Select a client"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsList.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.businessName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.client && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.client}
                    </p>
                  )}
                </div>

                {/* Task Type */}
                <div className="space-y-2">
                  <Label htmlFor="taskType">
                    Task Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(value) => setType(value as TaskType)}
                  >
                    <SelectTrigger id="taskType" className="h-10 w-full">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ── Section 2: Assignment & Priority ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                <UserCheck className="h-4 w-4" />
                Assignment & Priority
              </div>
              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Assigned To */}
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">
                    Assigned To <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="assignedTo"
                    type="number"
                    placeholder="Enter staff member ID"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className={cn(
                      "h-10",
                      errors.assigned_to && "border-destructive",
                    )}
                  />
                  {errors.assigned_to && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.assigned_to}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Priority <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={priority}
                    onValueChange={(value) =>
                      setPriority(value as TaskPriority)
                    }
                  >
                    <SelectTrigger id="priority" className="h-10 w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                p.color,
                              )}
                            />
                            {p.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as TaskStatus)}
                  >
                    <SelectTrigger id="status" className="h-10 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label>
                    Deadline <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-10 w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground",
                          errors.deadline && "border-destructive",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.deadline && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.deadline}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Form Actions ── */}
            <Separator />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
                disabled={createTaskMutation.isPending}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                className="gap-2"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
