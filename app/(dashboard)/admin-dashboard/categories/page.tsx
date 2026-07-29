"use client";

import TableLoader from "@/components/TableLoader";
import CategoryEmpty from "@/components/admin-dashboard/categories/CategoryEmpty";
import CreateCategoryModal from "@/components/admin-dashboard/categories/CreateCategoryModal";
import EditCategoryModal from "@/components/admin-dashboard/categories/EditCategoryModal";
import ViewCategoryModal from "@/components/admin-dashboard/categories/ViewCategoryModal";
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
import { useDelete } from "@/hooks/swr/useDelete";
import { useFetch } from "@/hooks/swr/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { ICategory, IPagination } from "@/types";
import { formatDate } from "@/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  SortAsc,
  Trash2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface ApiResponse {
  data: ICategory[];
  meta: IPagination;
}

export default function AdminCategoriesPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Search & sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICategory | null>(null);
  const [itemToEdit, setItemToEdit] = useState<ICategory | null>(null);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy]);

  // Build query string
  const queryParams = new URLSearchParams({
    page: String(currentPage),
    limit: String(limit),
    sortBy,
    ...(debouncedSearch && { searchTerm: debouncedSearch }),
  }).toString();

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/categories?${queryParams}`
  );

  // Delete hook
  const { mutate: deleteCategory, isLoading: isDeleting } = useDelete(
    "/categories",
    {
      revalidateKey: "/categories",
    }
  );

  // Handlers
  const handleView = (item: ICategory) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: ICategory) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert deleting category "${name}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#232156",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Deleting...",
            text: "Please wait",
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });

          await deleteCategory(id);

          Swal.fire({
            title: "Deleted!",
            text: `Category "${name}" has been deleted successfully.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          refetch();
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Failed to delete category",
            icon: "error",
          });
        }
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSortBy("createdAt");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  // Table columns
  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-lg">📁</span>
          </div>
          <div>
            <div className="font-semibold">{row.getValue("name")}</div>
            <div className="text-xs text-muted-foreground">
              slug: {row.original.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
          {formatDate(row.getValue("updatedAt"))}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-primary"
            onClick={() => handleView(row.original)}
            disabled={isDeleting}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleEdit(row.original)}
                disabled={isDeleting}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  handleDelete(row.original._id, row.original.name)
                }
                className="text-destructive hover:text-white! hover:bg-primary!"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
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

  const meta = data?.meta;
  const totalPage = meta?.totalPage || 1;
  const currentPageNum = meta?.page || 1;
  const isDataAvailable = (data?.data?.length ?? 0) > 0;

  const hasActiveFilters = searchTerm || sortBy !== "createdAt";

  if (isLoading) return <TableLoader />;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product categories
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total} categories
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-white p-5"
          disabled={isDeleting}
        >
          Add Category
        </Button>
      </div>

      {/* Toolbar: search left, sort + clear on right */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 pr-9"
            disabled={isDeleting}
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
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
            disabled={isDeleting}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created (newest)</SelectItem>
              <SelectItem value="-createdAt">Created (oldest)</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
              <SelectItem value="-name">Name Z–A</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 px-3 text-muted-foreground hover:text-foreground"
              disabled={isDeleting}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Table / Empty state */}
      {!isDataAvailable ? (
        <CategoryEmpty onCreateClick={() => setIsCreateModalOpen(true)} />
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
              disabled={isDeleting}
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
                      currentPageNum <= 1 || isDeleting
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
                          className={
                            isDeleting
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
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
                        className={
                          isDeleting
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
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
                      currentPageNum >= totalPage || isDeleting
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

      {/* Modals */}
      <CreateCategoryModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={refetch}
      />
      <EditCategoryModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        category={itemToEdit}
        onSuccess={refetch}
      />
      <ViewCategoryModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        category={selectedItem}
      />
    </section>
  );
}