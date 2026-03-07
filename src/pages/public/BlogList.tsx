import React, { useState, useEffect } from 'react';
import { adminService, BlogPost } from '@/src/services/adminService';
import FadeIn from '@/src/components/FadeIn';
import { Calendar, User, ArrowRight, Tag, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateBR } from '@/src/lib/dateUtils';

interface BlogListProps {
    onNavigate?: (view: string, params?: any) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onNavigate }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNewsletterState('loading');
        const { supabase } = await import('@/src/lib/supabase');
        try {
            const { error } = await supabase.from('leads').insert([{
                type: 'newsletter',
                email: newsletterEmail,
                source: 'Blog - Newsletter',
                data: { email: newsletterEmail },
                created_at: new Date().toISOString()
            }]);

            if (error) throw error;
            setNewsletterState('success');
            setNewsletterEmail('');
            setTimeout(() => setNewsletterState('idle'), 5000);
        } catch (err) {
            setNewsletterState('error');
            alert('Erro ao assinar a newsletter.');
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await adminService.getBlogPosts();
            const published = data.filter(p => p.status === 'published');
            setPosts(published);
            setFilteredPosts(published);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
    }, [searchTerm, posts]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    return (
        <section className="pt-44 lg:pt-60 pb-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl lg:text-7xl font-heading font-black text-brand-darkBlue mb-6 tracking-tighter leading-[0.95]">
                            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-400 italic pr-1">inteligência digital</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Estratégias, tendências e insights para fazer seu negócio crescer no mundo real através do digital.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por interesse..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all shadow-sm font-medium"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                                title="Limpar busca"
                                aria-label="Limpar busca"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <Tag size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum artigo encontrado</h3>
                        <p className="text-gray-500">{searchTerm ? 'Tente buscar por outro termo.' : 'Fique atento, novidades em breve!'}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <FadeIn key={post.id}>
                                <Link to={`/blog/${post.slug}`} className="block h-full">
                                    <article className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer h-full flex flex-col">
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
                                                    <Calendar size={12} /> {formatDateBR(post.created_at || '', { short: true })}
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
                                                <span className="text-xs font-black uppercase tracking-widest text-brand-darkBlue group-hover/btn:text-brand-gold transition-colors flex items-center gap-2">
                                                    Ler Artigo Completo <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>

            {/* Newsletter Subscribe */}
            <div className="max-w-4xl mx-auto px-4 mt-20">
                <div className="bg-brand-darkBlue rounded-[3rem] p-8 md:p-12 shadow-xl border border-brand-blue/20 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-black text-white mb-4">Receba Nossos Insights</h4>
                        <p className="text-blue-100/80 mb-8 max-w-lg mx-auto">
                            Estratégias de marketing, gestão e vendas enviadas semanalmente para você.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                required
                                value={newsletterEmail}
                                onChange={e => setNewsletterEmail(e.target.value)}
                                disabled={newsletterState === 'loading' || newsletterState === 'success'}
                                className="flex-1 h-14 px-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-brand-gold transition-all"
                            />
                            <button
                                type="submit"
                                disabled={newsletterState === 'loading' || newsletterState === 'success'}
                                className="h-14 px-8 bg-brand-gold text-brand-darkBlue rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg flex items-center justify-center disabled:opacity-70"
                            >
                                {newsletterState === 'loading' ? 'Enviando...' : newsletterState === 'success' ? 'Assinado!' : 'Assinar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogList;
