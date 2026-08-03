import { z } from "zod";

// Enums
export enum EGender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum EBloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email").min(1, "Email is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum([EGender.MALE, EGender.FEMALE, EGender.OTHER]),
  bloodGroup: z.enum([
    EBloodGroup.A_POSITIVE,
    EBloodGroup.A_NEGATIVE,
    EBloodGroup.B_POSITIVE,
    EBloodGroup.B_NEGATIVE,
    EBloodGroup.AB_POSITIVE,
    EBloodGroup.AB_NEGATIVE,
    EBloodGroup.O_POSITIVE,
    EBloodGroup.O_NEGATIVE,
  ]),
  nationality: z.string().min(1, "Nationality is required"),
});

// Step 2: Address Information
export const addressSchema = z.object({
  presentAddress: z.string().min(1, "Present address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
});

// Step 3: Guardian Information
export const guardianSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  guardianName: z.string().min(1, "Guardian's name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  guardianPhone: z.string().min(10, "Please enter a valid phone number"),
});

// Step 4: Education Information
export const educationSchema = z.object({
  highestQualification: z.string().min(1, "Highest qualification is required"),
  institutionName: z.string().min(1, "Institution name is required"),
  passingYear: z.number().min(1900, "Please enter a valid year"),
  result: z.string().min(1, "Result is required"),
});

// Step 5: Aviation Information
export const aviationSchema = z.object({
  passportNumber: z.string().min(1, "Passport number is required"),
  height: z.number().min(1, "Height is required"),
  weight: z.number().min(1, "Weight is required"),
  medicalInformation: z.string().min(1, "Medical information is required"),
});

// Step 6: Documents
export const documentsSchema = z.object({
  photo: z.string().min(1, "Photo is required"),
  photoPublicId: z.string().min(1, "Photo is required"),
  nidOrBirthCertificate: z.string().min(1, "NID or Birth Certificate is required"),
  nidOrBirthCertificatePublicId: z.string().min(1, "NID or Birth Certificate is required"),
  academicCertificate: z.string().min(1, "Academic Certificate is required"),
  academicCertificatePublicId: z.string().min(1, "Academic Certificate is required"),
  passport: z.string().min(1, "Passport is required"),
  passportPublicId: z.string().min(1, "Passport is required"),
  medicalCertificate: z.string().min(1, "Medical Certificate is required"),
  medicalCertificatePublicId: z.string().min(1, "Medical Certificate is required"),
});

// Combined schema
export const formSchema = z.object({
  user: z.string(),
  course: z.string(),
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
  ...guardianSchema.shape,
  ...educationSchema.shape,
  ...aviationSchema.shape,
  ...documentsSchema.shape,
});

export type FormValues = z.infer<typeof formSchema>;

export const steps = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Enter your personal details",
    schema: personalInfoSchema,
  },
  {
    id: "address",
    title: "Address Information",
    description: "Enter your address details",
    schema: addressSchema,
  },
  {
    id: "guardian",
    title: "Guardian Information",
    description: "Enter your guardian's details",
    schema: guardianSchema,
  },
  {
    id: "education",
    title: "Education Information",
    description: "Enter your educational background",
    schema: educationSchema,
  },
  {
    id: "aviation",
    title: "Aviation Information",
    description: "Enter your aviation details",
    schema: aviationSchema,
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload your documents",
    schema: documentsSchema,
  },
];

export const genderOptions = [
  { id: EGender.MALE, name: "Male" },
  { id: EGender.FEMALE, name: "Female" },
  { id: EGender.OTHER, name: "Other" },
];

export const bloodGroupOptions = [
  { id: EBloodGroup.A_POSITIVE, name: "A+" },
  { id: EBloodGroup.A_NEGATIVE, name: "A-" },
  { id: EBloodGroup.B_POSITIVE, name: "B+" },
  { id: EBloodGroup.B_NEGATIVE, name: "B-" },
  { id: EBloodGroup.AB_POSITIVE, name: "AB+" },
  { id: EBloodGroup.AB_NEGATIVE, name: "AB-" },
  { id: EBloodGroup.O_POSITIVE, name: "O+" },
  { id: EBloodGroup.O_NEGATIVE, name: "O-" },
];

export const defaultValues: FormValues = {
  user: "",
  course: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: EGender.MALE,
  bloodGroup: EBloodGroup.A_POSITIVE,
  nationality: "",
  presentAddress: "",
  permanentAddress: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  relationship: "",
  guardianPhone: "",
  highestQualification: "",
  institutionName: "",
  passingYear: new Date().getFullYear(),
  result: "",
  passportNumber: "",
  height: 0,
  weight: 0,
  medicalInformation: "",
  photo: "",
  photoPublicId: "",
  nidOrBirthCertificate: "",
  nidOrBirthCertificatePublicId: "",
  academicCertificate: "",
  academicCertificatePublicId: "",
  passport: "",
  passportPublicId: "",
  medicalCertificate: "",
  medicalCertificatePublicId: "",
};