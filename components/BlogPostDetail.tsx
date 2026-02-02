import React, { useState, useEffect } from 'react';
import { adminService, BlogPost } from '../services/adminService';
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { ViewState } from '../App';
import Button from './Button';

interface BlogPostDetailProps {
    slug: string;
    onNavigate: (view: ViewState) => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug, onNavigate }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const posts = await adminService.getBlogPosts();
            const found = posts.find(p => p.slug === slug);
            setPost(found || null);
            setLoading(false);
            window.scrollTo(0, 0);
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Artigo não encontrado</h2>
                <Button onClick={() => onNavigate('blog' as any)} variant="primary">Voltar para o Blog</Button>
            </div>
        );
    }

    return (
        <article className="bg-white min-h-screen">
            {/* Header do Post */}
            <header className="relative h-[60vh] min-h-[400px] flex items-end pb-16">
                <div className="absolute inset-0">
                    <img
                        src={post.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'}
                        className="w-full h-full object-cover"
                        alt={post.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <button
                        onClick={() => onNavigate('blog' as any)}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Voltar ao Blog
                    </button>

                    <div className="max-w-4xl">
                        <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6 inline-block">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 font-medium">
                            <span className="flex items-center gap-2">
                                <Calendar size={18} className="text-brand-orange" /> {new Date(post.created_at || '').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2">
                                <User size={18} className="text-brand-orange" /> MD Solution Admin
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo do Post */}
            <div className="container mx-auto px-4 md:px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <main className="lg:col-span-8">
                        <div
                            className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                prose-p:mb-6 prose-strong:text-gray-900 prose-img:rounded-3xl prose-img:shadow-2xl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </main>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 sticky top-32">
                            <h4 className="text-xl font-bold text-gray-900 mb-6">Compartilhe</h4>
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                                    <Share2 size={20} />
                                </button>
                                <button
                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Confira este artigo: ' + post.title + ' - ' + window.location.href)}`)}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                >
                                    <MessageCircle size={20} />
                                </button>
                            </div>

                            <div className="mt-12 bg-brand-darkBlue rounded-3xl p-8 text-center text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-orange opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                <h4 className="text-xl font-bold mb-4 relative z-10">Precisa de ajuda estratégica?</h4>
                                <p className="text-blue-100/70 text-sm mb-8 relative z-10">Agende um diagnóstico gratuito e descubra como aplicar esses conceitos no seu negócio.</p>
                                <Button
                                    onClick={() => onNavigate('marketing-diagnosis')}
                                    variant="primary"
                                    fullWidth
                                    className="relative z-10"
                                >
                                    Falar com Consultor
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
};

export default BlogPostDetail;
