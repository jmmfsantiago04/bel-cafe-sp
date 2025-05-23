import { Metadata } from "next"
import { PageHeader } from "./components/PageHeader"
import { CommonQuestions } from "./components/CommonQuestions"
import { ServicesQuestions } from "./components/ServicesQuestions"
import { ContactCard } from "./components/ContactCard"

export const metadata: Metadata = {
    title: "Dúvidas Frequentes | É de Chão",
    description: "Encontre respostas para as perguntas mais frequentes sobre o É de Chão Café.",
}

export default function DuvidasPage() {
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
                    {/* Left Column - Common Questions */}
                    <div className="space-y-6">
                        <CommonQuestions />
                    </div>

                    {/* Right Column - Additional Questions */}
                    <div className="space-y-6">
                        <ServicesQuestions />
                        <ContactCard />
                    </div>
                </div>
            </div>
        </div>
    )
} 