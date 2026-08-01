"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Award,
  Tag,
  FileText,
  User,
  List,
  Briefcase,
  Clock as ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICourse[];
}

export default function Courses() {
  const { session } = useSession();
  const userId = session?.user?.id;

  // Modal state
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleIssueCertificate = async (courseId: string, courseTitle: string) => {
    const result = await Swal.fire({
      title: "Issue Certificate?",
      text: `Generate a certificate for "${courseTitle}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#232156",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, issue it!",
    });

    if (result.isConfirmed) {
      try {
        // Simulate API call – replace with actual endpoint
        // await axios.post(`/courses/${courseId}/certificate`);
        await new Promise(resolve => setTimeout(resolve, 1500));

        await Swal.fire({
          icon: "success",
          title: "Certificate Issued!",
          text: "Your certificate has been generated and is ready to download.",
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Could not issue certificate. Please try again.",
        });
      }
    }
  };

  const handleViewDetails = (course: ICourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

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
          <CourseCard
            key={course._id}
            course={course}
            onIssueCertificate={handleIssueCertificate}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* View Details Modal */}
      <CourseDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
}

// Course Card Component
function CourseCard({
  course,
  onIssueCertificate,
  onViewDetails,
}: {
  course: ICourse;
  onIssueCertificate: (id: string, title: string) => void;
  onViewDetails: (course: ICourse) => void;
}) {
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
      <CardFooter className="border-t pt-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 inline mr-1" />
          {formatDate(course.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-primary border-primary/30 hover:bg-primary/10"
            onClick={() => onIssueCertificate(course._id, course.title)}
          >
            <Award className="h-4 w-4 mr-1" />
            Issue Certificate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(course)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Course Details Modal Component
function CourseDetailsModal({
  isOpen,
  onClose,
  course,
}: {
  isOpen: boolean;
  onClose: () => void;
  course: ICourse | null;
}) {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          <DialogDescription>
            {course.description || "No description available"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image (if available) */}
          {course.image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                Duration
              </p>
              <p className="font-medium">{course.duration || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Fee
              </p>
              <p className="font-medium">{formatCurrency(course.fee)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Slug
              </p>
              <p className="font-medium text-sm">{course.slug}</p>
            </div>
          </div>

          {/* Statuses */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
              Status
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={course.isAdmissionOpen ? "default" : "secondary"}>
                {course.isAdmissionOpen ? "Admission Open" : "Admission Closed"}
              </Badge>
              <Badge variant={course.isPublished ? "default" : "secondary"}>
                {course.isPublished ? "Published" : "Unpublished"}
              </Badge>
              <Badge variant={course.isActive ? "default" : "secondary"}>
                {course.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant={course.isFeatured ? "default" : "secondary"}>
                {course.isFeatured ? "Featured" : "Not Featured"}
              </Badge>
            </div>
          </div>

          {/* Checklists */}
          {course.checklists && course.checklists.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                <List className="h-4 w-4 inline mr-1" />
                Checklists
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {course.checklists.map((item, idx) => (
                  <li key={idx} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Career Opportunities */}
          {course.careerOpportunities && course.careerOpportunities.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                <Briefcase className="h-4 w-4 inline mr-1" />
                Career Opportunities
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {course.careerOpportunities.map((item, idx) => (
                  <li key={idx} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Shifts */}
          {course.availableShifts && course.availableShifts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                <Clock className="h-4 w-4 inline mr-1" />
                Available Shifts
              </h4>
              <div className="flex flex-wrap gap-2">
                {course.availableShifts.map((shift, idx) => (
                  <Badge key={idx} variant="outline">{shift}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Created: {formatDate(course.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Updated: {formatDate(course.updatedAt)}
              </div>
            </div>
            <div className="text-xs">ID: {course._id}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}