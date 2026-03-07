import React, { useState, useEffect } from 'react';
import { Save, Layout, ChevronLeft, Globe, Settings } from 'lucide-react';
import { adminService, CmsPage } from '../../../services/adminService';
import Button from '../../Button';
import RichTextEditor from '../RichTextEditor';

interface CmsPageEditorTabProps {
    pageId: string;
    onBack: () => void;
}

const CmsPageEditorTab: React.FC<CmsPageEditorTabProps> = ({ pageId, onBack }) => {
    const [page, setPage] = useState<Partial<CmsPage>>({
        title: '',
        slug: '',
        page_type: 'generic',
        content_html: '',
        status: 'draft',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pageId && pageId !== 'new') {
            loadPage();
        }
    }, [pageId]);

    const loadPage = async () => {
        setLoading(true);
        const pages = await adminService.getCmsPages();
        const found = pages.find(p => p.id === pageId);
        if (found) setPage(found);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // auto format slug if not provided correctly
        const formattedSlug = (page.slug || page.title || '').normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const payload = { ...page, slug: formattedSlug };

        const success = await adminService.saveCmsPage(payload);
        if (success) {
            alert('Página salva com sucesso!');
            adminService.triggerRebuild();
            onBack();
        } else {
            alert('Erro ao salvar página. Verifique se o slug já existe.');
        }
        setLoading(false);
    };

    const inputStyles = "w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium hover:bg-white";
    const labelStyles = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block";

    if (loading) return <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Carregando editor...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 mb-4 transition-colors text-[10px] font-black uppercase tracking-widest">
                        <ChevronLeft size={16} /> Voltar para Páginas
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black">
                            <Layout size={16} />
                        </div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{pageId === 'new' ? 'Nova Página' : 'Editar Página'}</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{page.title || 'Sem Título'}</h1>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleSave} loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl">
                        <Save size={18} /> Salvar e Publicar
                    </Button>
                </div>
            </header>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Edit Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <label className={labelStyles}>Título da Página</label>
                            <input
                                type="text"
                                value={page.title}
                                onChange={e => setPage({ ...page, title: e.target.value })}
                                className={inputStyles}
                                required
                                placeholder="Ex: Quem Somos"
                            />
                        </div>

                        <div>
                            <label className={labelStyles}>URL Slug</label>
                            <div className="flex items-center">
                                <span className="px-4 bg-gray-100 border border-gray-200 border-r-0 rounded-l-2xl h-[54px] flex items-center text-gray-400 text-sm">/pagina/</span>
                                <input
                                    type="text"
                                    value={page.slug}
                                    onChange={e => setPage({ ...page, slug: e.target.value })}
                                    className={`${inputStyles} rounded-l-none`}
                                    placeholder="quem-somos"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyles}>Conteúdo Principal</label>
                            <RichTextEditor
                                value={page.content_html || ''}
                                onChange={val => setPage({ ...page, content_html: val })}
                                placeholder="Escreva o conteúdo da página..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Configuration */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings size={20} className="text-gray-400" />
                            <h3 className="font-bold text-gray-900">Configurações</h3>
                        </div>

                        <div>
                            <label htmlFor="cms-status" className={labelStyles}>Status de Publicação</label>
                            <select
                                id="cms-status"
                                title="Status de Publicação"
                                value={page.status}
                                onChange={e => setPage({ ...page, status: e.target.value as 'draft' | 'published' })}
                                className={inputStyles}
                            >
                                <option value="draft">Rascunho</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="cms-type" className={labelStyles}>Tipo de Página</label>
                            <select
                                id="cms-type"
                                title="Tipo de Página"
                                value={page.page_type}
                                onChange={e => setPage({ ...page, page_type: e.target.value as 'generic' | 'service' })}
                                className={inputStyles}
                            >
                                <option value="generic">Página Simples (Text/Image)</option>
                                <option value="service">Página de Serviços Estratégicos</option>
                            </select>
                        </div>
                        {page.page_type === 'service' && (
                            <div className="pt-4 border-t border-gray-100">
                                <label className={labelStyles}>Chave Relacional (service_page_key)</label>
                                <input
                                    type="text"
                                    value={page.service_page_key || ''}
                                    onChange={e => setPage({ ...page, service_page_key: e.target.value })}
                                    className={inputStyles}
                                    placeholder="Ex: sites, gmb, ads..."
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-bold italic">Os cards vinculados à esta 'page' no Admin &gt; Serviços irão aparecer nesta página dinamicamente.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe size={20} className="text-gray-400" />
                            <h3 className="font-bold text-gray-900">SEO Básico</h3>
                        </div>

                        <div>
                            <label className={labelStyles}>Meta Título</label>
                            <input
                                type="text"
                                value={page.meta_title || ''}
                                onChange={e => setPage({ ...page, meta_title: e.target.value })}
                                className={inputStyles}
                                placeholder="Max 60 chars"
                            />
                        </div>

                        <div>
                            <label className={labelStyles}>Meta Descrição</label>
                            <textarea
                                value={page.meta_description || ''}
                                onChange={e => setPage({ ...page, meta_description: e.target.value })}
                                className={inputStyles}
                                rows={3}
                                placeholder="Max 160 chars"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CmsPageEditorTab;
