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
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/image-uploader";
import { X } from "lucide-react";
import { useFetch } from "@/hooks/swr/useFetch";
import { usePatch } from "@/hooks/swr/usePatch";
import { ICategory, ICourse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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

  // Local state for list input fields
  const [checklistInput, setChecklistInput] = useState("");
  const [careerInput, setCareerInput] = useState("");
  const [shiftInput, setShiftInput] = useState("");

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


  const handleImageChange = (url: string, publicId: string) => {
    setValue("image", url, { shouldValidate: true });
  };

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
    // Clear local inputs
    setChecklistInput("");
    setCareerInput("");
    setShiftInput("");
  };

  // Helper to add an item to a list
  const addItem = (
    field: "checklists" | "careerOpportunities" | "availableShifts",
    value: string
  ) => {
    if (!value.trim()) return;
    const current = watch(field) || [];
    if (current.includes(value.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Duplicate",
        text: `"${value.trim()}" already exists.`,
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    setValue(field, [...current, value.trim()]);
    // Clear the corresponding input
    if (field === "checklists") setChecklistInput("");
    else if (field === "careerOpportunities") setCareerInput("");
    else if (field === "availableShifts") setShiftInput("");
  };

  // Helper to remove an item from a list
  const removeItem = (
    field: "checklists" | "careerOpportunities" | "availableShifts",
    index: number
  ) => {
    const current = watch(field) || [];
    setValue(field, current.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    if (!course) return;
    try {
      const response = await patchData({ id: course._id, data });
      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        setChecklistInput("");
        setCareerInput("");
        setShiftInput("");
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

  // Helper to render a list field with add/remove
  const renderListField = (
    label: string,
    field: "checklists" | "careerOpportunities" | "availableShifts",
    placeholder: string,
    inputValue: string,
    setInput: (v: string) => void
  ) => {
    const items = watch(field) || [];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem(field, inputValue);
              }
            }}
          />
          <Button
            type="button"
            variant="default"
            onClick={() => addItem(field, inputValue)}
            disabled={!inputValue.trim()}
          >
            Add
          </Button>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {items.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(field, index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

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

          {/* 👇 REPLACED: Image URL input with ImageUploader */}
          <div className="space-y-2">
            <Label>Course Image</Label>
            <ImageUploader
              value={watch("image")}
              onChange={handleImageChange}
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
          {renderListField(
            "Checklists",
            "checklists",
            "e.g., HSC Pass",
            checklistInput,
            setChecklistInput
          )}

          {/* Career Opportunities */}
          {renderListField(
            "Career Opportunities",
            "careerOpportunities",
            "e.g., Commercial Pilot",
            careerInput,
            setCareerInput
          )}

          {/* Available Shifts */}
          {renderListField(
            "Available Shifts",
            "availableShifts",
            "e.g., Morning",
            shiftInput,
            setShiftInput
          )}

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