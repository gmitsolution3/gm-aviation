import { Plane } from "lucide-react";
import { motion } from "motion/react";

export default function DecorativeLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* soft glow */}
      <div className="absolute -right-24 top-16 size-96 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="absolute -left-32 bottom-0 size-96 rounded-full bg-white/5 blur-3xl" />

      {/* flight route */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-50 720 C 300 640, 520 500, 760 420 S 1200 220, 1500 120"
          stroke="url(#route)"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="route" x1="0" y1="0" x2="1440" y2="0">
            <stop stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* animated plane along route */}
      <motion.div
        className="absolute left-[12%] top-[62%] text-brand-accent/40"
        initial={{ x: 0, y: 0 }}
        animate={{ x: 120, y: -60 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <Plane className="size-8 -rotate-12" />
      </motion.div>

      {/* compass ring */}
      <div className="absolute right-10 top-28 hidden size-40 rounded-full border border-white/10 lg:block">
        <div className="absolute inset-4 rounded-full border border-dashed border-white/10" />
        <div className="absolute left-1/2 top-2 h-6 w-px -translate-x-1/2 bg-brand-accent/40" />
      </div>
    </div>
  );
}
