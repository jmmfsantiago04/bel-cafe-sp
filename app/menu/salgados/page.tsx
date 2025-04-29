import { db } from "@/lib/db"
import { menuItems } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export default async function SalgadosPage() {
    const salgados = await db
        .select()
        .from(menuItems)
        .where(
            and(
                eq(menuItems.isSalgado, true),
                eq(menuItems.isAvailable, true)
            )
        )

    return (
        <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#8B4513] mb-4 font-serif">
                    Salgados
                </h1>
                <p className="text-[#D2691E] text-lg">
                    Descubra nossos deliciosos salgados
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                    <span className="text-[#D2691E] font-serif">🥨</span>
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salgados.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-md border border-[#DEB887] overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {item.imageUrl && (
                            <div className="relative h-48 w-full">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-[#8B4513]">{item.name}</h3>
                                {item.isPopular && (
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                        Popular
                                    </span>
                                )}
                            </div>
                            {item.description && (
                                <p className="text-[#D2691E] mb-4">{item.description}</p>
                            )}
                            <div className="space-y-2">
                                {item.hasSize ? (
                                    <div className="space-y-1">
                                        {item.mediumSizePrice && (
                                            <p className="text-[#8B4513]">
                                                Médio: R$ {Number(item.mediumSizePrice).toFixed(2)}
                                            </p>
                                        )}
                                        {item.largeSizePrice && (
                                            <p className="text-[#8B4513]">
                                                Grande: R$ {Number(item.largeSizePrice).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-[#8B4513]">
                                        R$ {Number(item.price).toFixed(2)}
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.isGlutenFree && (
                                    <span className="bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded-full">
                                        🌾 Sem Glúten
                                    </span>
                                )}
                                {item.isVegetarian && (
                                    <span className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full">
                                        🥬 Vegetariano
                                    </span>
                                )}
                                {item.isVegan && (
                                    <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-1 rounded-full">
                                        🌱 Vegano
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {salgados.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-[#8B4513] text-lg">
                        Nenhum salgado disponível no momento.
                    </p>
                </div>
            )}

            {/* Decorative Footer */}
            <div className="flex items-center justify-center mt-12 space-x-4">
                <div className="h-[2px] w-24 bg-[#DEB887]" />
                <span className="text-[#D2691E] font-serif">🥐</span>
                <div className="h-[2px] w-24 bg-[#DEB887]" />
            </div>
        </div>
    )
} 