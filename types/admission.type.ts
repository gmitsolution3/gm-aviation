import { ICourse } from "@/types";

export interface IAdmission {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  course: ICourse; // adjust if needed
  status: "submitted" | "reviewed" | "approved" | "rejected";
  personalInformation: {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    nationality?: string;
  };
  addressInformation: {
    presentAddress?: string;
    permanentAddress?: string;
  };
  guardianInformation: {
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    relationship?: string;
    guardianPhone?: string;
  };
  educationInformation: {
    highestQualification?: string;
    institutionName?: string;
    passingYear?: number;
    result?: string;
  };
  aviationInformation: {
    passportNumber?: string;
    height?: number;
    weight?: number;
    medicalInformation?: string;
  };
  documents: {
    photo?: { url: string };
    nidOrBirthCertificate?: { url: string };
    academicCertificate?: { url: string };
    passport?: { url: string };
    medicalCertificate?: { url: string };
  };
  review?: {
    reviewedAt: string;
    remark: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
