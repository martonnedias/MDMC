import React, { useState, useEffect } from 'react';
import {
    Settings, FileText, Package, LayoutDashboard,
    Save, Plus, Trash2, Globe, MessageCircle,
    Instagram, Facebook, Youtube, Palette, Power,
    ArrowLeft, X, Check, Image as ImageIcon,
    LogOut, ExternalLink, Star, Sparkles, Upload, Eye, Users, Search,
    RotateCcw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminService, SiteConfig, BlogPost, ServiceData } from '../../services/adminService';
import { aiService } from '../../services/aiService';
import { PLANS, SWOT_PLANS, COMBOS_CONTENT, GMB_CONTENT } from '../../constants';
import Button from '../Button';
import RichTextEditor from './RichTextEditor';

const ORIGINAL_COLORS: Record<string, { bg: string, title: string }> = {
    hero: { bg: '#0A1931', title: '#ffffff' },
    services: { bg: '#f1f5f9', title: '#111827' },
    about: { bg: '#ffffff', title: '#111827' },
    'md-converte': { bg: '#0A1931', title: '#ffffff' },
    gmb: { bg: '#111827', title: '#ffffff' },
    ads: { bg: '#112240', title: '#ffffff' },
    sites: { bg: '#112240', title: '#ffffff' },
    swot: { bg: '#ffffff', title: '#111827' },
    diagnosis: { bg: '#f9fafb', title: '#111827' },
    consultancy: { bg: '#0052FF', title: '#ffffff' },
    footer: { bg: '#112240', title: '#ffffff' }
};

const SIZES = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'];
const REDIRECTS = [
    { label: 'Página Inicial', value: 'landing' },
    { label: 'Diagnóstico de Marketing', value: 'diagnosis' },
    { label: 'Google Business Profile', value: 'gmb' },
    { label: 'Gestão de Tráfego (Ads)', value: 'ads' },
    { label: 'Criação de Sites', value: 'sites' },
    { label: 'Consultoria Estratégica', value: 'consultancy' },
    { label: 'Análise SWOT', value: 'swot' },
    { label: 'Blog', value: 'blog' },
    { label: 'Sobre Nós', value: 'about' },
    { label: 'Serviços', value: 'services' },
];

