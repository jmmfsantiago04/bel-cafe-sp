import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { SpecialtiesSection } from "@/components/home/SpecialtiesSection";
import { ContactSection } from "@/components/home/ContactSection";
import { StoreStatus } from "@/components/StoreStatus";

export default function Home() {
  return (
    <main>
      <div className="fixed top-4 right-4 z-50">
        <StoreStatus />
      </div>
      <HeroSection />
      <AboutSection />
      <SpecialtiesSection />
      <ContactSection />
    </main>
  );
}
