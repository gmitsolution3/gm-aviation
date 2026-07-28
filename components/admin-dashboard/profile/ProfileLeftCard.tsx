// components/profile/ProfileLeftCard.tsx
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileFormValues } from "@/schema/profileForm.schema";
import { getUserInitials } from "@/utils";
import { Camera, Mail, Phone, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import ProfileImageDialog from "./ProfileImageDialog";

interface ProfileLeftCardProps {
  user: any;
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  isImageDialogOpen: boolean;
  setIsImageDialogOpen: (open: boolean) => void;
}

export default function ProfileLeftCard({
  user,
  form,
  isEditing,
  isImageDialogOpen,
  setIsImageDialogOpen,
}: ProfileLeftCardProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500";
      case "user":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <div className="relative mx-auto mb-4">
          <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-xl">
            <AvatarImage
              src={form.watch("image") || user.image || ""}
              alt={user.name}
            />
            <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60 text-white">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <Button
            disabled={!isEditing}
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background bg-primary text-white hover:bg-primary/90 hover:text-white"
            onClick={() => setIsImageDialogOpen(true)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <CardTitle className="text-2xl">{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
        <div className="mt-2 flex justify-center gap-2 flex-wrap">
          <Badge className={getRoleBadgeColor(user.role)}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
          {!user.emailVerified ? (
            <Badge
              variant="outline"
              className="border-yellow-500/50 text-yellow-500"
            >
              Email Not Verified
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-green-500/50 text-green-500"
            >
              Email Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <span>{user.phone || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 text-primary" />
            <span>
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Image Upload Dialog */}
      <ProfileImageDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        form={form}
        user={user}
      />
    </Card>
  );
}
