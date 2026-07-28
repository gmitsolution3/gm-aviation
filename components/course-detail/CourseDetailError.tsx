export default function CourseDetailError({
  refetch,
}: {
  refetch: () => void;
}) {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-ink">
          Failed to load course
        </h2>
        <p className="mt-2 text-brand-body">Please try again later</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-brand-navy px-6 py-2 text-white hover:bg-brand-navy/90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
