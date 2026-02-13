import React, { useState } from 'react';
import {
    FileText, Plus, Search, Filter, Edit3, Trash2,
    Eye, Clock, MessageSquare, Sparkles, Image as ImageIcon,
    Calendar, User, Tag, ChevronLeft, Save, Globe, Lock,
    CheckCircle, XCircle, ExternalLink
} from 'lucide-react';
import { BlogPost } from '../../../services/adminService';
import RichTextEditor from '../RichTextEditor';
import Button from '../../Button';

interface BlogTabProps {
    posts: BlogPost[];
    editingPost: BlogPost | null;
    setEditingPost: (post: BlogPost | null) => void;
    onSavePost: (e: React.FormEvent) => void;
    onDeletePost: (id: string) => void;
    onGenerateAI: () => void;
    loading: boolean;
}

const BlogTab: React.FC<BlogTabProps> = ({
    posts, editingPost, setEditingPost, onSavePost,
    onDeletePost, onGenerateAI, loading
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

    const filteredPosts = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (editingPost) {
        return (
            <form onSubmit={onSavePost} className="space-y-8 animate-fade-in max-w-6xl pb-20">
                <header className="flex justify-between items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setEditingPost(null)}
                            className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all hover:-translate-x-1"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                {editingPost.id ? 'Editar Publicação' : 'Novo Conteúdo'}
                            </h1>
                            <p className="text-sm font-bold text-gray-400 italic">Blog Estratégico MD Solution</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onGenerateAI}
                            disabled={loading}
                            className="px-6 py-4 bg-purple-50 text-purple-600 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all shadow-lg shadow-purple-50"
                        >
                            <Sparkles size={16} /> Assistente de Conteúdo (IA)
                        </button>
                        <Button type="submit" loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-100">
                            <Save size={18} /> Publicar Artigo
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Título do Post</label>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                                    className="w-full text-2xl font-black p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-200"
                                    placeholder="Como escalar seu ROI no tráfego pago em 2026..."
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Conteúdo Editorial</label>
                                <RichTextEditor
                                    value={editingPost.content}
                                    onChange={(val) => setEditingPost({ ...editingPost, content: val })}
                                    placeholder="Comece a contar sua história de sucesso..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <h4 className="font-black text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <Tag size={18} className="text-blue-500" /> Metadados
                            </h4>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Slug da URL</label>
                                <input
                                    type="text"
                                    value={editingPost.slug}
                                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Categoria</label>
                                <select
                                    value={editingPost.category}
                                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold"
                                >
                                    <option value="Tráfego Pago">Tráfego Pago</option>
                                    <option value="CRM e Vendas">CRM e Vendas</option>
                                    <option value="Marketing Local">Marketing Local</option>
                                    <option value="Estratégia">Estratégia</option>
                                    <option value="Case de Sucesso">Case de Sucesso</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Status de Publicação</label>
                                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPost({ ...editingPost, status: 'draft' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editingPost.status === 'draft' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Lock size={12} /> Rascunho
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingPost({ ...editingPost, status: 'published' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editingPost.status === 'published' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Globe size={12} /> Publicar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <h4 className="font-black text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-blue-500" /> Imagem de Destaque
                            </h4>
                            <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden flex items-center justify-center group relative cursor-pointer">
                                {editingPost.featured_image ? (
                                    <img src={editingPost.featured_image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clique para Upload</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setEditingPost({ ...editingPost, featured_image: reader.result as string });
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            <input
                                type="text"
                                value={editingPost.featured_image}
                                onChange={(e) => setEditingPost({ ...editingPost, featured_image: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-mono"
                                placeholder="Ou cole a URL aqui..."
                            />
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                            <h4 className="font-black text-gray-900 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <Search size={18} className="text-blue-500" /> SEO & Resumo
                            </h4>
                            <textarea
                                value={editingPost.excerpt}
                                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-medium h-32 resize-none"
                                placeholder="Uma descrição curta que aparece nas redes sociais e nos cards do blog..."
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Conteúdo Editorial</h1>
                    <p className="text-gray-500 font-medium">Crie autoridade e eduque sua audiência no blog.</p>
                </div>
                <Button
                    onClick={() => setEditingPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', category: 'Estratégia', status: 'draft' })}
                    variant="primary"
                    className="flex items-center gap-2 px-10 shadow-xl shadow-blue-100 text-sm"
                >
                    <Plus size={20} /> Novo Artigo
                </Button>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar posts por título ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    />
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button onClick={() => setStatusFilter('all')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>Todos</button>
                    <button onClick={() => setStatusFilter('published')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'published' ? 'bg-blue-600 text-white shadow-lg shadow-blue-50' : 'text-gray-400 hover:text-gray-600'}`}>Publicados</button>
                    <button onClick={() => setStatusFilter('draft')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'draft' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-600'}`}>Rascunhos</button>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100/50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Artigo / Categoria</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Engajamento</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Data</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPosts.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0">
                                            {post.featured_image ? <img src={post.featured_image} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-gray-300" />}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-base tracking-tight group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setEditingPost(post)}>
                                                {post.title}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5 font-bold text-xs text-gray-400 uppercase tracking-widest italic">
                                                <Tag size={10} className="text-blue-500" /> {post.category}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors cursor-help" title="Visualizações">
                                            <Eye size={16} /> <span className="text-xs font-black">{post.views || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors cursor-help" title="Curtidas">
                                            <CheckCircle size={16} /> <span className="text-xs font-black">{post.likes || 0}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                        {post.status === 'published' ? <Globe size={10} /> : <Lock size={10} />}
                                        {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
                                        <Calendar size={14} /> {new Date(post.created_at || '').toLocaleDateString('pt-BR')}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {post.status === 'published' && post.slug && (
                                            <a
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl shadow-sm transition-all"
                                                title="Ver no Site"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        <button onClick={() => setEditingPost(post)} className="p-3 bg-white border border-gray-100 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm transition-all" title="Editar"><Edit3 size={16} /></button>
                                        <button onClick={() => post.id && onDeletePost(post.id)} className="p-3 bg-white border border-gray-100 text-red-500 hover:bg-red-600 hover:text-white rounded-xl shadow-sm transition-all" title="Excluir"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogTab;
