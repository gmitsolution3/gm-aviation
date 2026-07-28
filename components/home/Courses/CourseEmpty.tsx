import SectionTitle from "@/components/SectionTitle";

export default function CourseEmpty() {
  return (
    <section id="courses" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Programs"
          title="Courses designed for a global aviation career"
          description="From your first solo flight to advanced airline certifications, choose the path that fits your ambition."
        />
        <div className="mt-14 text-center">
          <p className="text-brand-body text-xl">
            No courses available at the moment.
          </p>
        </div>
      </div>
    </section>
  );
}
