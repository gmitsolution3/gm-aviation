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
import { EGender, EBloodGroup, genderOptions, bloodGroupOptions } from "@/schema/admission.schema";
import { StepProps } from "@/types";

export default function PersonalInfoStep({ register, watch, setValue, errors, isLoading }: StepProps) {
  return (
    <div className="space-y-5">
      {/* Full Name */}
      <Field>
        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          disabled={isLoading}
          {...register("fullName")}
        />
        {errors.fullName && (
          <FieldError>{errors.fullName.message}</FieldError>
        )}
      </Field>

      {/* Email */}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email ? (
          <FieldError>{errors.email.message}</FieldError>
        ) : (
          <FieldDescription>We'll send you account updates</FieldDescription>
        )}
      </Field>

      {/* Phone */}
      <Field>
        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
        <Input
          id="phone"
          type="tel"
          placeholder="01712345678"
          autoComplete="tel"
          disabled={isLoading}
          {...register("phone")}
        />
        {errors.phone ? (
          <FieldError>{errors.phone.message}</FieldError>
        ) : (
          <FieldDescription>For account verification</FieldDescription>
        )}
      </Field>

      {/* Date of Birth */}
      <Field>
        <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
        <Input
          id="dateOfBirth"
          type="date"
          disabled={isLoading}
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth && (
          <FieldError>{errors.dateOfBirth.message}</FieldError>
        )}
      </Field>

      {/* Gender */}
      <Field>
        <FieldLabel htmlFor="gender">Gender</FieldLabel>
        <Select
          value={watch("gender") || ""}
          onValueChange={(value) => setValue("gender", value as EGender)}
          disabled={isLoading}
        >
          <SelectTrigger id="gender" className="w-full">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {genderOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.gender ? (
          <FieldError>{errors.gender.message}</FieldError>
        ) : (
          <FieldDescription>Select your gender</FieldDescription>
        )}
      </Field>

      {/* Blood Group */}
      <Field>
        <FieldLabel htmlFor="bloodGroup">Blood Group</FieldLabel>
        <Select
          value={watch("bloodGroup") || ""}
          onValueChange={(value) => setValue("bloodGroup", value as EBloodGroup)}
          disabled={isLoading}
        >
          <SelectTrigger id="bloodGroup" className="w-full">
            <SelectValue placeholder="Select your blood group" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {bloodGroupOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.bloodGroup ? (
          <FieldError>{errors.bloodGroup.message}</FieldError>
        ) : (
          <FieldDescription>Select your blood group</FieldDescription>
        )}
      </Field>

      {/* Nationality */}
      <Field>
        <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
        <Input
          id="nationality"
          type="text"
          placeholder="Bangladeshi"
          disabled={isLoading}
          {...register("nationality")}
        />
        {errors.nationality && (
          <FieldError>{errors.nationality.message}</FieldError>
        )}
      </Field>
    </div>
  );
}