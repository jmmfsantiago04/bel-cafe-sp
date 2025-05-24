import Image from "next/image"

export function OurStory() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-6">Como Tudo Começou</h2>

            <div className="relative h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
                <Image
                    src="/images/cafe-interior.jpg"
                    alt="Interior do É de Chão Café"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="space-y-4 text-[#2B4C5C]/80">
                <p>
                    O É de Chão nasceu do sonho de criar um espaço que unisse a autenticidade da culinária nordestina
                    com o aconchego de um café tradicional. Nossa jornada começou em 2023, quando decidimos transformar
                    uma antiga casa em um lugar onde as pessoas pudessem se sentir verdadeiramente em casa.
                </p>
                <p>
                    O nome "É de Chão" vem da expressão nordestina que representa algo autêntico, genuíno, feito com
                    amor e dedicação. Assim como o café que é cultivado e colhido da terra, nossa comida é preparada
                    com ingredientes frescos e receitas que passam de geração em geração.
                </p>
                <p>
                    Hoje, somos mais que um café - somos um ponto de encontro para amigos e famílias, um espaço onde
                    histórias são compartilhadas e memórias são criadas, tudo isso acompanhado do melhor café e da mais
                    deliciosa comida caseira.
                </p>
            </div>
        </div>
    )
} 