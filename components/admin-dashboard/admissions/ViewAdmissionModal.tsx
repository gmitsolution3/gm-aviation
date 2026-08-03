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
import { IAdmission } from "@/types";
import { formatDate } from "@/utils";
import { Calendar, Clock, Image } from "lucide-react";
import Link from "next/link";

interface ViewAdmissionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  admission: IAdmission | null;
}

export default function ViewAdmissionModal({
  isModalOpen,
  setIsModalOpen,
  admission,
}: ViewAdmissionModalProps) {
  if (!admission) return null;

  const {
    personalInformation,
    addressInformation,
    guardianInformation,
    educationInformation,
    aviationInformation,
    documents,
    course,
  } = admission;

  // Helper to render a section
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-muted-foreground border-b pb-1">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: any;
  }) => (
    <div>
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium">{value || "—"}</span>
    </div>
  );

  // Status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      submitted: "bg-yellow-500 hover:bg-yellow-600",
      reviewed: "bg-blue-500 hover:bg-blue-600",
      approved: "bg-green-500 hover:bg-green-600",
      rejected: "bg-red-500 hover:bg-red-600",
    };
    return (
      <Badge
        className={`${variants[status] || "bg-gray-500"} text-white`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => setIsModalOpen(false)}
    >
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Admission Application</span>
            {getStatusBadge(admission.status)}
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(admission.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Information */}
          {course && (
            <Section title="Course Information">
              <InfoItem label="Course" value={course.title} />
              <InfoItem label="Slug" value={course.slug} />
              <InfoItem label="Duration" value={course.duration} />
              <InfoItem
                label="Admission Open"
                value={
                  course.isAdmissionOpen ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="destructive">No</Badge>
                  )
                }
              />
            </Section>
          )}

          {/* User & Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Applicant">
              <InfoItem
                label="Name"
                value={
                  personalInformation?.fullName ||
                  admission.user?.name
                }
              />
              <InfoItem
                label="Email"
                value={
                  personalInformation?.email || admission.user?.email
                }
              />
              <InfoItem
                label="Phone"
                value={personalInformation?.phone}
              />
              <InfoItem
                label="Date of Birth"
                value={
                  personalInformation?.dateOfBirth
                    ? formatDate(personalInformation.dateOfBirth)
                    : "—"
                }
              />
              <InfoItem
                label="Gender"
                value={personalInformation?.gender || "—"}
              />
              <InfoItem
                label="Blood Group"
                value={personalInformation?.bloodGroup || "—"}
              />
              <InfoItem
                label="Nationality"
                value={personalInformation?.nationality || "—"}
              />
            </Section>

            {/* Address */}
            <Section title="Address Information">
              <div className="col-span-2 space-y-1">
                <p className="text-muted-foreground">
                  Present Address:
                </p>
                <p className="font-medium">
                  {addressInformation?.presentAddress || "—"}
                </p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-muted-foreground">
                  Permanent Address:
                </p>
                <p className="font-medium">
                  {addressInformation?.permanentAddress || "—"}
                </p>
              </div>
            </Section>
          </div>

          {/* Guardian Info */}
          <Section title="Guardian Information">
            <InfoItem
              label="Father's Name"
              value={guardianInformation?.fatherName}
            />
            <InfoItem
              label="Mother's Name"
              value={guardianInformation?.motherName}
            />
            <InfoItem
              label="Guardian's Name"
              value={guardianInformation?.guardianName}
            />
            <InfoItem
              label="Relationship"
              value={guardianInformation?.relationship}
            />
            <InfoItem
              label="Guardian Phone"
              value={guardianInformation?.guardianPhone}
            />
          </Section>

          {/* Education & Aviation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Education">
              <InfoItem
                label="Highest Qualification"
                value={educationInformation?.highestQualification}
              />
              <InfoItem
                label="Institution"
                value={educationInformation?.institutionName}
              />
              <InfoItem
                label="Passing Year"
                value={educationInformation?.passingYear}
              />
              <InfoItem
                label="Result"
                value={educationInformation?.result}
              />
            </Section>

            <Section title="Aviation Details">
              <InfoItem
                label="Passport Number"
                value={aviationInformation?.passportNumber}
              />
              <InfoItem
                label="Height (cm)"
                value={aviationInformation?.height}
              />
              <InfoItem
                label="Weight (kg)"
                value={aviationInformation?.weight}
              />
              <InfoItem
                label="Medical Info"
                value={aviationInformation?.medicalInformation}
              />
            </Section>
          </div>

          {/* Documents */}
          {documents && (
            <Section title="Uploaded Documents">
              <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(documents).map(([key, value]) => {
                  if (!value?.url) return null;
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <div
                      key={key}
                      className="border rounded p-2 flex items-center gap-2"
                    >
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={value.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm truncate"
                      >
                        {label}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Meta */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Created:{" "}
                {formatDate(admission.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Updated:{" "}
                {formatDate(admission.updatedAt)}
              </div>
            </div>
            <div className="text-xs">ID: {admission._id}</div>
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
