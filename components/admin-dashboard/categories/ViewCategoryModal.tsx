"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/types";
import { formatDate } from "@/utils";
import { Calendar, Clock } from "lucide-react";

interface ViewCategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  category: ICategory | null;
}

export default function ViewCategoryModal({
  isModalOpen,
  setIsModalOpen,
  category,
}: ViewCategoryModalProps) {
  if (!category) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>View complete category information.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              📁
            </div>
            <div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">slug: {category.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Created</div>
              <div className="font-medium flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                {formatDate(category.createdAt)}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Last Updated</div>
              <div className="font-medium flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {formatDate(category.updatedAt)}
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">ID</div>
            <div className="font-mono text-sm">{category._id}</div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}