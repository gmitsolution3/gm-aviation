"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePost } from "@/hooks/swr/usePost";
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
import Swal from "sweetalert2";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Name too long (max 50 characters)")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Only letters, numbers, spaces, and hyphens"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateCategoryModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateCategoryModalProps) {
  const { mutate: postData, isLoading } = usePost("/categories", {
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

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  // Generate slug preview
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const watchedName = watch("name");
  const slugPreview = watchedName ? generateSlug(watchedName) : "";

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await postData(data);
      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Category "${data.name}" created.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to create category. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new product category.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g., Electronics, Clothing"
              {...register("name")}
              className="text-lg"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            <p className="text-sm text-muted-foreground">This will be displayed as the category name.</p>
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="text-white">
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}