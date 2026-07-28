import SectionTitle from "@/components/SectionTitle";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function CourseError({
  refetch,
}: {
  refetch: () => void;
}) {
  return (
    <section id="courses" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Programs"
          title="Courses designed for a global aviation career"
          description="From your first solo flight to advanced airline certifications, choose the path that fits your ambition."
        />
        <div className="mt-14 flex justify-center">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load courses</AlertTitle>
            <AlertDescription className="mt-2">
              There was an error loading the courses. Please try again
              later.
            </AlertDescription>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              <RefreshCw className="mr-2 size-4" />
              Retry
            </Button>
          </Alert>
        </div>
      </div>
    </section>
  );
}
