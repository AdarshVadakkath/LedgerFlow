import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLogIn, useLogOut, useAttendanceStatus } from "@/hooks/useAttendance";
import { workLocationSchema } from "@/lib/validation/attendance";
import type { WorkLocation, LogInResponse } from "@/lib/validation/attendance";
import { toast } from "sonner";
import {
  Clock,
  LogIn,
  LogOut,
  MapPin,
  Building2,
  Home,
  Briefcase,
  Loader2,
  CheckCircle2,
  Timer,
} from "lucide-react";

interface TimeLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WORK_LOCATIONS: { value: WorkLocation; label: string; icon: React.ReactNode }[] = [
  { value: "OFFICE", label: "Office", icon: <Building2 className="h-4 w-4" /> },
  { value: "REMOTE", label: "Remote", icon: <Home className="h-4 w-4" /> },
  { value: "FIELD", label: "Field", icon: <Briefcase className="h-4 w-4" /> },
];

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function TimeLogModal({ open, onOpenChange }: TimeLogModalProps) {
  const [workLocation, setWorkLocation] = useState<WorkLocation>("OFFICE");
  const [activeSession, setActiveSession] = useState<LogInResponse | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const logInMutation = useLogIn();
  const logOutMutation = useLogOut();
  const { data: attendanceStatus } = useAttendanceStatus();

  // Determine if user is currently logged in (has login time but no logout time)
  const isLoggedIn = !!(
    attendanceStatus?.log_in_time && !attendanceStatus?.log_out_time
  );

  // Timer effect — runs every second while logged in
  useEffect(() => {
    if (!isLoggedIn && !activeSession) {
      setElapsed(0);
      return;
    }

    const loginTime = activeSession?.login_time || attendanceStatus?.log_in_time;
    if (!loginTime) return;

    const calcElapsed = () => {
      const start = new Date(loginTime).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((now - start) / 1000));
    };

    setElapsed(calcElapsed());

    const interval = setInterval(() => {
      setElapsed(calcElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, activeSession, attendanceStatus?.log_in_time]);

  const handleLogIn = useCallback(() => {
    // Validate work location
    const parsed = workLocationSchema.safeParse(workLocation);
    if (!parsed.success) {
      toast.error("Invalid work location selected");
      return;
    }

    logInMutation.mutate(parsed.data, {
      onSuccess: (data) => {
        setActiveSession(data);
        toast.success("Logged in successfully", {
          description: `Location: ${data.work_location_display} · ${formatTime(data.login_time)}`,
        });
      },
      onError: (error: any) => {
        toast.error("Failed to log in", {
          description: error?.message || "Something went wrong",
        });
      },
    });
  }, [workLocation, logInMutation]);

  const handleLogOut = useCallback(() => {
    logOutMutation.mutate(undefined, {
      onSuccess: (data) => {
        setActiveSession(null);
        setElapsed(0);
        toast.success("Logged out successfully", {
          description: `Time today: ${data.time_today}`,
        });
      },
      onError: (error: any) => {
        toast.error("Failed to log out", {
          description: error?.message || "Something went wrong",
        });
      },
    });
  }, [logOutMutation]);

  const isLoading = logInMutation.isPending || logOutMutation.isPending;
  const currentlyActive = isLoggedIn || !!activeSession;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden border-border bg-background">
        {/* Theme-aware gradient header */}
        <div className="relative overflow-hidden px-6 pt-6 pb-8 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-100 dark:from-slate-900 dark:via-indigo-950/80 dark:to-purple-950/60">
          {/* Decorative radial overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent dark:from-indigo-500/10 dark:via-transparent dark:to-transparent" />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-indigo-900 dark:text-white">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Time Tracker
            </DialogTitle>
            <DialogDescription className="text-sm text-indigo-600/70 dark:text-indigo-300/60">
              {currentlyActive
                ? "Your session is active — keep up the great work!"
                : "Start your work session to begin tracking time."}
            </DialogDescription>
          </DialogHeader>

          {/* Live timer display */}
          <div className="relative z-10 mt-5 flex items-center justify-center">
            <div className="relative">
              <div
                className={`rounded-2xl border px-8 py-4 text-center backdrop-blur-md transition-all duration-500 ${
                  currentlyActive
                    ? "border-indigo-300/50 bg-white/60 shadow-lg shadow-indigo-200/30 dark:border-indigo-500/30 dark:bg-white/10 dark:shadow-purple-900/30"
                    : "border-indigo-200/40 bg-white/40 dark:border-white/15 dark:bg-white/5"
                }`}
              >
                <p className="text-4xl font-mono font-bold tracking-widest tabular-nums text-indigo-900 dark:text-white">
                  {formatElapsed(elapsed)}
                </p>
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  {currentlyActive ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-white/40" />
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-white/50">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 bg-background">
          {/* Status info when logged in */}
          {currentlyActive && (
            <div className="flex items-center gap-3 rounded-xl border p-3.5 border-emerald-200/60 bg-emerald-50/60 dark:border-emerald-800/40 dark:bg-emerald-950/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Session Active
                </p>
                <p className="text-xs truncate text-emerald-600/80 dark:text-emerald-400/70">
                  {activeSession
                    ? `Logged in at ${formatTime(activeSession.login_time)} · ${activeSession.work_location_display}`
                    : attendanceStatus?.log_in_time
                      ? `Logged in at ${formatTime(attendanceStatus.log_in_time)}`
                      : "Session in progress"}
                </p>
              </div>
              {activeSession && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider shrink-0 border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                  {activeSession.work_location_display}
                </Badge>
              )}
            </div>
          )}

          {/* Work location selector — only when not logged in */}
          {!currentlyActive && (
            <div className="space-y-2.5">
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Work Location
              </label>
              <Select
                value={workLocation}
                onValueChange={(val) => setWorkLocation(val as WorkLocation)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select work location" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      <div className="flex items-center gap-2.5">
                        {loc.icon}
                        <span>{loc.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Session details when logged in */}
          {currentlyActive && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border p-3.5 space-y-1 bg-slate-50/80 border-slate-200/60 dark:bg-muted/30 dark:border-border">
                <div className="flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Elapsed
                  </span>
                </div>
                <p className="text-lg font-bold tabular-nums text-foreground">
                  {formatElapsed(elapsed)}
                </p>
              </div>
              <div className="rounded-xl border p-3.5 space-y-1 bg-slate-50/80 border-slate-200/60 dark:bg-muted/30 dark:border-border">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Login Time
                  </span>
                </div>
                <p className="text-lg font-bold tabular-nums text-foreground">
                  {activeSession
                    ? formatTime(activeSession.login_time)
                    : attendanceStatus?.log_in_time
                      ? formatTime(attendanceStatus.log_in_time)
                      : "—"}
                </p>
              </div>
            </div>
          )}

          {/* Action button */}
          {currentlyActive ? (
            <Button
              id="time-log-out-btn"
              onClick={handleLogOut}
              disabled={isLoading}
              variant="destructive"
              className="w-full h-12 text-sm font-semibold rounded-xl gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-900/30"
            >
              {logOutMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Log Out
                </>
              )}
            </Button>
          ) : (
            <Button
              id="time-log-in-btn"
              onClick={handleLogIn}
              disabled={isLoading}
              className="w-full h-12 text-sm font-semibold rounded-xl gap-2 text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-300/30 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 dark:hover:shadow-indigo-500/20"
            >
              {logInMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Log In
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
