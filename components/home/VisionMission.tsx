"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";
import { motion } from "motion/react";
import Reveal from "../Reveal";

const CARDS = [
  {
    icon: Eye,
    code: "VSN",
    kicker: "DESTINATION",
    title: "Our Vision",
    text: "To be the world's most trusted aviation academy — recognized for producing skilled, safety-focused professionals who elevate the standards of global aviation.",
  },
  {
    icon: Target,
    code: "MSN",
    kicker: "FLIGHT PLAN",
    title: "Our Mission",
    text: "To deliver exceptional, accessible aviation education through modern technology, expert mentorship, and an unwavering commitment to safety and career success.",
  },
];

export default function VisionMission() {
  return (
    <section className="relative overflow-hidden bg-brand-light py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal
                key={card.title}
                delay={i * 0.1}
                direction={i === 0 ? "right" : "left"}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className={`group relative h-full ${i === 0 ? "md:mr-7" : "md:ml-7"}`}
                >
                  <Card
                    className="relative h-full border border-brand-border bg-white p-8 transition-colors group-hover:border-brand-navy/25 lg:p-10"
                    style={{
                      clipPath:
                        "polygon(28px 0, 100% 0, 100% 100%, 0 100%, 0 28px)",
                    }}
                  >
                    <span
                      className="absolute left-0 top-0 h-full w-[3px] bg-[#F2A65A]"
                      aria-hidden="true"
                    />

                    <CardContent className="p-0">
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2">
                          <Icon
                            className="size-5 text-brand-accent"
                            aria-hidden="true"
                          />
                        </span>
                        <Badge
                          variant="outline"
                          className="border-0 p-0 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#c98a3e] hover:bg-transparent"
                        >
                          {card.code} · {card.kicker}
                        </Badge>
                      </div>

                      <h3 className="mt-6 font-heading text-2xl font-bold text-brand-ink">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-pretty text-base leading-relaxed text-brand-body">
                        {card.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
