"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ICourse } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";

interface ViewCourseModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  course: ICourse | null;
}

export default function ViewCourseModal({
  isModalOpen,
  setIsModalOpen,
  course,
}: ViewCourseModalProps) {
  if (!course) return null;

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => setIsModalOpen(false)}
    >
      <DialogContent className="!max-w-2xl">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
          <DialogDescription>
            View complete course information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Category: {course.category?.name || "N/A"} &middot;
                Slug: {course.slug}
              </p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Duration
              </div>
              <div className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {course.duration || "—"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Fee</div>
              <div className="font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                {formatCurrency(course.fee)}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Admission
              </div>
              <div>
                {course.isAdmissionOpen ? (
                  <Badge className="bg-green-500">Open</Badge>
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Featured
              </div>
              <div>
                {course.isFeatured ? (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  "No"
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Description
              </div>
              <p className="text-sm mt-1">{course.description}</p>
            </div>
          )}

          {/* Lists */}
          {course.checklists?.length > 0 && (
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Checklists
              </div>
              <ul className="list-disc list-inside text-sm mt-1">
                {course.checklists.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {course.careerOpportunities?.length > 0 && (
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Career Opportunities
              </div>
              <ul className="list-disc list-inside text-sm mt-1">
                {course.careerOpportunities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {course.availableShifts?.length > 0 && (
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">
                Available Shifts
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.availableShifts.map((shift, idx) => (
                  <Badge key={idx} variant="outline">
                    {shift}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Created:{" "}
                {formatDate(course.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Updated:{" "}
                {formatDate(course.updatedAt)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              ID: {course._id}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
