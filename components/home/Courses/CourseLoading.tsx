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
              <Card className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-brand-border bg-white shadow-sm">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="flex flex-1 flex-col p-6">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-brand-border p-6 pt-5">
                  <div>
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="mt-1 h-6 w-20" />
                  </div>
                  <Skeleton className="h-10 w-24 rounded-full" />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
