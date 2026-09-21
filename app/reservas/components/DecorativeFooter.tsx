export function DecorativeFooter() {
    return (
        <div className="flex items-center justify-center mt-8 sm:mt-12 md:mt-16 space-x-4 sm:space-x-6">
            <div className="h-[1px] sm:h-[2px] w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-[#EE8614] to-transparent" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#FDF5E6] flex items-center justify-center border border-[#EE8614] sm:border-2">
                <span className="text-[#EE8614] font-[family-name:var(--font-display)] text-base sm:text-lg md:text-xl">♦</span>
            </div>
            <div className="h-[1px] sm:h-[2px] w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-[#EE8614] to-transparent" />
        </div>
    )
} 