import About from "@/components/home/About";
import Admission from "@/components/home/Admission";
import Campus from "@/components/home/Campus";
import Courses from "@/components/home/Courses/Courses";
import Cta from "@/components/home/Cta";
import Faq from "@/components/home/Faq";
import Hero from "@/components/home/Hero";
import Partners from "@/components/home/Partners";
import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";
import VisionMission from "@/components/home/VisionMission";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Hero />
      <Partners />
      <About />
      <VisionMission />
      <Courses />
      <Campus />
      <Statistics />
      <Testimonials />
      <Admission />
      <Faq />
      <Cta />
    </main>
  );
}
