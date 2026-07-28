import {
  Building2,
  Compass,
  Globe2,
  Plane,
  Radar,
  Wind,
} from "lucide-react";

const PARTNERS = [
  { name: "SkyBridge Airways", icon: Plane },
  { name: "GlobalWings", icon: Globe2 },
  { name: "Aeronave", icon: Radar },
  { name: "Meridian Airports", icon: Building2 },
  { name: "NorthStar Aviation", icon: Compass },
  { name: "Zephyr Air", icon: Wind },
];

export default function Partners() {
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <section className="border-y border-brand-border bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-brand-body">
          Trusted by leading airlines & aviation authorities
        </p>
        <div className="marquee-mask mt-8 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-14">
            {items.map((partner, i) => {
              const Icon = partner.icon;
              return (
                <div
                  key={`${partner.name}-${i}`}
                  className="group flex shrink-0 items-center gap-2.5 text-brand-body grayscale transition-all duration-300 hover:text-brand-navy hover:grayscale-0"
                >
                  <Icon
                    className="size-7 transition-colors group-hover:text-brand-accent"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap font-heading text-lg font-bold tracking-tight">
                    {partner.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}