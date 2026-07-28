"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SectionTitle from "../SectionTitle";

const TESTIMONIALS = [
  {
    photo: "/images/student-1.png",
    name: "Daniel Okafor",
    course: "Commercial Pilot License",
    rating: 5,
    review:
      "Meridian turned my childhood dream into a career. The instructors pushed me to be precise and confident, and I walked into my airline interview fully prepared. I fly the A320 today because of this academy.",
  },
  {
    photo: "/images/student-2.png",
    name: "Sofia Laurent",
    course: "Cabin Crew & Hospitality",
    rating: 5,
    review:
      "The training was rigorous, warm, and incredibly practical. From safety drills to service excellence, every detail mattered. I was hired by an international carrier within a month of graduating.",
  },
  {
    photo: "/images/student-3.png",
    name: "Amara Nwosu",
    course: "Aircraft Maintenance Engineering",
    rating: 5,
    review:
      "The hangars and avionics labs are the real deal. I learned on the same systems I now maintain professionally. The career support team genuinely cared about placing me in the right role.",
  },
];

type Role = "center" | "left" | "right" | "hidden";

const ROLE_STYLE: Record<
  Role,
  {
    xPct: number;
    rotate: number;
    scale: number;
    opacity: number;
    z: number;
  }
> = {
  center: { xPct: 0, rotate: 0, scale: 1, opacity: 1, z: 30 },
  right: { xPct: 62, rotate: 9, scale: 0.85, opacity: 0.45, z: 20 },
  left: { xPct: -62, rotate: -9, scale: 0.85, opacity: 0.45, z: 20 },
  hidden: { xPct: 0, rotate: 0, scale: 0.8, opacity: 0, z: 0 },
};

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;

  const go = (dir: number) => {
    setIndex((prev) => (prev + dir + total) % total);
  };

  const roleFor = (i: number): Role => {
    const offset = (i - index + total) % total;
    if (offset === 0) return "center";
    if (offset === 1) return "right";
    if (offset === total - 1) return "left";
    return "hidden";
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Testimonials"
          title="Stories from our graduates"
          description="Hear from the pilots, crew, and engineers who started exactly where you are now."
        />

        <div className="relative mx-auto mt-25 max-w-4xl">
          <div className="relative h-[480px] sm:h-[420px]">
            {TESTIMONIALS.map((t, i) => {
              const role = roleFor(i);
              const { xPct, rotate, scale, opacity, z } =
                ROLE_STYLE[role];
              const isCenter = role === "center";
              const clickable = role === "left" || role === "right";

              return (
                <motion.div
                  key={t.name}
                  className={`absolute left-1/2 top-1/2 w-[80%] ${clickable ? "cursor-pointer" : ""}`}
                  style={{
                    zIndex: z,
                    pointerEvents:
                      role === "hidden" ? "none" : "auto",
                  }}
                  animate={{
                    x: `calc(-50% + ${xPct}%)`,
                    y: "-50%",
                    rotate,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 26,
                  }}
                  onClick={() => clickable && setIndex(i)}
                  role={clickable ? "button" : undefined}
                  aria-label={
                    clickable
                      ? `View testimonial from ${t.name}`
                      : undefined
                  }
                >
                  <Card
                    className={`rounded-[2rem] border border-brand-border bg-brand-light p-8 shadow-sm transition-shadow sm:p-10 ${
                      isCenter ? "shadow-lg" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <Quote
                        className="size-9 text-brand-accent/40"
                        aria-hidden="true"
                      />

                      <div
                        className="mt-4 flex"
                        aria-label={`${t.rating} out of 5 stars`}
                      >
                        {Array.from({ length: t.rating }).map(
                          (_, s) => (
                            <Star
                              key={s}
                              className="size-4 fill-brand-accent text-brand-accent"
                              aria-hidden="true"
                            />
                          ),
                        )}
                      </div>

                      <blockquote
                        className={`mt-5 text-pretty font-medium leading-relaxed text-brand-ink ${
                          isCenter
                            ? "text-xl sm:text-2xl"
                            : "text-lg line-clamp-4"
                        }`}
                      >
                        &ldquo;{t.review}&rdquo;
                      </blockquote>

                      <div className="mt-8 flex items-center gap-4">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
                          <Image
                            src={t.photo}
                            alt={t.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-heading text-base font-bold text-brand-ink">
                            {t.name}
                          </p>
                          <p className="text-sm text-brand-body">
                            {t.course}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-25 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="rounded-full border border-brand-border bg-white text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index
                      ? "w-7 bg-brand-accent"
                      : "w-2 bg-brand-border hover:bg-brand-body"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="rounded-full border border-brand-border bg-white text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
