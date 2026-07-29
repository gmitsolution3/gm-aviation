"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/swr/useFetch";
import { useSession } from "@/lib/auth-context";
import { ICourse } from "@/types";
import { formatDate, formatCurrency } from "@/utils";
import {
  BookOpen,
  Clock,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICourse[];
}

export default function Courses() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { data, isLoading, isError } = useFetch<ApiResponse>(
    userId ? `/courses/user/${userId}` : null
  );

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Please log in</h3>
        <p className="text-muted-foreground text-sm">
          You need to be logged in to view your enrolled courses.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Failed to load courses</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Please try refreshing the page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const courses = data?.data || [];

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No enrolled courses</h3>
        <p className="text-muted-foreground text-sm">
          You haven't enrolled in any courses yet.
        </p>
        <Button asChild className="mt-4">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 lg:px-0 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-1">
          You are enrolled in {courses.length} course{courses.length > 1 ? "s" : ""}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: ICourse }) {
  const isAdmissionOpen = course.isAdmissionOpen;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
          <Badge variant={isAdmissionOpen ? "default" : "secondary"} className="shrink-0">
            {isAdmissionOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available"}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{formatCurrency(course.fee)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {course.checklists?.slice(0, 3).map((item, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
          {course.checklists?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{course.checklists.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 inline mr-1" />
          {formatDate(course.createdAt)}
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/courses/${course._id}`}>
            View Details
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}