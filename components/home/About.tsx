"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building,
  Globe,
  GraduationCap,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Reveal from "../Reveal";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Experienced Instructors",
    text: "Learn from captains and engineers with decades of commercial flight experience.",
  },
  {
    icon: Building,
    title: "Modern Training Facilities",
    text: "Full-motion simulators, maintenance hangars, and smart classrooms.",
  },
  {
    icon: Globe,
    title: "International Curriculum",
    text: "ICAO and EASA-aligned programs recognized by airlines worldwide.",
  },
  {
    icon: Briefcase,
    title: "Career Support",
    text: "Dedicated placement team connecting graduates with airline partners.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 border-brand-accent text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent hover:bg-transparent">
              <span
                className="h-px w-6 bg-brand-accent"
                aria-hidden="true"
              />
              About Meridian
            </div>
            <h2 className="mt-4 text-pretty font-heading text-3xl font-bold leading-tight tracking-tight text-brand-ink sm:text-4xl">
              A legacy of training the world&apos;s most capable
              aviators
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-body">
              For over fifteen years, Meridian Aviation Academy has
              shaped pilots, engineers, and aviation professionals who
              now serve on flight decks and in operations across six
              continents. We combine rigorous standards with genuine
              mentorship.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 !border-none">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={i * 0.08}>
                  <div className="!border-none bg-transparent shadow-none">
                    <CardContent className="flex gap-4 p-0 !border-none">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-navy">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-bold text-brand-ink">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-brand-body">
                          {feature.text}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Right - video thumbnail */}
        <Reveal direction="left">
          <div className="group relative overflow-hidden rounded-[2rem] shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/about-simulator.png"
                alt="Pilots training inside a modern full-motion flight simulator"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-navy/25" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-0 flex h-auto w-auto items-center justify-center rounded-none hover:bg-transparent"
              aria-label="Play academy overview video"
            >
              <motion.span
                className="flex size-20 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-xl"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play
                  className="ml-1 size-8 fill-brand-navy"
                  aria-hidden="true"
                />
              </motion.span>
            </Button>
            <Card className="absolute bottom-6 left-6 border-0 bg-white/95 px-4 py-3 backdrop-blur">
              <CardContent className="p-0">
                <p className="font-heading text-sm font-bold text-brand-ink">
                  Inside the Academy
                </p>
                <p className="text-xs text-brand-body">
                  A 3-minute walkthrough
                </p>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
