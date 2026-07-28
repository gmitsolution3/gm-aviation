"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileText, Plane, Users } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

type Step = {
  icon: React.ElementType;
  step: string;
  title: string;
  text: string;
};

const STEPS: Step[] = [
  {
    icon: FileText,
    step: "Step 1",
    title: "Apply Online",
    text: "Submit your application and academic records through our secure portal.",
  },
  {
    icon: Users,
    step: "Step 2",
    title: "Interview & Assessment",
    text: "Meet our admissions team and complete an aptitude and medical screening.",
  },
  {
    icon: CreditCard,
    step: "Step 3",
    title: "Enrollment & Payment",
    text: "Confirm your seat, choose a payment plan, and receive your joining kit.",
  },
  {
    icon: Plane,
    step: "Step 4",
    title: "Start Training",
    text: "Begin ground school and take to the skies with your first training flight.",
  },
];

const AUTO_ADVANCE_MS = 4200;
const TICK_COUNT = 24;

// angle 0 = top, increases clockwise — matches how nodes are placed
const angleFor = (index: number, total: number) =>
  (360 / total) * index - 90;

function pointOnCircle(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  };
}

export default function Admission() {
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || isHovering) return undefined;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % STEPS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [active, isHovering, reduceMotion]);

  const activeStep = STEPS[active];
  const ActiveIcon = activeStep.icon;
  const circumference = 2 * Math.PI * 48;

  return (
    <section id="admission" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <SectionTitle
          eyebrow="Admission"
          title="Your journey to the flight deck"
          description="A clear, supported four-step path from application to your first day of training."
        />

        <Reveal>
          <div
            className="relative mx-auto mt-16 hidden aspect-square w-full max-w-[520px] md:block"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* outer ring */}
            <div className="absolute inset-0 rounded-full border border-brand-border" />

            {/* compass ticks, drawn in the same 0-100 space so they scale correctly */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {Array.from({ length: TICK_COUNT }).map((_, i) => {
                const angle = angleFor(i, TICK_COUNT);
                const isMajor = i % (TICK_COUNT / STEPS.length) === 0;
                const outer = pointOnCircle(angle, 49);
                const inner = pointOnCircle(
                  angle,
                  isMajor ? 44 : 46.5,
                );
                return (
                  <line
                    key={i}
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="currentColor"
                    strokeWidth={isMajor ? 0.6 : 0.3}
                    className={
                      isMajor
                        ? "text-brand-border"
                        : "text-brand-border/50"
                    }
                  />
                );
              })}
            </svg>

            {/* progress arc toward next auto-advance */}
            <AnimatePresence>
              {!reduceMotion && !isHovering && (
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >
                  <motion.circle
                    key={active}
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    className="text-[#F2A65A]"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: AUTO_ADVANCE_MS / 1000,
                      ease: "linear",
                    }}
                  />
                </svg>
              )}
            </AnimatePresence>

            {/* center content - using Card component */}
            <Card className="absolute inset-[16%] flex flex-col items-center justify-center rounded-full border-0 bg-brand-light px-6 text-center shadow-none">
              <CardContent className="flex flex-col items-center p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex flex-col items-center"
                  >
                    <Badge className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-navy p-0 text-[#F2A65A] hover:bg-brand-navy">
                      <ActiveIcon
                        className="size-6"
                        aria-hidden="true"
                      />
                    </Badge>
                    <span className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#c98a3e]">
                      {activeStep.step}
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-bold text-brand-ink">
                      {activeStep.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-body">
                      {activeStep.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* step nodes */}
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === active;
              const pos = pointOnCircle(
                angleFor(i, STEPS.length),
                50,
              );
              return (
                <Button
                  key={step.step}
                  variant="ghost"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`View ${step.title}`}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.span
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={`flex size-14 items-center justify-center rounded-full border-2 shadow-sm transition-colors ${
                      isActive
                        ? "border-brand-navy bg-brand-navy text-[#F2A65A]"
                        : "border-brand-border bg-white text-brand-body/50 hover:border-brand-navy/40 hover:text-brand-navy"
                    }`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </motion.span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isActive
                        ? "text-[#c98a3e]"
                        : "text-brand-body/50"
                    }`}
                  >
                    {step.step}
                  </span>
                </Button>
              );
            })}
          </div>
        </Reveal>

        {/* stacked fallback — mobile using Card components */}
        <div className="mt-16 space-y-6 md:hidden">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.step}
                className="relative border-brand-border/20"
              >
                <CardContent className="flex gap-5 p-6">
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute left-[3.25rem] top-[4.5rem] h-[calc(100%-5rem)] w-px bg-brand-border"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[#F2A65A] shadow-sm">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 pt-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#c98a3e]">
                      {step.step}
                    </span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-brand-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-body">
                      {step.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
