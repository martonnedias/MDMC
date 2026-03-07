import React, { useState, useEffect } from 'react';
import {
    Plus, Edit2, Layout, MoreVertical, Eye, Globe, Zap, ShieldCheck, Settings, ArrowRight, Clock, FileText, Trash2
} from 'lucide-react';
import { SiteConfig, adminService, CmsPage } from '../../../services/adminService';

interface PagesTabProps {
    config: SiteConfig;
    onEditPage: (pageId: string) => void;
}

const PagesTab: React.FC<PagesTabProps> = ({ config, onEditPage }) => {
    const [pages, setPages] = useState<CmsPage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        setLoading(true);
        const data = await adminService.getCmsPages();
        setPages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (confirm("Tem certeza que deseja deletar esta página?")) {
            await adminService.deleteCmsPage(id);
            fetchPages();
        }
    };

    // Add static/native pages combined with dynamic from CMS
    const allPages = [
        { id: 'landing', name: 'Página Inicial (Home)', description: 'O rosto principal do seu ecossistema digital (site_config)', status: 'published', isNative: true },
        ...pages.map(p => ({
            id: p.id!,
            name: p.title,
            description: `Slug: /${p.page_type === 'service' ? 'servicos' : 'pagina'}/${p.slug}`,
            status: p.status,
            isNative: false,
            slug: p.slug,
            page_type: p.page_type
        }))
    ];

    const getStatusColor = (status: string) => {
        return status === 'published' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50';
    };

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-gray-100">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                            <Layout size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-blue-500 tracking-[0.3em]">Gestão de Ecossistema</span>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight italic">
                        Páginas do <span className="text-blue-600">Site</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-tight text-lg max-w-2xl italic">
                        Organize a estrutura do seu site, crie novas experiências e otimize a jornada do cliente em tempo real.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onEditPage('new')}
                        className="h-16 px-10 bg-gray-900 text-white font-bold text-sm tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Criar Custom Page
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="py-20 text-center animate-pulse text-gray-400 font-bold">Carregando páginas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPages.map((page) => (
                        <div
                            key={page.id}
                            className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-blue-100 ring-1 ring-transparent hover:ring-blue-50 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 space-y-6 flex-grow">
                                <div className="flex justify-between items-start">
                                    <div className={`w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/10 group-hover:bg-blue-600 transition-colors`}>
                                        {page.isNative ? <Globe size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-bold flex items-center gap-1.5 px-2 py-1 rounded-md mb-2 uppercase ${getStatusColor(page.status)}`}>
                                            {page.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight italic line-clamp-1" title={page.name}>{page.name}</h3>
                                        {page.isNative && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] rounded-full font-black uppercase tracking-wider">Nativa</span>}
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed italic line-clamp-2 h-10">{page.description}</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex gap-3 pt-6 border-t border-gray-50 mt-4">
                                <button
                                    onClick={() => onEditPage(page.id)}
                                    className="flex-1 h-12 bg-blue-50 text-blue-600 font-bold text-xs rounded-2xl border border-blue-100 flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    title="Editar Visualmente"
                                >
                                    <Edit2 size={16} /> Editar
                                </button>

                                {page.isNative ? (
                                    <a
                                        href="/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-gray-50 text-gray-400 font-bold rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                                        title="Ver Página"
                                    >
                                        <Eye size={18} />
                                    </a>
                                ) : (
                                    <>
                                        <a
                                            href={`/${(page as any).page_type === 'service' ? 'servicos' : 'pagina'}/${(page as any).slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-gray-50 text-gray-400 font-bold rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                                            title="Ver Página"
                                        >
                                            <Eye size={18} />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(page.id)}
                                            className="w-12 h-12 bg-red-50 text-red-400 font-bold rounded-2xl border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                            title="Deletar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    <div
                        onClick={() => onEditPage('new')}
                        className="group border-4 border-dashed border-gray-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer min-h-[300px]">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-blue-300 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500">
                            <Plus size={32} />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-gray-400 tracking-tight group-hover:text-blue-900 transition-colors italic">Nova Página CMS</h3>
                            <p className="text-xs font-bold text-gray-300 group-hover:text-blue-600 tracking-[0.2em]">Crie LPs ou serviços</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagesTab;
