import SectionTitle from "@/components/SectionTitle";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <section id="courses" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Programs"
          title="Courses designed for a global aviation career"
          description="From your first solo flight to advanced airline certifications, choose the path that fits your ambition."
        />
        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="h-full">
              <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-md">
                {/* Image area with overlay and skeletons for badges */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Skeleton className="h-full w-full" />
                  {/* Dark gradient overlay – purely decorative, so no skeleton needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badges (glassmorphism skeletons) */}
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    <Skeleton className="h-7 w-16 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>

                  {/* Admission status skeleton */}
                  <div className="absolute bottom-4 left-4">
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>

                  {/* Price tag skeleton (overlaid on image) */}
                  <div className="absolute bottom-4 right-4">
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col gap-2 p-5">
                  {/* Category skeleton */}
                  <Skeleton className="h-5 w-16 rounded-full" />

                  {/* Title skeleton */}
                  <Skeleton className="h-7 w-3/4" />

                  {/* Rating & enrolled skeletons */}
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Description lines */}
                  <div className="mt-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Shifts skeleton */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-100 p-5 pt-4">
                  <Skeleton className="h-10 w-full rounded-full" />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}