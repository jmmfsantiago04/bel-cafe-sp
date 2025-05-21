import { getPublishedBlogPosts } from "@/app/actions/blog"
import { BlogCards } from "@/components/blog/blog-cards"
import { BlogPostResponse } from "@/app/actions/blog/types"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Blog | Bel Café',
    description: 'Descubra histórias, receitas e curiosidades sobre café em nosso blog.',
}

export default async function BlogPage() {
    const result = await getPublishedBlogPosts()
    const posts = (result.data?.map(post => ({
        ...post,
        category: post.category as "curiosidades" | "receitas" | "historia"
    })) || []) satisfies BlogPostResponse[]

    return (
        <div className="min-h-screen bg-[#F5E6D3]">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-amber-900 mb-4">Blog do Bel Café</h1>
                    <p className="text-lg text-amber-800">
                        Descubra histórias fascinantes, receitas exclusivas e curiosidades sobre o mundo do café.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center text-amber-800 py-8 bg-white rounded-xl shadow-md">
                        <p className="text-lg">Nenhum post publicado ainda.</p>
                        <p className="text-sm mt-2">Volte em breve para novidades!</p>
                    </div>
                ) : (
                    <BlogCards posts={posts} />
                )}
            </div>
        </div>
    )
} 