"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IEnrollment } from "@/types";
import { formatDate } from "@/utils";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

interface ViewEnrollmentModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  enrollment: IEnrollment | null;
}

export default function ViewEnrollmentModal({
  isModalOpen,
  setIsModalOpen,
  enrollment,
}: ViewEnrollmentModalProps) {
  if (!enrollment) return null;

  const { user, course, admission, status, enrolledAt, createdAt, updatedAt } = enrollment;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-500 hover:bg-yellow-600" },
      completed: { label: "Completed", className: "bg-green-500 hover:bg-green-600" },
      cancelled: { label: "Cancelled", className: "bg-red-500 hover:bg-red-600" },
    };
    const info = variants[status.toLowerCase()] || variants.pending;
    return <Badge className={`${info.className} text-white`}>{info.label}</Badge>;
  };

  const getAdmissionStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      submitted: { label: "Submitted", className: "bg-yellow-500 hover:bg-yellow-600" },
      "under-review": { label: "Under Review", className: "bg-blue-500 hover:bg-blue-600" },
      approved: { label: "Approved", className: "bg-green-500 hover:bg-green-600" },
      rejected: { label: "Rejected", className: "bg-red-500 hover:bg-red-600" },
    };
    const info = variants[status.toLowerCase()] || variants.submitted;
    return <Badge className={`${info.className} text-white`}>{info.label}</Badge>;
  };

  const InfoItem = ({ label, value }: { label: string; value: any }) => (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium">{value || "—"}</span>
    </div>
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Enrollment Details</span>
            {getStatusBadge(status)}
          </DialogTitle>
          <DialogDescription>
            Enrolled on {formatDate(enrolledAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User & Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">User</h4>
              <InfoItem label="Name" value={user?.name} />
              <InfoItem label="Email" value={user?.email} />
              <InfoItem label="Phone" value={user?.phone} />
              <InfoItem label="Role" value={user?.role} />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Course</h4>
              <InfoItem label="Title" value={course?.title} />
              <InfoItem label="Duration" value={course?.duration} />
              <InfoItem label="Fee" value={`$${course?.fee}`} />
              <InfoItem label="Admission Open" value={course?.isAdmissionOpen ? "Yes" : "No"} />
            </div>
          </div>

          {/* Admission Details */}
          {admission && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">Admission</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <InfoItem label="Status" value={getAdmissionStatusBadge(admission.status)} />
                {admission.review && (
                  <>
                    <InfoItem label="Review Remark" value={admission.review.remark} />
                    <InfoItem label="Reviewed At" value={formatDate(admission.review.reviewedAt)} />
                  </>
                )}
                <InfoItem label="Submitted" value={formatDate(admission.createdAt)} />
                <InfoItem label="Last Updated" value={formatDate(admission.updatedAt)} />
              </div>
              {/* Quick summary of personal info */}
              <div className="mt-2 p-3 border rounded bg-muted/20">
                <p className="text-xs text-muted-foreground">Applicant: {admission.personalInformation?.fullName || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Email: {admission.personalInformation?.email || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Phone: {admission.personalInformation?.phone || "N/A"}</p>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Created: {formatDate(createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated: {formatDate(updatedAt)}
              </div>
            </div>
            <div className="text-xs">ID: {enrollment._id}</div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}