import { type InferModel } from "drizzle-orm"
import { menuItems } from "@/db/schema"

type MenuItem = InferModel<typeof menuItems>

interface MenuCardProps {
    item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
    return (
        <div className="bg-[#2D4F56] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#F5E6D3]/10">
            {item.imageUrl && (
                <div className="relative h-48">
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#F5E6D3] mb-3">
                    {item.name}
                </h3>
                {item.description && (
                    <p className="text-[#F5E6D3]/80 text-sm mb-4">
                        {item.description}
                    </p>
                )}
                <div className="flex justify-between items-center">
                    <span className="text-[#FFB800] font-bold text-lg">
                        R$ {Number(item.price).toFixed(2)}
                    </span>
                    {item.isPopular && (
                        <span className="bg-[#E67E22] text-[#F5E6D3] text-xs px-2 py-1 rounded-full">
                            Popular
                        </span>
                    )}
                </div>
                {/* Dietary badges */}
                {(item.isVegetarian || item.isVegan || item.isGlutenFree) && (
                    <div className="flex gap-2 mt-4">
                        {item.isVegetarian && (
                            <span className="bg-[#2D4F56] text-[#F5E6D3]/80 text-xs px-2 py-1 rounded-full border border-[#F5E6D3]/20">
                                Vegetariano
                            </span>
                        )}
                        {item.isVegan && (
                            <span className="bg-[#2D4F56] text-[#F5E6D3]/80 text-xs px-2 py-1 rounded-full border border-[#F5E6D3]/20">
                                Vegano
                            </span>
                        )}
                        {item.isGlutenFree && (
                            <span className="bg-[#2D4F56] text-[#F5E6D3]/80 text-xs px-2 py-1 rounded-full border border-[#F5E6D3]/20">
                                Sem Glúten
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
} 