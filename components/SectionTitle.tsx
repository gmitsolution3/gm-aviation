import Reveal from "./Reveal";
import { Badge } from "@/components/ui/badge";

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <Badge 
        variant="outline" 
        className="inline-flex items-center gap-2 border-0 p-0 text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent hover:bg-transparent"
      >
        <span
          className="h-px w-6 bg-brand-accent"
          aria-hidden="true"
        />
        {eyebrow}
      </Badge>
      <h2
        className={`mt-4 text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          isDark ? "text-white" : "text-brand-ink"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-pretty text-base leading-relaxed sm:text-lg ${
            isDark ? "text-white/70" : "text-brand-body"
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}