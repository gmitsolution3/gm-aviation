// app/profile/page.tsx
"use client";

import ProfileLeftCard from "@/components/AdminDashboard/profile/ProfileLeftCard";
import ProfileLoader from "@/components/AdminDashboard/profile/ProfileLoader";
import ProfileRightCard from "@/components/AdminDashboard/profile/ProfileRightCard";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ProfileFormValues,
  profileSchema,
} from "@/form-schema/ProfileFormSchema";
import { useSession } from "@/lib/auth-context";
import { notify } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
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
      const response = await fetch("/api/user/update", {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4 rounded-lg">
        {/* Email Verification Alert */}
        {user && !user.emailVerified && (
          <Alert
            variant="destructive"
            className="mb-6 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20"
          >
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-400">
              Email Not Verified
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-500">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span>
                  Your email address <strong>{user.email}</strong> has
                  not been verified yet.{" "}
                  <Link href="/verify-user">Click here</Link> to
                  verify your email
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}
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
