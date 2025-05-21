import { getBlogPostBySlug } from "@/app/actions/blog"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { BlogPostResponse } from "@/app/actions/blog/types"
import { Metadata } from "next"

interface BlogPostPageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const result = await getBlogPostBySlug(params.slug)
    const post = result.data

    if (!post) {
        return {
            title: 'Post não encontrado | Bel Café',
        }
    }

    return {
        title: `${post.title} | Bel Café`,
        description: post.content.slice(0, 160),
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string }
}) {
    if (!params.slug) {
        notFound()
    }

    const result = await getBlogPostBySlug(params.slug)

    if (!result.data || 'error' in result) {
        notFound()
    }

    const post = {
        ...result.data,
        category: result.data.category as "curiosidades" | "receitas" | "historia"
    } satisfies BlogPostResponse

    function formatDate(date: Date | string) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date))
    }

    return (
        <div className="min-h-screen bg-[#F5E6D3]">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-amber-800 hover:text-amber-900 mb-8 group"
                    >
                        <span className="transform transition-transform group-hover:-translate-x-1">←</span>
                        <span className="ml-2 font-medium">Voltar para o Blog</span>
                    </Link>

                    <article className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {post.imageUrl && (
                            <div className="relative h-[400px] w-full">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <div className="flex flex-wrap items-center text-sm text-amber-800 mb-6 gap-2">
                                <span className="bg-amber-50 px-3 py-1 rounded-full">
                                    {formatDate(post.createdAt)}
                                </span>
                                <span>•</span>
                                <span className="bg-amber-50 px-3 py-1 rounded-full">
                                    {post.author}
                                </span>
                                <span>•</span>
                                <span className="capitalize bg-amber-100 px-3 py-1 rounded-full font-medium">
                                    {post.category}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-amber-900">
                                {post.title}
                            </h1>

                            <div className="prose prose-lg max-w-none prose-headings:text-amber-900 prose-a:text-amber-700 hover:prose-a:text-amber-800">
                                {post.content.split('\n').map((paragraph: string, index: number) => (
                                    paragraph ? (
                                        <p key={index} className="text-amber-950/90 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    ) : <br key={index} />
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-amber-100">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium group"
                                >
                                    <span className="transform transition-transform group-hover:-translate-x-1">←</span>
                                    <span className="ml-2">Voltar para todos os posts</span>
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    )
} 