'use client'

import { BlogPostResponse } from "@/app/actions/blog/types"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface BlogPostTableProps {
    posts: BlogPostResponse[]
    onEdit: (post: BlogPostResponse) => void
}

export function BlogPostTable({ posts, onEdit }: BlogPostTableProps) {
    function formatDate(date: Date | string) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date))
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">
                                {post.title}
                            </TableCell>
                            <TableCell>
                                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            </TableCell>
                            <TableCell>{post.author}</TableCell>
                            <TableCell>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.isPublished
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {post.isPublished ? 'Publicado' : 'Rascunho'}
                                </span>
                            </TableCell>
                            <TableCell>
                                {formatDate(post.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    className="text-amber-600 hover:text-amber-900"
                                    onClick={() => onEdit(post)}
                                >
                                    Editar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
} 