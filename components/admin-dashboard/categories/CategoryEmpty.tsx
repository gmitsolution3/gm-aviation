"use client";

import { Button } from "@/components/ui/button";

interface CategoryEmptyProps {
  onCreateClick: () => void;
}

export default function CategoryEmpty({ onCreateClick }: CategoryEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">
        📂
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">No categories found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Get started by adding your first category.
        </p>
      </div>
      <Button variant="outline" onClick={onCreateClick}>
        Add Category
      </Button>
    </div>
  );
}