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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetch } from "@/hooks/swr/useFetch";
import { ICategory } from "@/types";
import Swal from "sweetalert2";

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

interface CreateCourseModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateCourseModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateCourseModalProps) {
  const { mutate: postData, isLoading } = usePost("/courses", {
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

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

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
          text: `Course "${data.title}" created.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to create course. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>Add a new course.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              onValueChange={(val) => setValue("category", val)}
              value={watch("category")}
            >
              <SelectTrigger>
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
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...register("image")} placeholder="https://..." />
            {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
          </div>

          {/* Duration & Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...register("duration")} placeholder="e.g., 6 Months" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee">Fee ($)</Label>
              <Input
                id="fee"
                type="number"
                {...register("fee", { valueAsNumber: true })}
              />
              {errors.fee && <p className="text-sm text-destructive">{errors.fee.message}</p>}
            </div>
          </div>

          {/* Checklists, Career Opportunities, Shifts - you can add dynamic fields */}
          {/* For simplicity, we'll use comma-separated inputs */}
          <div className="space-y-2">
            <Label htmlFor="checklists">Checklists (comma separated)</Label>
            <Input
              id="checklists"
              placeholder="e.g., HSC Pass, Medical Certificate"
              onChange={(e) =>
                setValue(
                  "checklists",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careerOpportunities">Career Opportunities (comma separated)</Label>
            <Input
              id="careerOpportunities"
              placeholder="e.g., Commercial Pilot, Flight Instructor"
              onChange={(e) =>
                setValue(
                  "careerOpportunities",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableShifts">Available Shifts (comma separated)</Label>
            <Input
              id="availableShifts"
              placeholder="e.g., Morning, Evening"
              onChange={(e) =>
                setValue(
                  "availableShifts",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div>

          {/* Switches */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("isAdmissionOpen")}
                onCheckedChange={(checked) => setValue("isAdmissionOpen", checked)}
              />
              <Label>Admission Open</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("isFeatured")}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
              />
              <Label>Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("isPublished")}
                onCheckedChange={(checked) => setValue("isPublished", checked)}
              />
              <Label>Published</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("isActive")}
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
              Create Course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}