"use client";

import { RevealItem, RevealStagger } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/swr/useFetch";
import { ICourse, IPagination } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionTitle from "../../SectionTitle";
import CourseCard from "./CourseCard";
import CourseEmpty from "./CourseEmpty";
import CourseError from "./CourseError";
import CourseLoading from "./CourseLoading";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: IPagination;
  data: ICourse[];
}

export default function Courses() {
  const { data, isLoading, isError, refetch } = useFetch<ApiResponse>(
    "/courses?page=1&limit=6",
  );

  const courses = data?.data || [];
  const total = data?.meta?.total || 0;

  if (isLoading) {
    return <CourseLoading />;
  }

  if (isError) {
    return <CourseError refetch={refetch} />;
  }

  if (!courses.length) {
    return <CourseEmpty />;
  }

  return (
    <section id="courses" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Programs"
          title="Courses designed for a global aviation career"
          description="From your first solo flight to advanced airline certifications, choose the path that fits your ambition."
        />

        <RevealStagger className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: ICourse) => (
            <RevealItem key={course._id} className="h-full">
              <CourseCard course={course} />
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-12 text-center">
          <Link href="/courses">
            <Button
              size="lg"
              className="rounded-full bg-brand-navy px-8 font-semibold text-white hover:bg-brand-navy/90"
            >
              View All Courses
              <ArrowRight
                className="ml-2 size-4"
                aria-hidden="true"
              />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
