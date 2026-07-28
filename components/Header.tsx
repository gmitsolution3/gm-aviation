"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plane,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Campus", href: "#campus" },
  { label: "Admission", href: "#admission" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname()

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement bar */}
      <div className="hidden bg-brand-navy text-white lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2.5 text-sm">
          <div className="flex items-center gap-6 text-white/80">
            <a
              href="tel:+18005550110"
              className="flex items-center gap-2 transition-colors hover:text-brand-accent"
            >
              <Phone className="size-4" aria-hidden="true" />
              +1 (800) 555-0110
            </a>
            <a
              href="mailto:admissions@meridianaviation.edu"
              className="flex items-center gap-2 transition-colors hover:text-brand-accent"
            >
              <Mail className="size-4" aria-hidden="true" />
              admissions@meridianaviation.edu
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              Terminal Drive, Geneva International Airport
            </span>
          </div>
          <a
            href="#admission"
            className="flex items-center gap-1.5 font-semibold text-brand-accent transition-colors hover:text-white"
          >
            Apply Now
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Navbar */}
      <div
        className={`transition-all duration-300 ${
          !isHome || scrolled
            ? "bg-white/95 shadow-[0_8px_30px_rgb(17,24,39,0.06)] backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4"
          aria-label="Primary"
        >
          <Link href="/">
            <Image
              src={!isHome || scrolled ? "/images/logo-2.png" : "/images/logo-white.png"}
              height={300}
              width={300}
              className="w-36"
              alt="Site Logo"
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-brand-accent ${
                    !isHome || scrolled ? "text-brand-ink" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button
              className="hidden rounded-full bg-brand-accent px-6 font-semibold text-brand-navy hover:bg-brand-accent/90 lg:inline-flex"
              onClick={() => {
                document
                  .querySelector("#admission")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Apply Now
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={`inline-flex size-11 items-center justify-center rounded-xl transition-colors lg:hidden ${
                scrolled
                  ? "bg-brand-light text-brand-ink"
                  : "bg-white/15 text-white backdrop-blur"
              }`}
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-white p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                ease: [0.22, 1, 0.36, 1],
                duration: 0.35,
              }}
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-navy">
                    <Plane
                      className="size-5 text-brand-accent"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-heading text-lg font-extrabold text-brand-ink">
                    Meridian
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-light text-brand-ink"
                >
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-semibold text-brand-ink transition-colors hover:bg-brand-light hover:text-brand-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-4 border-t border-brand-border pt-6">
                <a
                  href="tel:+18005550110"
                  className="flex items-center gap-2 text-sm text-brand-body"
                >
                  <Phone
                    className="size-4 text-brand-accent"
                    aria-hidden="true"
                  />
                  +1 (800) 555-0110
                </a>
                <a
                  href="mailto:admissions@meridianaviation.edu"
                  className="flex items-center gap-2 text-sm text-brand-body"
                >
                  <Mail
                    className="size-4 text-brand-accent"
                    aria-hidden="true"
                  />
                  admissions@meridianaviation.edu
                </a>
                <Button
                  className="w-full rounded-full bg-brand-accent font-semibold text-brand-navy hover:bg-brand-accent/90"
                  onClick={() => {
                    setOpen(false);
                    document
                      .querySelector("#admission")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Apply Now
                </Button>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}