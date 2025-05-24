import { Metadata } from "next"
import { PageHeader } from "./components/PageHeader"
import { OurStory } from "./components/OurStory"
import { OurValues } from "./components/OurValues"
import { TeamSection } from "./components/TeamSection"
import { ContactSection } from "./components/ContactSection"

export const metadata: Metadata = {
    title: "Sobre Nós | É de Chão",
    description: "Conheça nossa história, valores e a equipe por trás do É de Chão Café.",
}

export default function SobreNosPage() {
    return (
        <div className="min-h-screen bg-[#FDF5E6] py-12 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#DEB887] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DEB887] rounded-full opacity-5 translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#8B4513] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 relative">
                <PageHeader />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <OurStory />
                        <OurValues />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <TeamSection />
                        <ContactSection />
                    </div>
                </div>
            </div>
        </div>
    )
} 