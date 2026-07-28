"use client";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/types";

export default function AddressStep({ register, errors, isLoading }: StepProps) {
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel htmlFor="presentAddress">Present Address</FieldLabel>
        <Input
          id="presentAddress"
          type="text"
          placeholder="Dhaka, Bangladesh"
          disabled={isLoading}
          {...register("presentAddress")}
        />
        {errors.presentAddress && (
          <FieldError>{errors.presentAddress.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="permanentAddress">Permanent Address</FieldLabel>
        <Input
          id="permanentAddress"
          type="text"
          placeholder="Dhaka, Bangladesh"
          disabled={isLoading}
          {...register("permanentAddress")}
        />
        {errors.permanentAddress && (
          <FieldError>{errors.permanentAddress.message}</FieldError>
        )}
      </Field>
    </div>
  );
}