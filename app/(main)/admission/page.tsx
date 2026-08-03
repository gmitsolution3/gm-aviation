"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { usePost } from "@/hooks/swr/usePost";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {useSession} from "@/lib/auth-context";

import { formSchema, steps, defaultValues, FormValues } from "@/schema/admission.schema";
import PersonalInfoStep from "@/components/admission/steps/PersonalInfoStep";
import AddressStep from "@/components/admission/steps/AddressStep";
import GuardianStep from "@/components/admission/steps/GuardianStep";
import EducationStep from "@/components/admission/steps/EducationStep";
import AviationStep from "@/components/admission/steps/AviationStep";
import DocumentsStep from "@/components/admission/steps/DocumentsStep";
import SuccessScreen from "@/components/admission/SuccessScreen";

export default function AdmissionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const {session} = useSession();
  const user = session?.user;

  const { mutate: postData, isLoading: isSubmitting } = usePost(
    "/admissions",
    {
      revalidateKey: "/admissions",
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      course: courseId as string,
      user: user.id,
      fullName: user.name,
      email: user.email,
      phone: user.phone || "",
    },
  });

  const currentStepSchema = steps[currentStep].schema;
  const totalSteps = steps.length;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  const nextStep = async () => {
    const isValid = await trigger(
      Object.keys(currentStepSchema.shape) as any
    );
    if (isValid) {
      if (currentStep === totalSteps - 1) {
        await onSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = getValues();
      const payload = {
        user: data.user,
        course: data.course,
        personalInformation: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          nationality: data.nationality,
        },
        addressInformation: {
          presentAddress: data.presentAddress,
          permanentAddress: data.permanentAddress,
        },
        guardianInformation: {
          fatherName: data.fatherName,
          motherName: data.motherName,
          guardianName: data.guardianName,
          relationship: data.relationship,
          guardianPhone: data.guardianPhone,
        },
        educationInformation: {
          highestQualification: data.highestQualification,
          institutionName: data.institutionName,
          passingYear: data.passingYear,
          result: data.result,
        },
        aviationInformation: {
          passportNumber: data.passportNumber,
          height: data.height,
          weight: data.weight,
          medicalInformation: data.medicalInformation,
        },
        documents: {
          photo: { url: data.photo || "" },
          nidOrBirthCertificate: { url: data.nidOrBirthCertificate || "" },
          academicCertificate: { url: data.academicCertificate || "" },
          passport: { url: data.passport || "" },
          medicalCertificate: { url: data.medicalCertificate || "" },
        },
      };

      const response = await postData(payload);

      if (response.success) {
        setIsComplete(true);
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your application has been submitted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to submit application. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const props = {
      register,
      watch,
      setValue,
      errors,
      isLoading: isLoading || isSubmitting,
    };

    switch (currentStep) {
      case 0:
        return <PersonalInfoStep {...props} />;
      case 1:
        return <AddressStep {...props} />;
      case 2:
        return <GuardianStep {...props} />;
      case 3:
        return <EducationStep {...props} />;
      case 4:
        return <AviationStep {...props} />;
      case 5:
        return <DocumentsStep {...props} />;
      default:
        return null;
    }
  };

  if (isComplete) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 pt-38">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="flex flex-col items-start pt-8 px-8 pb-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {steps[currentStep].description}
                </CardDescription>
              </div>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2 w-full" aria-label="Form progress" />
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-6">
          <form className="space-y-6">
            {renderStep()}

            <div className="flex items-center justify-between pt-4 border-t border-default-200 dark:border-default-700">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0 || isLoading || isSubmitting}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {currentStep === totalSteps - 1 ? "Submitting..." : "Loading..."}
                  </>
                ) : currentStep === totalSteps - 1 ? (
                  "Submit"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}