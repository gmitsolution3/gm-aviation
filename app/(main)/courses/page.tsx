"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RevealItem, RevealStagger } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
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
import { ICourse, IPagination } from "@/types";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/home/Courses/CourseCard";
import CourseEmpty from "@/components/home/Courses/CourseEmpty";
import CourseError from "@/components/home/Courses/CourseError";
import CourseLoading from "@/components/home/Courses/CourseLoading";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: IPagination;
  data: ICourse[];
}

const DEFAULT_LIMIT = 9;
const LIMIT_OPTIONS = [6, 9, 12, 18, 24];

export default function CoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read page and limit from URL or use defaults
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const [limit, setLimit] = useState(
    limitParam ? parseInt(limitParam) : DEFAULT_LIMIT
  );

  // Update URL when page or limit changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (limit !== DEFAULT_LIMIT) params.set("limit", limit.toString());
    const queryString = params.toString();
    router.push(`/courses${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [page, limit, router]);

  // Fetch courses with pagination
  const { data, isLoading, isError, refetch } = useFetch<ApiResponse>(
    `/courses?page=${page}&limit=${limit}`
  );

  const courses = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (newLimit: string) => {
    setLimit(parseInt(newLimit));
    setPage(1); // Reset to first page when limit changes
  };

  // Reset to first page when data changes (e.g., after refetch)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  if (isLoading) {
    return <CourseLoading />;
  }

  if (isError) {
    return <CourseError refetch={refetch} />;
  }

  if (!courses.length) {
    return <CourseEmpty />;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <section id="courses" className="bg-white py-20 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Programs"
          title="Courses designed for a global aviation career"
          description="From your first solo flight to advanced airline certifications, choose the path that fits your ambition."
        />

        {/* Results info and limit selector */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startItem}</span> –{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{total}</span> courses
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-20 h-9">
                <SelectValue placeholder="9" />
              </SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt.toString()}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course grid */}
        <RevealStagger className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: ICourse) => (
            <RevealItem key={course._id} className="h-full">
              <CourseCard course={course} />
            </RevealItem>
          ))}
        </RevealStagger>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    aria-disabled={page === 1}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {/* First page if not visible */}
                {!pageNumbers.includes(1) && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {pageNumbers[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Page numbers */}
                {pageNumbers.map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(num);
                      }}
                      isActive={num === page}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {/* Last page if not visible */}
                {!pageNumbers.includes(totalPages) && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Back to top (optional) */}
        <div className="mt-10 text-center">
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}