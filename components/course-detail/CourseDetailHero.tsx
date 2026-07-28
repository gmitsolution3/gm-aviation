import { ICourse } from "@/types";
import { CalendarDays, Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";

export default function CourseDetailHero({
  course,
}: {
  course: ICourse;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-navy pt-32 lg:pt-40">
      <div className="absolute inset-0 opacity-25">
        <Image
          src={course.image}
          alt="Course Cover Image"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/85 to-brand-navy/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-16 lg:pb-20">
        <Reveal>
          <nav
            className="flex items-center gap-2 text-sm text-white/60"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="transition-colors hover:text-brand-accent"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/#courses"
              className="transition-colors hover:text-brand-accent"
            >
              Courses
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/90">{course.title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-navy">
              {course.category?.name || "Aviation"}
            </span>
            {course.isAdmissionOpen && (
              <span className="rounded-full bg-green-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                Open for Admission
              </span>
            )}
            {course.isFeatured && (
              <span className="rounded-full bg-yellow-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl text-balance font-heading text-4xl font-bold leading-tight text-white sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
            {course.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-white/80">
              <Clock
                className="size-5 text-brand-accent"
                aria-hidden="true"
              />
              <span className="text-sm">{course.duration}</span>
            </div>
            {course.availableShifts &&
              course.availableShifts.length > 0 && (
                <div className="flex items-center gap-2 text-white/80">
                  <CalendarDays
                    className="size-5 text-brand-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm">
                    Shifts: {course.availableShifts.join(", ")}
                  </span>
                </div>
              )}
            <div className="flex items-center gap-2 text-white/80">
              <Users
                className="size-5 text-brand-accent"
                aria-hidden="true"
              />
              <span className="text-sm">Limited Seats</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
