import React from 'react';
import { Settings2, Edit3, Type, Zap, MessageCircle } from 'lucide-react';
import { INPUT_STYLES, LABEL_STYLES } from './PageEditorConstants';

interface SectionEditorProps {
    sectionKey: string;
    defaultTitle: string;
    defaultSub: string;
    pageConfig: Record<string, any>;
    updateSectionConfig: (section: string, key: string, value: any) => void;
}

const AdvancedTitleBuilder: React.FC<{
    section: string;
    fieldKey: string;
    label: string;
    placeholder: string;
    currentValue: string;
    updateSectionConfig: (section: string, key: string, value: any) => void;
}> = ({ section, fieldKey, label, placeholder, currentValue, updateSectionConfig }) => {
    const insertTag = (tagStart: string, tagEnd: string) => {
        updateSectionConfig(section, fieldKey, `${currentValue} ${tagStart}Texto${tagEnd}`);
    };

    const id = `title-builder-${section}-${fieldKey}`;

    return (
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-gray-100 space-y-3 dark:bg-white/5 dark:border-white/10">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    <Edit3 size={12} className="text-brand-blue" />
                    <label htmlFor={id} className={LABEL_STYLES + " mb-0"}>{label}</label>
                </div>
            </div>

            <div className="relative group">
                <textarea
                    id={id}
                    rows={3}
                    value={currentValue}
                    onChange={(e) => updateSectionConfig(section, fieldKey, e.target.value)}
                    className={`${INPUT_STYLES} font-mono text-xs text-subtitle bg-slate-50/50 focus:bg-card transition-all`}
                    placeholder={placeholder}
                    aria-label={label}
                />
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Type size={14} className="text-subtitle" />
                </div>
            </div>

            <div className="flex gap-2 flex-wrap items-center pt-2">
                <span className="text-[9px] font-bold text-subtitle   mr-2">Estilos Rápidos:</span>
                <button
                    type="button"
                    onClick={() => insertTag('<span class="text-yellow-500">', '</span>')}
                    className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-xl text-[9px] font-bold   hover:bg-yellow-100 transition-all border border-yellow-100 dark:bg-yellow-900/20"
                >
                    + Destaque Laranja
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('<span class="text-brand-blue">', '</span>')}
                    className="px-3 py-1.5 bg-blue-50 text-brand-blue rounded-xl text-[9px] font-bold   hover:bg-blue-100 transition-all border border-blue-100 dark:bg-blue-900/20"
                >
                    + Destaque Azul
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">', '</span>')}
                    className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[9px] font-bold   hover:bg-purple-100 transition-all border border-purple-100 dark:bg-purple-900/20"
                >
                    + Texto Gradiente
                </button>
                <button
                    type="button"
                    onClick={() => insertTag('<span class="bg-blue-600 text-white px-2 py-0.5 rounded-md shadow-[0_0_15px_rgba(37,99,235,0.5)]">', '</span>')}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[9px] font-bold   hover:bg-blue-700 transition-all shadow-sm"
                >
                    + Estilo Neon
                </button>
            </div>
            <p className="text-[9px] text-subtitle italic">O texto acima aceita HTML. Use os botões para inserir destaques coloridos automaticamente.</p>
        </div>
    );
};

