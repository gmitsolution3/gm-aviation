"use client";

import CountryEmpty from "@/components/AdminDashboard/countries/CountryEmpty";
import CreateCountryModal from "@/components/AdminDashboard/countries/CreateCountryModal";
import EditCountryModal from "@/components/AdminDashboard/countries/EditCountryModal";
import ViewCountryModal from "@/components/AdminDashboard/countries/ViewCountryModal";
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
import { useFetch } from "@/hooks/swr/useFetch";
import { ICountry } from "@/types";
import { formatDate } from "@/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Filter,
  Flag,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface ApiResponse {
  data: ICountry[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminCountriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/countries?page=${currentPage}&limit=${limit}${filterStatus ? `&isActive=${filterStatus}` : ""}`,
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICountry | null>(
    null,
  );
  const [itemToEdit, setItemToEdit] = useState<ICountry | null>(null);

  const handleView = (item: ICountry) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: ICountry) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterStatus("");
    setCurrentPage(1);
  };

  const columns: ColumnDef<ICountry>[] = [
    {
      accessorKey: "name",
      header: "Country",
      size: 300,
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold">
                {row.getValue("name")}
              </div>
              <Badge variant="outline" className="text-xs">
                {row.original.code}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Currency: {row.original.currency}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      size: 150,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.getValue("currency")}
          </div>
          <div className="text-xs text-muted-foreground">
            Code: {row.original.code}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isActive ? (
            <Badge
              variant="default"
              className="gap-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 180,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center text-sm font-medium">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            {formatDate(row.getValue("createdAt"))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Updated: {formatDate(row.original.updatedAt)}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 100,
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleEdit(row.original)}
                className="hover:text-white! hover:bg-primary!"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
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

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Countries</h1>
          <p className="text-muted-foreground mt-1">
            Manage your countries
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total}{" "}
              countries
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-white p-5"
        >
          Add Country
        </Button>
      </div>

      <div className="flex items-center justify-end gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select
          value={filterStatus}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {filterStatus && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            Clear filter
          </Button>
        )}
      </div>

      {!isDataAvailable ? (
        <CountryEmpty
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
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

      <CreateCountryModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={refetch}
      />
      <EditCountryModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        country={itemToEdit}
        onSuccess={refetch}
      />
      <ViewCountryModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        country={selectedItem}
      />
    </section>
  );
}
