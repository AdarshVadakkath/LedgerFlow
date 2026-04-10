import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewTaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: any;
}

const clients = [
  "Acme Corp",
  "XYZ Solutions",
  "Global Tech",
  "New Ventures Inc.",
  "Sharma Associates",
  "Patel Industries",
  "Sunrise Trading",
  "ABC Enterprises Pvt. Ltd.",
  "XYZ Solutions LLP",
  "Sharma & Associates",
  "Global Tech India Pvt. Ltd.",
  "Mehta Financial Services",
  "Gupta Constructions",
];

const assignees = [
  "CA Rajesh Kumar",
  "CA Priya Sharma",
  "CA Amit Patel",
  "CA Sneha Gupta",
  "CA Vikram Singh",
  "CA Deepa Nair",
  "CA Arjun Mehta",
  "CA Kavita Joshi",
];

const taskTypes = [
  "ITR Filing",
  "GST Return",
  "TDS Return",
  "Audit",
  "Bookkeeping",
  "Company Registration",
  "ROC Filing",
  "Consultation",
  "Tax Planning",
  "Other",
];

const priorities = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function ViewTask({ open, onClose, task }: ViewTaskModalProps) {
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    client: "",
    assignedTo: "",
    taskType: "",
    priority: "",
  });
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (task) {
      setFormData({
        taskTitle: task.title || "",
        description: "",
        client: task.client || "",
        assignedTo: task.assignedTo || "",
        taskType: task.type || "",
        priority: task.priority?.toLowerCase() || "",
      });
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    }
  }, [task]);

  if (!open) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
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
            View Task Details
          </CardTitle>
          <CardDescription>
            Review the assignment parameters for this task
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
                    placeholder="e.g. Q4 ITR Filing for ABC Enterprises"
                    value={formData.taskTitle}
                    onChange={(e) =>
                      handleInputChange("taskTitle", e.target.value)
                    }
                    className="h-10"
                    disabled
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the task..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="resize-none"
                    disabled
                  />
                </div>

                {/* Client */}
                <div className="space-y-2">
                  <Label htmlFor="client">
                    Client <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.client}
                    onValueChange={(value) =>
                      handleInputChange("client", value)
                    }
                    disabled
                  >
                    <SelectTrigger id="client" className="h-10 w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Task Type */}
                <div className="space-y-2">
                  <Label htmlFor="taskType">
                    Task Type
                  </Label>
                  <Select
                    value={formData.taskType}
                    onValueChange={(value) =>
                      handleInputChange("taskType", value)
                    }
                    disabled
                  >
                    <SelectTrigger id="taskType" className="h-10 w-full">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) =>
                      handleInputChange("assignedTo", value)
                    }
                    disabled
                  >
                    <SelectTrigger id="assignedTo" className="h-10 w-full">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Priority
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value)
                    }
                    disabled
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
                                p.value === "high" && "bg-red-500",
                                p.value === "medium" && "bg-yellow-500",
                                p.value === "low" && "bg-green-500",
                              )}
                            />
                            {p.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label>
                    Due Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled
                        className={cn(
                          "h-10 w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground",
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
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* ── Form Actions ── */}
            <Separator />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="gap-2">
                Close
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
