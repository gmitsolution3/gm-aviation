import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col items-center pt-8 px-8 pb-0">
          {/* Logo Skeleton */}
          <div className="inline-block mb-4">
            <Skeleton className="h-16 w-40 rounded-lg" />
          </div>
          
          <div className="space-y-2 text-center">
            <Skeleton className="h-9 w-48 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-64 mx-auto rounded-lg" />
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-6">
          {/* Form Fields Skeleton */}
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16 rounded-lg" />
                <Skeleton className="h-3 w-28 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>

            {/* Submit Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Register Link Skeleton */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Skeleton className="h-4 w-36 rounded-lg" />
              <Skeleton className="h-4 w-28 rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}