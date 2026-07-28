import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TableLoader() {
  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      
      <Card className="overflow-hidden border shadow-sm p-0">
        <div className="overflow-x-auto">
          <div className="w-full">
            <div className="bg-muted/50 border-b">
              <div className="flex px-6 py-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32 ml-auto" />
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-center px-6 py-5 border-b last:border-0">
                <div className="flex items-start gap-3 flex-1">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}