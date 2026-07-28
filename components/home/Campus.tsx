"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, MapPin, Plane } from "lucide-react";
import Image from "next/image";
import Reveal from "../Reveal";

const IMAGES = [
  {
    src: "/images/campus-simlab.png",
    alt: "Row of modern flight simulator pods",
    code: "BAY 01",
    caption: "Simulator Hall",
  },
  {
    src: "/images/campus-hangar.png",
    alt: "Bright training hangar with aircraft",
    code: "BAY 02",
    caption: "Training Hangar",
  },
  {
    src: "/images/campus-classroom.png",
    alt: "Modern aviation lecture theatre",
    code: "BAY 03",
    caption: "Lecture Theatre",
  },
  {
    src: "/images/campus-building.png",
    alt: "Aviation academy campus building",
    code: "BAY 04",
    caption: "Main Campus",
  },
];

export default function Campus() {
  return (
    <section id="campus" className="bg-brand-light py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <Reveal>
          <div
            className="inline-flex items-center gap-2 border-brand-accent text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent hover:bg-brand-accent/10"
          >
            <div
              className="h-px w-6 bg-brand-accent"
            />
            Our Campus
          </div>
          <h2 className="mt-4 text-pretty font-heading text-3xl font-bold leading-tight tracking-tight text-brand-ink sm:text-4xl">
            A campus built for immersive aviation learning
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-body">
            Set beside an active international airport, our 40-acre
            campus brings together full-motion simulators, working
            hangars, and smart classrooms — so you train in the
            environment you will one day work in.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Direct runway access for live flight training",
              "On-site maintenance hangars and avionics labs",
              "Student lounges, library, and residence halls",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-brand-body"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">
                  <MapPin className="size-3.5" aria-hidden="true" />
                </span>
                {item}
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="mt-8 rounded-full bg-brand-navy px-8 font-semibold text-white hover:bg-brand-navy/90"
          >
            Book a Campus Tour
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </Reveal>

        {/* Right - hub grid on desktop, carousel on mobile */}
        <Reveal direction="left">
          <div className="relative hidden grid-cols-2 gap-6 sm:grid">
            {IMAGES.map((img) => (
              <div
                key={img.src}
                className="group relative overflow-hidden rounded-2xl shadow-sm"
              >
                <AspectRatio ratio={4 / 5}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-brand-navy/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <Badge className="absolute left-3 top-3 rounded-full bg-brand-navy/80 px-2.5 py-1 font-mono text-[10px] font-normal tracking-[0.15em] text-white/90 backdrop-blur-sm hover:bg-brand-navy/80">
                  {img.code}
                </Badge>

                <p className="absolute inset-x-3 bottom-3 translate-y-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {img.caption}
                </p>
              </div>
            ))}

            {/* Junction hub — where the four gutters meet */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <Separator
                orientation="vertical"
                className="absolute left-1/2 top-1/2 h-[34px] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-dashed border-brand-navy/30 bg-transparent"
              />
              <Separator
                orientation="vertical"
                className="absolute left-1/2 top-1/2 h-[34px] w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 border-l border-dashed border-brand-navy/30 bg-transparent"
              />
              <span className="relative flex size-9 items-center justify-center rounded-full border-4 border-brand-light bg-brand-navy text-[#F2A65A] shadow-sm">
                <Plane className="size-3.5" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Mobile carousel using Card */}
          <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:hidden">
            {IMAGES.map((img) => (
              <Card
                key={img.src}
                className="w-[75%] shrink-0 snap-center overflow-hidden rounded-2xl border-0 shadow-sm"
              >
                <CardContent className="relative aspect-[4/5] p-0">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="75vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
                  <Badge className="absolute left-3 top-3 rounded-full bg-brand-navy/80 px-2.5 py-1 font-mono text-[10px] font-normal tracking-[0.15em] text-white/90 hover:bg-brand-navy/80">
                    {img.code}
                  </Badge>
                  <p className="absolute inset-x-3 bottom-3 text-sm font-semibold text-white">
                    {img.caption}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
