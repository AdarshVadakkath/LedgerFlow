import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Minus,
  MapPin,
  Building2,
  Home,
  Activity,
  SearchIcon,
  FilterIcon,
  Columns3Icon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon
} from "lucide-react";

// --- Types & Data ---

type Staff = {
  name: string;
  role: string;
  status: string;
  statusColor: string;
  locationType: "office" | "remote" | "field";
  location: string;
  timeToday: string;
  loginTime: string;
};

const staffData: Staff[] = [
  {
    name: "Ananya Sharma",
    role: "Senior Associate",
    status: "ACTIVE",
    statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none",
    locationType: "office",
    location: "Mumbai HQ",
    timeToday: "06:42:15",
    loginTime: "09:15 AM",
  },
  {
    name: "Rahul Jain",
    role: "Audit Manager",
    status: "ON BREAK",
    statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-none",
    locationType: "remote",
    location: "Remote (Pune)",
    timeToday: "04:12:00",
    loginTime: "10:00 AM",
  },
  {
    name: "Vikram Mehta",
    role: "Tax Consultant",
    status: "FIELD",
    statusColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none",
    locationType: "field",
    location: "Client: Tata Motors",
    timeToday: "07:55:10",
    loginTime: "08:30 AM",
  },
];

type Session = {
  date: string;
  type: string;
  typeColor: string;
  timeRange: string;
  address: string;
  duration: string;
  active: boolean;
};

const recentSessions: Session[] = [
  {
    date: "May 20, MON",
    type: "OFFICE",
    typeColor: "text-blue-600 bg-blue-100/50 dark:bg-blue-900/20 dark:text-blue-400 border-none",
    timeRange: "09:15 AM - Present",
    address: "Level 4, Maker Chambers IV, Nariman Point, Mumbai 400021",
    duration: "06:42",
    active: true,
  },
  {
    date: "May 17, FRI",
    type: "CLIENT SITE",
    typeColor: "text-pink-600 bg-pink-100/50 dark:bg-pink-900/20 dark:text-pink-400 border-none",
    timeRange: "08:45 AM - 06:15 PM",
    address: "Reliance Corporate Park, Thane-Belapur Rd, Navi Mumbai 400701",
    duration: "09:30",
    active: false,
  },
  {
    date: "May 16, THU",
    type: "REMOTE",
    typeColor: "text-amber-600 bg-amber-100/50 dark:bg-amber-900/20 dark:text-amber-400 border-none",
    timeRange: "10:00 AM - 07:00 PM",
    address: "Residential Complex, Worli Sea Face, Mumbai 400030",
    duration: "09:00",
    active: false,
  },
];

// --- Columns Setup ---

const staffColumns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.role}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.original.statusColor}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        {row.original.locationType === "office" && <Building2 className="h-4 w-4" />}
        {row.original.locationType === "remote" && <Home className="h-4 w-4" />}
        {row.original.locationType === "field" && <MapPin className="h-4 w-4" />}
        {row.original.location}
      </div>
    ),
  },
  {
    accessorKey: "timeToday",
    header: "Time Today",
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.timeToday}</span>,
  },
  {
    accessorKey: "loginTime",
    header: "Login Time",
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums text-sm">{row.original.loginTime}</span>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: () => (
      <div className="text-right">
        <Button variant="link" className="text-primary font-semibold p-0 h-auto">
          View Details
        </Button>
      </div>
    ),
  },
];

const sessionsColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="font-bold text-sm">{row.original.date}</span>,
  },
  {
    accessorKey: "type",
    header: "Session Type",
    cell: ({ row }) => (
      <Badge className={`text-[10px] uppercase font-bold tracking-wider rounded-sm ${row.original.typeColor}`}>
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "timeRange",
    header: "Time Range",
    cell: ({ row }) => <span className="text-sm font-medium text-muted-foreground">{row.original.timeRange}</span>,
  },
  {
    accessorKey: "address",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-foreground/80 max-w-[200px] lg:max-w-[400px]">
        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="truncate" title={row.original.address}>{row.original.address}</span>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-right">Duration / Active</div>,
    cell: ({ row }) => (
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
          {row.original.active && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />}
          {row.original.active ? <span className="text-blue-600 dark:text-blue-400">ACTIVE NOW</span> : "DURATION"}
        </span>
        <span className="text-xl font-bold tabular-nums">{row.original.duration}</span>
      </div>
    ),
  },
];

// --- Main Component ---

export function Attendance() {
  // Staff Table State
  const [staffSearchValue, setStaffSearchValue] = React.useState("");
  const [staffColumnVisibility, setStaffColumnVisibility] = React.useState<VisibilityState>({});
  const [staffColumnFilters, setStaffColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [staffPagination, setStaffPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const staffTable = useReactTable({
    data: staffData,
    columns: staffColumns,
    state: {
      columnVisibility: staffColumnVisibility,
      columnFilters: staffColumnFilters,
      pagination: staffPagination,
    },
    onColumnFiltersChange: setStaffColumnFilters,
    onColumnVisibilityChange: setStaffColumnVisibility,
    onPaginationChange: setStaffPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleStaffSearch = (value: string) => {
    setStaffSearchValue(value);
    if (value) {
      staffTable.getColumn("name")?.setFilterValue(value);
    } else {
      staffTable.getColumn("name")?.setFilterValue("");
    }
  };

  // Session Table State 
  const [sessionSearchValue, setSessionSearchValue] = React.useState("");
  const [sessionColumnVisibility, setSessionColumnVisibility] = React.useState<VisibilityState>({});
  const [sessionColumnFilters, setSessionColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sessionPagination, setSessionPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const sessionTable = useReactTable({
    data: recentSessions,
    columns: sessionsColumns,
    state: {
      columnVisibility: sessionColumnVisibility,
      columnFilters: sessionColumnFilters,
      pagination: sessionPagination,
    },
    onColumnFiltersChange: setSessionColumnFilters,
    onColumnVisibilityChange: setSessionColumnVisibility,
    onPaginationChange: setSessionPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSessionSearch = (value: string) => {
    setSessionSearchValue(value);
    if (value) {
      sessionTable.getColumn("address")?.setFilterValue(value);
    } else {
      sessionTable.getColumn("address")?.setFilterValue("");
    }
  };

  return (
    <div className="container max-w-full space-y-8 p-4 lg:p-6 pb-20">
      {/* ── Header Row ── */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
        <div className="space-y-1 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">Staff Attendance</h1>
          <p className="text-muted-foreground">
            Monitor real-time availability and location-based performance metrics for the audit team.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 lg:ml-auto">
          <Button variant="outline" className="gap-2 bg-background">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            05/20/2024
          </Button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Office Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">1,240</span>
              <span className="text-sm font-semibold text-muted-foreground">hrs</span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-3 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" /> +12% vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              WFH / Remote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">482</span>
              <span className="text-sm font-semibold text-muted-foreground">hrs</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1 font-medium">
              <Minus className="h-3 w-3" /> Steady state
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Client Site
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">856</span>
              <span className="text-sm font-semibold text-muted-foreground">hrs</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1 font-medium">
              <Activity className="h-3 w-3" /> Peak audit season
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Field Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">124</span>
              <span className="text-sm font-semibold text-muted-foreground">hrs</span>
            </div>
            <p className="text-xs text-orange-500 mt-3 flex items-center gap-1 font-medium">
              <MapPin className="h-3 w-3" /> Inventory counts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Table Section: Real-time Staff Status ── */}
      <div className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Real-time Staff Status</h2>
            <p className="text-muted-foreground text-sm">32 Online Now</p>
          </div>
        </div>

        {/* Staff Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex">
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter staff by name..."
                value={staffSearchValue}
                onChange={(e) => handleStaffSearch(e.target.value)}
                className="pl-8 h-9 w-40 lg:w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Filter</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3Icon className="mr-2 h-4 w-4" />
                  Columns
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {staffTable.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((col) => {
                  return (
                    <DropdownMenuCheckboxItem key={col.id} className="capitalize" checked={col.getIsVisible()} onCheckedChange={(val) => col.toggleVisibility(!!val)}>
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Staff Data Table */}
        <div className="rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              {staffTable.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {staffTable.getRowModel().rows?.length ? (
                staffTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={staffColumns.length} className="h-24 text-center">No staff found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Staff Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {staffTable.getFilteredRowModel().rows.length} staff total.
          </div>
          <div className="flex w-full items-center justify-between gap-8 lg:w-fit lg:justify-end">
            <div className="hidden items-center gap-2 lg:flex">
              <Label className="text-sm font-medium">Rows per page</Label>
              <Select value={`${staffTable.getState().pagination.pageSize}`} onValueChange={(v) => staffTable.setPageSize(Number(v))}>
                <SelectTrigger size="sm" className="w-20"><SelectValue placeholder={staffTable.getState().pagination.pageSize} /></SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30].map((s) => (<SelectItem key={s} value={`${s}`}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {staffTable.getState().pagination.pageIndex + 1} of {staffTable.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => staffTable.setPageIndex(0)} disabled={!staffTable.getCanPreviousPage()}>
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => staffTable.previousPage()} disabled={!staffTable.getCanPreviousPage()}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => staffTable.nextPage()} disabled={!staffTable.getCanNextPage()}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => staffTable.setPageIndex(staffTable.getPageCount() - 1)} disabled={!staffTable.getCanNextPage()}>
                <ChevronsRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Section: My Recent Sessions ── */}
      <div className="space-y-4 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">My Recent Sessions</h2>
            <p className="text-muted-foreground text-sm">Weekly Total: 38.5 hrs</p>
          </div>
        </div>

        {/* Sessions Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex">
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter sessions by location..."
                value={sessionSearchValue}
                onChange={(e) => handleSessionSearch(e.target.value)}
                className="pl-8 h-9 w-40 lg:w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Filter</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3Icon className="mr-2 h-4 w-4" />
                  Columns
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {sessionTable.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((col) => {
                  return (
                    <DropdownMenuCheckboxItem key={col.id} className="capitalize" checked={col.getIsVisible()} onCheckedChange={(val) => col.toggleVisibility(!!val)}>
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Sessions Data Table */}
        <div className="rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              {sessionTable.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {sessionTable.getRowModel().rows?.length ? (
                sessionTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={sessionsColumns.length} className="h-24 text-center">No recent sessions found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Sessions Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {sessionTable.getFilteredRowModel().rows.length} session(s) total.
          </div>
          <div className="flex w-full items-center justify-between gap-8 lg:w-fit lg:justify-end">
            <div className="hidden items-center gap-2 lg:flex">
              <Label className="text-sm font-medium">Rows per page</Label>
              <Select value={`${sessionTable.getState().pagination.pageSize}`} onValueChange={(v) => sessionTable.setPageSize(Number(v))}>
                <SelectTrigger size="sm" className="w-20"><SelectValue placeholder={sessionTable.getState().pagination.pageSize} /></SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30].map((s) => (<SelectItem key={s} value={`${s}`}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {sessionTable.getState().pagination.pageIndex + 1} of {sessionTable.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => sessionTable.setPageIndex(0)} disabled={!sessionTable.getCanPreviousPage()}>
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => sessionTable.previousPage()} disabled={!sessionTable.getCanPreviousPage()}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0" onClick={() => sessionTable.nextPage()} disabled={!sessionTable.getCanNextPage()}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => sessionTable.setPageIndex(sessionTable.getPageCount() - 1)} disabled={!sessionTable.getCanNextPage()}>
                <ChevronsRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
