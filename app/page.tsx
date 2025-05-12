import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { SpecialtiesSection } from "@/components/home/SpecialtiesSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#8B4513]">
      <HeroSection />
      <AboutSection />
      <SpecialtiesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
