"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePatch } from "@/hooks/swr/usePatch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Calendar, Clock, Mail, Phone, Shield } from "lucide-react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { IUser } from "@/types";
import { formatDate } from "@/utils";
import Image from "next/image";

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  user: IUser | null;
  onSuccess?: () => void;
}

export default function EditUserModal({
  isModalOpen,
  setIsModalOpen,
  user,
  onSuccess,
}: EditUserModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/users", {
    revalidateKey: "/users",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        role: user.role,
      });
    }
  }, [user, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    try {
      const payload = {
        role: data.role,
      };

      const response = await patchData({
        id: `${user._id}/role`,
        data: payload,
      });

      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `User "${user.name}" role has been updated to ${data.role}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update user role. Please try again.",
      });
    }
  };

  const watchedRole = watch("role");

  if (!user) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
          <DialogDescription>
            Promote or change user role permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Current role: {user.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select
              value={watchedRole}
              onValueChange={(value) => setValue("role", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Select the role you want to assign to this user
            </p>
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
            <Button type="submit" disabled={isLoading} className="text-white">
              Update Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}