export const SectionEditor: React.FC<SectionEditorProps> = ({ sectionKey, defaultTitle, defaultSub, pageConfig, updateSectionConfig }) => {
    const sectionData = pageConfig?.[sectionKey] || {};
    const isActive = sectionData.is_active !== false;

    return (
        <div className="grid grid-cols-1 gap-6 mb-8 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100/50 dark:bg-white/5 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <Settings2 size={16} className="text-brand-blue" />
                    <h5 className="text-[10px] font-bold   text-subtitle">Configurações Estéticas do Bloco</h5>
                </div>
                <button
                    type="button"
                    onClick={() => updateSectionConfig(sectionKey, 'is_active', !isActive)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[10px] font-bold   ${isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20' : 'bg-gray-100 text-subtitle border border-gray-200 dark:bg-white/5'}`}
                >
                    {isActive ? 'Ativado' : 'Habilitar Seção'}
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                </button>
            </div>

            <div className={`space-y-6 transition-all ${!isActive ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="space-y-2">
                    <label htmlFor={`badge-${sectionKey}`} className={LABEL_STYLES}>Badge (Etiqueta superior)</label>
                    <input
                        id={`badge-${sectionKey}`}
                        type="text"
                        value={sectionData.badge || ''}
                        onChange={(e) => updateSectionConfig(sectionKey, 'badge', e.target.value)}
                        className={INPUT_STYLES}
                        placeholder="Etiqueta da seção..."
                        aria-label="Etiqueta da seção"
                    />
                </div>

                <AdvancedTitleBuilder
                    section={sectionKey}
                    fieldKey="title"
                    label="Título da Seção"
                    placeholder={defaultTitle}
                    currentValue={sectionData.title || ''}
                    updateSectionConfig={updateSectionConfig}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor={`sub-${sectionKey}`} className={LABEL_STYLES}>Subtítulo / Descrição</label>
                        <textarea
                            id={`sub-${sectionKey}`}
                            rows={3}
                            value={sectionData.subtitle || ''}
                            onChange={(e) => updateSectionConfig(sectionKey, 'subtitle', e.target.value)}
                            className={INPUT_STYLES}
                            placeholder={defaultSub}
                            aria-label="Subtítulo da seção"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor={`title-color-${sectionKey}`} className={LABEL_STYLES}>Cor do Título</label>
                            <div className="flex gap-2">
                                <input
                                    id={`title-color-${sectionKey}`}
                                    type="color"
                                    value={sectionData.title_color || '#0f172a'}
                                    onChange={(e) => updateSectionConfig(sectionKey, 'title_color', e.target.value)}
                                    className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0"
                                    aria-label="Cor do Título"
                                />
                                <input
                                    type="text"
                                    value={sectionData.title_color || ''}
                                    onChange={(e) => updateSectionConfig(sectionKey, 'title_color', e.target.value)}
                                    className={INPUT_STYLES}
                                    placeholder="#0f172a"
                                    aria-label="Texto da Cor do Título"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`sub-color-${sectionKey}`} className={LABEL_STYLES}>Cor Subtítulo</label>
                            <div className="flex gap-2">
                                <input
                                    id={`sub-color-${sectionKey}`}
                                    type="color"
                                    value={sectionData.subtitle_color || '#64748b'}
                                    onChange={(e) => updateSectionConfig(sectionKey, 'subtitle_color', e.target.value)}
                                    className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0"
                                    aria-label="Cor do Subtítulo"
                                />
                                <input
                                    type="text"
                                    value={sectionData.subtitle_color || ''}
                                    onChange={(e) => updateSectionConfig(sectionKey, 'subtitle_color', e.target.value)}
                                    className={INPUT_STYLES}
                                    placeholder="#64748b"
                                    aria-label="Texto da Cor do Subtítulo"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor={`sub-size-${sectionKey}`} className={LABEL_STYLES}>Tamanho Subtítulo</label>
                            <select
                                id={`sub-size-${sectionKey}`}
                                className={INPUT_STYLES + " py-3"}
                                value={sectionData.subtitle_size || ''}
                                onChange={(e) => updateSectionConfig(sectionKey, 'subtitle_size', e.target.value)}
                                aria-label="Tamanho do Subtítulo"
                            >
                                <option value="">Padrão (XL)</option>
                                <option value="text-sm">Pequeno (SM)</option>
                                <option value="text-base">Médio (Base)</option>
                                <option value="text-lg">Grande (LG)</option>
                                <option value="text-xl">Extra Grande (XL)</option>
                                <option value="text-2xl">Gigante (2XL)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                    <div>
                        <label htmlFor={`bg-color-${sectionKey}`} className={LABEL_STYLES}>Cor de Fundo</label>
                        <div className="flex gap-2">
                            <input
                                id={`bg-color-${sectionKey}`}
                                type="color"
                                value={sectionData.bg_color || '#ffffff'}
                                onChange={(e) => updateSectionConfig(sectionKey, 'bg_color', e.target.value)}
                                className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0"
                                aria-label="Cor de Fundo da Seção"
                            />
                            <input
                                type="text"
                                value={sectionData.bg_color || ''}
                                onChange={(e) => updateSectionConfig(sectionKey, 'bg_color', e.target.value)}
                                className={INPUT_STYLES}
                                placeholder="#ffffff"
                                aria-label="Texto da Cor de Fundo"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor={`bg-grad-${sectionKey}`} className={LABEL_STYLES}>Gradiente Fundo (CSS)</label>
                        <input
                            id={`bg-grad-${sectionKey}`}
                            type="text"
                            value={sectionData.bg_gradient || ''}
                            onChange={(e) => updateSectionConfig(sectionKey, 'bg_gradient', e.target.value)}
                            className={INPUT_STYLES}
                            placeholder="linear-gradient(...)"
                            aria-label="Gradiente de Fundo"
                        />
                    </div>
                    <div>
                        <label htmlFor={`font-${sectionKey}`} className={LABEL_STYLES}>Fonte Seção</label>
                        <select
                            id={`font-${sectionKey}`}
                            value={sectionData.font_family || ''}
                            onChange={(e) => updateSectionConfig(sectionKey, 'font_family', e.target.value)}
                            className={INPUT_STYLES + " py-3"}
                            aria-label="Fonte da Seção"
                        >
                            <option value="">Padrão do Site</option>
                            <option value="Inter">Inter</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Raleway">Raleway</option>
                        </select>
                    </div>
                </div>

                {['hero', 'problems', 'features', 'cta'].includes(sectionKey) && (
                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Zap size={14} className="text-yellow-500" />
                                <h5 className="text-[10px] font-bold   text-subtitle">Call to Action (Botão)</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <label htmlFor={`btn-txt-${sectionKey}`} className={LABEL_STYLES}>Texto do Botão</label>
                                    <input
                                        id={`btn-txt-${sectionKey}`}
                                        type="text"
                                        value={sectionData.button_text || ''}
                                        onChange={(e) => updateSectionConfig(sectionKey, 'button_text', e.target.value)}
                                        className={INPUT_STYLES}
                                        placeholder="Clique aqui"
                                        aria-label="Texto do Botão"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label htmlFor={`btn-link-${sectionKey}`} className={LABEL_STYLES}>Link/Destino</label>
                                    <input
                                        id={`btn-link-${sectionKey}`}
                                        type="text"
                                        value={sectionData.button_link || ''}
                                        onChange={(e) => updateSectionConfig(sectionKey, 'button_link', e.target.value)}
                                        className={INPUT_STYLES}
                                        placeholder="#contato"
                                        aria-label="Link do Botão"
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`btn-bg-${sectionKey}`} className={LABEL_STYLES}>Cor Fundo Botão</label>
                                    <div className="flex gap-2">
                                        <input
                                            id={`btn-bg-${sectionKey}`}
                                            type="color"
                                            value={sectionData.button_bg_color || '#f97316'}
                                            onChange={(e) => updateSectionConfig(sectionKey, 'button_bg_color', e.target.value)}
                                            className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0"
                                            aria-label="Cor de Fundo do Botão"
                                        />
                                        <input
                                            type="text"
                                            value={sectionData.button_bg_color || ''}
                                            onChange={(e) => updateSectionConfig(sectionKey, 'button_bg_color', e.target.value)}
                                            className={INPUT_STYLES}
                                            placeholder="#f97316"
                                            aria-label="Texto da Cor do Botão"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor={`btn-color-${sectionKey}`} className={LABEL_STYLES}>Cor Texto Botão</label>
                                    <div className="flex gap-2">
                                        <input
                                            id={`btn-color-${sectionKey}`}
                                            type="color"
                                            value={sectionData.button_text_color || '#ffffff'}
                                            onChange={(e) => updateSectionConfig(sectionKey, 'button_text_color', e.target.value)}
                                            className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0"
                                            aria-label="Cor do Texto do Botão"
                                        />
                                        <input
                                            type="text"
                                            value={sectionData.button_text_color || ''}
                                            onChange={(e) => updateSectionConfig(sectionKey, 'button_text_color', e.target.value)}
                                            className={INPUT_STYLES}
                                            placeholder="#ffffff"
                                            aria-label="Texto da Cor do Texto do Botão"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
