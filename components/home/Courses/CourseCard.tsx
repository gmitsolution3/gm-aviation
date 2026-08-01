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
import { ArrowRight, Clock, Users, Star, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: ICourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  // Mock rating – replace with real data
  const rating = 4.8;
  const enrolledCount = 1250;

  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="group h-full"
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-brand-navy/20 p-0 gap-1">
        {/* Image Container with Gradient Overlay */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark gradient overlay to improve badge readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badges – Glassmorphism with better positioning */}
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <Badge className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy backdrop-blur-sm transition-all hover:bg-white">
              <Clock className="size-3.5" aria-hidden="true" />
              {course.duration}
            </Badge>
            {course.isFeatured && (
              <Badge className="flex items-center gap-1.5 rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-yellow-950 backdrop-blur-sm">
                <Star className="size-3.5 fill-current" />
                Featured
              </Badge>
            )}
          </div>

          {/* Admission Status – moved to bottom-left */}
          <div className="absolute bottom-4 left-4">
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
                course.isAdmissionOpen
                  ? "bg-emerald-500/90 text-white"
                  : "bg-rose-500/90 text-white"
              }`}
            >
              {course.isAdmissionOpen ? "● Enroll Now" : "● Closed"}
            </Badge>
          </div>

          {/* Price Tag – overlaid on image for prominence */}
          <div className="absolute bottom-4 right-4 rounded-full bg-brand-navy/90 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            ${course.fee.toLocaleString()}
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 p-5">
          {/* Category */}
          {course.category && (
            <Badge variant="outline" className="self-start text-xs font-medium">
              {course.category.name}
            </Badge>
          )}

          <CardTitle className="font-heading text-xl font-bold leading-tight text-brand-ink text-balance">
            {course.title}
          </CardTitle>

          {/* Rating & Enrolled – social proof */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              {rating} (2.3k)
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {enrolledCount.toLocaleString()} enrolled
            </span>
          </div>

          <p className="flex-1 text-sm leading-relaxed text-brand-body line-clamp-3">
            {course.description}
          </p>

          {/* Shifts – with icons */}
          {course.availableShifts?.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <GraduationCap className="size-4 text-brand-body" />
              {course.availableShifts.map((shift, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="rounded-full bg-blue-50/80 px-3 py-0.5 text-xs text-blue-700"
                >
                  {shift}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-gray-100 p-5 pt-4">
          <Button
            className="group/btn w-full rounded-full bg-brand-navy font-semibold text-white transition-all hover:bg-brand-navy/90 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => router.push(`/courses/${course.slug}`)}
          >
            <span>View Details</span>
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}