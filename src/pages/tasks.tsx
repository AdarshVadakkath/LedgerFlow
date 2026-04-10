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
import { 
  Plus,
  MoreHorizontal,
  SearchIcon, 
  FilterIcon, 
  Columns3Icon, 
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ViewTask } from "@/pages/viewTask";
import { EditTask } from "@/pages/editTask";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Fake Data Definition
type Task = {
  id: string;
  title: string;
  client: string;
  assignedTo: string;
  type: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Done";
  dueDate: string;
};

const fakeTasks: Task[] = [
  {
    id: "TASK-001",
    title: "Q4 ITR Filing",
    client: "Acme Corp",
    assignedTo: "CA Rajesh Kumar",
    type: "ITR Filing",
    priority: "High",
    status: "In Progress",
    dueDate: "2024-04-15",
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
  },
  {
    id: "TASK-003",
    title: "Annual Audit",
    client: "Global Tech",
    assignedTo: "CA Amit Patel",
    type: "Audit",
    priority: "High",
    status: "To Do",
    dueDate: "2024-05-01",
  },
  {
    id: "TASK-004",
    title: "Company Registration",
    client: "New Ventures Inc.",
    assignedTo: "CA Sneha Gupta",
    type: "Company Registration",
    priority: "Low",
    status: "Done",
    dueDate: "2024-03-30",
  },
  {
    id: "TASK-005",
    title: "Tax Planning Session",
    client: "Sharma Associates",
    assignedTo: "CA Vikram Singh",
    type: "Consultation",
    priority: "Medium",
    status: "To Do",
    dueDate: "2024-04-10",
  },
  {
    id: "TASK-006",
    title: "TDS Return Filing",
    client: "Patel Industries",
    assignedTo: "CA Deepa Nair",
    type: "TDS Return",
    priority: "High",
    status: "In Progress",
    dueDate: "2024-04-05",
  },
  {
    id: "TASK-007",
    title: "Bookkeeping Review",
    client: "Sunrise Trading",
    assignedTo: "CA Arjun Mehta",
    type: "Bookkeeping",
    priority: "Low",
    status: "To Do",
    dueDate: "2024-04-25",
  },
];

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "Task ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        to={`/tasks/${row.original.id}`}
        className="font-medium hover:underline text-primary/90"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const colorMap: Record<string, string> = {
        High: "text-red-500",
        Medium: "text-yellow-500",
        Low: "text-green-500",
      };
      return (
        <span className={`font-semibold ${colorMap[priority] || ""}`}>
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "Done"
          ? "default"
          : status === "In Progress"
            ? "secondary"
            : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/tasks/${row.original.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (table.options.meta as any)?.onEdit(row.original)}>
              Edit Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function Tasks() {
  const navigate = useNavigate();
  const [editTaskData, setEditTaskData] = React.useState<Task | null>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: fakeTasks,
    columns,
    state: {
      columnVisibility,
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onEdit: (task: Task) => setEditTaskData(task),
    },
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value) {
      table.getColumn("title")?.setFilterValue(value);
    } else {
      table.getColumn("title")?.setFilterValue("");
    }
  };

  return (
    <>
      <div className="container max-w-full space-y-6 p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm">
            Track and manage your firm's operational tasks
          </p>
        </div>
        <Button onClick={() => navigate('/tasks/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>
      </div>

      {/* Toolbar / Search / Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex">
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter tasks by title..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
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
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
               <TableRow key={headerGroup.id}>
                 {headerGroup.headers.map((header) => {
                   return (
                     <TableHead key={header.id}>
                       {header.isPlaceholder
                         ? null
                         : flexRender(
                             header.column.columnDef.header,
                             header.getContext(),
                           )}
                     </TableHead>
                   );
                 })}
               </TableRow>
             ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-4">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredRowModel().rows.length} task(s) total.
        </div>
        <div className="flex w-full items-center justify-between gap-8 lg:w-fit lg:justify-end">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>


      <EditTask
        open={!!editTaskData}
        onClose={() => setEditTaskData(null)}
        task={editTaskData}
      />
    </>
  );
}
