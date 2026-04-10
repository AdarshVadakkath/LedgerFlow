import { api } from "./axios";

// ===================== Dashboard Summary =====================

/** Raw shape returned by GET /dashboard/summary/ */
interface DashboardSummaryRaw {
  kpis: {
    total_staff: number;
    working_now: number;
    total_clients: number;
    open_tasks: number;
  };
  task_summary: {
    unassigned: number;
    in_progress: number;
    blocked: number;
    reassigned: number;
    in_review: number;
    overdue: number;
    due_today: number;
  };
}

/** Frontend-friendly KPI model */
export interface DashboardKpis {
  totalStaff: number;
  workingNow: number;
  totalClients: number;
  openTasks: number;
}

/** Frontend-friendly task summary model */
export interface TaskSummary {
  unassigned: number;
  inProgress: number;
  blocked: number;
  reassigned: number;
  inReview: number;
  overdue: number;
  dueToday: number;
}

/** Combined dashboard summary for UI consumption */
export interface DashboardSummary {
  kpis: DashboardKpis;
  taskSummary: TaskSummary;
}

/** Map raw API response → frontend model */
const mapDashboardSummary = (raw: DashboardSummaryRaw): DashboardSummary => ({
  kpis: {
    totalStaff: raw.kpis.total_staff,
    workingNow: raw.kpis.working_now,
    totalClients: raw.kpis.total_clients,
    openTasks: raw.kpis.open_tasks,
  },
  taskSummary: {
    unassigned: raw.task_summary.unassigned,
    inProgress: raw.task_summary.in_progress,
    blocked: raw.task_summary.blocked,
    reassigned: raw.task_summary.reassigned,
    inReview: raw.task_summary.in_review,
    overdue: raw.task_summary.overdue,
    dueToday: raw.task_summary.due_today,
  },
});

/** Fetches dashboard summary and returns mapped, typed data */
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummaryRaw>("/dashboard/summary/");
  return mapDashboardSummary(data);
};

// ===================== Staff Activity =====================

/** Raw shape returned by GET /dashboard/staff-activity */
interface StaffActivityRaw {
  id: number;
  full_name: string | null;
  role: string;
  status: string;
  location: string;
  time_today: string;
  total_seconds_today: number;
}

interface StaffActivityApiResponse {
  total: number;
  page: number;
  results: StaffActivityRaw[];
}

/** Frontend-friendly, camelCase model */
export interface StaffActivity {
  id: number;
  fullName: string;
  role: string;
  status: string;
  location: string;
  timeToday: string;
  totalSecondsToday: number;
}

/** Map a single raw record → frontend model */
const mapStaffActivity = (raw: StaffActivityRaw): StaffActivity => ({
  id: raw.id,
  fullName: raw.full_name ?? "Unknown",
  role: raw.role,
  status: raw.status,
  location: raw.location,
  timeToday: raw.time_today,
  totalSecondsToday: raw.total_seconds_today,
});

/** Fetches staff-activity list and returns mapped, typed results */
export const getStaffActivity = async (): Promise<StaffActivity[]> => {
  const { data } = await api.get<StaffActivityApiResponse>(
    "/dashboard/staff-activity/",
  );
  return data.results.map(mapStaffActivity);
};