interface AdminPanelProps {
    onNavigate?: (view: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'blog' | 'services' | 'leads'>('dashboard');
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [briefings, setBriefings] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Editor States
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [configData, postsData, servicesData, leadsData, briefingsData, statsData] = await Promise.all([
                adminService.getSiteConfig(),
                adminService.getBlogPosts(true), // Admin vê rascunhos
                adminService.getServices(),
                adminService.getLeads(),
                adminService.getBriefings(),
                adminService.getDashboardStats()
            ]);
            setConfig(configData);
            setPosts(postsData || []);
            setServices(servicesData || []);
            setLeads(leadsData || []);
            setBriefings(briefingsData || []);
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
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
            // setEditingPost(null); // Comentado para ficar na tela de edição
            loadData();
        }
        setLoading(false);
    };

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        setLoading(true);

        // Limpa features vazias antes de salvar
        const cleanedService = {
            ...editingService,
            features: editingService.features.filter(f => f.trim() !== '')
        };

        const success = await adminService.saveService(cleanedService);
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

    const handleDeleteService = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
        setLoading(true);
        const success = await adminService.deleteService(id);
        if (success) loadData();
        setLoading(false);
    };

    const handleSyncDefaults = async () => {
        if (!confirm('Isso irá importar os planos padrões das constantes do site para o banco de dados. Deseja continuar?')) return;
        setLoading(true);

        const defaults: ServiceData[] = [
            // Marketing Plans
            ...PLANS.map((p, i) => ({
                name: p.name,
                description: p.description,
                price: p.price,
                features: p.features,
                category: 'marketing',
                is_active: true,
                display_order: i,
                subtitle: p.subtitle,
                cta_text: p.ctaText,
                extra_info: p.adBudget,
                is_highlighted: p.highlight || false
            })),
            // SWOT Plans
            ...SWOT_PLANS.map((p, i) => ({
                name: p.name,
                description: p.description,
                price: p.price,
                features: p.features,
                category: 'swot',
                is_active: true,
                display_order: i + 10,
                subtitle: p.subtitle,
                badge_text: p.badge,
                is_highlighted: p.highlight || false
            })),
            // Combos
            ...COMBOS_CONTENT.map((p, i) => ({
                name: p.name,
                description: p.includes,
                price: 'Consulte-nos',
                features: [],
                category: 'combos',
                is_active: true,
                display_order: i + 20,
                extra_info: p.advantage
            })),
            // GMB
            ...GMB_CONTENT.packages.map((p, i) => ({
                name: p.name,
                description: p.description,
                price: p.price,
                features: p.features,
                category: 'gmb',
                is_active: true,
                display_order: i + 30,
                cta_text: p.cta,
                is_highlighted: p.highlight || false
            }))
        ];

        const success = await adminService.syncDefaultServices(defaults);
        if (success) {
            alert('Sincronização concluída!');
            loadData();
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        if (onNavigate) onNavigate('landing');
        else window.location.hash = '';
    };

    const handleBackToSite = () => {
        if (onNavigate) onNavigate('landing');
        else window.location.hash = '';
    };

    const handleGenerateAI = async () => {
        const topic = prompt("Sobre qual tema você quer que a IA escreva?");
        if (!topic) return;

        setLoading(true);
        const generated = await aiService.generateBlogPost(topic, editingPost?.category || 'Marketing');

        if (generated) {
            setEditingPost(prev => prev ? ({
                ...prev,
                title: generated.title,
                slug: generated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                excerpt: generated.excerpt,
                content: generated.content
            }) : null);
            alert('Conteúdo gerado com sucesso! Revise antes de salvar.');
        }
        setLoading(false);
    };

    const inputStyles = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm";
    const labelStyles = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block";

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-100 uppercase tracking-tighter">
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
                    <button
                        onClick={() => { setActiveTab('leads'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Users size={18} /> Leads e Briefings
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <button
                        onClick={handleBackToSite}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        <ExternalLink size={18} /> Voltar para o Site
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={18} /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow pt-6 px-10 pb-10 overflow-auto">
                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        <header>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Painel de Controle</h1>
                            <p className="text-gray-500 font-medium">Gestão estratégica da MD Solution.</p>
                        </header>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total de Leads</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.totalLeads || 0}</h3>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Briefings SWOT</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.totalBriefings || 0}</h3>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Posts no Blog</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.totalPosts || 0}</h3>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Serviços Ativos</p>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.activeServices || 0}</h3>
                            </div>
                        </div>

                        {/* Recent Activity Mini Tables */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                <h4 className="font-black text-lg mb-6 flex items-center justify-between">
                                    <span>Últimos Leads</span>
                                    <button onClick={() => setActiveTab('leads')} className="text-xs text-blue-600 hover:underline">Ver todos</button>
                                </h4>
                                <div className="space-y-4">
                                    {leads.slice(0, 5).map(lead => (
                                        <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{lead.data?.name || 'Lead sem nome'}</p>
                                                <p className="text-xs text-gray-500">{lead.data?.email || '-'}</p>
                                            </div>
                                            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full uppercase">{lead.type}</span>
                                        </div>
                                    ))}
                                    {leads.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum lead encontrado.</p>}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                <h4 className="font-black text-lg mb-6 flex items-center justify-between">
                                    <span>Últimos Briefings</span>
                                    <button onClick={() => setActiveTab('leads')} className="text-xs text-blue-600 hover:underline">Ver todos</button>
                                </h4>
                                <div className="space-y-4">
                                    {briefings.slice(0, 5).map(briefing => (
                                        <div key={briefing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{briefing.data?.companyName || briefing.data?.company_name || 'Empresa'}</p>
                                                <p className="text-xs text-gray-500">{briefing.data?.responsibleName || briefing.data?.name || '-'}</p>
                                            </div>
                                            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-full uppercase">{briefing.plan || 'SWOT'}</span>
                                        </div>
                                    ))}
                                    {briefings.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum briefing encontrado.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONFIGURAÇÕES SITE */}
                {activeTab === 'config' && (
                    <form onSubmit={handleSaveConfig} className="space-y-8 animate-fade-in max-w-5xl">
                        {loading && (
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-blue-800 text-sm flex items-center gap-3">
                                <Settings className="animate-spin" size={20} />
                                Carregando configurações...
                            </div>
                        )}

                        {(!config && !loading) && (
                            <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] text-center space-y-4">
                                <Settings className="mx-auto text-blue-400" size={32} />
                                <h3 className="font-bold text-blue-900">Nenhuma configuração ativa</h3>
                                <p className="text-blue-600 text-sm max-w-xs mx-auto">Você ainda não definiu as cores e contatos do site. Clique abaixo para gerar o modelo inicial.</p>
                                <Button onClick={() => setConfig({ id: 1, site_name: 'MD Solution', phone: '', whatsapp: '', facebook_url: '', instagram_url: '', youtube_url: '', primary_color: '#2563eb', secondary_color: '#f97316', is_blog_active: true, is_swot_active: true })} variant="primary">
                                    Iniciar Configuração
                                </Button>
                            </div>
                        )}

                        {config && (
                            <>
                                <header className="flex justify-between items-end">
                                    <div>
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações Gerais</h1>
                                        <p className="text-gray-500 font-medium">Altere informações, links e o visual do site.</p>
                                    </div>
                                    <Button type="submit" loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-200">
                                        <Save size={18} /> Salvar Alterações
                                    </Button>
                                </header>

                                <div className="flex justify-end mb-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Isso irá resetar todas as cores e fontes para o padrão original do tema. Deseja continuar?')) {
                                                setConfig({
                                                    ...config,
                                                    primary_color: '#0052FF',
                                                    secondary_color: '#FF6B00',
                                                    theme: {
                                                        ...config.theme,
                                                        colors: {
                                                            background: '#ffffff',
                                                            card_background: '#f9fafb',
                                                            header_background: '#ffffff',
                                                            footer_background: '#112240',
                                                            text_primary: '#111827',
                                                            text_secondary: '#6b7280'
                                                        },
                                                        typography: {
                                                            font_family: 'Inter',
                                                            heading_font: 'Poppins'
                                                        }
                                                    }
                                                });
                                            }
                                        }}
                                        className="text-xs font-bold text-gray-400 hover:text-red-500 underline decoration-dashed underline-offset-4"
                                    >
                                        Restaurar Padrões de Fábrica (Cores/Fontes)
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Contato */}
                                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                                        <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Globe size={20} /></div> Conteúdo e Logo
                                        </h4>
                                        <div className="space-y-6">
                                            <div>
                                                <label className={labelStyles}>Nome da Empresa/Site</label>
                                                <input type="text" value={config.site_name} onChange={(e) => setConfig({ ...config, site_name: e.target.value })} className={inputStyles} />
                                            </div>
                                            <div>
                                                <label className={labelStyles}>Logo do Site (URL / Upload)</label>
                                                <div className="flex gap-4 items-center">
                                                    <div className="relative flex-1">
                                                        <input type="text" value={config.logo_url || ''} onChange={(e) => setConfig({ ...config, logo_url: e.target.value })} className={inputStyles + " pr-10"} placeholder="https://..." />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const input = document.createElement('input');
                                                                input.type = 'file';
                                                                input.accept = 'image/*';
                                                                input.onchange = async (e: any) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const url = await adminService.uploadImage(file);
                                                                        if (url) setConfig({ ...config, logo_url: url });
                                                                    }
                                                                };
                                                                input.click();
                                                            }}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"
                                                        >
                                                            <Upload size={18} />
                                                        </button>
                                                    </div>
                                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                                                        {config.logo_url ? <img src={config.logo_url} className="max-h-full" /> : <ImageIcon className="text-gray-200" />}
                                                    </div>
                                                </div>
                                            </div>
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
                                                <input type="checkbox" checked={config.is_blog_active} onChange={(e) => setConfig({ ...config, is_blog_active: e.target.checked })} className="w-6 h-6 rounded-full accent-blue-600" />
                                            </label>
                                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <span className="text-sm font-bold text-gray-900">Ativar Módulo SWOT</span>
                                                <input type="checkbox" checked={config.is_swot_active} onChange={(e) => setConfig({ ...config, is_swot_active: e.target.checked })} className="w-6 h-6 rounded-full accent-blue-600" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Conteúdo Hero - Mantido */}
                                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 md:col-span-2">
                                        <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><FileText size={20} /></div> Conteúdo da Home (Hero)
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={labelStyles}>Título Principal</label>
                                                <input
                                                    type="text"
                                                    value={config.content?.hero_title || ''}
                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, hero_title: e.target.value } })}
                                                    className={inputStyles}
                                                    placeholder="Escale sua operação com Marketing e Vendas"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelStyles}>Subtítulo</label>
                                                <textarea
                                                    value={config.content?.hero_subtitle || ''}
                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, hero_subtitle: e.target.value } })}
                                                    className={`${inputStyles} h-24 resize-none`}
                                                    placeholder="Acelere seu crescimento com estratégias validadas..."
                                                />
                                            </div>
                                            <div>
                                                <label className={labelStyles}>Texto do Botão (CTA)</label>
                                                <input
                                                    type="text"
                                                    value={config.content?.hero_cta || ''}
                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, hero_cta: e.target.value } })}
                                                    className={inputStyles}
                                                    placeholder="Iniciar Diagnóstico Grátis"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelStyles}>URL da Imagem Hero</label>
                                                <input
                                                    type="text"
                                                    value={config.content?.hero_image || ''}
                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, hero_image: e.target.value } })}
                                                    className={inputStyles}
                                                    placeholder="https://images.unsplash.com/..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={labelStyles}>Cor Fundo Hero</label>
                                                    <input type="color" value={config.content?.hero_background_color || '#0A1931'} onChange={(e) => setConfig({ ...config, content: { ...config.content, hero_background_color: e.target.value } })} className="w-full h-8 rounded-lg cursor-pointer" />
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Cor Título Hero</label>
                                                    <input type="color" value={config.content?.hero_title_color || '#ffffff'} onChange={(e) => setConfig({ ...config, content: { ...config.content, hero_title_color: e.target.value } })} className="w-full h-8 rounded-lg cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customização de Seções */}
                                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 md:col-span-2">
                                        <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600"><LayoutDashboard size={20} /></div> Customização de Seções
                                        </h4>

                                        <div className="space-y-8">
                                            {['hero', 'services', 'swot', 'ads', 'gmb', 'sites', 'about', 'md-converte', 'diagnosis', 'consultancy', 'footer'].map((sectionKey) => (
                                                <div key={sectionKey} className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
                                                    <h5 className="font-black text-gray-900 mb-4 flex items-center gap-2 capitalize">
                                                        <div className={`w-2 h-2 rounded-full ${sectionKey === 'services' ? 'bg-blue-500' : sectionKey === 'swot' ? 'bg-orange-500' : 'bg-gray-400'}`}></div> Seção {sectionKey}
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        <div className="col-span-full md:col-span-1 lg:col-span-1 border-b pb-4 mb-2">
                                                            <label className="flex items-center justify-between cursor-pointer group">
                                                                <span className="text-sm font-black text-gray-900 uppercase">Seção Ativa</span>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={config.content?.sections?.[sectionKey]?.is_active !== false}
                                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], is_active: e.target.checked } } } })}
                                                                    className="w-6 h-6 rounded-full accent-blue-600"
                                                                />
                                                            </label>
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Título</label>
                                                            <input
                                                                type="text"
                                                                value={config.content?.sections?.[sectionKey]?.title || ''}
                                                                onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], title: e.target.value } } } })}
                                                                className={inputStyles}
                                                                placeholder="Título da Seção"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Subtítulo / Descrição</label>
                                                            <input
                                                                type="text"
                                                                value={config.content?.sections?.[sectionKey]?.subtitle || config.content?.sections?.[sectionKey]?.description || ''}
                                                                onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], subtitle: e.target.value } } } })}
                                                                className={inputStyles}
                                                                placeholder="Subtítulo ou breve descrição"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Imagem da Seção</label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={config.content?.sections?.[sectionKey]?.image_url || ''}
                                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], image_url: e.target.value } } } })}
                                                                    className={inputStyles}
                                                                    placeholder="URL da Imagem"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const input = document.createElement('input');
                                                                        input.type = 'file';
                                                                        input.accept = 'image/*';
                                                                        input.onchange = async (e: any) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const url = await adminService.uploadImage(file);
                                                                                if (url) setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], image_url: url } } } });
                                                                            }
                                                                        };
                                                                        input.click();
                                                                    }}
                                                                    className="p-3 bg-white border border-gray-200 rounded-2xl text-blue-500 hover:bg-gray-50 shadow-sm"
                                                                    title="Upload de Imagem"
                                                                >
                                                                    <Upload size={18} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Fonte (Google Fonts)</label>
                                                            <select
                                                                value={config.content?.sections?.[sectionKey]?.font_family || ''}
                                                                onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], font_family: e.target.value } } } })}
                                                                className={inputStyles}
                                                                style={{ fontFamily: config.content?.sections?.[sectionKey]?.font_family }}
                                                            >
                                                                <option value="">Fonte Padrão</option>
                                                                <option value="Inter">Inter (Padrão)</option>
                                                                <option value="Poppins">Poppins</option>
                                                                <option value="Montserrat">Montserrat</option>
                                                                <option value="Open Sans">Open Sans</option>
                                                                <option value="Playfair Display">Playfair Display (Serif)</option>
                                                                <option value="Ubuntu">Ubuntu</option>
                                                                <option value="Sora">Sora</option>
                                                                <option value="Roboto">Roboto</option>
                                                                <option value="Outfit">Outfit</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Tamanho Título</label>
                                                            <select
                                                                value={config.content?.sections?.[sectionKey]?.font_size_title || ''}
                                                                onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], font_size_title: e.target.value } } } })}
                                                                className={inputStyles}
                                                            >
                                                                <option value="">Padrão</option>
                                                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Tamanho Subtítulo</label>
                                                            <select
                                                                value={config.content?.sections?.[sectionKey]?.font_size_subtitle || ''}
                                                                onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], font_size_subtitle: e.target.value } } } })}
                                                                className={inputStyles}
                                                            >
                                                                <option value="">Padrão</option>
                                                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className={labelStyles}>Redirecionamento do Botão</label>
                                                            <select
                                                                value={config.content?.sections?.[sectionKey]?.button_redirect || ''}
                                                                onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], button_redirect: e.target.value } } } })}
                                                                className={inputStyles}
                                                            >
                                                                <option value="">Nenhum / Link Manual</option>
                                                                {REDIRECTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                                            </select>
                                                        </div>

                                                        {!config.content?.sections?.[sectionKey]?.button_redirect && (
                                                            <div>
                                                                <label className={labelStyles}>Link Manual do Botão</label>
                                                                <input
                                                                    type="text"
                                                                    value={config.content?.sections?.[sectionKey]?.button_link || ''}
                                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], button_link: e.target.value } } } })}
                                                                    className={inputStyles}
                                                                    placeholder="/link-slug"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <label className={labelStyles + " mb-0"}>Cor Fundo</label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], background_color: ORIGINAL_COLORS[sectionKey]?.bg || '#ffffff' } } } })}
                                                                        className="text-[9px] font-black uppercase text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                                                        title="Redefinir para padrão"
                                                                    >
                                                                        <RotateCcw size={10} /> Reset
                                                                    </button>
                                                                </div>
                                                                <input type="color" value={config.content?.sections?.[sectionKey]?.background_color || ORIGINAL_COLORS[sectionKey]?.bg || '#ffffff'} onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], background_color: e.target.value } } } })} className="w-full h-8 rounded-lg cursor-pointer" />
                                                            </div>
                                                            <div>
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <label className={labelStyles + " mb-0"}>Cor Título</label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], title_color: ORIGINAL_COLORS[sectionKey]?.title || '#000000' } } } })}
                                                                        className="text-[9px] font-black uppercase text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                                                        title="Redefinir para padrão"
                                                                    >
                                                                        <RotateCcw size={10} /> Reset
                                                                    </button>
                                                                </div>
                                                                <input type="color" value={config.content?.sections?.[sectionKey]?.title_color || ORIGINAL_COLORS[sectionKey]?.title || '#000000'} onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], title_color: e.target.value } } } })} className="w-full h-8 rounded-lg cursor-pointer" />
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-4 col-span-full border-t pt-4 mt-2">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={config.content?.sections?.[sectionKey]?.show_social_icons !== false}
                                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], show_social_icons: e.target.checked } } } })}
                                                                    className="w-4 h-4 rounded accent-blue-600"
                                                                />
                                                                <span className="text-xs font-bold text-gray-500 uppercase">Mostrar Redes Sociais</span>
                                                            </label>

                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={config.content?.sections?.[sectionKey]?.show_share_menu !== false}
                                                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, sections: { ...config.content?.sections, [sectionKey]: { ...config.content?.sections?.[sectionKey], show_share_menu: e.target.checked } } } })}
                                                                    className="w-4 h-4 rounded accent-blue-600"
                                                                />
                                                                <span className="text-xs font-bold text-gray-500 uppercase">Mostrar Menu Compartilhar</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Aparência Avançada */}
                                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 md:col-span-2">
                                        <h4 className="font-black text-lg flex items-center gap-3 border-b border-gray-50 pb-6 text-gray-900">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Palette size={20} /></div> Personalização Avançada
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h5 className="font-bold text-sm text-gray-900 uppercase tracking-widest border-b pb-2">Cores Globais</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelStyles}>Fundo da Página</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={config.theme?.colors?.background || '#ffffff'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, background: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                            <span className="text-xs text-gray-500">{config.theme?.colors?.background || '#ffffff'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={labelStyles}>Topo da Página</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={config.theme?.colors?.top_background || '#ffffff'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, top_background: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                            <span className="text-xs text-gray-500">{config.theme?.colors?.top_background || '#ffffff'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={labelStyles}>Meio da Página</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={config.theme?.colors?.mid_background || '#ffffff'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, mid_background: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                            <span className="text-xs text-gray-500">{config.theme?.colors?.mid_background || '#ffffff'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={labelStyles}>Cabeçalho</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={config.theme?.colors?.header_background || '#ffffff'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, header_background: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                            <span className="text-xs text-gray-500">{config.theme?.colors?.header_background || '#ffffff'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={labelStyles}>Rodapé</label>
                                                        <div className="flex items-center gap-2">
                                                            <input type="color" value={config.theme?.colors?.footer_background || '#112240'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, footer_background: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                            <span className="text-xs text-gray-500">{config.theme?.colors?.footer_background || '#112240'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h5 className="font-bold text-sm text-gray-900 uppercase tracking-widest border-b pb-2">Tipografia Global</h5>
                                                <div>
                                                    <label className={labelStyles}>Cor do Título Global</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="color" value={config.theme?.colors?.title_color || '#111827'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, title_color: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                        <span className="text-xs text-gray-500">{config.theme?.colors?.title_color || '#111827'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Cor do Subtítulo Global</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="color" value={config.theme?.colors?.subtitle_color || '#6b7280'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, colors: { ...config.theme?.colors, subtitle_color: e.target.value } as any } })} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                                        <span className="text-xs text-gray-500">{config.theme?.colors?.subtitle_color || '#6b7280'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Fonte Principal (Google Fonts)</label>
                                                    <select
                                                        value={config.theme?.typography?.font_family || 'Inter'}
                                                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, font_family: e.target.value } as any } })}
                                                        className={inputStyles}
                                                    >
                                                        <option value="Inter">Inter</option>
                                                        <option value="Poppins">Poppins</option>
                                                        <option value="Montserrat">Montserrat</option>
                                                        <option value="Open Sans">Open Sans</option>
                                                        <option value="Playfair Display">Playfair Display</option>
                                                        <option value="Ubuntu">Ubuntu</option>
                                                        <option value="Sora">Sora</option>
                                                        <option value="Roboto">Roboto</option>
                                                        <option value="Outfit">Outfit</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-4">
                                                    <div>
                                                        <label className={labelStyles}>Tamanho Base</label>
                                                        <input type="text" value={config.theme?.typography?.base_font_size || '1rem'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, base_font_size: e.target.value } as any } })} className={inputStyles} placeholder="Ex: 16px" />
                                                    </div>
                                                    <div>
                                                        <label className={labelStyles}>Tamanho Títulos</label>
                                                        <input type="text" value={config.theme?.typography?.heading_font_size || '3rem'} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, heading_font_size: e.target.value } as any } })} className={inputStyles} placeholder="Ex: 3rem" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                )}

                {/* BLOG EDITOR / LIST */}
                {activeTab === 'blog' && (
                    <div className="space-y-8 animate-fade-in">
                        {editingPost ? (
                            <form onSubmit={handleSavePost} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 max-w-5xl mx-auto">
                                <header className="flex justify-between items-center mb-8">
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setEditingPost(null)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-bold text-sm">
                                            <ArrowLeft size={18} /> Voltar à Lista
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleGenerateAI}
                                            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-bold text-sm bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 hover:bg-purple-100 hover:border-purple-200"
                                        >
                                            <Sparkles size={16} /> Criar com IA
                                        </button>
                                    </div>
                                    <Button type="submit" loading={loading} variant="primary" className="px-8 py-3 rounded-xl flex items-center gap-2">
                                        <Save size={18} /> Salvar Artigo
                                    </Button>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Título do Post</label>
                                            <input type="text" value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })} className={inputStyles} placeholder="Ex: Por que sua empresa não vende?" required />
                                        </div>
                                        <div>
                                            <label className={labelStyles}>URL Amigável (Slug)</label>
                                            <input type="text" value={editingPost.slug} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} className={inputStyles} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelStyles}>Categoria</label>
                                                <select value={editingPost.category} onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })} className={inputStyles}>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Estratégia">Estratégia</option>
                                                    <option value="Vendas">Vendas</option>
                                                    <option value="Gestão">Gestão</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelStyles}>Status</label>
                                                <select value={editingPost.status} onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })} className={inputStyles}>
                                                    <option value="published">Publicado</option>
                                                    <option value="draft">Rascunho</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Imagem de Capa (URL / Upload)</label>
                                            <div className="flex gap-4 items-center">
                                                <div className="relative flex-1">
                                                    <input type="text" value={editingPost.featured_image || ''} onChange={(e) => setEditingPost({ ...editingPost, featured_image: e.target.value })} className={inputStyles + " pr-10"} placeholder="https://..." />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const input = document.createElement('input');
                                                            input.type = 'file';
                                                            input.accept = 'image/*';
                                                            input.onchange = async (e: any) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const url = await adminService.uploadImage(file);
                                                                    if (url) setEditingPost({ ...editingPost, featured_image: url });
                                                                }
                                                            };
                                                            input.click();
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700"
                                                    >
                                                        <Upload size={18} />
                                                    </button>
                                                </div>
                                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden shadow-sm">
                                                    {editingPost.featured_image ? <img src={editingPost.featured_image} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="text-gray-300" />}
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
                                    <label className={labelStyles}>Conteúdo do Artigo (Editor Visual)</label>
                                    <RichTextEditor
                                        value={editingPost.content}
                                        onChange={(val) => setEditingPost({ ...editingPost, content: val })}
                                        placeholder="Escreva seu artigo aqui..."
                                    />
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Blog</h1>
                                        <p className="text-gray-500 font-medium">Crie autoridade e atraia clientes com conteúdo.</p>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <div className="relative flex-1 md:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder="Buscar posts..."
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                onChange={(e) => {
                                                    const term = e.target.value.toLowerCase();
                                                    // Aqui poderíamos filtrar o estado local 'posts'
                                                }}
                                            />
                                        </div>
                                        <Button onClick={() => setEditingPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', category: 'Marketing', status: 'published' })} variant="primary" className="px-8 py-3 rounded-2xl flex items-center gap-2 shadow-lg whitespace-nowrap">
                                            <Plus size={18} /> Novo Post
                                        </Button>
                                    </div>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.map(post => (
                                        <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="h-40 overflow-hidden relative">
                                                <img src={post.featured_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                                    {post.status}
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <h3 className="font-black text-gray-900 mb-2 truncate">{post.title}</h3>
                                                <p className="text-xs text-gray-400 mb-6">{new Date(post.created_at || '').toLocaleDateString('pt-BR')}</p>
                                                <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                                                    <div className="flex gap-4">
                                                        <button onClick={() => setEditingPost(post)} className="text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-blue-700 transition-colors">
                                                            <Settings size={14} /> Editar
                                                        </button>
                                                        <button onClick={() => post.slug && onNavigate && onNavigate('blog-post', { slug: post.slug })} className="text-purple-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-purple-700 transition-colors">
                                                            <Eye size={14} /> Ver
                                                        </button>
                                                    </div>
                                                    <button onClick={() => post.id && handleDeletePost(post.id)} className="text-red-300 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} /> Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {posts.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 italic">Nenhum post encontrado.</div>}
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
                                            <label className={labelStyles}>Nome do Serviço/Pacote</label>
                                            <input type="text" value={editingService.name} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} className={inputStyles} placeholder="Ex: Pacote Essencial" required />
                                        </div>
                                        <div>
                                            <label className={labelStyles}>Categoria</label>
                                            <select value={editingService.category} onChange={(e) => setEditingService({ ...editingService, category: e.target.value })} className={inputStyles}>
                                                <option value="marketing">Marketing (Social/Ads)</option>
                                                <option value="swot">Análise SWOT / Estratégia</option>
                                                <option value="gmb">Google Meu Negócio</option>
                                                <option value="sites">Sites & LPs</option>
                                                <option value="combos">Combos (Combinações)</option>
                                                <option value="consultancy">Consultoria</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelStyles}>Valor / Investimento</label>
                                                <input type="text" value={editingService.price} onChange={(e) => setEditingService({ ...editingService, price: e.target.value })} className={inputStyles} placeholder="Ex: R$ 997/mês" required />
                                            </div>
                                            <div>
                                                <label className={labelStyles}>Ordem de Exibição</label>
                                                <input type="number" value={editingService.display_order} onChange={(e) => setEditingService({ ...editingService, display_order: parseInt(e.target.value) })} className={inputStyles} />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-6">
                                            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                                <Star size={14} className="text-brand-orange" /> Refinamento Estético
                                            </h4>

                                            <div>
                                                <label className={labelStyles}>Subtítulo (Curto)</label>
                                                <input type="text" value={editingService.subtitle || ''} onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })} className={inputStyles} placeholder="Ex: Presença que funciona" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={labelStyles}>Texto do Botão (CTA)</label>
                                                    <input type="text" value={editingService.cta_text || ''} onChange={(e) => setEditingService({ ...editingService, cta_text: e.target.value })} className={inputStyles} placeholder="Ex: Quero este Plano" />
                                                </div>
                                                <div>
                                                    <label className={labelStyles}>Selo/Badge</label>
                                                    <input type="text" value={editingService.badge_text || ''} onChange={(e) => setEditingService({ ...editingService, badge_text: e.target.value })} className={inputStyles} placeholder="Ex: Mais Procurado" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelStyles}>Info Extra (Verba / Vantagem)</label>
                                                <input type="text" value={editingService.extra_info || ''} onChange={(e) => setEditingService({ ...editingService, extra_info: e.target.value })} className={inputStyles} placeholder="Ex: Verba sugerida R$ 750/mês" />
                                            </div>

                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" checked={editingService.is_highlighted} onChange={(e) => setEditingService({ ...editingService, is_highlighted: e.target.checked })} className="w-5 h-5 rounded-lg accent-blue-600" />
                                                <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Destacar este card no site</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelStyles}>Descrição Completa</label>
                                            <textarea value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className={inputStyles + " h-32 resize-none"} placeholder="Descreva os benefícios do serviço..." />
                                        </div>

                                        <div>
                                            <label className={labelStyles}>Componentes do Pacote (Features)</label>
                                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {editingService.features.map((feature, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const newFeatures = [...editingService.features];
                                                                newFeatures[index] = e.target.value;
                                                                setEditingService({ ...editingService, features: newFeatures });
                                                            }}
                                                            className={inputStyles}
                                                            placeholder="Ex: Gestão de 3 redes sociais"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newFeatures = editingService.features.filter((_, i) => i !== index);
                                                                setEditingService({ ...editingService, features: newFeatures });
                                                            }}
                                                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingService({ ...editingService, features: [...editingService.features, ''] })}
                                                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-xs hover:border-blue-400 hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> Adicionar Componente
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <ServicesTab services={services} onEdit={setEditingService} onDelete={handleDeleteService} onSync={handleSyncDefaults} onNew={() => setEditingService({ name: '', category: 'marketing', price: '', description: '', features: [''], display_order: 0, is_active: true, is_highlighted: false, subtitle: '', cta_text: '', badge_text: '', extra_info: '' })} />
                        )}
                    </div>
                )}

                {/* LEADS E BRIEFINGS */}
                {activeTab === 'leads' && (
                    <div className="space-y-8 animate-fade-in">
                        <header>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Leads e Briefings</h1>
                            <p className="text-gray-500 font-medium">Controle de contatos recebidos.</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                                    <MessageCircle className="text-blue-600" /> Contatos do Rodapé
                                </h3>
                                <div className="space-y-4">
                                    {leads.map(lead => (
                                        <div key={lead.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900">{lead.data?.name || 'Cliente'}</h4>
                                                <span className="text-[10px] text-gray-400">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{lead.data?.email} | {lead.data?.phone}</p>
                                        </div>
                                    ))}
                                    {leads.length === 0 && <p className="text-gray-400 text-center py-8 italic">Nenhum lead.</p>}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                                    <FileText className="text-orange-600" /> Briefings SWOT
                                </h3>
                                <div className="space-y-4">
                                    {briefings.map(briefing => (
                                        <div key={briefing.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900">{briefing.data?.companyName || 'Empresa'}</h4>
                                                <span className="text-[10px] text-gray-400">{new Date(briefing.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{briefing.data?.email}</p>
                                        </div>
                                    ))}
                                    {briefings.length === 0 && <p className="text-gray-400 text-center py-8 italic">Nenhum briefing.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Componente auxiliar para a tab de serviços
const ServicesTab: React.FC<{ services: ServiceData[], onEdit: (s: ServiceData) => void, onDelete: (id: string) => void, onSync: () => void, onNew: () => void }> = ({ services, onEdit, onDelete, onSync, onNew }) => {
    const [sortKey, setSortKey] = useState<'order' | 'price' | 'name'>('order');

    // Group services
    const categories: Record<string, string> = {
        'marketing': 'Marketing & Tráfego',
        'swot': 'Análise SWOT & Estratégia',
        'gmb': 'Google Meu Negócio',
        'sites': 'Sites & Landing Pages',
        'combos': 'Combos & Pacotes',
        'consultancy': 'Consultoria Avulsa'
    };

    const getSortedServices = (list: ServiceData[]) => {
        return [...list].sort((a, b) => {
            if (sortKey === 'name') return a.name.localeCompare(b.name);
            if (sortKey === 'order') return (a.display_order || 0) - (b.display_order || 0);
            // Simple string price compare isn't perfect but works for now, ideal would be numeric parsing
            if (sortKey === 'price') return a.price.localeCompare(b.price);
            return 0;
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Serviços e Preços</h1>
                    <p className="text-gray-500 font-medium">Controle o que é exibido nas tabelas de preços do site.</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <div className="bg-white border p-1 rounded-xl flex">
                        <button onClick={() => setSortKey('order')} className={`px-3 py-2 rounded-lg text-xs font-bold ${sortKey === 'order' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>Ordem</button>
                        <button onClick={() => setSortKey('name')} className={`px-3 py-2 rounded-lg text-xs font-bold ${sortKey === 'name' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>Nome</button>
                    </div>
                    <Button onClick={onSync} variant="outline" className="px-6 py-4 rounded-2xl flex items-center gap-2 !border-gray-200 !text-gray-600 hover:!bg-gray-50 bg-white">
                        <Globe size={18} className="text-brand-blue" /> Sincronizar Padrões
                    </Button>
                    <Button onClick={onNew} variant="primary" className="px-8 py-4 rounded-2xl flex items-center gap-2 shadow-lg">
                        <Plus size={18} /> Novo Pacote
                    </Button>
                </div>
            </header>

            {Object.entries(categories).map(([key, label]) => {
                const categoryServices = getSortedServices(services.filter(s => s.category === key));
                if (categoryServices.length === 0) return null;

                return (
                    <div key={key} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8">
                        <div className="px-10 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <h3 className="font-black text-gray-700 uppercase tracking-widest text-sm">{label}</h3>
                            <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-600 font-bold">{categoryServices.length} itens</span>
                        </div>
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-50">
                                {categoryServices.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-10 py-6 font-black text-gray-900 w-1/3">
                                            <div className="flex items-center gap-2">
                                                {s.name}
                                                {s.is_highlighted && <Star size={12} className="text-brand-orange fill-brand-orange" />}
                                            </div>
                                            {s.subtitle && <p className="text-[10px] text-gray-400 font-normal uppercase mt-1">{s.subtitle}</p>}
                                        </td>
                                        <td className="px-10 py-6 w-1/3">
                                            <p className="font-bold text-gray-600 italic">{s.price}</p>
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-3">
                                            <button onClick={() => onEdit(s)} className="p-3 text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Editar"><Settings size={18} /></button>
                                            <button onClick={() => s.id && onDelete(s.id)} className="p-3 text-red-300 hover:text-red-500 rounded-xl transition-all" title="Excluir"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
            {services.length === 0 && (
                <div className="px-10 py-16 text-center text-gray-400 font-medium italic">Nenhum serviço cadastrado ainda.</div>
            )}
        </div>
    );
};
