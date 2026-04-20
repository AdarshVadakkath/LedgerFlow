import { useState } from "react";
import { 
  useCreateSubtask, 
  useCreateComment, 
  useGetComments, 
  useUpdateComment, 
  useDeleteComment, 
  useReplyToComment 
} from "@/hooks/useTasks";
import { createSubtaskSchema, createCommentSchema } from "@/lib/validation/task";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Plus,
  Send,
  User,
  Clock,
  ListChecks,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data matching tasks.tsx
const fakeTasks = [
  {
    id: "TASK-001",
    title: "Q4 ITR Filing",
    client: "Acme Corp",
    assignedTo: "CA Rajesh Kumar",
    type: "ITR Filing",
    priority: "High",
    status: "In Progress",
    dueDate: "2024-04-15",
    description: "Prepare and file the 4th quarter income tax return for Acme Corporation.",
  },
  {
    id: "TASK-002",
    title: "Monthly GST Return",
    client: "XYZ Solutions",
    assignedTo: "CA Priya Sharma",
    type: "GST Return",
    priority: "Medium",
    status: "To Do",
    dueDate: "2024-04-20",
    description: "Compile and file the GST returns for the previous month.",
  },
];

export default function TaskProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const taskId = Number(id?.replace("TASK-", "")) || 1;

  const createSubtaskMutation = useCreateSubtask();
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const replyToCommentMutation = useReplyToComment();
  const { data: fetchedCommentsData } = useGetComments(taskId);

  // Find task or fallback to mock
  const task = fakeTasks.find((t) => t.id === id) || {
    id: id || "TASK-XXX",
    title: "Sample Task",
    client: "Unknown Client",
    assignedTo: "Unassigned",
    type: "General",
    priority: "Medium",
    status: "To Do",
    dueDate: "2024-12-31",
    description: "This is a detailed description of what needs to be done for this task.",
  };

  // Subtasks State
  const [subtasks, setSubtasks] = useState([
    { id: 1, title: "Gather required documents from client", completed: true },
    { id: 2, title: "Review financial statements", completed: false },
    { id: 3, title: "Draft initial computation", completed: false },
  ]);
  const [newSubtask, setNewSubtask] = useState("");

  // Comments State
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);

  const comments = (Array.isArray(fetchedCommentsData) 
    ? fetchedCommentsData 
    : fetchedCommentsData?.results || []
  ).map((c: any) => ({
    id: c.id,
    author: c.author?.first_name ? `${c.author.first_name} ${c.author.last_name || ''}` : `User ${c.author?.id || c.created_by || 'Unknown'}`,
    time: c.created_at ? new Date(c.created_at).toLocaleString() : "Just now",
    text: c.body,
  }));

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    // Get current user id from localStorage
    const storedUser = localStorage.getItem("user");
    let createdBy: number | undefined;
    if (storedUser) {
      try {
        createdBy = JSON.parse(storedUser).id;
      } catch {}
    }

    // Parse task ID from URL param
    const parentId = Number(id?.replace("TASK-", "")) || 1;

    // Build subtask payload
    const payload = {
      title: newSubtask,
      description: "",
      client: 1, // Inherit from parent in a real scenario
      assigned_to: 1, // Inherit from parent in a real scenario
      parent: parentId,
      deadline: new Date().toISOString(),
      status: "UNASSIGNED" as const,
      type: "BILLABLE" as const,
      priority: "MEDIUM" as const,
      ...(createdBy && { created_by: createdBy }),
    };

    const result = createSubtaskSchema.safeParse(payload);
    if (!result.success) {
      toast.error("Validation failed", {
        description: (result.error.issues)?.[0]?.message || "Invalid subtask data",
      });
      return;
    }

    createSubtaskMutation.mutate(
      { parentId: taskId, input: result.data },
      {
        onSuccess: () => {
          setSubtasks([...subtasks, { id: Date.now(), title: newSubtask, completed: false }]);
          setNewSubtask("");
          toast.success("Subtask created", {
            description: `"${newSubtask}" added successfully.`,
          });
        },
        onError: (error: any) => {
          setSubtasks([...subtasks, { id: Date.now(), title: newSubtask, completed: false }]);
          setNewSubtask("");
          toast.error("API error, added locally", {
            description: error?.message || "Failed to sync with server",
          });
        },
      },
    );
  };

  const handleToggleSubtask = (st_id: number) => {
    setSubtasks(
      subtasks.map((st) => (st.id === st_id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const result = createCommentSchema.safeParse({ body: newComment });
    if (!result.success) {
      toast.error("Invalid comment");
      return;
    }

    if (replyingToCommentId) {
      replyToCommentMutation.mutate(
        { taskId, commentId: replyingToCommentId, input: result.data },
        {
          onSuccess: () => {
            setNewComment("");
            setReplyingToCommentId(null);
            toast.success("Reply added");
          },
          onError: () => toast.error("Failed to add reply")
        }
      );
    } else {
      createCommentMutation.mutate(
        { taskId, input: result.data },
        {
          onSuccess: () => {
            setNewComment("");
            toast.success("Comment added");
          },
          onError: () => toast.error("Failed to add comment", { description: "You might be offline." })
        }
      );
    }
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({ taskId, commentId }, {
      onSuccess: () => toast.success("Comment deleted"),
      onError: () => toast.error("Failed to delete comment")
    });
  };

  const startEditComment = (commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(text);
  };

  const handleSaveEditComment = () => {
    if (!editCommentText.trim() || !editingCommentId) return;

    updateCommentMutation.mutate(
      { taskId, commentId: editingCommentId, input: { body: editCommentText } },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditCommentText("");
          toast.success("Comment updated");
        },
        onError: () => toast.error("Failed to update comment")
      }
    );
  };

  const priorityColor: Record<string, string> = {
    High: "text-red-500 bg-red-500/10 border-red-500/20",
    Medium: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
    Low: "text-green-600 bg-green-500/10 border-green-500/20",
  };

  return (
    <div className="container max-w-full space-y-8 p-4 lg:p-6 pb-16">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/tasks")}
            className="hidden sm:flex mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
              <Badge variant={task.status === "Done" ? "default" : task.status === "In Progress" ? "secondary" : "outline"}>
                {task.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <ClipboardList className="h-4 w-4 text-primary" />
                {task.id}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Client: <span className="font-medium text-foreground">{task.client}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Due: <span className="font-medium text-foreground">{task.dueDate}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Edit Task</Button>
          <Button>Complete Task</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left Column: Details & Subtasks ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg">Task Description</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-foreground leading-relaxed">
                {task.description}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Priority</span>
                  <div>
                    <Badge variant="outline" className={priorityColor[task.priority] || ""}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Type</span>
                  <p className="font-medium">{task.type}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned To</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {task.assignedTo.charAt(0)}
                    </div>
                    <p className="font-medium">{task.assignedTo}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Subtasks</CardTitle>
              </div>
              <Badge variant="secondary">
                {subtasks.filter((s) => s.completed).length} / {subtasks.length} Done
              </Badge>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* List of subtasks */}
              <div className="space-y-3">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <Checkbox 
                      id={`subtask-${st.id}`} 
                      checked={st.completed}
                      onCheckedChange={() => handleToggleSubtask(st.id)}
                      className="mt-0.5"
                    />
                    <div className="grid gap-1.5 leading-none flex-1">
                      <label
                        htmlFor={`subtask-${st.id}`}
                        className={`text-sm font-medium leading-none cursor-pointer ${
                          st.completed ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        {st.title}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Add new subtask */}
              <div className="flex items-center gap-2 pt-2">
                <Input
                  placeholder="Add a new subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                  className="flex-1 bg-muted/30"
                />
                <Button variant="secondary" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Comments ── */}
        <div className="space-y-6">
          <Card className="shadow-sm flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Activity & Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-3 group">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-semibold text-primary text-xs">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {comment.time}
                        </span>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Comment actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditComment(comment.id, comment.text)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="mt-2 space-y-2">
                        <Textarea 
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="min-h-[60px] resize-none text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                          <Button size="sm" onClick={handleSaveEditComment} disabled={!editCommentText.trim()}>Save</Button>
                        </div>
                      </div>
                    ) : (
                    <div className="text-sm text-foreground bg-muted p-3 rounded-lg rounded-tl-none">
                        {comment.text}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                       <Button 
                          variant="link" 
                          className="h-auto p-0 text-xs text-muted-foreground" 
                          onClick={() => setReplyingToCommentId(comment.id)}
                       >
                         Reply
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-4">
                  No comments yet. Be the first to start the conversation!
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col border-t p-4 pb-4 items-stretch gap-2">
              {replyingToCommentId && (
                <div className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded-t-md">
                  <span className="text-muted-foreground">Replying to a comment...</span>
                  <Button variant="ghost" size="sm" onClick={() => setReplyingToCommentId(null)} className="h-4 p-0 px-1">Cancel</Button>
                </div>
              )}
              <div className="flex w-full items-end gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button size="icon" onClick={handleAddComment} disabled={!newComment.trim() || createCommentMutation.isPending || replyToCommentMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
