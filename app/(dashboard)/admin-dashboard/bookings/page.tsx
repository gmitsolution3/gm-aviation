"use client";

import BookingEmpty from "@/components/AdminDashboard/bookings/BookingEmpty";
import ViewBookingModal from "@/components/AdminDashboard/bookings/ViewBookingModal";
import UpdateStatusModal from "@/components/AdminDashboard/bookings/UpdateStatusModal";
import TableLoader from "@/components/TableLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/swr/useFetch";
import { IBooking } from "@/types";
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
  MoreHorizontal,
  Search,
  X,
  Filter,
  Package,
  Truck,
  MapPin,
  Hash,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Ship,
  Ban,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface ApiResponse {
  data: IBooking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminBookingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/bookings?page=${currentPage}&limit=${limit}${debouncedSearch ? `&searchTerm=${debouncedSearch}` : ""}${filterStatus ? `&status=${filterStatus}` : ""}`
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IBooking | null>(null);
  const [itemToUpdate, setItemToUpdate] = useState<IBooking | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus]);

  const handleView = (item: IBooking) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (item: IBooking) => {
    setItemToUpdate(item);
    setIsStatusModalOpen(true);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any; label: string }> = {
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      processing: {
        variant: "outline",
        icon: RefreshCw,
        label: "Processing",
      },
      shipped: {
        variant: "default",
        icon: Ship,
        label: "Shipped",
      },
      completed: {
        variant: "default",
        icon: CheckCircle,
        label: "Completed",
      },
      cancelled: {
        variant: "destructive",
        icon: Ban,
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

  const columns: ColumnDef<IBooking>[] = [
    {
      accessorKey: "trackingId",
      header: "Tracking ID",
      size: 200,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-mono text-sm font-medium">
            {row.getValue("trackingId")}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {row.original.userId?.name || "N/A"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "itemName",
      header: "Item",
      size: 180,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("itemName")}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>{row.original.totalQuantity} pcs</span>
            <span>·</span>
            <span>{row.original.totalWeight} kg</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "fromCountry",
      header: "Route",
      size: 200,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <span>{row.original.fromCountry?.code || "N/A"}</span>
            <span className="text-muted-foreground">→</span>
            <span>{row.original.toCountry?.code || "N/A"}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.fromCountry?.name} → {row.original.toCountry?.name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "estimatedShippingCharge",
      header: "Est. Charge",
      size: 150,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            ${row.original.estimatedShippingCharge?.min || 0} - ${row.original.estimatedShippingCharge?.max || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            <Truck className="h-3 w-3 inline mr-1" />
            {row.original.transportationMethod || "N/A"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row }) => (
        <div>
          {getStatusBadge(row.getValue("status"))}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 160,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center text-sm">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            {formatDate(row.getValue("createdAt"))}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ID: {row.original._id.slice(-6)}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 80,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-primary !p-0"
            onClick={() => handleView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary !p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleView(row.original)}
                className="hover:text-white! hover:bg-primary!"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleUpdateStatus(row.original)}
                className="hover:text-white! hover:bg-primary!"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  if (isLoading) return <TableLoader />;

  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;
  const currentPageNum = meta?.page || 1;

  const isDataAvailable = (data?.data?.length as number) > 0;
  const hasActiveFilters = searchTerm || filterStatus;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage all bookings
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total} bookings
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tracking ID, item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-end gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
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

      {!isDataAvailable ? (
        <BookingEmpty />
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
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
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
                          cell.getContext(),
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

      {isDataAvailable && (
        <div className="flex items-center justify-between mt-4">
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
                    onClick={() =>
                      handlePageChange(currentPageNum - 1)
                    }
                    className={
                      currentPageNum <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPageNum <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPageNum >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPageNum - 2 + i;
                    }

                    if (pageNumber < 1 || pageNumber > totalPages)
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
                  },
                )}

                {totalPages > 5 &&
                  currentPageNum < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                {totalPages > 5 &&
                  currentPageNum < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(currentPageNum + 1)
                    }
                    className={
                      currentPageNum >= totalPages
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

      <ViewBookingModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        booking={selectedItem}
      />
      <UpdateStatusModal
        isModalOpen={isStatusModalOpen}
        setIsModalOpen={setIsStatusModalOpen}
        booking={itemToUpdate}
        onSuccess={refetch}
      />
    </section>
  );
}