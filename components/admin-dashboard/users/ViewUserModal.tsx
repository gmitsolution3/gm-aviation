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
import { IUser } from "@/types";
import { formatDate } from "@/utils";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Ban,
  Shield,
} from "lucide-react";
import Image from "next/image";

interface ViewUserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  user: IUser | null;
}

export default function ViewUserModal({
  isModalOpen,
  setIsModalOpen,
  user,
}: ViewUserModalProps) {
  if (!user) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View complete user information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
                {user.emailVerified ? (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Email Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Email Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Name</div>
              <div className="font-medium">{user.name}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Role</div>
              <div className="font-medium capitalize flex items-center gap-1">
                <Shield className="h-4 w-4 text-muted-foreground" />
                {user.role}
              </div>
            </div>
            <div className="rounded-lg border p-3 col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Email</div>
              <div className="font-medium flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email}
              </div>
            </div>
            {user.phone && (
              <div className="rounded-lg border p-3 col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Phone</div>
                <div className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {user.phone}
                </div>
              </div>
            )}
            <div className="rounded-lg border p-3 col-span-2">
              <div className="text-xs text-muted-foreground mb-1">ID</div>
              <div className="font-medium font-mono text-sm">{user._id}</div>
            </div>
          </div>

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
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}