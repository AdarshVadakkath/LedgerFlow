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
  Download, 
  Upload, 
  SearchIcon, 
  FilterIcon, 
  Columns3Icon, 
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon
} from "lucide-react";

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
type Document = {
  id: string;
  title: string;
  client: string;
  type: string;
  year: number;
  status: "Active" | "Archived" | "Pending";
  uploadedBy: string;
  date: string;
};

const fakeData: Document[] = [
  {
    id: "1",
    title: "Annual Tax Return",
    client: "Acme Corp",
    type: "Tax",
    year: 2023,
    status: "Active",
    uploadedBy: "John Doe",
    date: "2024-03-15",
  },
  {
    id: "2",
    title: "Q4 Financial Statement",
    client: "Globex Inc",
    type: "Financials",
    year: 2023,
    status: "Archived",
    uploadedBy: "Jane Smith",
    date: "2024-01-10",
  },
  {
    id: "3",
    title: "Audit Report",
    client: "Stark Industries",
    type: "Audit",
    year: 2024,
    status: "Pending",
    uploadedBy: "Tony Stark",
    date: "2024-04-01",
  },
  {
    id: "4",
    title: "Incorporation Doc",
    client: "Wayne Tech",
    type: "Legal",
    year: 2020,
    status: "Active",
    uploadedBy: "Bruce Wayne",
    date: "2020-05-12",
  },
  {
    id: "5",
    title: "Payroll Ledger",
    client: "Daily Planet",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "Clark Kent",
    date: "2024-03-28",
  },

  {
    id: "6",
    title: "GST Filing",
    client: "Initech",
    type: "Tax",
    year: 2023,
    status: "Pending",
    uploadedBy: "Peter Gibbons",
    date: "2024-02-11",
  },
  {
    id: "7",
    title: "Expense Report",
    client: "Hooli",
    type: "Financials",
    year: 2024,
    status: "Active",
    uploadedBy: "Richard Hendricks",
    date: "2024-03-20",
  },
  {
    id: "8",
    title: "Compliance Audit",
    client: "Vehement Capital",
    type: "Audit",
    year: 2022,
    status: "Archived",
    uploadedBy: "Gavin Belson",
    date: "2023-12-01",
  },
  {
    id: "9",
    title: "Contract Agreement",
    client: "Massive Dynamic",
    type: "Legal",
    year: 2021,
    status: "Active",
    uploadedBy: "Nina Sharp",
    date: "2021-09-14",
  },
  {
    id: "10",
    title: "Salary Sheet",
    client: "Wonka Industries",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "Willy Wonka",
    date: "2024-03-18",
  },

  {
    id: "11",
    title: "Quarterly Tax Filing",
    client: "Umbrella Corp",
    type: "Tax",
    year: 2023,
    status: "Pending",
    uploadedBy: "Alice",
    date: "2024-01-25",
  },
  {
    id: "12",
    title: "Profit & Loss Statement",
    client: "Soylent Corp",
    type: "Financials",
    year: 2024,
    status: "Active",
    uploadedBy: "Joe Green",
    date: "2024-03-10",
  },
  {
    id: "13",
    title: "Internal Audit",
    client: "Cyberdyne Systems",
    type: "Audit",
    year: 2022,
    status: "Archived",
    uploadedBy: "Miles Dyson",
    date: "2023-11-30",
  },
  {
    id: "14",
    title: "Legal Notice",
    client: "Tyrell Corp",
    type: "Legal",
    year: 2023,
    status: "Active",
    uploadedBy: "Eldon Tyrell",
    date: "2023-08-22",
  },
  {
    id: "15",
    title: "Bonus Payroll",
    client: "Aperture Science",
    type: "Payroll",
    year: 2024,
    status: "Pending",
    uploadedBy: "Cave Johnson",
    date: "2024-03-22",
  },

  {
    id: "16",
    title: "Corporate Tax Filing",
    client: "Black Mesa",
    type: "Tax",
    year: 2023,
    status: "Active",
    uploadedBy: "Gordon Freeman",
    date: "2024-02-15",
  },
  {
    id: "17",
    title: "Revenue Sheet",
    client: "Oceanic Airlines",
    type: "Financials",
    year: 2024,
    status: "Active",
    uploadedBy: "Jack Shephard",
    date: "2024-03-12",
  },
  {
    id: "18",
    title: "Risk Audit",
    client: "Pied Piper",
    type: "Audit",
    year: 2023,
    status: "Pending",
    uploadedBy: "Dinesh",
    date: "2024-02-05",
  },
  {
    id: "19",
    title: "Partnership Agreement",
    client: "Bluth Company",
    type: "Legal",
    year: 2022,
    status: "Archived",
    uploadedBy: "Michael Bluth",
    date: "2022-07-09",
  },
  {
    id: "20",
    title: "Wage Register",
    client: "Duff Beer",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "Homer Simpson",
    date: "2024-03-30",
  },

  {
    id: "21",
    title: "Income Tax Return",
    client: "Gringotts Bank",
    type: "Tax",
    year: 2023,
    status: "Active",
    uploadedBy: "Goblin Chief",
    date: "2024-01-18",
  },
  {
    id: "22",
    title: "Balance Sheet",
    client: "Monsters Inc",
    type: "Financials",
    year: 2024,
    status: "Pending",
    uploadedBy: "Mike Wazowski",
    date: "2024-03-05",
  },
  {
    id: "23",
    title: "External Audit",
    client: "Nakatomi Corp",
    type: "Audit",
    year: 2023,
    status: "Active",
    uploadedBy: "John McClane",
    date: "2024-02-20",
  },
  {
    id: "24",
    title: "MoU Agreement",
    client: "Virtucon",
    type: "Legal",
    year: 2021,
    status: "Archived",
    uploadedBy: "Dr Evil",
    date: "2021-06-11",
  },
  {
    id: "25",
    title: "Monthly Payroll",
    client: "Dunder Mifflin",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "Michael Scott",
    date: "2024-03-25",
  },

  {
    id: "26",
    title: "Advance Tax Report",
    client: "Prestige Worldwide",
    type: "Tax",
    year: 2023,
    status: "Pending",
    uploadedBy: "Brennan Huff",
    date: "2024-02-28",
  },
  {
    id: "27",
    title: "Cash Flow Statement",
    client: "Globex Corp",
    type: "Financials",
    year: 2024,
    status: "Active",
    uploadedBy: "Hank Scorpio",
    date: "2024-03-15",
  },
  {
    id: "28",
    title: "Security Audit",
    client: "Initrode",
    type: "Audit",
    year: 2022,
    status: "Archived",
    uploadedBy: "Samir",
    date: "2023-10-10",
  },
  {
    id: "29",
    title: "NDA Agreement",
    client: "Soylent Industries",
    type: "Legal",
    year: 2023,
    status: "Active",
    uploadedBy: "Frank Thorn",
    date: "2023-12-12",
  },
  {
    id: "30",
    title: "Employee Payroll",
    client: "Oceanic Corp",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "Kate Austen",
    date: "2024-03-29",
  },

  {
    id: "31",
    title: "VAT Filing",
    client: "Hogwarts Ltd",
    type: "Tax",
    year: 2023,
    status: "Active",
    uploadedBy: "Albus Dumbledore",
    date: "2024-01-30",
  },
  {
    id: "32",
    title: "Equity Report",
    client: "Wayne Enterprises",
    type: "Financials",
    year: 2024,
    status: "Pending",
    uploadedBy: "Lucius Fox",
    date: "2024-03-08",
  },
  {
    id: "33",
    title: "Compliance Audit",
    client: "Stark Corp",
    type: "Audit",
    year: 2023,
    status: "Active",
    uploadedBy: "Pepper Potts",
    date: "2024-02-14",
  },
  {
    id: "34",
    title: "Service Agreement",
    client: "Oscorp",
    type: "Legal",
    year: 2022,
    status: "Archived",
    uploadedBy: "Norman Osborn",
    date: "2022-09-19",
  },
  {
    id: "35",
    title: "HR Payroll Sheet",
    client: "Daily Bugle",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "J Jonah Jameson",
    date: "2024-03-21",
  },

  {
    id: "36",
    title: "Corporate Filing",
    client: "Tyrell Systems",
    type: "Tax",
    year: 2023,
    status: "Pending",
    uploadedBy: "Rachel",
    date: "2024-02-01",
  },
  {
    id: "37",
    title: "Annual Report",
    client: "Wonka Factory",
    type: "Financials",
    year: 2024,
    status: "Active",
    uploadedBy: "Charlie Bucket",
    date: "2024-03-11",
  },
  {
    id: "38",
    title: "Operational Audit",
    client: "Cyber Corp",
    type: "Audit",
    year: 2023,
    status: "Active",
    uploadedBy: "Neo",
    date: "2024-02-22",
  },
  {
    id: "39",
    title: "License Agreement",
    client: "Matrix Systems",
    type: "Legal",
    year: 2021,
    status: "Archived",
    uploadedBy: "Morpheus",
    date: "2021-04-04",
  },
  {
    id: "40",
    title: "Weekly Payroll",
    client: "Zorg Industries",
    type: "Payroll",
    year: 2024,
    status: "Active",
    uploadedBy: "Jean-Baptiste Zorg",
    date: "2024-03-31",
  },
];
const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "title",
    header: "Document title",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "Active"
          ? "default"
          : status === "Archived"
            ? "secondary"
            : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded by",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log("Download", row.original.id)}
        >
          <Download className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export function Documents() {
  const [searchValue, setSearchValue] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: fakeData,
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
    <div className="container max-w-full space-y-6 p-4 lg:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground text-sm">
            Manage and audit centralized documents archives
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload document
        </Button>
      </div>

      {/* Toolbar / Search / Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex">
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter title..."
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
      <div className="rounded-md border bg-card">
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
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredRowModel().rows.length} document(s) total.
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
  );
}
