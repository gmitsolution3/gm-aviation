"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "../Reveal";
import SectionTitle from "../SectionTitle";

const faqs = [
  {
    id: "faq-1",
    q: "What are the eligibility requirements to join?",
    a: "Applicants must have completed higher secondary education (12th grade) with Physics and Mathematics for most flying programs. A minimum age of 17, a valid medical certificate, and English proficiency are also required. Our admissions team reviews each profile individually.",
  },
  {
    id: "faq-2",
    q: "Are your programs internationally recognized?",
    a: "Yes. Our training is aligned with DGCA, EASA, and ICAO standards, and our certifications are recognized by leading airlines and aviation authorities worldwide, giving graduates strong global mobility.",
  },
  {
    id: "faq-3",
    q: "Do you provide placement assistance after graduation?",
    a: "Absolutely. We maintain active partnerships with major airlines and MRO organizations. Our dedicated career services team supports graduates with interview preparation, resume building, and direct recruitment drives.",
  },
  {
    id: "faq-4",
    q: "What kind of aircraft and simulators will I train on?",
    a: "Students train on a modern fleet of single and multi-engine aircraft, alongside full-motion flight simulators and advanced procedural trainers that replicate real airline flight decks.",
  },
  {
    id: "faq-5",
    q: "Is financial aid or an installment plan available?",
    a: "We offer flexible payment plans, merit-based scholarships, and guidance on education loans through our partner banks. Speak with our counselors to find an option that fits your situation.",
  },
  {
    id: "faq-6",
    q: "How long does it take to complete a pilot program?",
    a: "A full Commercial Pilot License program typically takes 18 to 24 months depending on weather, individual progress, and examination schedules. Ground school and flight training run in structured, parallel phases.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-brand-surface py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Frequently Asked"
          title="Questions, answered"
          description="Everything you need to know before you begin your journey with us. Can't find your answer? Our team is one message away."
        />

        <Reveal className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-4"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="group overflow-hidden rounded-2xl border border-brand-line bg-brand-bg px-5 shadow-sm transition-colors data-[state=open]:border-brand-accent/40"
              >
                <AccordionTrigger className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-base font-semibold text-brand-ink outline-none hover:no-underline md:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pr-12 text-pretty text-sm leading-relaxed text-brand-body md:text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
