import { db } from "@/lib/db";
import { menuItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { MenuCard } from "@/components/menu/menu-card";

export default async function Sobremesas() {
    const items = await db.query.menuItems.findMany({
        where: and(
            eq(menuItems.isSobremesa, true),
            eq(menuItems.isAvailable, true)
        ),
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#F5E6D3] to-[#F4861F]/10">
            {/* Hero Banner */}
            <section className="relative h-[50vh] min-h-[400px] bg-[url('/restaurant-banner.jpg')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-b from-[#C84C28]/95 to-[#F4861F]" />

                <header className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                    <div className="bg-[#F5E6D3]/10 p-12 rounded-3xl backdrop-blur-md border-2 border-[#FFB800] max-w-3xl mx-auto shadow-2xl">
                        <h1 className="text-7xl font-bold text-white font-serif mb-6 drop-shadow-lg">Sobremesas</h1>
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent" />
                            <span className="text-[#FFB800] text-4xl filter drop-shadow-lg">🍰</span>
                            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent" />
                        </div>
                        <p className="text-white italic text-2xl font-medium tracking-wide drop-shadow-lg">Disponível o dia todo</p>
                    </div>
                </header>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0 right-0 w-full h-[12vw] min-h-[100px] fill-[#F5E6D3]"
                    preserveAspectRatio="none"
                    style={{ filter: 'drop-shadow(0 -1px 2px rgba(0,0,0,0.1))' }}
                >
                    <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                </svg>
            </section>

            <section className="container mx-auto px-4 py-16">
                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                        <MenuCard key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </main>
    );
} 