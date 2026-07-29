"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import { IAdmission } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as z from "zod";

const formSchema = z.object({
  status: z.enum(["under-review", "approved", "rejected"], {
    error: "Please select a status",
  }),
  remark: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewAdmissionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  admission: IAdmission | null;
  onSuccess?: () => void;
}

export default function ReviewAdmissionModal({
  isModalOpen,
  setIsModalOpen,
  admission,
  onSuccess,
}: ReviewAdmissionModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/admissions", {
    revalidateKey: "/admissions",
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
      status: "under-review",
      remark: "",
    },
  });

  useEffect(() => {
    if (admission) {
      reset({
        status: "under-review",
        remark: "",
      });
    }
  }, [admission, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    if (!admission) return;

    try {
      const response = await patchData({
        id: `${admission._id}/review`,
        data,
      });

      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Review Updated",
          text: `Admission status updated to ${data.status}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.message ||
          "Failed to update review. Please try again.",
      });
    }
  };

  if (!admission) return null;

  const watchedStatus = watch("status");

  return (
    <Dialog
      modal={false}
      open={isModalOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Admission</DialogTitle>
          <DialogDescription>
            Update the status and add a remark for this application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watchedStatus}
              onValueChange={(
                val: "under-review" | "approved" | "rejected",
              ) => setValue("status", val)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-review">
                  Under Review
                </SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Remark */}
          <div className="space-y-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea
              id="remark"
              placeholder="Add any remarks about this decision..."
              {...register("remark")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="text-white"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
