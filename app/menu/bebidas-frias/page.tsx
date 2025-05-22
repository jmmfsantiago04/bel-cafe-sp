import { db } from "@/lib/db";
import { drinks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { DrinkCard } from "@/app/menu/components/drink-card";

export default async function BebidasFrias() {
    const items = await db.query.drinks.findMany({
        where: and(
            eq(drinks.isHotDrink, false),
            eq(drinks.isAvailable, true)
        ),
    });

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#F5E6D3] to-[#F4861F]/10">
            {/* Hero Banner */}
            <section
                className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] bg-[url('/bebidas-frias-banner.jpg')] bg-cover bg-center"
                aria-labelledby="page-title"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#C84C28]/95 to-[#F4861F]"
                    aria-hidden="true"
                />

                <header className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                    <div className="bg-[#F5E6D3]/10 p-8 sm:p-10 md:p-12 rounded-3xl backdrop-blur-md border-2 border-[#FFB800] max-w-2xl sm:max-w-3xl mx-auto shadow-2xl">
                        <h1
                            id="page-title"
                            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white font-serif mb-4 sm:mb-5 md:mb-6 drop-shadow-lg"
                        >
                            Bebidas Geladas
                        </h1>
                        <div
                            className="flex items-center justify-center gap-3 sm:gap-4 mb-3"
                            aria-hidden="true"
                        >
                            <div className="h-0.5 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent" />
                            <span className="text-[#FFB800] text-3xl sm:text-3xl md:text-4xl filter drop-shadow-lg">🧊</span>
                            <div className="h-0.5 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent" />
                        </div>
                        <p className="text-white italic text-xl sm:text-2xl font-medium tracking-wide drop-shadow-lg">
                            Refrescantes & Deliciosas
                        </p>
                    </div>
                </header>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0 right-0 w-full h-[10vw] sm:h-[12vw] min-h-[80px] sm:min-h-[100px] fill-[#F5E6D3]"
                    preserveAspectRatio="none"
                    style={{ filter: 'drop-shadow(0 -1px 2px rgba(0,0,0,0.1))' }}
                    aria-hidden="true"
                >
                    <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                </svg>
            </section>

            <section
                className="container mx-auto px-4 py-12 sm:py-14 md:py-16"
                aria-label="Lista de bebidas geladas"
            >
                {items.length > 0 ? (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                        role="list"
                    >
                        {items.map((item) => (
                            <DrinkCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[#2B4C5C] text-base sm:text-lg font-medium">
                            Nenhuma bebida gelada disponível no momento.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
} 