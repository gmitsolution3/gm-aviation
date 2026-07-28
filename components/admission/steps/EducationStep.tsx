"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepProps } from "@/types";

export default function EducationStep({ register, watch, setValue, errors, isLoading }: StepProps) {
  return (
    <div className="space-y-5">
      {/* Highest Qualification Select */}
      <Field>
        <FieldLabel htmlFor="highestQualification">Highest Qualification</FieldLabel>
        <Select
          value={watch("highestQualification") || ""}
          onValueChange={(value) => setValue("highestQualification", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="highestQualification" className="w-full">
            <SelectValue placeholder="Select highest qualification" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ssc">SSC</SelectItem>
              <SelectItem value="hsc">HSC</SelectItem>
              <SelectItem value="bachelor">Bachelor</SelectItem>
              <SelectItem value="master">Master</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.highestQualification ? (
          <FieldError>{errors.highestQualification.message}</FieldError>
        ) : (
          <FieldDescription>Select your highest qualification</FieldDescription>
        )}
      </Field>

      {/* Institution Name */}
      <Field>
        <FieldLabel htmlFor="institutionName">Institution Name</FieldLabel>
        <Input
          id="institutionName"
          type="text"
          placeholder="ABC College"
          disabled={isLoading}
          {...register("institutionName")}
        />
        {errors.institutionName && (
          <FieldError>{errors.institutionName.message}</FieldError>
        )}
      </Field>

      {/* Passing Year */}
      <Field>
        <FieldLabel htmlFor="passingYear">Passing Year</FieldLabel>
        <Input
          id="passingYear"
          type="number"
          placeholder="2023"
          disabled={isLoading}
          {...register("passingYear", { valueAsNumber: true })}
        />
        {errors.passingYear && (
          <FieldError>{errors.passingYear.message}</FieldError>
        )}
      </Field>

      {/* Result */}
      <Field>
        <FieldLabel htmlFor="result">Result</FieldLabel>
        <Input
          id="result"
          type="text"
          placeholder="5.00"
          disabled={isLoading}
          {...register("result")}
        />
        {errors.result && (
          <FieldError>{errors.result.message}</FieldError>
        )}
      </Field>
    </div>
  );
}