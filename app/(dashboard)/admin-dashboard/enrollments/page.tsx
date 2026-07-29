"use client";

import TableLoader from "@/components/TableLoader";
import EnrollmentEmpty from "@/components/admin-dashboard/enrollments/EnrollmentEmpty";
import ViewEnrollmentModal from "@/components/admin-dashboard/enrollments/ViewEnrollmentModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/swr/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { IEnrollment } from "@/types";
import { formatDate } from "@/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Calendar,
  Eye,
  Search,
  Filter,
  X,
  User,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ApiResponse {
  data: IEnrollment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export default function EnrollmentsPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IEnrollment | null>(null);

  // Build query string
  const queryParams = new URLSearchParams({
    page: String(currentPage),
    limit: String(limit),
    ...(debouncedSearch && { searchTerm: debouncedSearch }),
    ...(filterStatus && { status: filterStatus }),
  }).toString();

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/enrollments?${queryParams}`
  );

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus]);

  // Handlers
  const handleView = (item: IEnrollment) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; label: string }
    > = {
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      completed: {
        variant: "default",
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        variant: "destructive",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.pending;
    const Icon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="gap-1 capitalize">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  // Admission status badge (for nested admission)
  const getAdmissionStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      submitted: "bg-yellow-500 hover:bg-yellow-600",
      "under-review": "bg-blue-500 hover:bg-blue-600",
      approved: "bg-green-500 hover:bg-green-600",
      rejected: "bg-red-500 hover:bg-red-600",
    };
    return (
      <Badge className={`${variants[status] || "bg-gray-500"} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Table columns
  const columns: ColumnDef<IEnrollment>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
              {user.phone && (
                <div className="text-xs text-muted-foreground">{user.phone}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => {
        const course = row.original.course;
        return (
          <div>
            <div className="font-medium">{course.title}</div>
            <div className="text-xs text-muted-foreground">
              {course.duration}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "admission.status",
      header: "Admission",
      cell: ({ row }) => {
        const admissionStatus = row.original.admission?.status;
        return admissionStatus ? getAdmissionStatusBadge(admissionStatus) : <span>—</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Enrollment",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "enrolledAt",
      header: "Enrolled",
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
          {formatDate(row.getValue("enrolledAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-primary"
          onClick={() => handleView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;
  const currentPageNum = meta?.page || 1;
  const isDataAvailable = (data?.data?.length ?? 0) > 0;
  const hasActiveFilters = searchTerm || filterStatus;

  if (isLoading) return <TableLoader />;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Enrollments</h1>
          <p className="text-muted-foreground mt-1">
            Manage all course enrollments
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total} enrollments
            </p>
          )}
        </div>
      </div>

      {/* Toolbar: search + filter */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user name, email or course title..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 pr-9"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3 text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Table / Empty state */}
      {!isDataAvailable ? (
        <EnrollmentEmpty />
      ) : (
        <Card className="overflow-hidden border shadow-sm p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-6 py-3 text-sm font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {isDataAvailable && (
        <div className="flex items-center justify-between mt-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={String(limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPageNum - 1)}
                    className={
                      currentPageNum <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(totalPage, 5) },
                  (_, i) => {
                    let pageNumber: number;
                    if (totalPage <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPageNum <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPageNum >= totalPage - 2) {
                      pageNumber = totalPage - 4 + i;
                    } else {
                      pageNumber = currentPageNum - 2 + i;
                    }
                    if (pageNumber < 1 || pageNumber > totalPage)
                      return null;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pageNumber === currentPageNum}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                {totalPage > 5 && currentPageNum < totalPage - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPage)}
                      >
                        {totalPage}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPageNum + 1)}
                    className={
                      currentPageNum >= totalPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* View Modal */}
      <ViewEnrollmentModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        enrollment={selectedItem}
      />
    </section>
  );
}