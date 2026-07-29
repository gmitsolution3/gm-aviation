"use client";

import { FileSearch } from "lucide-react";

export default function EnrollmentEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <FileSearch className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">No enrollments found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          No enrollments have been recorded yet.
        </p>
      </div>
    </div>
  );
}