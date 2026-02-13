import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2, Layout, Type, Image as ImageIcon, Palette, DollarSign, List, MessageCircle, HelpCircle, ChevronDown, ChevronUp, CheckCircle, Target, Zap } from 'lucide-react';
import { SiteConfig, ServiceData } from '../../../services/adminService';
import Button from '../../Button';

interface PageEditorTabProps {
    pageId: string;
    pageName: string;
    config: SiteConfig;
    services: ServiceData[];
    setConfig: (config: SiteConfig) => void;
    onSave: (e: React.FormEvent) => void;
    onEditService: (service: ServiceData) => void;
    onDeleteService: (id: string) => void;
    onNewService: (page: string, section: string) => void;
    loading: boolean;
}

const PageEditorTab: React.FC<PageEditorTabProps> = ({
    pageId, pageName, config, services, setConfig, onSave,
    onEditService, onDeleteService, onNewService, loading
}) => {
    const sectionConfig = config.content?.sections?.[pageId] || {};
    const [expandedBlock, setExpandedBlock] = useState<string | null>('hero');

    const updateSectionConfig = (key: string, value: any) => {
        const newSections = {
            ...config.content?.sections,
            [pageId]: { ...sectionConfig, [key]: value }
        };
        setConfig({
            ...config,
            content: { ...config.content, sections: newSections }
        });
    };

    const toggleBlock = (block: string) => {
        setExpandedBlock(expandedBlock === block ? null : block);
    };

    const inputStyles = "w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium hover:bg-white";
    const labelStyles = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block";

    const renderServiceList = (sectionId: string, title: string, icon: any) => {
        // Fallback filtering in case page/section_id columns are missing in DB
        const sectionServices = services
            .filter(s => {
                const matchPage = s.page === pageId || (!s.page && (
                    (pageId === 'consultancy' && s.category === 'consultoria') ||
                    (pageId === 'ads' && s.category === 'marketing') ||
                    (s.category === pageId)
                ));

                const matchSection = s.section_id === sectionId || (!s.section_id && sectionId === 'pricing');

                return matchPage && matchSection;
            })
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        return (
            <div className="mt-8 border rounded-[2rem] overflow-hidden border-gray-100 bg-white shadow-sm">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                            {React.createElement(icon, { size: 18 })}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">{title}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sectionServices.length} Itens Cadastrados</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => onNewService(pageId, sectionId)}
                        variant="outline"
                        className="h-10 px-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
                    >
                        <Plus size={14} /> Novo Item
                    </Button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionServices.map(service => (
                        <div key={service.id} className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-blue-100 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <h5 className="font-bold text-gray-900 line-clamp-1">{service.name}</h5>
                                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{service.price || 'Free'}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{service.description}</p>
                            <div className="flex gap-2 border-t border-gray-50 pt-3">
                                <button
                                    onClick={() => onEditService(service)}
                                    className="flex-1 flex justify-center items-center gap-2 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                                >
                                    <Edit2 size={12} /> Editar
                                </button>
                                <button
                                    onClick={() => service.id && onDeleteService(service.id)}
                                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {sectionServices.length === 0 && (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                            <p className="text-gray-400 text-xs font-bold italic">Nenhum item nesta seção.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderSectionHeaderConfig = (prefix: string, defaultTitle: string, defaultSub: string) => (
        <div className="grid grid-cols-1 gap-6 mb-8 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100">
            <div>
                <label className={labelStyles}>Título da Seção</label>
                <input
                    type="text"
                    value={sectionConfig[`${prefix}_title`] || ''}
                    onChange={(e) => updateSectionConfig(`${prefix}_title`, e.target.value)}
                    className={inputStyles}
                    placeholder={defaultTitle}
                />
            </div>
            <div>
                <label className={labelStyles}>Subtítulo / Descrição</label>
                <textarea
                    rows={2}
                    value={sectionConfig[`${prefix}_subtitle`] || ''}
                    onChange={(e) => updateSectionConfig(`${prefix}_subtitle`, e.target.value)}
                    className={inputStyles}
                    placeholder={defaultSub}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-black text-xs">
                            {pageId.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.3em]">Editor de Página</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{pageName}</h1>
                    <p className="text-gray-500 font-medium tracking-tight mt-2">Gerencie textos, design e todos os blocos de conteúdo desta página.</p>
                </div>
                <Button onClick={onSave} loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-200 text-sm">
                    <Save size={18} /> Salvar Alterações
                </Button>
            </header>

            {/* HERO CONFIG */}
            <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedBlock === 'hero' ? 'bg-white border-blue-100 ring-4 ring-blue-50/50' : 'bg-white border-gray-100'}`}>
                <button
                    onClick={() => toggleBlock('hero')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Layout size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Hero Section</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Cabeçalho e Promessa Principal</p>
                        </div>
                    </div>
                    {expandedBlock === 'hero' ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-gray-300" />}
                </button>

                {expandedBlock === 'hero' && (
                    <div className="p-8 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                        <div className="space-y-6">
                            <div>
                                <label className={labelStyles}>Título Principal (H1)</label>
                                <textarea
                                    rows={3}
                                    value={sectionConfig.title || ''}
                                    onChange={(e) => updateSectionConfig('title', e.target.value)}
                                    className={inputStyles}
                                    placeholder="Ex: Sua empresa merece..."
                                />
                                <p className="text-[10px] text-gray-400 mt-2">Aceita HTML simples como &lt;span&gt;</p>
                            </div>
                            <div>
                                <label className={labelStyles}>Subtítulo / Descrição</label>
                                <textarea
                                    rows={4}
                                    value={sectionConfig.subtitle || ''}
                                    onChange={(e) => updateSectionConfig('subtitle', e.target.value)}
                                    className={inputStyles}
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className={labelStyles}>Texto do Botão CTA</label>
                                <input
                                    type="text"
                                    value={sectionConfig.button_text || ''}
                                    onChange={(e) => updateSectionConfig('button_text', e.target.value)}
                                    className={inputStyles}
                                />
                            </div>
                            <div>
                                <label className={labelStyles}>Imagem de Capa (URL)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={sectionConfig.image_url || ''}
                                        onChange={(e) => updateSectionConfig('image_url', e.target.value)}
                                        className={inputStyles}
                                        placeholder="https://..."
                                    />
                                    <div className="w-14 h-14 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                        {sectionConfig.image_url ? <img src={sectionConfig.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyles}>Cor do Título</label>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <input
                                            type="color"
                                            value={sectionConfig.title_color || '#000000'}
                                            onChange={(e) => updateSectionConfig('title_color', e.target.value)}
                                            className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer"
                                        />
                                        <span className="text-xs font-mono text-gray-500">{sectionConfig.title_color}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyles}>Fonte Específica</label>
                                    <select
                                        value={sectionConfig.font_family || ''}
                                        onChange={(e) => updateSectionConfig('font_family', e.target.value)}
                                        className={inputStyles + " py-3"}
                                    >
                                        <option value="">Padrão do Site</option>
                                        <option value="Inter">Inter</option>
                                        <option value="Poppins">Poppins</option>
                                        <option value="Montserrat">Montserrat</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PROBLEM / PAIN POINTS */}
            <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedBlock === 'problems' ? 'bg-white border-red-100 ring-4 ring-red-50/50' : 'bg-white border-gray-100'}`}>
                <button onClick={() => toggleBlock('problems')} className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                            <Target size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Dores e Problemas</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Cards de Problema</p>
                        </div>
                    </div>
                    {expandedBlock === 'problems' ? <ChevronUp className="text-red-500" /> : <ChevronDown className="text-gray-300" />}
                </button>
                {expandedBlock === 'problems' && (
                    <div className="p-8 pt-0 animate-fade-in">
                        {renderSectionHeaderConfig('problems', 'Seu site está expulsando clientes?', 'Subtítulo da seção de problemas')}
                        {renderServiceList('pain-points', 'Cards de Problema', Target)}
                    </div>
                )}
            </div>

            {/* METHODOLOGY & FEATURES */}
            <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedBlock === 'features' ? 'bg-white border-purple-100 ring-4 ring-purple-50/50' : 'bg-white border-gray-100'}`}>
                <button onClick={() => toggleBlock('features')} className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Diferenciais e Metodologia</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Bento Grid e Ícones</p>
                        </div>
                    </div>
                    {expandedBlock === 'features' ? <ChevronUp className="text-purple-500" /> : <ChevronDown className="text-gray-300" />}
                </button>
                {expandedBlock === 'features' && (
                    <div className="p-8 pt-0 animate-fade-in space-y-6">
                        {renderSectionHeaderConfig('features', 'Muito mais que um rostinho bonito', 'Subtítulo da seção de diferenciais')}
                        {renderServiceList('methodology', 'Metodologia (3 Passos)', Layout)}
                        {renderServiceList('benefits', 'Benefícios (Bento Grid)', Zap)}
                        {renderServiceList('modules', 'Checklist Completo (Módulos)', CheckCircle)}
                    </div>
                )}
            </div>

            {/* PRICING & FAQ */}
            <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedBlock === 'pricing' ? 'bg-white border-green-100 ring-4 ring-green-50/50' : 'bg-white border-gray-100'}`}>
                <button onClick={() => toggleBlock('pricing')} className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Planos e FAQ</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Oferta Comercial</p>
                        </div>
                    </div>
                    {expandedBlock === 'pricing' ? <ChevronUp className="text-green-500" /> : <ChevronDown className="text-gray-300" />}
                </button>
                {expandedBlock === 'pricing' && (
                    <div className="p-8 pt-0 animate-fade-in space-y-6">
                        {renderSectionHeaderConfig('pricing', 'Estruturas que Geram Lucro', 'Subtítulo da seção de preços')}
                        {renderServiceList('pricing', 'Cards de Preço', DollarSign)}
                        {renderSectionHeaderConfig('faq', 'Tudo o que você Precisa Saber', 'Subtítulo do FAQ')}
                        {renderServiceList('faq', 'Perguntas Frequentes', HelpCircle)}
                    </div>
                )}
            </div>

            {/* SOCIAL PROOF */}
            <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedBlock === 'social' ? 'bg-white border-orange-100 ring-4 ring-orange-50/50' : 'bg-white border-gray-100'}`}>
                <button onClick={() => toggleBlock('social')} className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <MessageCircle size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Prova Social</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Depoimentos e Galeria</p>
                        </div>
                    </div>
                    {expandedBlock === 'social' ? <ChevronUp className="text-orange-500" /> : <ChevronDown className="text-gray-300" />}
                </button>
                {expandedBlock === 'social' && (
                    <div className="p-8 pt-0 animate-fade-in space-y-6">
                        {renderSectionHeaderConfig('social', 'Aprovado por Grandes Líderes', 'Subtítulo da prova social')}
                        {renderServiceList('testimonials', 'Depoimentos', MessageCircle)}
                        {renderServiceList('gallery', 'Galeria de Projetos', ImageIcon)}
                    </div>
                )}
            </div>

            {/* FINAL CTA */}
            <div className={`border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedBlock === 'cta' ? 'bg-white border-brand-orange ring-4 ring-orange-500/10' : 'bg-white border-gray-100'}`}>
                <button onClick={() => toggleBlock('cta')} className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-lg shadow-orange-200">
                            <Target size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Chamada Final (CTA)</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Rodapé de Conversão</p>
                        </div>
                    </div>
                    {expandedBlock === 'cta' ? <ChevronUp className="text-brand-orange" /> : <ChevronDown className="text-gray-300" />}
                </button>
                {expandedBlock === 'cta' && (
                    <div className="p-8 pt-0 animate-fade-in">
                        {renderSectionHeaderConfig('cta', 'VAMOS CONSTRUIR SEU SUCESSO?', 'Texto de apoio do formulário')}
                    </div>
                )}
            </div>

        </div>
    );
};

export default PageEditorTab;
