import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  {
    title: "Programs",
    links: [
      "Commercial Pilot",
      "Private Pilot",
      "Cabin Crew",
      "Aircraft Engineering",
      "Air Traffic Control",
    ],
  },
  {
    title: "Academy",
    links: [
      "About Us",
      "Our Campus",
      "Faculty",
      "Admissions",
      "Scholarships",
    ],
  },
  {
    title: "Resources",
    links: [
      "Student Portal",
      "Career Services",
      "News & Events",
      "FAQ",
      "Contact",
    ],
  },
];

const socials = [
  { label: "Facebook" },
  { label: "Instagram" },
  { label: "LinkedIn" },
  { label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/">
              <Image
                src={"/images/logo-white.png"}
                height={300}
                width={300}
                className="w-36"
                alt="Site Logo"
              />
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed">
              Training the next generation of aviation professionals
              with world-class instructors, modern aircraft, and a
              relentless commitment to safety.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-brand-accent"
                  aria-hidden="true"
                />
                <span>
                  Terminal Drive, Skyline International Airport, CA
                  90045
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="size-4 shrink-0 text-brand-accent"
                  aria-hidden="true"
                />
                <span>+1 (800) 555-0192</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="size-4 shrink-0 text-brand-accent"
                  aria-hidden="true"
                />
                <span>admissions@meridianaviation.edu</span>
              </li>
            </ul>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="transition-colors hover:text-brand-accent"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm">{`© ${new Date().getFullYear()} Meridian Aviation Academy. All rights reserved.`}</p>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <Link
                key={s.label}
                href="#"
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium transition-colors hover:border-brand-accent hover:text-brand-accent"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}