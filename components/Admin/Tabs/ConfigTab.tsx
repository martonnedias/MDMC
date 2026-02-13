import React, { useState } from 'react';
import {
    Settings, Globe, Palette, Power, FileText, LayoutDashboard,
    MessageCircle, Instagram, Facebook, Youtube, Share2,
    Upload, RotateCcw, Save, Trash2, Image as ImageIcon,
    Type, MousePointer2, Smartphone, Layout, ArrowRight, Eye,
    ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { SiteConfig } from '../../../services/adminService';
import { adminService } from '../../../services/adminService';
import Button from '../../Button';

interface ConfigTabProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
    onSave: (e: React.FormEvent) => void;
    loading: boolean;
}

const ConfigTab: React.FC<ConfigTabProps> = ({ config, setConfig, onSave, loading }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>('general');

    const inputStyles = "w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium";
    const labelStyles = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block";

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    const handleUpload = async (file: File, callback: (url: string) => void) => {
        const url = await adminService.uploadImage(file);
        if (url) callback(url);
    };

    const SIZES = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'];

    const SectionHeader = ({ id, icon: Icon, title, description, color }: any) => (
        <button
            type="button"
            onClick={() => toggleSection(id)}
            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${expandedSection === id ? 'bg-white border-blue-100 shadow-xl shadow-blue-50/50 mb-6' : 'bg-white border-gray-100 hover:border-blue-200'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                    <Icon size={22} />
                </div>
                <div className="text-left">
                    <h3 className="font-black text-gray-900 tracking-tight">{title}</h3>
                    <p className="text-xs font-bold text-gray-400 italic">{description}</p>
                </div>
            </div>
            {expandedSection === id ? <ChevronUp size={20} className="text-blue-500" /> : <ChevronDown size={20} className="text-gray-300" />}
        </button>
    );

    return (
        <form onSubmit={onSave} className="space-y-4 animate-fade-in max-w-5xl pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Configurações Gerais</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Personalize cada detalhe visual e estratégico do site em tempo real.</p>
                </div>
                <Button type="submit" loading={loading} variant="primary" className="px-12 py-5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-blue-200 text-sm">
                    <Save size={20} /> Salvar Alterações
                </Button>
            </header>

            {/* GERAL E LOGO */}
            <div className="space-y-0">
                <SectionHeader
                    id="general"
                    icon={Globe}
                    title="Identidade e Contato"
                    description="Nome da empresa, logo e informações de contato direto."
                    color="bg-blue-50 text-blue-600"
                />
                {expandedSection === 'general' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-blue-50 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                            <div>
                                <label className={labelStyles}>Nome da Empresa</label>
                                <input type="text" value={config.site_name} onChange={(e) => setConfig({ ...config, site_name: e.target.value })} className={inputStyles} />
                            </div>
                            <div>
                                <label className={labelStyles}>Telefone de Contato</label>
                                <input type="text" value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })} className={inputStyles} placeholder="(00) 00000-0000" />
                            </div>
                            <div>
                                <label className={labelStyles}>WhatsApp Direct (Apenas números)</label>
                                <input type="text" value={config.whatsapp} onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })} className={inputStyles} placeholder="55869..." />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="mb-6">
                                    <label className={labelStyles}>Logo Principal (Fundo Claro)</label>
                                    <div className="relative flex-1">
                                        <input type="text" value={config.logo_url || ''} onChange={(e) => setConfig({ ...config, logo_url: e.target.value })} className={inputStyles + " pr-20"} placeholder="URL da logo..." />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            {config.logo_url && (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfig({ ...config, logo_url: '' })}
                                                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Remover Imagem"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const el = document.createElement('input');
                                                    el.type = 'file';
                                                    el.accept = 'image/*';
                                                    el.onchange = (e: any) => handleUpload(e.target.files[0], (url) => setConfig({ ...config, logo_url: url }));
                                                    el.click();
                                                }}
                                                className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                                title="Upload Nova Imagem"
                                            >
                                                <Upload size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {config.logo_url ? <img src={config.logo_url} className="max-h-full" /> : <ImageIcon className="text-gray-300" />}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className={labelStyles}>Logo Negativa (Fundo Escuro/Transparente)</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="relative flex-1">
                                            <input type="text" value={config.logo_light_url || ''} onChange={(e) => setConfig({ ...config, logo_light_url: e.target.value })} className={inputStyles + " pr-20"} placeholder="URL da logo branca/clara..." />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                {config.logo_light_url && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfig({ ...config, logo_light_url: '' })}
                                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                        title="Remover Imagem"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.createElement('input');
                                                        el.type = 'file';
                                                        el.accept = 'image/*';
                                                        el.onchange = (e: any) => handleUpload(e.target.files[0], (url) => setConfig({ ...config, logo_light_url: url }));
                                                        el.click();
                                                    }}
                                                    className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                                    title="Upload Nova Imagem"
                                                >
                                                    <Upload size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-14 h-14 bg-slate-800 rounded-2xl border border-gray-600 flex items-center justify-center overflow-hidden shrink-0">
                                            {config.logo_light_url ? <img src={config.logo_light_url} className="max-h-full" /> : <ImageIcon className="text-gray-500" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className={labelStyles}>Logo do Rodapé (Opcional)</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="relative flex-1">
                                            <input type="text" value={config.logo_footer_url || ''} onChange={(e) => setConfig({ ...config, logo_footer_url: e.target.value })} className={inputStyles + " pr-20"} placeholder="URL logo rodapé..." />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                {config.logo_footer_url && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfig({ ...config, logo_footer_url: '' })}
                                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                        title="Remover Imagem"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const el = document.createElement('input');
                                                        el.type = 'file';
                                                        el.accept = 'image/*';
                                                        el.onchange = (e: any) => handleUpload(e.target.files[0], (url) => setConfig({ ...config, logo_footer_url: url }));
                                                        el.click();
                                                    }}
                                                    className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                                    title="Upload Nova Imagem"
                                                >
                                                    <Upload size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                                            {config.logo_footer_url ? <img src={config.logo_footer_url} className="max-h-full" /> : <ImageIcon className="text-gray-500" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelStyles}>Altura Header</label>
                                        <select
                                            value={config.logo_height_header || 'h-10'}
                                            onChange={(e) => setConfig({ ...config, logo_height_header: e.target.value })}
                                            className={inputStyles}
                                        >
                                            <option value="h-8">Pequeno (32px)</option>
                                            <option value="h-10">Normal (40px)</option>
                                            <option value="h-12">Médio (48px)</option>
                                            <option value="h-16">Grande (64px)</option>
                                            <option value="h-20">Extra (80px)</option>
                                            <option value="h-24">Gigante (96px)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelStyles}>Altura Rodapé</label>
                                        <select
                                            value={config.logo_height_footer || 'h-12'}
                                            onChange={(e) => setConfig({ ...config, logo_height_footer: e.target.value })}
                                            className={inputStyles}
                                        >
                                            <option value="h-8">Pequeno (32px)</option>
                                            <option value="h-10">Normal (40px)</option>
                                            <option value="h-12">Médio (48px)</option>
                                            <option value="h-16">Grande (64px)</option>
                                            <option value="h-20">Extra (80px)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyles}>Slogan E-mail</label>
                                    <input type="text" value={config.slogan || ''} onChange={(e) => setConfig({ ...config, slogan: e.target.value })} className={inputStyles} placeholder="Estrategistas Digitais em Escala" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VISUAL & THEME */}
                <SectionHeader
                    id="appearance"
                    icon={Palette}
                    title="Design System"
                    description="Cores, tipografia e estilos globais do site."
                    color="bg-purple-50 text-purple-600"
                />
                {expandedSection === 'appearance' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-blue-50 shadow-sm mb-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className={labelStyles}>Cor Primária (Bots / Acentos)</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                    <input type="color" value={config.primary_color} onChange={(e) => setConfig({ ...config, primary_color: e.target.value })} className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-xl" />
                                    <span className="text-xs font-black text-gray-500 font-mono tracking-tighter uppercase">{config.primary_color}</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelStyles}>Cor Secundária (Chamadas)</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                    <input type="color" value={config.secondary_color} onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })} className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-xl" />
                                    <span className="text-xs font-black text-gray-500 font-mono tracking-tighter uppercase">{config.secondary_color}</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelStyles}>Arredondamento (Cards)</label>
                                <select
                                    value={config.theme?.border_radius || '2rem'}
                                    onChange={(e) => setConfig({ ...config, theme: { ...config.theme, border_radius: e.target.value } })}
                                    className={inputStyles}
                                >
                                    <option value="0px">None (Square)</option>
                                    <option value="0.5rem">Soft (8px)</option>
                                    <option value="1rem">Rounded (16px)</option>
                                    <option value="2rem">Premium (32px)</option>
                                    <option value="3rem">Ultra (48px)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-10">
                            <div>
                                <label className={labelStyles}>Tipografia: Corpo do Texto</label>
                                <input type="text" value={config.theme?.typography?.font_family} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, font_family: e.target.value } as any } })} className={inputStyles} placeholder="Inter, Outfit, Roboto" />
                            </div>
                            <div>
                                <label className={labelStyles}>Tipografia: Títulos e H1</label>
                                <input type="text" value={config.theme?.typography?.heading_font} onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, heading_font: e.target.value } as any } })} className={inputStyles} placeholder="Poppins, Montserrat" />
                            </div>
                        </div>
                    </div>
                )}

                {/* MODULOS E PÁGINAS */}
                <SectionHeader
                    id="modules"
                    icon={Power}
                    title="Chaves de Ativação"
                    description="Ligue ou desligue módulos inteiros do site instantaneamente."
                    color="bg-emerald-50 text-emerald-600"
                />
                {expandedSection === 'modules' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-blue-50 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex items-center justify-between p-6 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-[2rem] cursor-pointer transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${config.is_blog_active ? 'bg-emerald-500' : 'bg-gray-300'} shadow`}></div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-sm italic uppercase tracking-tighter">Módulo de Blog</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Visibilidade pública</p>
                                </div>
                            </div>
                            <input type="checkbox" checked={config.is_blog_active} onChange={(e) => setConfig({ ...config, is_blog_active: e.target.checked })} className="w-10 h-6 accent-emerald-500 scale-125" />
                        </label>
                        <label className="flex items-center justify-between p-6 bg-gray-50 hover:bg-blue-50 border border-gray-100 rounded-[2rem] cursor-pointer transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${config.is_swot_active ? 'bg-emerald-500' : 'bg-gray-300'} shadow`}></div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-sm italic uppercase tracking-tighter">Módulo SWOT</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Diagnóstico pro</p>
                                </div>
                            </div>
                            <input type="checkbox" checked={config.is_swot_active} onChange={(e) => setConfig({ ...config, is_swot_active: e.target.checked })} className="w-10 h-6 accent-emerald-500 scale-125" />
                        </label>
                    </div>
                )}

                {/* SESSÕES PÁGINA INICIAL */}
                <SectionHeader
                    id="sections"
                    icon={Layout}
                    title="Editor de Seções (Home)"
                    description="Controle de conteúdo e estilo de cada sessão da landing page."
                    color="bg-teal-50 text-teal-600"
                />
                {expandedSection === 'sections' && (
                    <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 shadow-sm mb-8 space-y-4">
                        {['hero', 'services', 'swot', 'ads', 'gmb', 'sites', 'about', 'md-converte', 'diagnosis', 'consultancy', 'social_media', 'footer'].map((key) => {
                            const section = config.content?.sections?.[key] || {};
                            const isActive = section.is_active !== false;

                            return (
                                <div key={key} className={`border rounded-[2rem] overflow-hidden transition-all ${isActive ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-400 uppercase'}`}>
                                                {key.substring(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 capitalize tracking-tighter">{key}</h4>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Editor de Bloco</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mr-1">Status:</span>
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={(e) => {
                                                        const newSections = { ...config.content?.sections, [key]: { ...section, is_active: e.target.checked } };
                                                        setConfig({ ...config, content: { ...config.content, sections: newSections } });
                                                    }}
                                                    className="w-8 h-4 accent-blue-600 scale-110"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-gray-100">
                                            <div className="lg:col-span-1">
                                                <label className={labelStyles}>Título da Seção</label>
                                                <input
                                                    type="text"
                                                    value={section.title || ''}
                                                    onChange={(e) => {
                                                        const newSections = { ...config.content?.sections, [key]: { ...section, title: e.target.value } };
                                                        setConfig({ ...config, content: { ...config.content, sections: newSections } });
                                                    }}
                                                    className={inputStyles}
                                                />
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className={labelStyles}>Subtítulo / Promo</label>
                                                <input
                                                    type="text"
                                                    value={section.subtitle || ''}
                                                    onChange={(e) => {
                                                        const newSections = { ...config.content?.sections, [key]: { ...section, subtitle: e.target.value } };
                                                        setConfig({ ...config, content: { ...config.content, sections: newSections } });
                                                    }}
                                                    className={inputStyles}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelStyles}>Fonte Específica</label>
                                                <select
                                                    value={section.font_family || ''}
                                                    onChange={(e) => {
                                                        const newSections = { ...config.content?.sections, [key]: { ...section, font_family: e.target.value } };
                                                        setConfig({ ...config, content: { ...config.content, sections: newSections } });
                                                    }}
                                                    className={inputStyles}
                                                >
                                                    <option value="">Padrão</option>
                                                    <option value="Inter">Inter</option>
                                                    <option value="Poppins">Poppins</option>
                                                    <option value="Outfit">Outfit</option>
                                                    <option value="Montserrat">Montserrat</option>
                                                    <option value="Playfair Display">Playfair (Serif)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className={labelStyles}>Tamanho Título</label>
                                                <select
                                                    value={section.font_size_title || ''}
                                                    onChange={(e) => {
                                                        const newSections = { ...config.content?.sections, [key]: { ...section, font_size_title: e.target.value } };
                                                        setConfig({ ...config, content: { ...config.content, sections: newSections } });
                                                    }}
                                                    className={inputStyles}
                                                >
                                                    <option value="">Padrão</option>
                                                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>

                                            <div>
                                                <label className={labelStyles}>Ação do Botão</label>
                                                <select
                                                    value={section.button_redirect || ''}
                                                    onChange={(e) => {
                                                        const newSections = { ...config.content?.sections, [key]: { ...section, button_redirect: e.target.value } };
                                                        setConfig({ ...config, content: { ...config.content, sections: newSections } });
                                                    }}
                                                    className={inputStyles}
                                                >
                                                    <option value="">Nenhum/Form</option>
                                                    <option value="landing">Home</option>
                                                    <option value="diagnosis">Diagnóstico</option>
                                                    <option value="swot">SWOT</option>
                                                    <option value="blog">Blog</option>
                                                    <option value="whatsapp">Link Direto WhatsApp</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="fixed bottom-8 right-8 z-[100] animate-bounce-in">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-brand-blue text-white w-20 h-20 rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,82,255,0.4)] hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    {loading ? <RotateCcw size={24} className="animate-spin" /> : <Save size={24} />}
                </button>
            </div>
        </form>
    );
};

export default ConfigTab;
