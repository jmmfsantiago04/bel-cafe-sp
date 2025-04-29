import { getHotDrinks } from "@/app/actions/drinks";

export default async function HotDrinksPage() {
    const hotDrinks = await getHotDrinks();

    if ('error' in hotDrinks) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-[#8B4513] mb-4">Bebidas Quentes</h1>
                <p className="text-red-600">{hotDrinks.error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-[#8B4513] mb-4 font-serif">
                    Bebidas Quentes
                </h1>
                <p className="text-[#D2691E] text-lg">
                    Descubra nossa seleção de bebidas quentes
                </p>
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                    <span className="text-[#D2691E] font-serif">☕</span>
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                </div>
            </div>

            {/* Drinks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotDrinks.map((drink) => (
                    <div
                        key={drink.id}
                        className="bg-white rounded-lg shadow-md border border-[#DEB887] overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {drink.imageUrl && (
                            <div className="relative h-48 w-full">
                                <img
                                    src={drink.imageUrl}
                                    alt={drink.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-[#8B4513]">{drink.name}</h3>
                                <div className="flex gap-2">
                                    {drink.isAlcoholic && (
                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold border border-red-700 shadow-sm">
                                            🍷 18+
                                        </span>
                                    )}
                                    {drink.isPopular && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                            Popular
                                        </span>
                                    )}
                                </div>
                            </div>
                            {drink.description && (
                                <p className="text-[#D2691E] mb-4">{drink.description}</p>
                            )}
                            <div className="space-y-2">
                                {drink.hasSize ? (
                                    <div className="space-y-1">
                                        {drink.mediumSizePrice && (
                                            <p className="text-[#8B4513]">
                                                Médio: R$ {Number(drink.mediumSizePrice).toFixed(2)}
                                            </p>
                                        )}
                                        {drink.largeSizePrice && (
                                            <p className="text-[#8B4513]">
                                                Grande: R$ {Number(drink.largeSizePrice).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-[#8B4513]">
                                        R$ {Number(drink.price).toFixed(2)}
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {drink.isGlutenFree && (
                                    <span className="bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded-full">
                                        🌾 Sem Glúten
                                    </span>
                                )}
                                {drink.isVegetarian && (
                                    <span className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full">
                                        🥬 Vegetariano
                                    </span>
                                )}
                                {drink.isVegan && (
                                    <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-1 rounded-full">
                                        🌱 Vegano
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hotDrinks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-[#8B4513] text-lg">
                        Nenhuma bebida quente disponível no momento.
                    </p>
                </div>
            )}

            {/* Decorative Footer */}
            <div className="flex items-center justify-center mt-12 space-x-4">
                <div className="h-[2px] w-24 bg-[#DEB887]" />
                <span className="text-[#D2691E] font-serif">♨️</span>
                <div className="h-[2px] w-24 bg-[#DEB887]" />
            </div>
        </div>
    );
} 