"use client";

import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ICategory } from "@/types";
import { formatDate } from "@/utils";
import { Calendar, Clock } from "lucide-react";
import Swal from "sweetalert2";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Name too long")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Only letters, numbers, spaces, and hyphens"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  category: ICategory | null;
  onSuccess?: () => void;
}

export default function EditCategoryModal({
  isModalOpen,
  setIsModalOpen,
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/categories", {
    revalidateKey: "/categories",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const watchedName = watch("name");
  const slugPreview = watchedName ? generateSlug(watchedName) : "";

  const onSubmit = async (data: FormValues) => {
    if (!category) return;
    try {
      const response = await patchData({
        id: category._id,
        data,
      });
      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Category "${data.name}" updated.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update category.",
      });
    }
  };

  if (!category) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...register("name")}
              className="text-lg"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {watchedName && (
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <h4 className="font-medium text-sm">Preview</h4>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{watchedName}</span>
                <Badge variant="outline">slug: {slugPreview}</Badge>
              </div>
            </div>
          )}

          {category && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Created: {formatDate(category.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Updated: {formatDate(category.updatedAt)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Current slug: {category.slug}</div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="text-white">
              Update Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}