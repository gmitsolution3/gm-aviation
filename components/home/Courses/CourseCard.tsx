"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ICourse } from "@/types";
import { motion } from "motion/react";
import { ArrowRight, Clock, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: ICourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      className="group h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-brand-border bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <Badge
            variant="secondary"
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-navy backdrop-blur hover:bg-white/95"
          >
            <Clock className="size-3.5" aria-hidden="true" />
            {course.duration}
          </Badge>
          {course.isAdmissionOpen ? (
            <Badge className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-green-500/95 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-green-500/95">
              Open
            </Badge>
          ) : (
            <Badge className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/95 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-red-500/95">
              Closed
            </Badge>
          )}
          {course.isFeatured && (
            <Badge className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-yellow-500/95 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-yellow-500/95">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-6">
          {/* Category Badge */}
          {course.category && (
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {course.category.name}
              </Badge>
            </div>
          )}

          <CardTitle className="font-heading text-xl font-bold text-brand-ink leading-tight">
            {course.title}
          </CardTitle>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-body line-clamp-3">
            {course.description}
          </p>

          {/* Available Shifts */}
          {course.availableShifts &&
            course.availableShifts.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-body">
                  Available Shifts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {course.availableShifts.map((shift, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700 hover:bg-blue-50"
                    >
                      <Users className="size-3" />
                      {shift}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </CardContent>

        <CardFooter className="mt-auto flex items-center justify-between border-t border-brand-border p-6 pt-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-brand-body">
              Tuition
            </p>
            <p className="font-heading text-lg font-bold text-brand-ink">
              ${course.fee.toLocaleString()}
            </p>
          </div>
          <Button
            className="rounded-full bg-brand-navy px-5 font-semibold text-white hover:bg-brand-navy/90"
            onClick={() => router.push(`/courses/${course.slug}`)}
          >
            View Detail
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
