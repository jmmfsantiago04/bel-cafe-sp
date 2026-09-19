import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { SpecialtiesSection } from "@/components/home/SpecialtiesSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <SpecialtiesSection />
      <ContactSection />
    </div>
  );
}