import { PageHeader } from "./components/PageHeader"
import { WhatsAppCard } from "./components/WhatsAppCard"
import { BusinessHoursCard } from "./components/BusinessHoursCard"
import { ReservationRulesCard } from "./components/ReservationRulesCard"
import { ContactCard } from "./components/ContactCard"
import { DecorativeFooter } from "./components/DecorativeFooter"

export default function
    BookingPage() {
    return (
        <div className="min-h-screen bg-[#FDF5E6] py-12 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#DEB887] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DEB887] rounded-full opacity-5 translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#8B4513] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 relative">
                <PageHeader />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Contact and Hours */}
                    <div className="space-y-6">
                        <WhatsAppCard />
                        <BusinessHoursCard />
                    </div>

                    {/* Right Column - Rules and Location */}
                    <div className="space-y-6">
                        <ReservationRulesCard />
                        <ContactCard />
                    </div>
                </div>

                <DecorativeFooter />
            </div>
        </div>
    )
} 