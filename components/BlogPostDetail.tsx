import React, { useState, useEffect } from 'react';
import { adminService, BlogPost, BlogComment } from '../services/adminService';
import { Calendar, User as UserIcon, ArrowLeft, Share2, MessageCircle, ArrowRight, ThumbsUp, ThumbsDown, Send, CornerDownRight, Lock, ShieldCheck, Facebook, Linkedin, Twitter, Copy, Check } from 'lucide-react';
import { ViewState } from '../App';
import { useAuth } from './Auth/AuthProvider';
import Button from './Button';
import { formatDateBR, formatRelativeTime } from '../lib/dateUtils';

interface BlogPostDetailProps {
    slug: string;
    onNavigate: (view: ViewState) => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug, onNavigate }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [suggestedPosts, setSuggestedPosts] = useState<BlogPost[]>([]);
    const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [newComment, setNewComment] = useState({ author: '', content: '' });
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [commenting, setCommenting] = useState(false);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [reacting, setReacting] = useState<string | null>(null);
    const [hasReacted, setHasReacted] = useState(false);
    const [copied, setCopied] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const posts = await adminService.getBlogPosts();
            console.log('All posts:', posts);
            console.log('Looking for slug:', slug);

            // Filter only published posts
            const publishedPosts = posts.filter(p => p.status === 'published');
            const found = publishedPosts.find(p => p.slug === slug);

            console.log('Found post:', found);

            if (found) {
                setPost(found);
                if (found.id) {
                    const postComments = await adminService.getComments(found.id);
                    setComments(postComments);

                    // Record view
                    adminService.incrementViewCount(found.id);

                    // Check if already reacted
                    const reactions = JSON.parse(localStorage.getItem('blog_reactions') || '{}');
                    if (reactions[found.id]) {
                        setHasReacted(true);
                    }
                }
            }

            // Sugestões: publicados, exceto o atual, priorizando recentes
            const suggestions = publishedPosts
                .filter(p => p.slug !== slug)
                .slice(0, 3);
            setSuggestedPosts(suggestions);

            // Fetch popular posts
            const popular = await adminService.getPopularPosts(5);
            setPopularPosts(popular);

            setLoading(false);
            window.scrollTo(0, 0);
        };
        fetchPost();
    }, [slug]);

    const handleReaction = async (type: 'like' | 'dislike') => {
        if (!post?.id || reacting || hasReacted) return;
        setReacting(type);
        const success = await adminService.reactToPost(post.id, type);
        if (success) {
            setPost({
                ...post,
                likes: type === 'like' ? (post.likes || 0) + 1 : post.likes,
                dislikes: type === 'dislike' ? (post.dislikes || 0) + 1 : post.dislikes
            });

            // Save to localStorage
            const reactions = JSON.parse(localStorage.getItem('blog_reactions') || '{}');
            reactions[post.id] = type;
            localStorage.setItem('blog_reactions', JSON.stringify(reactions));
            setHasReacted(true);
        }
        setReacting(null);
    };

    const handleAddComment = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        const content = parentId ? replyContent : newComment.content;
        const author = user?.user_metadata?.full_name || (parentId ? 'Leitor' : newComment.author);

        if (!post?.id || !content.trim() || (!user && !newComment.author.trim())) return;

        setCommenting(true);
        const commentData: BlogComment = {
            post_id: post.id,
            parent_id: parentId,
            author_name: author,
            content: content
        };

        const added = await adminService.addComment(commentData);
        if (added) {
            setComments([...comments, added]);
            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComment({ author: '', content: '' });
                setCommentSuccess(true);
                setTimeout(() => setCommentSuccess(false), 5000);
            }
        }
        setCommenting(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent((post?.title || '') + " - " + window.location.href)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`
    };

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
                                <Calendar size={18} className="text-brand-orange" /> {formatDateBR(post.created_at || '')}
                            </span>
                            <span className="flex items-center gap-2">
                                <UserIcon size={18} className="text-brand-orange" /> MD Solution Admin
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo do Post */}
            <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <main className="lg:col-span-8">
                        {/* Social Share Bar - Início do Post */}
                        <div className="mb-10 flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] w-full md:w-auto mb-2 md:mb-0">Compartilhar Artigo:</span>
                            <div className="flex flex-wrap gap-3">
                                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm" title="WhatsApp">
                                    <MessageCircle size={18} />
                                </a>
                                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Facebook">
                                    <Facebook size={18} />
                                </a>
                                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-brand-orange transition-all shadow-sm" title="X (Twitter)">
                                    <Twitter size={18} />
                                </a>
                                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all shadow-sm" title="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                                <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-blue-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm" title="Telegram">
                                    <Send size={18} />
                                </a>
                                <button
                                    onClick={handleCopyLink}
                                    className={`flex items-center gap-2 px-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copiado!' : 'Copiar Link'}
                                </button>
                            </div>
                        </div>

                        <div
                            className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                prose-p:mb-6 prose-strong:text-gray-900 prose-img:rounded-3xl prose-img:shadow-2xl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Avaliação do Conteúdo */}
                        <div className="mt-16 bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                            <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">Gostou do conteúdo? Deixe sua avaliação</h4>
                            <div className="flex justify-center gap-8">
                                <button
                                    onClick={() => handleReaction('like')}
                                    disabled={reacting !== null || hasReacted}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all active:scale-95 ${reacting === 'like' || (hasReacted && JSON.parse(localStorage.getItem('blog_reactions') || '{}')[post.id] === 'like') ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 hover:border-brand-blue hover:text-brand-blue border border-gray-100 shadow-sm'} ${hasReacted ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <ThumbsUp size={20} className={reacting === 'like' ? 'animate-bounce' : ''} />
                                    <span className="font-bold">{post.likes || 0}</span>
                                    <span className="text-sm font-medium">Gostei</span>
                                </button>
                                <button
                                    onClick={() => handleReaction('dislike')}
                                    disabled={reacting !== null || hasReacted}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all active:scale-95 ${reacting === 'dislike' || (hasReacted && JSON.parse(localStorage.getItem('blog_reactions') || '{}')[post.id] === 'dislike') ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:border-gray-800 hover:text-gray-800 border border-gray-100 shadow-sm'} ${hasReacted ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <ThumbsDown size={20} className={reacting === 'dislike' ? 'animate-bounce' : ''} />
                                    <span className="font-bold">{post.dislikes || 0}</span>
                                    <span className="text-sm font-medium">Não Gostei</span>
                                </button>
                            </div>
                        </div>

                        {/* Article Footer - Author, Date, Share */}
                        <div className="mt-20 pt-12 border-t border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shadow-inner">
                                        <UserIcon size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Escrito por</p>
                                        <h4 className="font-bold text-gray-900 text-lg">Equipe MD Solution</h4>
                                        <p className="text-sm text-gray-500">Consultoria e Estratégia Digital</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Publicação</p>
                                        <p className="font-bold text-gray-900">{new Date(post.created_at || '').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="h-12 w-px bg-gray-100 hidden md:block" />
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Confira este artigo: ' + post.title + ' - ' + window.location.href)}`)}
                                            className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm group"
                                            title="Compartilhar no WhatsApp"
                                        >
                                            <MessageCircle size={22} className="transition-transform group-hover:scale-110" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({ title: post.title, url: window.location.href });
                                                } else {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    alert('Link copiado!');
                                                }
                                            }}
                                            className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all shadow-sm group"
                                            title="Compartilhar Artigo"
                                        >
                                            <Share2 size={22} className="transition-transform group-hover:scale-110" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Comentários */}
                        <section className="mt-20">
                            <h3 className="text-3xl font-heading font-bold text-gray-900 mb-10 flex items-center gap-4">
                                Comentários <span className="text-sm bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full">{comments.length}</span>
                            </h3>

                            {/* Form de Comentário */}
                            {user ? (
                                <form onSubmit={(e) => handleAddComment(e)} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 mb-12 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-6">Deixe um comentário</h4>
                                    <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-50 shadow-sm">
                                            {user.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                                    <UserIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Publicando como</p>
                                            <p className="font-bold text-gray-900">{user.user_metadata?.full_name || 'Usuário'}</p>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Seu Comentário</label>
                                        <textarea
                                            value={newComment.content}
                                            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                            placeholder="O que você achou deste artigo?"
                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all h-32 resize-none"
                                            required
                                        />
                                    </div>
                                    {commentSuccess && (
                                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 font-bold text-sm animate-fade-in flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Comentário enviado com sucesso!
                                        </div>
                                    )}
                                    <Button type="submit" variant="primary" loading={commenting} withIcon>
                                        {commenting ? 'Publicando...' : 'Publicar Comentário'}
                                    </Button>
                                </form>
                            ) : (
                                <div className="bg-blue-50/50 rounded-[2rem] p-10 border border-blue-100 text-center mb-12 animate-fade-in">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-blue mx-auto mb-6 shadow-sm">
                                        <Lock size={28} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-3">Sua opinião constrói inteligência</h4>
                                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                                        Junte-se à conversa e compartilhe seus insights com outros líderes de mercado.
                                        Identifique-se para publicar seu comentário e interagir diretamente com nossa equipe.
                                    </p>
                                    <div className="flex flex-col items-center gap-4">
                                        <Button onClick={() => onNavigate('auth' as any)} variant="primary" className="px-10">
                                            Fazer Login para Comentar
                                        </Button>
                                        <button
                                            onClick={() => onNavigate('comment-policy' as any)}
                                            className="text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-brand-blue transition-colors flex items-center gap-2"
                                        >
                                            <ShieldCheck size={12} /> Conheça nossas regras da casa
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Lista de Comentários */}
                            <div className="space-y-8">
                                {comments.filter(c => !c.parent_id).length === 0 && (
                                    <div className="text-center py-10 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-medium">Seja o primeiro a comentar!</p>
                                    </div>
                                )}

                                {comments.filter(c => !c.parent_id).map((comment) => (
                                    <div key={comment.id} className="group">
                                        <div className="flex gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                                                <UserIcon size={24} />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h5 className="font-bold text-gray-900">{comment.author_name}</h5>
                                                    <span className="text-xs text-gray-400">{new Date(comment.created_at || '').toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <p className="text-gray-600 mb-4 leading-relaxed">{comment.content}</p>
                                                <button
                                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id || null)}
                                                    className="text-[10px] font-black uppercase text-brand-blue tracking-widest hover:text-brand-orange transition-colors"
                                                >
                                                    Responder
                                                </button>

                                                {/* Form de Resposta */}
                                                {(replyingTo === comment.id && user) && (
                                                    <form onSubmit={(e) => handleAddComment(e, comment.id || null)} className="mt-6 flex flex-col gap-4 animate-fade-in">
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder="Sua resposta..."
                                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all h-24 resize-none text-sm"
                                                            required
                                                        />
                                                        <div className="flex gap-3">
                                                            <Button type="submit" variant="primary" loading={commenting} className="py-2 px-6 text-xs">Enviar Resposta</Button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setReplyingTo(null)}
                                                                className="px-6 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-100 transition-all"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}

                                                {(replyingTo === comment.id && !user) && (
                                                    <div className="mt-6 p-4 bg-blue-50/30 rounded-2xl border border-blue-50 text-xs text-blue-800 flex items-center gap-2 animate-fade-in">
                                                        <Lock size={14} /> Faça login para responder a este comentário.
                                                    </div>
                                                )}

                                                {/* Respostas (Ninho 1) */}
                                                <div className="mt-6 space-y-6">
                                                    {comments.filter(reply => reply.parent_id === comment.id).map((reply) => (
                                                        <div key={reply.id} className="flex gap-4">
                                                            <CornerDownRight size={18} className="text-gray-300 mt-2" />
                                                            <div className="flex-grow bg-blue-50/30 p-5 rounded-[1.5rem] border border-blue-50">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <h6 className="font-bold text-gray-800 text-sm">{reply.author_name} <span className="text-[10px] font-black text-brand-blue ml-2 uppercase tracking-widest">Admin</span></h6>
                                                                    <span className="text-[10px] text-gray-400">{new Date(reply.created_at || '').toLocaleDateString('pt-BR')}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 leading-relaxed">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
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

                            {/* Artigos Populares */}
                            <div className="mt-12">
                                <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-6">Artigos Mais Lidos</h4>
                                <div className="space-y-6">
                                    {popularPosts.map((pPost, index) => (
                                        <div
                                            key={pPost.id}
                                            onClick={() => onNavigate('blog-post' as any, { slug: pPost.slug })}
                                            className="group cursor-pointer flex gap-4 items-start"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-black text-gray-300 group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-all duration-300 border border-gray-100">
                                                0{index + 1}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-gray-700 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                                                    {pPost.title}
                                                </h5>
                                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                                    {pPost.category}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Seção Sugestões de Leitura */}
            {
                suggestedPosts.length > 0 && (
                    <section className="bg-gray-50 py-24 border-t border-gray-100">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h3 className="text-[10px] text-brand-blue font-black uppercase tracking-[0.2em] mb-2">Continue Lendo</h3>
                                    <h4 className="text-3xl font-heading font-bold text-gray-900">Artigos Relacionados</h4>
                                </div>
                                <button
                                    onClick={() => onNavigate('blog' as any)}
                                    className="text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors flex items-center gap-2"
                                >
                                    Ver todos <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {suggestedPosts.map((sPost) => (
                                    <div
                                        key={sPost.id}
                                        onClick={() => onNavigate('blog-post' as any, { slug: sPost.slug })}
                                        className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            <img
                                                src={sPost.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'}
                                                alt={sPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                                    {sPost.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-8 flex flex-col flex-grow">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-brand-blue transition-colors leading-tight">
                                                {sPost.title}
                                            </h4>
                                            <div className="mt-auto flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} /> {new Date(sPost.created_at || '').toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }
        </article >
    );
};

export default BlogPostDetail;
