// components/profile/ProfileSkeleton.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Skeleton className="h-28 w-28 rounded-full mx-auto" />
                </div>
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto mt-1" />
                <div className="mt-2 flex justify-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details Skeleton */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-4 w-52 mt-1" />
                </div>
                <Skeleton className="h-10 w-32" />
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Skeleton className="h-5 w-5" />
                        <div className="flex-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-4 w-40 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}