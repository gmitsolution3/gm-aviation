"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/swr/useFetch";
import { usePatch } from "@/hooks/swr/usePatch";
import { ICategory, ICourse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional(),
  duration: z.string().optional(),
  fee: z.number().min(0, "Fee must be a positive number"),
  checklists: z.array(z.string()),
  careerOpportunities: z.array(z.string()),
  availableShifts: z.array(z.string()),
  isAdmissionOpen: z.boolean(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCourseModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  course: ICourse | null;
  onSuccess?: () => void;
}

export default function EditCourseModal({
  isModalOpen,
  setIsModalOpen,
  course,
  onSuccess,
}: EditCourseModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/courses", {
    revalidateKey: "/courses",
  });
  const { data: categoriesData } = useFetch<{ data: ICategory[] }>(
    "/categories?limit=100"
  );

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
      title: "",
      category: "",
      description: "",
      image: "",
      duration: "",
      fee: 0,
      checklists: [],
      careerOpportunities: [],
      availableShifts: [],
      isAdmissionOpen: true,
      isFeatured: false,
      isPublished: true,
      isActive: true,
    },
  });

  // Pre‑fill form when course changes
  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        category: course.category?._id || "",
        description: course.description || "",
        image: course.image || "",
        duration: course.duration || "",
        fee: course.fee || 0,
        checklists: course.checklists || [],
        careerOpportunities: course.careerOpportunities || [],
        availableShifts: course.availableShifts || [],
        isAdmissionOpen: course.isAdmissionOpen,
        isFeatured: course.isFeatured,
        isPublished: course.isPublished,
        isActive: course.isActive,
      });
    }
  }, [course, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    if (!course) return;
    try {
      const response = await patchData({ id: course._id, data });
      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Course "${data.title}" updated.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update course.",
      });
    }
  };

  if (!course) return null;

  // Helper to convert array to comma‑separated string for input fields
  const arrayToString = (arr: string[]) => arr.join(", ");
  const stringToArray = (str: string) =>
    str.split(",").map((s) => s.trim()).filter(Boolean);

  // Watch values for switches
  const watchedIsAdmissionOpen = watch("isAdmissionOpen");
  const watchedIsFeatured = watch("isFeatured");
  const watchedIsPublished = watch("isPublished");
  const watchedIsActive = watch("isActive");

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>Update course details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input id="edit-title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category *</Label>
            <Select
              onValueChange={(val) => setValue("category", val)}
              value={watch("category")}
            >
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.data?.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" {...register("description")} />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-image">Image URL</Label>
            <Input
              id="edit-image"
              {...register("image")}
              placeholder="https://..."
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          {/* Duration & Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <Input
                id="edit-duration"
                {...register("duration")}
                placeholder="e.g., 6 Months"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fee">Fee ($)</Label>
              <Input
                id="edit-fee"
                type="number"
                {...register("fee", { valueAsNumber: true })}
              />
              {errors.fee && (
                <p className="text-sm text-destructive">{errors.fee.message}</p>
              )}
            </div>
          </div>

          {/* Checklists */}
          <div className="space-y-2">
            <Label htmlFor="edit-checklists">Checklists (comma separated)</Label>
            <Input
              id="edit-checklists"
              defaultValue={arrayToString(watch("checklists") || [])}
              onBlur={(e) => {
                const arr = stringToArray(e.target.value);
                setValue("checklists", arr);
              }}
              placeholder="e.g., HSC Pass, Medical Certificate"
            />
          </div>

          {/* Career Opportunities */}
          <div className="space-y-2">
            <Label htmlFor="edit-career">
              Career Opportunities (comma separated)
            </Label>
            <Input
              id="edit-career"
              defaultValue={arrayToString(watch("careerOpportunities") || [])}
              onBlur={(e) => {
                const arr = stringToArray(e.target.value);
                setValue("careerOpportunities", arr);
              }}
              placeholder="e.g., Commercial Pilot, Flight Instructor"
            />
          </div>

          {/* Available Shifts */}
          <div className="space-y-2">
            <Label htmlFor="edit-shifts">Available Shifts (comma separated)</Label>
            <Input
              id="edit-shifts"
              defaultValue={arrayToString(watch("availableShifts") || [])}
              onBlur={(e) => {
                const arr = stringToArray(e.target.value);
                setValue("availableShifts", arr);
              }}
              placeholder="e.g., Morning, Evening"
            />
          </div>

          {/* Switches */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={watchedIsAdmissionOpen}
                onCheckedChange={(checked) =>
                  setValue("isAdmissionOpen", checked)
                }
              />
              <Label>Admission Open</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watchedIsFeatured}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
              />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watchedIsPublished}
                onCheckedChange={(checked) => setValue("isPublished", checked)}
              />
              <Label>Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label>Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="text-white">
              Update Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}