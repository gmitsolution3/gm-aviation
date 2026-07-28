"use client";

import CourseDetailError from "@/components/course-detail/CourseDetailError";
import CourseDetailHero from "@/components/course-detail/CourseDetailHero";
import CourseDetailLoading from "@/components/course-detail/CourseDetailLoading";
import Reveal, {
  RevealItem,
  RevealStagger,
} from "@/components/Reveal";
import { useFetchById } from "@/hooks/swr/useFetchById";
import { ICourse } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  CircleCheck,
  Clock,
  GraduationCap,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICourse;
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, isLoading, isError, refetch } =
    useFetchById<ApiResponse>("/courses", slug);

  // Loading state
  if (isLoading) {
    return <CourseDetailLoading />;
  }

  // Error state
  if (isError || !data?.data) {
    return <CourseDetailError refetch={refetch} />;
  }

  const course = data.data;

  // Transform API data to match the component's expected structure
  const transformedCourse = {
    title: course.title,
    slug: course.slug,
    category: course.category?.name || "Aviation",
    level: "Professional",
    image: course.image,
    duration: course.duration,
    fee: course.fee,
    intake: "Rolling Admission",
    cohortSize: "15-20 Students",
    description: course.description,
    checklists: course.checklists || [],
    careerOpportunities: course.careerOpportunities || [],
    availableShifts: course.availableShifts || [],
    isAdmissionOpen: course.isAdmissionOpen,
    isFeatured: course.isFeatured,
  };

  const facts = [
    {
      icon: Clock,
      label: "Duration",
      value: transformedCourse.duration,
    },
    {
      icon: GraduationCap,
      label: "Level",
      value: transformedCourse.level,
    },
    {
      icon: CalendarDays,
      label: "Intake",
      value: transformedCourse.intake,
    },
    {
      icon: Users,
      label: "Cohort Size",
      value: transformedCourse.cohortSize,
    },
    {
      icon: Tag,
      label: "Category",
      value: transformedCourse.category,
    },
  ];

  // Related courses (would fetch separately in a real implementation)
  const related: any[] = [];

  return (
    <div className="bg-white">
      {/* Hero */}
      <CourseDetailHero course={course} />

      {/* Body */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          {/* Main content */}
          <div className="min-w-0">
            {/* Overview */}
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-brand-ink">
                Program Overview
              </h2>
              <div className="mt-4 space-y-4">
                <p className="text-pretty leading-relaxed text-brand-body">
                  {course.description}
                </p>
                <p className="text-pretty leading-relaxed text-brand-body">
                  This comprehensive {course.duration} program is
                  designed to prepare you for a successful career in
                  the aviation industry. With a focus on practical
                  skills and theoretical knowledge, you'll gain the
                  expertise needed to excel in your chosen field.
                </p>
                {course.careerOpportunities &&
                  course.careerOpportunities.length > 0 && (
                    <p className="text-pretty leading-relaxed text-brand-body">
                      Upon completion, you'll be qualified for roles
                      such as: {course.careerOpportunities.join(", ")}
                      .
                    </p>
                  )}
              </div>
            </Reveal>

            {/* Highlights */}
            <Reveal className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-brand-ink">
                Program Highlights
              </h2>
              <RevealStagger className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RevealItem>
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-surface p-4">
                    <CircleCheck
                      className="mt-0.5 size-5 shrink-0 text-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-brand-ink">
                      Industry-recognized certification
                    </span>
                  </div>
                </RevealItem>
                <RevealItem>
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-surface p-4">
                    <CircleCheck
                      className="mt-0.5 size-5 shrink-0 text-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-brand-ink">
                      Hands-on training with experienced instructors
                    </span>
                  </div>
                </RevealItem>
                <RevealItem>
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-surface p-4">
                    <CircleCheck
                      className="mt-0.5 size-5 shrink-0 text-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-brand-ink">
                      Modern facilities and equipment
                    </span>
                  </div>
                </RevealItem>
                <RevealItem>
                  <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-surface p-4">
                    <CircleCheck
                      className="mt-0.5 size-5 shrink-0 text-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-brand-ink">
                      Career support and job placement assistance
                    </span>
                  </div>
                </RevealItem>
              </RevealStagger>
            </Reveal>

            {/* Requirements */}
            {course.checklists && course.checklists.length > 0 && (
              <Reveal className="mt-12">
                <h2 className="font-heading text-2xl font-bold text-brand-ink">
                  Entry Requirements
                </h2>
                <ul className="mt-5 space-y-3">
                  {course.checklists.map((req) => (
                    <li
                      key={req}
                      className="flex items-start gap-3 text-brand-body"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-accent"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Career outcomes */}
            {course.careerOpportunities &&
              course.careerOpportunities.length > 0 && (
                <Reveal className="mt-12">
                  <h2 className="font-heading text-2xl font-bold text-brand-ink">
                    Career Outcomes
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {course.careerOpportunities.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-2 text-sm font-medium text-brand-ink"
                      >
                        <Briefcase
                          className="size-4 text-brand-accent"
                          aria-hidden="true"
                        />
                        {role}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}

            {/* Available Shifts */}
            {course.availableShifts &&
              course.availableShifts.length > 0 && (
                <Reveal className="mt-12">
                  <h2 className="font-heading text-2xl font-bold text-brand-ink">
                    Available Shifts
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {course.availableShifts.map((shift) => (
                      <span
                        key={shift}
                        className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-2 text-sm font-medium text-brand-ink"
                      >
                        <Clock
                          className="size-4 text-brand-accent"
                          aria-hidden="true"
                        />
                        {shift}
                      </span>
                    ))}
                  </div>
                </Reveal>
              )}
          </div>

          {/* Sidebar */}
          <aside className="lg:pl-2">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[1.75rem] border border-brand-border bg-white shadow-lg">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="380px"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-brand-body">
                    Total Tuition
                  </p>
                  <p className="mt-1 font-heading text-3xl font-bold text-brand-ink">
                    ${course.fee.toLocaleString()}
                  </p>

                  <dl className="mt-6 space-y-4 border-t border-brand-border pt-6">
                    {facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-center justify-between gap-4"
                      >
                        <dt className="flex items-center gap-2.5 text-sm text-brand-body">
                          <fact.icon
                            className="size-4 text-brand-accent"
                            aria-hidden="true"
                          />
                          {fact.label}
                        </dt>
                        <dd className="text-sm font-semibold text-brand-ink">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/admission?courseId=${course._id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-accent/90"
                  >
                    Apply for this Program
                    <ArrowRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Link>
                  <a
                    href="tel:+18005550110"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-navy"
                  >
                    Talk to an Advisor
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related courses */}
        {related.length > 0 ? (
          <div className="mt-20 border-t border-brand-border pt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold text-brand-ink sm:text-3xl">
                Explore other programs
              </h2>
              <Link
                href="/#courses"
                className="hidden items-center gap-1.5 text-sm font-semibold text-brand-navy transition-colors hover:text-brand-accent sm:inline-flex"
              >
                View all
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <RevealStagger className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.slug}>
                  <Link
                    href={`/courses/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-brand-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                        {item.category}
                      </span>
                      <h3 className="mt-2 font-heading text-lg font-bold text-brand-ink transition-colors group-hover:text-brand-accent">
                        {item.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-body">
                        {item.text}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
                        View details
                        <ArrowRight
                          className="size-4"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        ) : null}

        {/* Back link */}
        <div className="mt-14">
          <Link
            href="/#courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-body transition-colors hover:text-brand-navy"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to all courses
          </Link>
        </div>
      </section>
    </div>
  );
}
