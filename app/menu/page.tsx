import { MenuItemForm } from "@/components/admin/menu-form"
import { getCategories } from "@/app/actions/categories"

export default async function MenuPage() {
    const { data: categories, error } = await getCategories();

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F5DEB3] to-[#FFEFD5] py-12">
                <div className="container mx-auto text-center">
                    <p className="text-red-600">Erro ao carregar categorias: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#F5DEB3] to-[#FFEFD5] py-12">
            <div className="container mx-auto">
                {/* Decorative Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#8B4513] mb-4 font-serif">
                        Bel Café
                    </h1>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="h-[2px] w-24 bg-[#DEB887]" />
                        <span className="text-[#D2691E] font-serif">☕</span>
                        <div className="h-[2px] w-24 bg-[#DEB887]" />
                    </div>
                </div>

                {/* Menu Form */}
                <MenuItemForm categories={categories} />

                {/* Decorative Footer */}
                <div className="flex items-center justify-center mt-12 space-x-4">
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                    <span className="text-[#D2691E] font-serif">♦</span>
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                </div>
            </div>
        </main>
    )
} 