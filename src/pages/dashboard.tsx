import { SectionCards } from "@/components/section-cards";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Download,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useStaffActivity } from "@/hooks/useStaffActivity";
import { useMemo } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const { data: summaryData } = useDashboardSummary();
  const { data: rawStaffActivityData } = useStaffActivity();

  const summaryMetrics = [
    {
      title: "Total Staff",
      value: (summaryData?.kpis.totalStaff ?? 0).toString(),
      description: "Active staff members",
      icon: ClipboardList,
      isPositive: true,
    },
    {
      title: "Working Now",
      value: (summaryData?.kpis.workingNow ?? 0).toString(),
      description: "Currently online",
      icon: CheckCircle2,
      isPositive: true,
    },
    {
      title: "Total Clients",
      value: (summaryData?.kpis.totalClients ?? 0).toString(),
      description: "Registered clients",
      icon: Clock,
      isPositive: false,
    },
    {
      title: "Open Tasks",
      value: (summaryData?.kpis.openTasks ?? 0).toString(),
      description: "Tasks needing attention",
      icon: AlertCircle,
      isPositive: false,
    },
  ];
  const staffActivityData = useMemo(() => {
    if (!rawStaffActivityData) return [];

    return rawStaffActivityData.map((item) => ({
      id: item.id,
      employee: item.fullName,
      role: item.role,
      status: item.status,
      location: item.location,
      timeToday: item.timeToday,
    }));
  }, [rawStaffActivityData]);

  return (
    <div className="container max-w-full space-y-6 p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your document overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate("/tasks")}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards + Task Summary — shared width wrapper */}
      <div className="w-full  space-y-5">
        {/* Key Metrics Cards */}
        <SectionCards data={summaryMetrics} />

        {/* Task Summary Banner */}
        <Card className="ml-6 rounded-xl shadow-sm border-slate-100 dark:border-slate-800">
          <CardContent className="p-2 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <span className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase whitespace-nowrap">
              Task Summary:
            </span>

            <div className="flex items-center gap-3 w-full overflow-x-auto">
              {/* Unassigned */}
              <Badge
                variant="outline"
                className="border-none bg-[#f4f6fb] text-slate-600 hover:bg-[#eaedf5] gap-2 px-4 py-3 rounded-full shadow-none font-medium text-xs whitespace-nowrap shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                Unassigned{" "}
                <span className="font-bold text-slate-800">
                  {summaryData?.taskSummary.unassigned ?? 0}
                </span>
              </Badge>

              {/* In Progress */}
              <Badge
                variant="outline"
                className="border-none bg-[#f0f5ff] text-blue-700 hover:bg-[#e1ecff] gap-2 px-4 py-3 rounded-full shadow-none font-medium text-xs whitespace-nowrap shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                In Progress{" "}
                <span className="font-bold text-blue-900">
                  {summaryData?.taskSummary.inProgress ?? 0}
                </span>
              </Badge>

              {/* In Review */}
              <Badge
                variant="outline"
                className="border-none bg-[#f6f5fb] text-slate-700 hover:bg-[#ebeaf4] gap-2 px-4 py-3 rounded-full shadow-none font-medium text-xs whitespace-nowrap shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                In Review{" "}
                <span className="font-bold text-indigo-900">
                  {summaryData?.taskSummary.inReview ?? 0}
                </span>
              </Badge>

              {/* Overdue */}
              <Badge
                variant="outline"
                className="border-none bg-[#fff0f0] text-red-600 hover:bg-[#ffe1e1] gap-2 px-4 py-3 rounded-full shadow-none font-medium text-xs whitespace-nowrap shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                Overdue{" "}
                <span className="font-bold text-red-900">
                  {summaryData?.taskSummary.overdue ?? 0}
                </span>
              </Badge>

              {/* Due Today */}
              <Badge
                variant="outline"
                className="border-none bg-[#fff8f0] text-orange-700 hover:bg-[#ffeed9] gap-2 px-4 py-3 rounded-full shadow-none font-medium text-xs whitespace-nowrap shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                Due Today{" "}
                <span className="font-bold text-orange-900">
                  {summaryData?.taskSummary.dueToday ?? 0}
                </span>
              </Badge>

              {/* Blocked */}
              <Badge
                variant="outline"
                className="border-none bg-[#f5f0f0] text-rose-700 hover:bg-[#ede5e5] gap-2 px-4 py-3 rounded-full shadow-none font-medium text-xs whitespace-nowrap shrink-0"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                Blocked{" "}
                <span className="font-bold text-rose-900">
                  {summaryData?.taskSummary.blocked ?? 0}
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <h2 className="text-2xl font-bold tracking-tight flex justify-start  ">
        Staff Activity
      </h2>

      <DataTable data={staffActivityData} />
    </div>
  );
}
