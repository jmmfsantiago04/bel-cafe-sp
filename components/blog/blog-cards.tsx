'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BlogPostResponse } from '@/app/actions/blog/types'

interface BlogCardsProps {
    posts: BlogPostResponse[]
}

export function BlogCards({ posts }: BlogCardsProps) {
    function formatDate(date: Date | string) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="relative h-48 w-full">
                        {post.imageUrl ? (
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-amber-50 animate-pulse" />
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex flex-wrap items-center text-sm text-amber-800 mb-2 gap-2">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                            <span>•</span>
                            <span className="capitalize bg-amber-100 px-3 py-1 rounded-full text-xs font-medium">
                                {post.category}
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold mb-2 text-amber-900 hover:text-amber-700 transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h2>

                        <p className="text-amber-950/80 mb-4 line-clamp-3">
                            {post.content}
                        </p>

                        <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors"
                        >
                            Ler mais →
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    )
} 