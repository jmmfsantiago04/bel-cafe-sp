import { Menu } from "@/components/menu/menu";
import { db } from "@/lib/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function MenuPage() {
    const items = await db.query.menuItems.findMany({
        where: eq(menuItems.isAvailable, true),
    });

    // Group items by category
    const groupedItems = {
        salgados: items.filter(item => item.isSalgado),
        doces: items.filter(item => item.isDoce),
        cafeDaManha: items.filter(item => item.isCafeDaManha),
    };

    return (
        <div className="container mx-auto py-8">
            {/* Welcome Message */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#8B4513] mb-4 font-serif">
                    Bem-vindo ao Bel Café
                </h1>
                <p className="text-[#D2691E] text-lg">
                    Explore nosso cardápio e descubra nossas deliciosas opções
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                    <span className="text-[#D2691E] font-serif">☕</span>
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                </div>
            </div>

            {/* Menu Component */}
            <Menu initialItems={groupedItems} />

            {/* Decorative Footer */}
            <div className="flex items-center justify-center mt-12 space-x-4">
                <div className="h-[2px] w-24 bg-[#DEB887]" />
                <span className="text-[#D2691E] font-serif">♦</span>
                <div className="h-[2px] w-24 bg-[#DEB887]" />
            </div>
        </div>
    );
} 