import React, { useState, useEffect } from 'react';
import {
    Settings, FileText, Package, LayoutDashboard,
    Save, Plus, Trash2, Globe, MessageCircle,
    Instagram, Facebook, Youtube, Palette, Power
} from 'lucide-react';
import { adminService, SiteConfig, BlogPost, ServiceData } from '../../services/adminService';
import Button from '../Button';

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'blog' | 'services'>('dashboard');
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(false);

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

    const inputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm";

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-8 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="text-blue-600" /> MD Admin
                    </h2>
                </div>
                <nav className="p-4 space-y-2 flex-grow">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Settings size={18} /> Configurações
                    </button>
                    <button
                        onClick={() => setActiveTab('blog')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <FileText size={18} /> Blog
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Package size={18} /> Serviços e Preços
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-10 overflow-auto">
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <header>
                            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, Admin</h1>
                            <p className="text-gray-500">Gerencie seu site e acompanhe seus resultados.</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total de Leads</p>
                                <h3 className="text-3xl font-black text-gray-900">--</h3>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Posts no Blog</p>
                                <h3 className="text-3xl font-black text-gray-900">{posts.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Páginas Ativas</p>
                                <h3 className="text-3xl font-black text-gray-900">4</h3>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'config' && config && (
                    <form onSubmit={handleSaveConfig} className="space-y-8 animate-fade-in max-w-4xl">
                        <header className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Configurações Gerais</h1>
                                <p className="text-gray-500">Altere informações básicas, links e cores do site.</p>
                            </div>
                            <Button type="submit" loading={loading} variant="primary" className="px-8 py-3 rounded-xl flex items-center gap-2">
                                <Save size={18} /> Salvar Alterações
                            </Button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contato */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                <h4 className="font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-gray-900">
                                    <Globe className="text-blue-600" size={20} /> Informações de Contato
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Telefone Exibido</label>
                                        <input
                                            type="text"
                                            value={config.phone}
                                            onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                                            className={inputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">WhatsApp (Apenas Números)</label>
                                        <input
                                            type="text"
                                            value={config.whatsapp}
                                            onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                                            className={inputStyles}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Redes Sociais */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                <h4 className="font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-gray-900">
                                    <MessageCircle className="text-blue-600" size={20} /> Redes Sociais
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Instagram size={18} className="text-pink-600" />
                                        <input
                                            type="text"
                                            value={config.instagram_url}
                                            onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                                            className={inputStyles}
                                            placeholder="URL Instagram"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Facebook size={18} className="text-blue-700" />
                                        <input
                                            type="text"
                                            value={config.facebook_url}
                                            onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                                            className={inputStyles}
                                            placeholder="URL Facebook"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Youtube size={18} className="text-red-600" />
                                        <input
                                            type="text"
                                            value={config.youtube_url}
                                            onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
                                            className={inputStyles}
                                            placeholder="URL YouTube"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visual */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                <h4 className="font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-gray-900">
                                    <Palette className="text-blue-600" size={20} /> Identidade Visual
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cor Primária</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="color"
                                                value={config.primary_color}
                                                onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                                className="h-10 w-10 p-0 border-none bg-transparent cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={config.primary_color}
                                                onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                                className={inputStyles}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Cor Secundária</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="color"
                                                value={config.secondary_color}
                                                onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                                className="h-10 w-10 p-0 border-none bg-transparent cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={config.secondary_color}
                                                onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                                className={inputStyles}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status das Páginas */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                <h4 className="font-bold flex items-center gap-2 border-b border-gray-50 pb-4 text-gray-900">
                                    <Power className="text-blue-600" size={20} /> Ativar/Desativar Recursos
                                </h4>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-bold text-gray-700">Ativar Módulo de Blog</span>
                                        <input
                                            type="checkbox"
                                            checked={config.is_blog_active}
                                            onChange={(e) => setConfig({ ...config, is_blog_active: e.checked })}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-bold text-gray-700">Ativar Análise SWOT</span>
                                        <input
                                            type="checkbox"
                                            checked={config.is_swot_active}
                                            onChange={(e) => setConfig({ ...config, is_swot_active: e.checked })}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {activeTab === 'blog' && (
                    <div className="space-y-8 animate-fade-in">
                        <header className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
                                <p className="text-gray-500">Crie e gerencie os artigos do seu site.</p>
                            </div>
                            <Button variant="primary" className="px-8 py-3 rounded-xl flex items-center gap-2">
                                <Plus size={18} /> Novo Post
                            </Button>
                        </header>

                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Título</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {posts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">Nenhum post encontrado.</td>
                                        </tr>
                                    ) : (
                                        posts.map(post => (
                                            <tr key={post.id}>
                                                <td className="px-8 py-4 font-bold text-gray-900">{post.title}</td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {post.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-500">{new Date(post.created_at || '').toLocaleDateString('pt-BR')}</td>
                                                <td className="px-8 py-4 text-right space-x-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Save size={18} /></button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
