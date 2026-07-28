// components/profile/ProfileRightCard.tsx
"use client";

import { Camera, Edit2, Mail, Phone, Save, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/schema/profileForm.schema";
import ProfileDisplay from "./ProfileDisplay"; 

interface ProfileRightCardProps {
  user: any;
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isLoading: boolean;
  onSubmit: (data: ProfileFormValues) => void;
  setIsImageDialogOpen: (open: boolean) => void;
}

export default function ProfileRightCard({
  user,
  form,
  isEditing,
  setIsEditing,
  isLoading,
  onSubmit,
  setIsImageDialogOpen,
}: ProfileRightCardProps) {
  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{isEditing ? "Edit Profile" : "Profile Information"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your personal information"
              : "View your personal information"}
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            if (isEditing) {
              form.reset();
            }
            setIsEditing(!isEditing);
          }}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </CardHeader>
      <Separator />

      <CardContent className="pt-6">
        {isEditing ? (
          <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Hidden image fields */}
            <input type="hidden" {...form.register("image")} />
            <input type="hidden" {...form.register("imagePublicId")} />

            <FieldGroup className="space-y-5">
              {/* Name Field */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Your full name"
                  disabled={isLoading}
                  {...form.register("name")}
                  aria-invalid={!!form.formState.errors.name}
                />
                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>

              {/* Email Field (Disabled) */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
                  {...form.register("email")}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </Field>

              {/* Phone Field */}
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  placeholder="Your phone number"
                  disabled={isLoading}
                  {...form.register("phone")}
                  aria-invalid={!!form.formState.errors.phone}
                />
                {form.formState.errors.phone && (
                  <FieldError>{form.formState.errors.phone.message}</FieldError>
                )}
              </Field>

              {/* Image Upload Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsImageDialogOpen(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Change Profile Picture
                </Button>
                {form.watch("image") && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Image uploaded successfully
                  </p>
                )}
              </div>
            </FieldGroup>
          </form>
        ) : (
          <ProfileDisplay user={user} />
        )}
      </CardContent>

      {isEditing && (
        <CardFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" form="profile-form" disabled={isLoading}>
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}