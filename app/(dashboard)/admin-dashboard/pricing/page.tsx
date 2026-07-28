"use client";

import PricingEmpty from "@/components/AdminDashboard/pricing/PricingEmpty";
import EditPricingModal from "@/components/AdminDashboard/pricing/EditPricingModal";
import ViewPricingModal from "@/components/AdminDashboard/pricing/ViewPricingModal";
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
import { IPricing, ICountry } from "@/types";
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
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  XCircle,
  X,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { axiosInstance } from "@/lib/axios";
import Swal from "sweetalert2";

interface ApiResponse {
  data: IPricing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CountriesResponse {
  data: ICountry[];
}

interface ImportResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    totalRows: number;
    matchedRecords: number;
    modifiedRecords: number;
  };
}

export default function AdminPricingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/pricing?page=${currentPage}&limit=${limit}${filterStatus ? `&isConfigured=${filterStatus}` : ""}${filterCountry ? `&countryId=${filterCountry}` : ""}${debouncedSearch ? `&searchTerm=${debouncedSearch}` : ""}`
  );

  const { data: countriesData } = useFetch<CountriesResponse>(
    "/countries?page=1&limit=100"
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IPricing | null>(null);
  const [itemToEdit, setItemToEdit] = useState<IPricing | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, filterCountry]);

  const handleView = (item: IPricing) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: IPricing) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleCountryFilterChange = (value: string) => {
    setFilterCountry(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterCountry("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("isConfigured", filterStatus);
      if (filterCountry) params.append("countryId", filterCountry);
      if (debouncedSearch) params.append("searchTerm", debouncedSearch);

      const queryString = params.toString();
      const url = `/pricing/export${queryString ? `?${queryString}` : ""}`;

      const response = await axiosInstance.get(url, {
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `pricing_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      await Swal.fire({
        icon: "success",
        title: "Export Successful!",
        text: "Pricing data has been exported to Excel.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Failed to export pricing data. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!validTypes.includes(file.type)) {
      await Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an Excel file (.xlsx or .xls)",
      });
      event.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      await Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size must be less than 5MB",
      });
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);

    try {
      const response = await axiosInstance.post<ImportResponse>(
        "/pricing/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Import Successful!",
          html: `
            <div class="text-left space-y-2">
              <p><strong>Total Rows:</strong> ${response.data.data.totalRows}</p>
              <p><strong>Matched Records:</strong> ${response.data.data.matchedRecords}</p>
              <p><strong>Modified Records:</strong> ${response.data.data.modifiedRecords}</p>
            </div>
          `,
          confirmButtonText: "OK",
        });
        refetch();
      } else {
        throw new Error(response.data.message || "Import failed");
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Import Failed",
        text: error.response?.data?.message || "Failed to import pricing data. Please try again.",
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const columns: ColumnDef<IPricing>[] = [
    {
      accessorKey: "categoryId",
      header: "Category",
      size: 250,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-semibold">
            {row.original.categoryId?.label || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.categoryId?.value || "No category"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "countryId",
      header: "Country",
      size: 200,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-medium">
            {row.original.countryId?.name || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.countryId?.code || "No code"} · {row.original.countryId?.currency || ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "minPrice",
      header: "Price Range",
      size: 200,
      cell: ({ row }) => (
        <div>
          {row.original.isConfigured ? (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {row.original.minPrice} - {row.original.maxPrice}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Not configured</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isConfigured",
      header: "Status",
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isConfigured ? (
            <Badge
              variant="default"
              className="gap-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Configured
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Pending
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
  const hasActiveFilters = filterStatus || filterCountry || searchTerm;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pricing</h1>
          <p className="text-muted-foreground mt-1">
            Manage pricing configurations
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total}{" "}
              pricing records
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleImportClick}
            disabled={isImporting}
            variant="outline"
            className="p-5"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? "Importing..." : "Import Excel"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={handleExport}
            disabled={isExporting || !isDataAvailable}
            className="text-white p-5"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export as Excel"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by category or country..."
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
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={filterCountry} onValueChange={handleCountryFilterChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              {countriesData?.data?.map((country) => (
                <SelectItem key={country._id} value={country._id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Configured</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
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
        <PricingEmpty />
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

      <EditPricingModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        pricing={itemToEdit}
        onSuccess={refetch}
      />
      <ViewPricingModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        pricing={selectedItem}
      />
    </section>
  );
}