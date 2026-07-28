"use client";

import BanUserModal from "@/components/admin-dashboard/users/BanUserModal";
import EditUserModal from "@/components/admin-dashboard/users/EditUserModal";
import UserEmpty from "@/components/admin-dashboard/users/UserEmpty";
import ViewUserModal from "@/components/admin-dashboard/users/ViewUserModal";
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
import { useFetch } from "@/hooks/swr/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import { IUser } from "@/types";
import { formatDate } from "@/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Ban,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {useSession} from "@/lib/auth-context"

interface ApiResponse {
  data: IUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterBan, setFilterBan] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { session } = useSession();

  console.log(session);

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/users?page=${currentPage}&limit=${limit}${debouncedSearch ? `&searchTerm=${debouncedSearch}` : ""}${filterRole ? `&role=${filterRole}` : ""}${filterBan ? `&isBanned=${filterBan}` : ""}`,
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IUser | null>(
    null,
  );
  const [itemToEdit, setItemToEdit] = useState<IUser | null>(null);
  const [itemToBan, setItemToBan] = useState<IUser | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterRole, filterBan]);

  const handleView = (item: IUser) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: IUser) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleBan = (item: IUser) => {
    setItemToBan(item);
    setIsBanModalOpen(true);
  };

  const handleRoleFilterChange = (value: string) => {
    setFilterRole(value);
    setCurrentPage(1);
  };

  const handleBanFilterChange = (value: string) => {
    setFilterBan(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("");
    setFilterBan("");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      header: "User",
      size: 300,
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {row.original.image ? (
              <Image
                src={row.original.image}
                alt={row.original.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold">
              {row.getValue("name")}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.email}
            </div>
            {row.original.phone && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {row.original.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      size: 120,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("role")}
        </Badge>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: "Email",
      size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.emailVerified ? (
            <Badge
              variant="default"
              className="gap-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Unverified
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isBanned",
      header: "Status",
      size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isBanned ? (
            <Badge variant="destructive" className="gap-1">
              <Ban className="h-3 w-3" />
              Banned
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="gap-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
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
                Update Role
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleBan(row.original)}
                className={
                  row.original.isBanned
                    ? "hover:text-white! hover:bg-primary!"
                    : "text-destructive hover:text-white! hover:bg-primary!"
                }
              >
                <Ban className="h-4 w-4 mr-2" />
                {row.original.isBanned ? "Unban User" : "Ban User"}
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
  const hasActiveFilters = searchTerm || filterRole || filterBan;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage your users
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total} users
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone..."
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
          <Select
            value={filterRole}
            onValueChange={handleRoleFilterChange}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterBan}
            onValueChange={handleBanFilterChange}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="true">Banned</SelectItem>
              <SelectItem value="false">Active</SelectItem>
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
        <UserEmpty />
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

      <EditUserModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        user={itemToEdit}
        onSuccess={refetch}
      />
      <ViewUserModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        user={selectedItem}
      />
      <BanUserModal
        isModalOpen={isBanModalOpen}
        setIsModalOpen={setIsBanModalOpen}
        user={itemToBan}
        onSuccess={refetch}
      />
    </section>
  );
}
