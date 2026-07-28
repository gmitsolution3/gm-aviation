"use client";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/types";

export default function GuardianStep({ register, errors, isLoading }: StepProps) {
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel htmlFor="fatherName">Father's Name</FieldLabel>
        <Input
          id="fatherName"
          type="text"
          placeholder="Father Name"
          disabled={isLoading}
          {...register("fatherName")}
        />
        {errors.fatherName && (
          <FieldError>{errors.fatherName.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="motherName">Mother's Name</FieldLabel>
        <Input
          id="motherName"
          type="text"
          placeholder="Mother Name"
          disabled={isLoading}
          {...register("motherName")}
        />
        {errors.motherName && (
          <FieldError>{errors.motherName.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="guardianName">Guardian's Name</FieldLabel>
        <Input
          id="guardianName"
          type="text"
          placeholder="Guardian Name"
          disabled={isLoading}
          {...register("guardianName")}
        />
        {errors.guardianName && (
          <FieldError>{errors.guardianName.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="relationship">Relationship with Guardian</FieldLabel>
        <Input
          id="relationship"
          type="text"
          placeholder="Uncle"
          disabled={isLoading}
          {...register("relationship")}
        />
        {errors.relationship && (
          <FieldError>{errors.relationship.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="guardianPhone">Guardian's Phone Number</FieldLabel>
        <Input
          id="guardianPhone"
          type="tel"
          placeholder="01812345678"
          disabled={isLoading}
          {...register("guardianPhone")}
        />
        {errors.guardianPhone && (
          <FieldError>{errors.guardianPhone.message}</FieldError>
        )}
      </Field>
    </div>
  );
}