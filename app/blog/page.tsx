import { getPublishedBlogPosts } from "@/app/actions/blog"
import { BlogCards } from "@/app/blog/components/blog-cards"
import { BlogPostResponse } from "@/app/actions/blog/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
                <header className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="text-3xl font-bold text-[#4A2512] mb-4">Blog do Bel Café</h1>
                    <p className="text-[#8B4513]/80">
                        Descubra histórias fascinantes, receitas exclusivas e curiosidades sobre o mundo do café.
                    </p>
                </header>

                <Card className="bg-white/80 backdrop-blur-sm border-none">
                    <CardHeader>
                        <CardTitle className="text-[#4A2512]">Posts Recentes</CardTitle>
                        <CardDescription>
                            Confira nossas últimas publicações
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {posts.length === 0 ? (
                            <div className="text-center text-[#8B4513]/80 py-8">
                                <p className="text-lg">Nenhum post publicado ainda.</p>
                                <p className="text-sm mt-2">Volte em breve para novidades!</p>
                            </div>
                        ) : (
                            <BlogCards posts={posts} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 