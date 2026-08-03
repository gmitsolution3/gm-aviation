"use client";

import { RevealItem, RevealStagger } from "@/components/Reveal";
import { animate, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Stat = {
  end: number;
  suffix: string;
  label: string;
  code: string;
  dialFill: number; // 0–1, visual pointer position on the gauge sweep — not a literal data scale
};

const STATS: Stat[] = [
  {
    end: 1000,
    suffix: "+",
    label: "Graduates Worldwide",
    code: "GRD",
    dialFill: 0.86,
  },
  {
    end: 25,
    suffix: "+",
    label: "Professional Courses",
    code: "CRS",
    dialFill: 0.52,
  },
  {
    end: 98,
    suffix: "%",
    label: "Placement Rate",
    code: "PLC",
    dialFill: 0.98,
  },
  {
    end: 15,
    suffix: "+",
    label: "Years of Excellence",
    code: "YRS",
    dialFill: 0.65,
  },
];

const SWEEP_START = -220; // degrees
const SWEEP_END = 40; // degrees
const SWEEP_TOTAL = SWEEP_END - SWEEP_START; // 260° sweep, like an airspeed dial

function round(n: number, precision = 3) {
  return Math.round(n * 10 ** precision) / 10 ** precision;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: round(cx + r * Math.cos(rad)),
    y: round(cy + r * Math.sin(rad)),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function GaugeStat({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const [needleDeg, setNeedleDeg] = useState(SWEEP_START);

  const targetDeg = SWEEP_START + SWEEP_TOTAL * stat.dialFill;

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(stat.end);
      setNeedleDeg(targetDeg);
      return;
    }
    const controls = animate(0, 1, {
      duration: 1.6,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (p) => {
        setDisplay(Math.round(stat.end * p));
        setNeedleDeg(SWEEP_START + (targetDeg - SWEEP_START) * p);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, stat.end, targetDeg, index]);

  const trackPath = describeArc(50, 50, 44, SWEEP_START, SWEEP_END);
  const fillPath = describeArc(50, 50, 44, SWEEP_START, needleDeg);
  const needleTip = polar(50, 50, 34, needleDeg);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative size-32 sm:size-36">
        <svg viewBox="0 0 100 100" className="size-full">
          {Array.from({ length: 14 }).map((_, i) => {
            const deg = SWEEP_START + (SWEEP_TOTAL / 13) * i;
            const isMajor = i % 3 === 0;
            const outer = polar(50, 50, 47, deg);
            const inner = polar(50, 50, isMajor ? 41.5 : 43.5, deg);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="white"
                strokeOpacity={isMajor ? 0.25 : 0.12}
                strokeWidth={isMajor ? 1.2 : 0.7}
              />
            );
          })}

          <path
            d={trackPath}
            fill="none"
            stroke="white"
            strokeOpacity={0.1}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={fillPath}
            fill="none"
            stroke="#F2A65A"
            strokeWidth={3}
            strokeLinecap="round"
          />

          <line
            x1="50"
            y1="50"
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#F2A65A"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="2.6" fill="#F2A65A" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-white sm:text-3xl">
            {display.toLocaleString()}
            {stat.suffix}
          </span>
          <span className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-[#F2A65A]/80">
            {stat.code}
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-sm font-medium uppercase tracking-wide text-white/70 sm:text-base">
        {stat.label}
      </p>
    </div>
  );
}

export default function Statistics() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <Image
          src="/images/stats-plane.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/70 to-brand-navy" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6">
        <RevealStagger className="grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
          {STATS.map((stat, i) => (
            <RevealItem
              key={stat.label}
              className="flex justify-center px-2 sm:px-4"
            >
              <GaugeStat stat={stat} index={i} />
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
