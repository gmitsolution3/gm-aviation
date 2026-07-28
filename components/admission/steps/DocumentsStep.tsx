"use client";

import { ImageUploader } from "@/components/image-uploader";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { StepProps } from "@/types";

export default function DocumentsStep({ watch, setValue, errors, isLoading }: StepProps) {
  return (
    <div className="space-y-5">
      <FieldDescription className="mb-2">
        Please upload your documents. Supported formats: PDF, JPG, PNG
      </FieldDescription>

      <div>
        <FieldLabel>
          Photo <span className="text-destructive">*</span>
        </FieldLabel>
        <ImageUploader
          value={watch("photo")}
          imagePublicId={watch("photoPublicId")}
          onChange={(url: string, publicId: string) => {
            setValue("photo", url);
            setValue("photoPublicId", publicId);
          }}
        />
        {errors.photo && (
          <p className="text-destructive mt-2">{errors.photo.message}</p>
        )}
      </div>

      <div>
        <FieldLabel>
          NID or Birth Certificate <span className="text-destructive">*</span>
        </FieldLabel>
        <ImageUploader
          value={watch("nidOrBirthCertificate")}
          imagePublicId={watch("nidOrBirthCertificatePublicId")}
          onChange={(url: string, publicId: string) => {
            setValue("nidOrBirthCertificate", url);
            setValue("nidOrBirthCertificatePublicId", publicId);
          }}
        />
        {errors.nidOrBirthCertificate && (
          <p className="text-destructive mt-2">{errors.nidOrBirthCertificate.message}</p>
        )}
      </div>

      <div>
        <FieldLabel>
          Academic Certificate <span className="text-destructive">*</span>
        </FieldLabel>
        <ImageUploader
          value={watch("academicCertificate")}
          imagePublicId={watch("academicCertificatePublicId")}
          onChange={(url: string, publicId: string) => {
            setValue("academicCertificate", url);
            setValue("academicCertificatePublicId", publicId);
          }}
        />
        {errors.academicCertificate && (
          <p className="text-destructive mt-2">{errors.academicCertificate.message}</p>
        )}
      </div>

      <div>
        <FieldLabel>
          Passport <span className="text-destructive">*</span>
        </FieldLabel>
        <ImageUploader
          value={watch("passport")}
          imagePublicId={watch("passportPublicId")}
          onChange={(url: string, publicId: string) => {
            setValue("passport", url);
            setValue("passportPublicId", publicId);
          }}
        />
        {errors.passport && (
          <p className="text-destructive mt-2">{errors.passport.message}</p>
        )}
      </div>

      <div>
        <FieldLabel>
          Medical Certificate <span className="text-destructive">*</span>
        </FieldLabel>
        <ImageUploader
          value={watch("medicalCertificate")}
          imagePublicId={watch("medicalCertificatePublicId")}
          onChange={(url: string, publicId: string) => {
            setValue("medicalCertificate", url);
            setValue("medicalCertificatePublicId", publicId);
          }}
        />
        {errors.medicalCertificate && (
          <p className="text-destructive mt-2">{errors.medicalCertificate.message}</p>
        )}
      </div>
    </div>
  );
}