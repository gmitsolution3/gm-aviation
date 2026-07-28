"use client";

import { Button } from "@/components/ui/button";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Plane, PlayCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import DecorativeLayer from "./DecorativeLayer";

const HEADING_TAPE = [
  230, 240, 250, 260, 270, 274, 280, 290, 300, 310, 320,
];
const AIRSPEED_TAPE = [230, 220, 210, 200, 190, 180];
const ALTITUDE_TAPE = [12800, 12600, 12400, 12200, 12000, 11800];

// Horizon line's resting position and how far it's allowed to travel
const HORIZON_REST = 42; // %
const HORIZON_RANGE = 16; // % either side of rest

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);

  // 0 at rest; -1..1 as the cursor moves from top to bottom of the photo
  const pitch = useMotionValue(0);
  const pitchSpring = useSpring(pitch, {
    stiffness: 140,
    damping: 18,
    mass: 0.6,
  });

  const horizonTop = useTransform(
    pitchSpring,
    (v) => `${HORIZON_REST + v * HORIZON_RANGE}%`,
  );
  // Nose noses down slightly as it moves down, up as it moves up
  const planeRotate = useTransform(pitchSpring, (v) => -45 - v * 20);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const relativeY = (e.clientY - rect.top) / rect.height; // 0 top -> 1 bottom
    pitch.set((relativeY - 0.5) * 2); // -1 .. 1
  };

  const handleMouseLeave = () => {
    pitch.set(0);
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-brand-navy via-brand-navy to-[#0a1826] pt-28 pb-16 lg:pt-32"
    >
      <DecorativeLayer />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-10">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 font-mono text-xs tracking-[0.2em] text-white/60">
            <ShieldCheck
              className="size-4 shrink-0 text-[#F2A65A]"
              aria-hidden="true"
            />
            <span>HDG 274°</span>
            <span className="text-white/20">/</span>
            <span>ICAO-ALIGNED CURRICULUM</span>
          </div>

          <h1 className="mt-7 text-balance font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Every cadet starts at hour zero.
            <span className="block text-brand-accent">
              Ours leave with wings.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/70">
            Simulators that match the aircraft you'll actually fly.
            Instructors who've flown the routes they're training you
            for. A logbook airlines recognise the day you graduate.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button
              size="lg"
              className="rounded-full bg-brand-accent px-8 font-semibold text-brand-navy hover:bg-brand-accent/90"
              onClick={() =>
                document
                  .querySelector("#courses")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Programs
            </Button>

            <button
              type="button"
              onClick={() =>
                document
                  .querySelector("#about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              <PlayCircle
                className="size-5 text-[#F2A65A]"
                aria-hidden="true"
              />
              Watch the walkthrough
              <span className="translate-x-0 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-stretch gap-0 border-t border-white/10 pt-6">
            {[
              { value: "1,000+", label: "GRADUATES WORLDWIDE" },
              { value: "98%", label: "PLACED WITHIN A YEAR" },
              { value: "4.9/5", label: "ALUMNI RATING" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col gap-1 pr-8 ${i > 0 ? "border-l border-white/10 pl-8" : ""}`}
              >
                <span className="font-mono text-2xl font-semibold text-white">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/45">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — instrument panel */}
        <motion.div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.15,
          }}
        >
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#081420] shadow-2xl">
            <div className="relative h-9 overflow-hidden border-b border-white/10 bg-[#0d1f30]">
              <div
                className={`flex h-full items-center gap-6 whitespace-nowrap font-mono text-xs text-white/40 ${
                  reduceMotion ? "" : "animate-tape"
                }`}
                style={{ paddingLeft: "40%" }}
              >
                {[...HEADING_TAPE, ...HEADING_TAPE].map((deg, i) => (
                  <span
                    key={i}
                    className={deg === 274 ? "text-[#F2A65A]" : ""}
                  >
                    {deg}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#F2A65A]" />
            </div>

            <div className="relative flex">
              <div
                className="hidden w-12 shrink-0 flex-col items-center justify-center gap-3 border-r border-white/10 py-4 font-mono text-[11px] text-white/40 sm:flex"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                }}
              >
                {AIRSPEED_TAPE.map((v) => (
                  <span
                    key={v}
                    className={v === 210 ? "text-[#F2A65A]" : ""}
                  >
                    {v}
                  </span>
                ))}
              </div>

              {/* Photo + horizon overlay — now hover-responsive */}
              <div
                ref={photoRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-[4/5] flex-1 cursor-crosshair"
              >
                <Image
                  src="/images/hero-pilot.png"
                  alt="Commercial pilot cadet standing in front of a modern jet aircraft"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent" />

                {/* Flight-path marker + horizon line, driven by cursor Y */}
                <motion.div
                  className="pointer-events-none absolute left-0 right-0 border-t border-[#F2A65A]/70"
                  style={{ top: horizonTop }}
                >
                  <span className="absolute left-1/2 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <motion.span
                      style={{ rotate: planeRotate }}
                      className="flex"
                    >
                      <Plane
                        className="size-4 text-[#F2A65A]"
                        aria-hidden="true"
                      />
                    </motion.span>
                  </span>
                </motion.div>

                <div className="absolute left-3 top-3 rounded bg-black/40 px-2 py-1 font-mono text-[10px] tracking-wide text-white/80 backdrop-blur-sm">
                  IAS 210 KT
                </div>
                <div className="absolute right-3 top-3 rounded bg-black/40 px-2 py-1 font-mono text-[10px] tracking-wide text-white/80 backdrop-blur-sm">
                  ALT 12,400 FT
                </div>
              </div>

              <div
                className="hidden w-12 shrink-0 flex-col items-center justify-center gap-3 border-l border-white/10 py-4 font-mono text-[11px] text-white/40 sm:flex"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                }}
              >
                {ALTITUDE_TAPE.map((v) => (
                  <span
                    key={v}
                    className={v === 12400 ? "text-[#F2A65A]" : ""}
                  >
                    {v.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes tape {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-tape {
          animation: tape 18s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-tape {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}