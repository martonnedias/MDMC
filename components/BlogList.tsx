import React, { useState, useEffect } from 'react';
import { adminService, BlogPost } from '../services/adminService';
import FadeIn from './FadeIn';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { ViewState } from '../App';

interface BlogListProps {
    onNavigate: (view: ViewState, params?: any) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onNavigate }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await adminService.getBlogPosts();
            setPosts(data.filter(p => p.status === 'published'));
            setLoading(false);
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                        Blog Inteligência Digital
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Estratégias, tendências e insights para fazer seu negócio crescer no mundo real através do digital.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <Tag size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum artigo publicado ainda</h3>
                        <p className="text-gray-500">Fique atento, novidades em breve!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <FadeIn key={post.id}>
                                <article
                                    className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer h-full flex flex-col"
                                    onClick={() => onNavigate('blog-post' as any, { slug: post.slug })}
                                >
                                    <div className="aspect-[16/10] overflow-hidden relative">
                                        <img
                                            src={post.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={12} /> {new Date(post.created_at || '').toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <User size={12} /> Admin
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue transition-colors leading-tight">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between group/btn">
                                            <span className="text-xs font-black uppercase tracking-widest text-brand-darkBlue group-hover/btn:text-brand-orange transition-colors flex items-center gap-2">
                                                Ler Artigo Completo <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogList;
