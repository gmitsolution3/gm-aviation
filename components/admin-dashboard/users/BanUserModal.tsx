"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatch } from "@/hooks/swr/usePatch";
import { IUser } from "@/types";
import { formatDate } from "@/utils";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Ban,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";

interface BanUserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  user: IUser | null;
  onSuccess?: () => void;
}

export default function BanUserModal({
  isModalOpen,
  setIsModalOpen,
  user,
  onSuccess,
}: BanUserModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/users", {
    revalidateKey: "/users",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleBanToggle = async () => {
    if (!user) return;

    const action = user.isBanned ? "unban" : "ban";
    const actionText = user.isBanned ? "unban" : "ban";
    const capitalizedAction = user.isBanned ? "Unban" : "Ban";

    const result = await Swal.fire({
      title: `${capitalizedAction} User?`,
      text: `Are you sure you want to ${actionText} "${user.name}"?`,
      icon: user.isBanned ? "info" : "warning",
      showCancelButton: true,
      confirmButtonColor: user.isBanned ? "#22c55e" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionText} user`,
    });

    if (!result.isConfirmed) return;

    setIsProcessing(true);

    try {
      const payload = {
        isBanned: !user.isBanned,
      };

      const response = await patchData({
        id: `${user._id}/ban`,
        data: payload,
      });

      if (response.success) {
        setIsModalOpen(false);
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `User "${user.name}" has been ${actionText}ned.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Failed to ${actionText} user. Please try again.`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog modal={false} open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {user.isBanned ? "Unban User" : "Ban User"}
          </DialogTitle>
          <DialogDescription>
            {user.isBanned
              ? "Restore access for this user."
              : "Restrict access for this user."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{user.name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  Role: {user.role}
                </Badge>
                {user.isBanned ? (
                  <Badge variant="destructive" className="gap-1 text-xs">
                    <Ban className="h-3 w-3" />
                    Currently Banned
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600 text-xs">
                    <ShieldAlert className="h-3 w-3" />
                    Currently Active
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 p-4">
            <div className="flex items-start gap-3">
              <Ban className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">
                  {user.isBanned ? "Unban Confirmation" : "Ban Confirmation"}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.isBanned
                    ? `This will restore full access for "${user.name}". They will be able to log in and use the platform again.`
                    : `This will restrict access for "${user.name}". They will not be able to log in or use the platform.`}
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined: {formatDate(user.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {formatDate(user.updatedAt)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {user._id}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleBanToggle}
              disabled={isProcessing || isLoading}
              className={
                user.isBanned
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-destructive hover:bg-destructive/90 text-white"
              }
            >
              {isProcessing || isLoading ? "Processing..." : user.isBanned ? "Unban User" : "Ban User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}