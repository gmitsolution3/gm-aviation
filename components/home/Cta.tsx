"use client";

import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function Cta() {
  return (
    <section className="bg-brand-surface px-4 pb-20 md:px-8 md:pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-ink px-6 py-14 md:px-16 md:py-20">
          {/* decorative flight path */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, var(--brand-accent) 0, transparent 40%), radial-gradient(circle at 85% 80%, var(--brand-sky) 0, transparent 45%)",
            }}
          />
          <div className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 md:block">
            <svg
              width="260"
              height="260"
              viewBox="0 0 260 260"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 240C60 140 140 60 240 20"
                stroke="var(--brand-accent)"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity="0.5"
              />
            </svg>
          </div>

          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-balance font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
                Your flight deck is waiting. Start your aviation
                career today.
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-white/70">
                Applications for the next intake are open. Speak with
                an advisor to find the program that matches your
                ambition.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                size="lg"
                className="bg-brand-accent font-semibold text-brand-ink hover:bg-brand-accent/90 rounded-4xl"
              >
                Apply Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 font-semibold text-white bg-white/10 rounded-4xl"
              >
                <PhoneCall className="mr-2 size-4" />
                Talk to an Advisor
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
