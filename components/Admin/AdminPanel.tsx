import React, { useState, useEffect } from 'react';
import {
    Settings, FileText, Package, LayoutDashboard,
    Save, Plus, Trash2, Globe, MessageCircle,
    Instagram, Facebook, Youtube, Palette, Power,
    ArrowLeft, X, Check, Image as ImageIcon
} from 'lucide-react';
import { adminService, SiteConfig, BlogPost, ServiceData } from '../../services/adminService';
import Button from '../Button';

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'blog' | 'services'>('dashboard');
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(false);

    // Editor States
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [configData, postsData, servicesData] = await Promise.all([
            adminService.getSiteConfig(),
            adminService.getBlogPosts(),
            adminService.getServices()
        ]);
        setConfig(configData);
        setPosts(postsData);
        setServices(servicesData);
        setLoading(false);
    };

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        setLoading(true);
        const success = await adminService.updateSiteConfig(config);
        if (success) alert('Configurações salvas com sucesso!');
        setLoading(false);
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;
        setLoading(true);
        const success = await adminService.saveBlogPost(editingPost);
        if (success) {
            alert('Post salvo com sucesso!');
            setEditingPost(null);
            loadData();
        }
        setLoading(false);
    };

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        setLoading(true);
        const success = await adminService.saveService(editingService);
        if (success) {
            alert('Serviço salvo com sucesso!');
            setEditingService(null);
            loadData();
        }
        setLoading(false);
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este post?')) return;
        setLoading(true);
        const success = await adminService.deleteBlogPost(id);
        if (success) loadData();
        setLoading(false);
    };

    const inputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm";
    const labelStyles = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block";

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-gray-100 uppercase tracking-tighter">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Settings size={18} />
                        </div> MD Admin
                    </h2>
                </div>
                <nav className="p-4 space-y-2 flex-grow">
                    <button
                        onClick={() => { setActiveTab('dashboard'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => { setActiveTab('config'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Settings size={18} /> Configurações
                    </button>
                    <button
                        onClick={() => { setActiveTab('blog'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <FileText size={18} /> Blog
                    </button>
                    <button
                        onClick={() => { setActiveTab('services'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Package size={18} /> Serviços e Preços
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-10 overflow-auto">
                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <header>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Painel de Controle</h1>
                            <p className="text-gray-500 font-medium">Gestão estratégica da MD Solution.</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total de Leads</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">--</h3>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Posts no Blog</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{posts.length}</h3>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Páginas Ativas</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">5</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONFIGURAÇÕES SITE */}
                {activeTab === 'config' && config && (
                    <form onSubmit={handleSaveConfig} className="space-y-8 animate-fade-in max-w-5xl">
                        <header className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações Gerais</h1>
                                <p className="text-gray-500 font-medium">Altere informações, links e o visual do site.</p>
                            </div>
                            <Button type="submit" loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-200">
                                <Save size={18} /> Salvar Alterações
                            </Button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contato */}
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                                <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Globe size={20} /></div> Contato Principal
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className={labelStyles}>Telefone Exibido</label>
                                        <input type="text" value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className={labelStyles}>WhatsApp (Apenas Números)</label>
                                        <input type="text" value={config.whatsapp} onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })} className={inputStyles} placeholder="Ex: 5586994144709" />
                                    </div>
                                </div>
                            </div>

                            {/* Redes Sociais */}
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                                <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600"><MessageCircle size={20} /></div> Presença Digital
                                </h4>
                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className={labelStyles}>Instagram URL</label>
                                        <div className="flex items-center gap-3">
                                            <Instagram size={20} className="text-pink-600 shrink-0" />
                                            <input type="text" value={config.instagram_url} onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })} className={inputStyles} />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className={labelStyles}>Facebook URL</label>
                                        <div className="flex items-center gap-3">
                                            <Facebook size={20} className="text-blue-700 shrink-0" />
                                            <input type="text" value={config.facebook_url} onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })} className={inputStyles} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Cores */}
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                                <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><Palette size={20} /></div> Identidade Visual
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyles}>Cor Primária</label>
                                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                            <input type="color" value={config.primary_color} onChange={(e) => setConfig({ ...config, primary_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                                            <span className="text-xs font-bold text-gray-500">{config.primary_color}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Cor Secundária</label>
                                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                            <input type="color" value={config.secondary_color} onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none" />
                                            <span className="text-xs font-bold text-gray-500">{config.secondary_color}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ativação */}
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                                <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><Power size={20} /></div> Módulos do Site
                                </h4>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <span className="text-sm font-bold text-gray-900">Ativar Blog</span>
                                        <input type="checkbox" checked={config.is_blog_active} onChange={(e) => setConfig({ ...config, is_blog_active: e.checked })} className="w-6 h-6 rounded-full accent-blue-600" />
                                    </label>
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <span className="text-sm font-bold text-gray-900">Ativar Módulo SWOT</span>
                                        <input type="checkbox" checked={config.is_swot_active} onChange={(e) => setConfig({ ...config, is_swot_active: e.checked })} className="w-6 h-6 rounded-full accent-blue-600" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* BLOG EDITOR / LIST */}
                {activeTab === 'blog' && (
                    <div className="space-y-8 animate-fade-in">
                        {editingPost ? (
                            <form onSubmit={handleSavePost} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 max-w-5xl mx-auto">
                                <header className="flex justify-between items-center mb-8">
                                    <button type="button" onClick={() => setEditingPost(null)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm">
                                        <ArrowLeft size={18} /> Voltar à Lista
                                    </button>
                                    <Button type="submit" loading={loading} variant="primary" className="px-8 py-3 rounded-xl flex items-center gap-2">
                                        <Save size={18} /> Salvar Artigo
                                    </Button>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Título do Post</label>
                                            <input type="text" value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} className={inputStyles} placeholder="Ex: Por que sua empresa não vende?" required />
                                        </div>
                                        <div>
                                            <label className={labelStyles}>URL Amigável (Slug)</label>
                                            <input type="text" value={editingPost.slug} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} className={inputStyles} />
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Categoria</label>
                                            <select value={editingPost.category} onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })} className={inputStyles}>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Estratégia">Estratégia</option>
                                                <option value="Vendas">Vendas</option>
                                                <option value="Gestão">Gestão</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Imagem de Capa (URL)</label>
                                            <div className="flex gap-4">
                                                <input type="text" value={editingPost.featured_image} onChange={(e) => setEditingPost({ ...editingPost, featured_image: e.target.value })} className={inputStyles} placeholder="https://..." />
                                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                                                    {editingPost.featured_image ? <img src={editingPost.featured_image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Resumo Exibido na Lista</label>
                                            <textarea value={editingPost.excerpt} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} className={inputStyles + " h-24 resize-none"} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelStyles}>Conteúdo do Artigo (HTML / Texto)</label>
                                    <textarea value={editingPost.content} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} className={inputStyles + " h-96 font-mono text-xs"} placeholder="Seu conteúdo aqui..." required />
                                    <p className="text-[10px] text-gray-400 mt-2 italic">* Use tags HTML para formatação personalizada.</p>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <header className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Blog</h1>
                                        <p className="text-gray-500 font-medium">Crie autoridade e atraia clientes com conteúdo.</p>
                                    </div>
                                    <Button onClick={() => setEditingPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', category: 'Marketing', status: 'published' })} variant="primary" className="px-8 py-4 rounded-2xl flex items-center gap-2 shadow-lg">
                                        <Plus size={18} /> Novo Post
                                    </Button>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.length === 0 && (
                                        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-inner">
                                            <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhum post hoje.</p>
                                        </div>
                                    )}
                                    {posts.map(post => (
                                        <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                                            <div className="h-40 overflow-hidden relative">
                                                <img src={post.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                                    {post.status}
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <h3 className="font-black text-gray-900 mb-2 truncate">{post.title}</h3>
                                                <p className="text-xs text-gray-400 mb-6">{new Date(post.created_at || '').toLocaleDateString('pt-BR')}</p>
                                                <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                                                    <button onClick={() => setEditingPost(post)} className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:text-blue-700">Editar <Check size={14} /></button>
                                                    <button onClick={() => post.id && handleDeletePost(post.id)} className="text-red-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:text-red-600">Excluir <X size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SERVIÇOS E PREÇOS */}
                {activeTab === 'services' && (
                    <div className="space-y-8 animate-fade-in">
                        {editingService ? (
                            <form onSubmit={handleSaveService} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 max-w-5xl mx-auto">
                                <header className="flex justify-between items-center mb-8">
                                    <button type="button" onClick={() => setEditingService(null)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm">
                                        <ArrowLeft size={18} /> Voltar
                                    </button>
                                    <Button type="submit" loading={loading} variant="primary" className="px-8 py-3 rounded-xl flex items-center gap-2">
                                        <Save size={18} /> Salvar Serviço
                                    </Button>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Nome do Pacote/Serviço</label>
                                            <input type="text" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} className={inputStyles} placeholder="Ex: Pacote Essencial" required />
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Categoria</label>
                                            <select value={editingService.category} onChange={(e) => setEditingService({ ...editingService, category: e.target.value })} className={inputStyles}>
                                                <option value="marketing">Marketing (Social/Ads)</option>
                                                <option value="swot">Análise SWOT / Estratégia</option>
                                                <option value="gmb">Google Meu Negócio</option>
                                                <option value="sites">Sites & LPs</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Valor / Investimento</label>
                                            <input type="text" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: e.target.value })} className={inputStyles} placeholder="Ex: R$ 997/mês ou Sob Consulta" required />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Descrição (O que é?)</label>
                                            <textarea value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className={inputStyles + " h-24 resize-none"} placeholder="Breve resumo do serviço..." />
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Funcionalidades / Itens Inclusos</label>
                                            <div className="space-y-2">
                                                {editingService.features.map((f, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <input type="text" value={f} onChange={(e) => {
                                                            const newF = [...editingService.features];
                                                            newF[i] = e.target.value;
                                                            setEditingService({ ...editingService, features: newF });
                                                        }} className={inputStyles} />
                                                        <button type="button" onClick={() => {
                                                            const newF = editingService.features.filter((_, idx) => idx !== i);
                                                            setEditingService({ ...editingService, features: newF });
                                                        }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><X size={16} /></button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => setEditingService({ ...editingService, features: [...editingService.features, ''] })} className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                                                    <Plus size={14} /> Adicionar Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <header className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Serviços e Preços</h1>
                                        <p className="text-gray-500 font-medium">Controle o que é exibido nas tabelas de preços do site.</p>
                                    </div>
                                    <Button onClick={() => setEditingService({ name: '', description: '', price: '', category: 'marketing', features: [''], is_active: true, display_order: 0 })} variant="primary" className="px-8 py-4 rounded-2xl flex items-center gap-2 shadow-lg">
                                        <Plus size={18} /> Novo Pacote
                                    </Button>
                                </header>

                                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50/50 border-b border-gray-50">
                                            <tr>
                                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Serviço/Pacote</th>
                                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Valor</th>
                                                <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {services.length === 0 && (
                                                <tr><td colSpan={4} className="px-10 py-16 text-center text-gray-400 font-medium italic">Nenhum serviço cadastrado ainda.</td></tr>
                                            )}
                                            {services.map(s => (
                                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-10 py-6 font-black text-gray-900">{s.name}</td>
                                                    <td className="px-10 py-6">
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{s.category}</span>
                                                    </td>
                                                    <td className="px-10 py-6 font-bold text-gray-600 italic">{s.price}</td>
                                                    <td className="px-10 py-6 text-right space-x-3">
                                                        <button onClick={() => setEditingService(s)} className="p-3 text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all"><Save size={18} /></button>
                                                        <button className="p-3 text-red-300 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
