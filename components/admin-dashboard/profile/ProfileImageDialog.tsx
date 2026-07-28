"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/image-uploader";
import type { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/schema/profileForm.schema";

interface ProfileImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ProfileFormValues>;
  user: any;
}

export default function ProfileImageDialog({
  open,
  onOpenChange,
  form,
  user,
}: ProfileImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture or remove the current one.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ImageUploader
            value={form.watch("image") || user.image}
            imagePublicId={form.watch("imagePublicId") || user.imagePublicId}
            onChange={(url, publicId) => {
              form.setValue("image", url);
              form.setValue("imagePublicId", publicId);
            }}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}