import React from 'react';
import { Layout, Share2, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { SiteConfig } from '../../../../services/adminService';
import { Card } from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { SOCIAL_STYLES, SOCIAL_DISPLAY_TYPES, moveItem } from './configConstants';

interface NavigationSectionProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
}

export const NavigationSection: React.FC<NavigationSectionProps> = ({ config, setConfig }) => {
    const AVAILABLE_VIEWS = [
        { label: 'Início (Landing)', value: 'landing' },
        { label: 'Estratégias de Anúncios', value: 'ads' },
        { label: 'Consultoria Comercial', value: 'consultancy' },
        { label: 'Sobre Nós', value: 'about' },
        { label: 'Auditoria SWOT', value: 'swot' },
        { label: 'Diagnóstico Gratuito', value: 'marketing-diagnosis' },
        { label: 'Blog & Insights', value: 'blog' },
        { label: 'Painel Admin', value: 'admin' },
        { label: 'Autenticação', value: 'auth' },
        { label: 'Showcase de Design', value: 'design-showcase' },
        { label: 'CONVERTE Sim. (CRM)', value: 'md-converte' },
        { label: 'Dominância Local (GMB)', value: 'gmb' },
        { label: 'Websites & LPs', value: 'sites' },
        { label: 'Termos de Uso', value: 'terms' },
        { label: 'Privacidade', value: 'privacy' },
        ...(Object.entries(config.content?.pages || {})
            .filter(([key]) => !['landing', 'ads', 'consultancy', 'about', 'swot', 'marketing-diagnosis', 'blog', 'admin', 'auth', 'design-showcase', 'md-converte', 'gmb', 'sites', 'terms', 'privacy'].includes(key))
            .map(([key, page]) => ({
                label: (page as any).title || key.charAt(0).toUpperCase() + key.slice(1),
                value: key
            }))
        )
    ];

    return (
        <Card className="space-y-8 p-6 mb-6 border-border-main bg-card-bg">
            {/* HEADER SECTION */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-txt-title border-b border-border-main pb-4  tracking-[0.2em] flex items-center gap-2">
                    <Layout size={14} className="text-brand-blue" /> Configurações do Cabeçalho
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                        label="Template Visual"
                        value={config.content?.header?.template || 'modern'}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, template: e.target.value as any } } })}
                    >
                        <option value="modern">Moderno (Flutuante)</option>
                        <option value="minimal">Minimalista (Sutil)</option>
                        <option value="glass">Glassmorphism (Vidro)</option>
                        <option value="classic">Clássico (Original/Alto)</option>
                        <option value="compact">Compacto (Móvel-First)</option>
                    </Select>

                    <Select
                        label="Alinhamento dos Links"
                        value={config.content?.header?.alignment || 'right'}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, alignment: e.target.value as any } } })}
                    >
                        <option value="left">Esquerda</option>
                        <option value="center">Centralizado</option>
                        <option value="right">Direita</option>
                    </Select>

                    <div>
                        <label className="text-[10px] font-bold text-txt-subtitle   ml-1 mb-2 block">Cor após Scroll</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={config.content?.header?.scroll_bg_color || '#ffffff'}
                                onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, scroll_bg_color: e.target.value } } })}
                                className="h-[46px] w-[46px] rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0 overflow-hidden"
                                title="Cor do Cabeçalho após Scroll"
                                aria-label="Selecionar cor do fundo do cabeçalho após rolagem"
                            />
                            <div className="flex-1">
                                <Input
                                    value={config.content?.header?.scroll_bg_color}
                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, scroll_bg_color: e.target.value } } })}
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-bg/50 p-5 rounded-2xl border border-border-main">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h5 className="text-[10px] font-bold   text-txt-subtitle">Redes Sociais (Header)</h5>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.content?.header?.social_is_active || false}
                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, social_is_active: e.target.checked } } })}
                                    className="w-4 h-4 text-brand-blue rounded"
                                />
                                <span className="text-[10px] font-bold text-txt-subtitle ">Ativar</span>
                            </label>
                        </div>
                        {config.content?.header?.social_is_active && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                <Select
                                    label="Estilo dos Ícones"
                                    value={config.content?.header?.social_style || 'round'}
                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, social_style: e.target.value as any } } })}
                                >
                                    {SOCIAL_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </Select>
                                <Select
                                    label="Tipo de Exibição"
                                    value={config.content?.header?.social_display_type || 'icon'}
                                    onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, social_display_type: e.target.value as any } } })}
                                >
                                    {SOCIAL_DISPLAY_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </Select>
                                <div>
                                    <label className="text-[10px] font-bold text-txt-subtitle   ml-1 mb-2 block">Cor do Ícone</label>
                                    <input
                                        type="color"
                                        value={config.content?.header?.social_icon_color || '#ffffff'}
                                        onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, social_icon_color: e.target.value } } })}
                                        className="w-full h-[46px] px-1 bg-card-bg border border-border-main rounded-xl cursor-pointer"
                                        title="Cor do Ícone Social"
                                        aria-label="Selecionar cor para os ícones sociais no cabeçalho"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-txt-subtitle   ml-1 mb-2 block">Cor do Hover</label>
                                    <input
                                        type="color"
                                        value={config.content?.header?.social_icon_hover_color || '#D4AF37'}
                                        onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, social_icon_hover_color: e.target.value } } })}
                                        className="w-full h-[46px] px-1 bg-card-bg border border-border-main rounded-xl cursor-pointer"
                                        title="Cor do Hover Social"
                                        aria-label="Selecionar cor de destaque ao passar o mouse nos ícones sociais"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group h-10">
                            <div className={`w-10 h-6 rounded-full transition-all relative ${config.content?.header?.is_transparent ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${config.content?.header?.is_transparent ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <span className="text-[10px] font-bold text-title block  tracking-tight">Transparência Inicial</span>
                            <input
                                type="checkbox"
                                checked={config.content?.header?.is_transparent || false}
                                onChange={(e) => setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, is_transparent: e.target.checked } } })}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* LINKS EDITOR */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-txt-subtitle   mb-2 block">Links de Navegação Principal</label>
                    <div className="space-y-2">
                        {(config.content?.header?.links || []).map((link, idx) => {
                            const isUsed = (config.content?.header?.links || []).some((l, i) => i !== idx && l.view === link.view);
                            return (
                                <div key={idx} className={`bg-surface-bg/50 p-4 rounded-xl border flex flex-col gap-3 transition-all ${isUsed ? 'border-amber-200 dark:border-amber-900/50 shadow-sm shadow-amber-50/10' : 'border-border-main'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1">
                                            <button type="button" onClick={() => {
                                                const newLinks = moveItem(config.content?.header?.links || [], idx, 'up');
                                                setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, links: newLinks } } });
                                            }} className="p-1 hover:bg-card rounded transition-colors text-subtitle hover:text-brand-blue" aria-label="Mover link para cima"><ChevronUp size={12} /></button>
                                            <button type="button" onClick={() => {
                                                const newLinks = moveItem(config.content?.header?.links || [], idx, 'down');
                                                setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, links: newLinks } } });
                                            }} className="p-1 hover:bg-card rounded transition-colors text-subtitle hover:text-brand-blue" aria-label="Mover link para baixo"><ChevronDown size={12} /></button>
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => {
                                                    const newLinks = [...(config.content?.header?.links || [])];
                                                    newLinks[idx].label = e.target.value;
                                                    setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, links: newLinks } } });
                                                }}
                                                placeholder="Rótulo (ex: Início)"
                                                label="Rótulo do Link"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Select
                                                value={link.view}
                                                onChange={(e) => {
                                                    const newLinks = [...(config.content?.header?.links || [])];
                                                    newLinks[idx].view = e.target.value;
                                                    setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, links: newLinks } } });
                                                }}
                                                error={isUsed ? "Link já selecionado em outra posição" : undefined}
                                                label="Visualização do Link"
                                            >
                                                {AVAILABLE_VIEWS.map(v => (
                                                    <option key={v.value} value={v.value}>
                                                        {v.label} {(config.content?.header?.links || []).some(l => l.view === v.value) ? '✓' : ''}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newLinks = (config.content?.header?.links || []).filter((_, i) => i !== idx);
                                                setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, links: newLinks } } });
                                            }}
                                            className="p-2 text-subtitle hover:text-red-500 transition-colors"
                                            aria-label="Remover link"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => {
                                const newLinks = [...(config.content?.header?.links || []), { label: 'Novo Link', view: 'landing' }];
                                setConfig({ ...config, content: { ...config.content, header: { ...config.content?.header, links: newLinks } } });
                            }}
                            className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-subtitle font-bold text-[10px]   hover:border-brand-blue/30 hover:text-brand-blue hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Novo Link de Navegação
                        </button>
                    </div>
                </div>
            </div>

            {/* FOOTER SECTION */}
            <div className="space-y-6 pt-10 border-t border-border-main">
                <h4 className="text-xs font-bold text-txt-title pb-4  tracking-[0.2em] flex items-center gap-2">
                    <Share2 size={14} className="text-brand-blue" /> Configurações do Rodapé
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Template do Rodapé"
                        value={config.content?.footer?.template || 'standard'}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, template: e.target.value as any } } })}
                    >
                        <option value="standard">Padrão Moderno</option>
                        <option value="simple">Minimalista Limpo</option>
                        <option value="corporate">Corporativo Sólido</option>
                        <option value="creative">Criativo & Vibrante</option>
                        <option value="grid">Grid de Informações</option>
                    </Select>
                    <Input
                        label="Texto de Direitos Autorais"
                        value={config.content?.footer?.copyright_text}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, copyright_text: e.target.value } } })}
                        placeholder="© 2024 MD Solution..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-surface-bg/50 rounded-2xl border border-border-main">
                    <Input
                        label="Título do CTA Principal"
                        value={config.content?.footer?.cta_title}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, cta_title: e.target.value } } })}
                        placeholder="Pronto para o próximo nível?"
                    />
                    <Input
                        label="Subtítulo do CTA"
                        value={config.content?.footer?.cta_subtitle}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, cta_subtitle: e.target.value } } })}
                        placeholder="Junte-se a dezenas de empresas..."
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-txt-subtitle   ml-1 block">Colunas de Links do Rodapé</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(config.content?.footer?.links || []).map((column, cIdx) => (
                            <div key={cIdx} className="bg-surface-bg/50 p-4 rounded-xl border border-border-main space-y-3">
                                <div className="flex items-center gap-2 border-b border-border-main pb-2 mb-2">
                                    <div className="flex flex-col gap-0.5 mr-2">
                                        <button type="button" onClick={() => {
                                            const newLinks = moveItem(config.content?.footer?.links || [], cIdx, 'up');
                                            setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                        }} className="text-subtitle hover:text-brand-blue transition-colors" title="Mover coluna para cima"><ChevronUp size={10} /></button>
                                        <button type="button" onClick={() => {
                                            const newLinks = moveItem(config.content?.footer?.links || [], cIdx, 'down');
                                            setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                        }} className="text-subtitle hover:text-brand-blue transition-colors" title="Mover coluna para baixo"><ChevronDown size={10} /></button>
                                    </div>
                                    <input
                                        type="text"
                                        value={column.title}
                                        onChange={(e) => {
                                            const newLinks = [...(config.content?.footer?.links || [])];
                                            newLinks[cIdx].title = e.target.value;
                                            setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                        }}
                                        className="bg-transparent border-none p-0 text-[10px] font-bold  text-txt-title outline-none flex-grow"
                                        placeholder="Título da Coluna"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newLinks = (config.content?.footer?.links || []).filter((_, i) => i !== cIdx);
                                            setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                        }}
                                        className="text-subtitle hover:text-red-500"
                                        title="Remover coluna"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {column.items.map((item, iIdx) => {
                                        const isUsed = (config.content?.footer?.links || []).some((col, cI) => col.items.some((it, iI) => (cI !== cIdx || iI !== iIdx) && it.view === item.view));
                                        return (
                                            <div key={iIdx} className={`bg-card-bg p-2 rounded-lg border transition-all ${isUsed ? 'border-amber-200 dark:border-amber-900/50' : 'border-border-main'}`}>
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <Input
                                                            value={item.label}
                                                            onChange={(e) => {
                                                                const newLinks = [...(config.content?.footer?.links || [])];
                                                                newLinks[cIdx].items[iIdx].label = e.target.value;
                                                                setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                                            }}
                                                            placeholder="Label"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Select
                                                            value={item.view}
                                                            onChange={(e) => {
                                                                const newLinks = [...(config.content?.footer?.links || [])];
                                                                newLinks[cIdx].items[iIdx].view = e.target.value;
                                                                setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                                            }}
                                                            error={isUsed ? "Já em uso" : undefined}
                                                        >
                                                            {AVAILABLE_VIEWS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                                                        </Select>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newLinks = [...(config.content?.footer?.links || [])];
                                                            newLinks[cIdx].items = newLinks[cIdx].items.filter((_, i) => i !== iIdx);
                                                            setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                                        }}
                                                        className="text-subtitle hover:text-red-500"
                                                        title="Remover link"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newLinks = [...(config.content?.footer?.links || [])];
                                            newLinks[cIdx].items.push({ label: 'Novo Link', view: 'landing' });
                                            setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                                        }}
                                        className="w-full py-2 border border-dashed border-brand-blue/20 rounded-lg text-brand-blue font-bold text-[9px]   hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-1"
                                    >
                                        <Plus size={10} /> Add Link a esta Coluna
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                const newLinks = [...(config.content?.footer?.links || []), { title: 'Nova Coluna', items: [] }];
                                setConfig({ ...config, content: { ...config.content, footer: { ...config.content?.footer, links: newLinks } } });
                            }}
                            className="py-2.5 border-2 border-dashed border-border-main rounded-xl text-txt-subtitle font-bold text-[10px]   hover:border-brand-blue/30 hover:text-brand-blue hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Nova Coluna
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
