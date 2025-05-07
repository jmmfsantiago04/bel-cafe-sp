import { db } from "@/lib/db"
import { menuItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { MenuCard } from "@/components/menu/menu-card"

export default async function MenuPage() {
    const [almoco, jantar, sobremesas] = await Promise.all([
        db.query.menuItems.findMany({
            where: eq(menuItems.isAlmoco, true),
        }),
        db.query.menuItems.findMany({
            where: eq(menuItems.isJantar, true),
        }),
        db.query.menuItems.findMany({
            where: eq(menuItems.isSobremesa, true),
        }),
    ])

    return (
        <div className="min-h-screen bg-[#8B2500] py-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#F5E6D3] font-serif mb-2">É de Chão</h1>
                    <p className="text-[#FFB800] italic">Comida de Afeto</p>
                </div>

                {/* Almoço Section */}
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <h2 className="text-2xl font-semibold text-[#F5E6D3]">Almoço</h2>
                        <div className="flex-1 h-px bg-[#F5E6D3]/20 ml-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {almoco.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                {/* Jantar Section */}
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <h2 className="text-2xl font-semibold text-[#F5E6D3]">Jantar</h2>
                        <div className="flex-1 h-px bg-[#F5E6D3]/20 ml-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {jantar.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>

                {/* Sobremesas Section */}
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <h2 className="text-2xl font-semibold text-[#F5E6D3]">Sobremesas</h2>
                        <div className="flex-1 h-px bg-[#F5E6D3]/20 ml-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sobremesas.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
} 