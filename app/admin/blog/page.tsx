'use client'

import { useState, useEffect } from "react"
import { AddBlogPostForm } from "@/app/admin/blog/components/add-blog-post-form"
import { EditBlogPostForm } from "@/app/admin/blog/components/edit-blog-post-form"
import { BlogPostTable } from "@/app/admin/blog/components/blog-post-table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getAllBlogPosts, type BlogPostResponse } from "@/app/actions/blog"

export default function AdminBlogPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState<BlogPostResponse | null>(null)
    const [posts, setPosts] = useState<BlogPostResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    async function loadPosts() {
        try {
            setIsLoading(true)
            setError(null)
            const result = await getAllBlogPosts()

            if ('error' in result) {
                throw new Error(result.error)
            }

            const typedPosts = result.data?.map(post => ({
                ...post,
                category: post.category as "curiosidades" | "receitas" | "historia"
            })) || []

            setPosts(typedPosts)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadPosts()
    }, [])

    const handleAddSuccess = () => {
        setIsAddDialogOpen(false)
        loadPosts()
    }

    const handleEditSuccess = () => {
        setIsEditDialogOpen(false)
        setSelectedPost(null)
        loadPosts()
    }

    const handleEdit = (post: BlogPostResponse) => {
        setSelectedPost(post)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gerenciar Blog</h1>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Novo Post</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Post</DialogTitle>
                            <DialogDescription>
                                Preencha os campos abaixo para criar um novo post no blog.
                            </DialogDescription>
                        </DialogHeader>
                        <AddBlogPostForm onSuccess={handleAddSuccess} />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Carregando posts...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">
                    Erro ao carregar posts: {error}
                </div>
            ) : posts.length > 0 ? (
                <BlogPostTable posts={posts} onEdit={handleEdit} />
            ) : (
                <div className="text-center text-gray-500 py-8">
                    Nenhum post encontrado. Crie um novo post clicando no botão acima.
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Post</DialogTitle>
                        <DialogDescription>
                            Edite os campos abaixo para atualizar o post.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPost && (
                        <EditBlogPostForm
                            post={selectedPost}
                            onSuccess={handleEditSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
} 