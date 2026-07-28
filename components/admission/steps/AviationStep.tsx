"use client";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/types";

export default function AviationStep({ register, errors, isLoading }: StepProps) {
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel htmlFor="passportNumber">Passport Number</FieldLabel>
        <Input
          id="passportNumber"
          type="text"
          placeholder="A12345678"
          disabled={isLoading}
          {...register("passportNumber")}
        />
        {errors.passportNumber && (
          <FieldError>{errors.passportNumber.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="height">Height (cm)</FieldLabel>
        <Input
          id="height"
          type="number"
          placeholder="172"
          disabled={isLoading}
          {...register("height", { valueAsNumber: true })}
        />
        {errors.height && (
          <FieldError>{errors.height.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
        <Input
          id="weight"
          type="number"
          placeholder="65"
          disabled={isLoading}
          {...register("weight", { valueAsNumber: true })}
        />
        {errors.weight && (
          <FieldError>{errors.weight.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="medicalInformation">Medical Information</FieldLabel>
        <Input
          id="medicalInformation"
          type="text"
          placeholder="Fit"
          disabled={isLoading}
          {...register("medicalInformation")}
        />
        {errors.medicalInformation && (
          <FieldError>{errors.medicalInformation.message}</FieldError>
        )}
      </Field>
    </div>
  );
}