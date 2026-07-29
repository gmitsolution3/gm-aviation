// app/profile/page.tsx
"use client";

import ProfileLeftCard from "@/components/admin-dashboard/profile/ProfileLeftCard";
import ProfileLoader from "@/components/admin-dashboard/profile/ProfileLoader";
import ProfileRightCard from "@/components/admin-dashboard/profile/ProfileRightCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-context";
import {
  ProfileFormValues,
  profileSchema,
} from "@/schema/profileForm.schema";
import { notify } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfilePage() {
  const { session, setSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const user = session?.user;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || "",
      imagePublicId: user?.imagePublicId || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSession({
          ...session,
          user: {
            ...user,
            name: data.name,
            phone: data.phone,
            image: data.image,
            imagePublicId: data.imagePublicId,
          },
        });

        notify.success("Profile updated successfully!");
        setIsEditing(false);
        setIsImageDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notify.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>
              Please log in to view your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProfileLoader />}>
      <div className="min-h-screen py-10 px-4 rounded-lg">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <ProfileLeftCard
                user={user}
                form={form}
                isEditing={isEditing}
                isImageDialogOpen={isImageDialogOpen}
                setIsImageDialogOpen={setIsImageDialogOpen}
              />
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <ProfileRightCard
                user={user}
                form={form}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isLoading={isLoading}
                onSubmit={onSubmit}
                setIsImageDialogOpen={setIsImageDialogOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
