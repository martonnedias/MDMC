import React from 'react';
import { Palette, Link, Type, Layout, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { SiteConfig } from '../../../../services/adminService';
import { Card } from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';
import { useToast } from '../../UI/Toast';

interface DesignSystemSectionProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
}

const ColorPicker = ({
    label,
    value,
    onChange,
    description
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    description?: string;
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-txt-title  tracking-wide flex items-center justify-between">
            {label}
        </label>
        {description && <p className="text-[10px] text-txt-subtitle mb-1">{description}</p>}
        <div className="flex items-center gap-3 bg-surface-bg p-2 rounded-xl border border-border-main hover:border-brand-blue/30 transition-colors">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-inner border border-black/10 dark:border-white/10">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                    title={`Seletor de cor para: ${label}`}
                />
            </div>
            <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="font-mono text-sm  flex-1 !p-2 !h-10 !bg-transparent border-none focus:ring-0"
                placeholder="#000000"
            />
        </div>
    </div>
);

const SectionHeading = ({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action?: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-3 mb-6 pb-4 border-b border-border-main/50">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
                <Icon size={18} />
            </div>
            <div>
                <h5 className="font-bold text-txt-title text-sm">{title}</h5>
                <p className="text-xs text-txt-subtitle">{description}</p>
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const DesignSystemSection: React.FC<DesignSystemSectionProps> = ({ config, setConfig }) => {
    const { showConfirm, showToast } = useToast();

    // Helper to safely update nested theme colors
    const updateThemeColor = (key: keyof NonNullable<NonNullable<SiteConfig['theme']>['colors']>, value: string) => {
        setConfig({
            ...config,
            theme: {
                ...config.theme,
                colors: {
                    ...config.theme?.colors,
                    [key]: value
                } as any
            }
        });
    };

    const handleRestoreDefaults = async () => {
        const confirmed = await showConfirm({
            title: 'Restaurar Padrões Originais',
            message: 'Tem certeza? Isso substituirá todas as suas cores, tipografias e bordas pelas do design original do Stitch. Você precisará clicar em "Salvar Configurações" no final para aplicar.',
            confirmLabel: 'Sim, Restaurar Padrões',
            variant: 'warning'
        });

        if (confirmed) {
            import('../../../../constants/adminConstants').then(({ DEFAULT_SITE_CONFIG }) => {
                setConfig({
                    ...config,
                    primary_color: DEFAULT_SITE_CONFIG.primary_color,
                    secondary_color: DEFAULT_SITE_CONFIG.secondary_color,
                    theme: {
                        ...config.theme,
                        border_radius: DEFAULT_SITE_CONFIG.theme?.border_radius,
                        typography: DEFAULT_SITE_CONFIG.theme?.typography,
                        colors: DEFAULT_SITE_CONFIG.theme?.colors,
                        layout_mode: 'wide'
                    }
                });
                showToast('Tema original restaurado! Não esqueça de Salvar as Configurações.', 'success');
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-bold text-txt-title   px-1">Identidade Visual</h4>
                <button
                    type="button"
                    onClick={handleRestoreDefaults}
                    className="flex items-center gap-2 text-[10px] font-bold   text-yellow-500 hover:text-yellow-600 transition-colors bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-lg"
                >
                    <RotateCcw size={14} className="rotate-180" />
                    Resetar Tema Original
                </button>
            </div>

            {/* 1. Cores da Marca (Brand) */}
            <Card className="p-6 border-border-main bg-card-bg shadow-sm">
                <SectionHeading
                    icon={Palette}
                    title="Cores da Marca"
                    description="Defina a identidade principal (logotipo central) e os acentos universais que representam sua marca."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ColorPicker
                        label="Cor Primária"
                        description="Ex: Botões principais e bot."
                        value={config.primary_color}
                        onChange={(val) => setConfig({ ...config, primary_color: val })}
                    />
                    <ColorPicker
                        label="Cor Secundária"
                        description="Ex: Textos em destaque e avisos."
                        value={config.secondary_color}
                        onChange={(val) => setConfig({ ...config, secondary_color: val })}
                    />
                    <ColorPicker
                        label="Brand Blue"
                        description="Variação azul da marca."
                        value={config.theme?.colors?.brand_blue || ''}
                        onChange={(val) => updateThemeColor('brand_blue', val)}
                    />
                    <ColorPicker
                        label="Brand Gold"
                        description="Variação dourada da marca."
                        value={config.theme?.colors?.brand_gold || ''}
                        onChange={(val) => updateThemeColor('brand_gold', val)}
                    />
                </div>
            </Card>

            {/* 2. Cores de Fundo (Backgrounds) */}
            <Card className="p-6 border-border-main bg-card-bg shadow-sm">
                <SectionHeading
                    icon={ImageIcon}
                    title="Cores de Fundo"
                    description="Controle o ambiente preenchendo as diferentes seções do layout."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ColorPicker
                        label="Fundo Principal"
                        value={config.theme?.colors?.background || ''}
                        onChange={(val) => updateThemeColor('background', val)}
                    />
                    <ColorPicker
                        label="Fundo de Cards"
                        value={config.theme?.colors?.card_background || ''}
                        onChange={(val) => updateThemeColor('card_background', val)}
                    />
                    <ColorPicker
                        label="Fundo do Cabeçalho"
                        value={config.theme?.colors?.header_background || ''}
                        onChange={(val) => updateThemeColor('header_background', val)}
                    />
                    <ColorPicker
                        label="Fundo do Rodapé"
                        value={config.theme?.colors?.footer_background || ''}
                        onChange={(val) => updateThemeColor('footer_background', val)}
                    />
                </div>
            </Card>

            {/* 3. Cores de Texto (Typography Colors) */}
            <Card className="p-6 border-border-main bg-card-bg shadow-sm">
                <SectionHeading
                    icon={Type}
                    title="Cores de Texto"
                    description="Assegure contraste e legibilidade com textos principais e secundários."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ColorPicker
                        label="Texto Principal"
                        value={config.theme?.colors?.text_primary || ''}
                        onChange={(val) => updateThemeColor('text_primary', val)}
                    />
                    <ColorPicker
                        label="Texto Secundário"
                        value={config.theme?.colors?.text_secondary || ''}
                        onChange={(val) => updateThemeColor('text_secondary', val)}
                    />
                    <ColorPicker
                        label="Cor dos Títulos"
                        value={config.theme?.colors?.title_color || ''}
                        onChange={(val) => updateThemeColor('title_color', val)}
                    />
                    <ColorPicker
                        label="Cor dos Subtítulos"
                        value={config.theme?.colors?.subtitle_color || ''}
                        onChange={(val) => updateThemeColor('subtitle_color', val)}
                    />
                </div>
            </Card>

            {/* 4. Tipografia e Layout */}
            <Card className="p-6 border-border-main bg-card-bg shadow-sm">
                <SectionHeading
                    icon={Layout}
                    title="Tipografia e Forma"
                    description="Estilos estruturais, fontes e bordas do ecossistema geral."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <Input
                        label="Tipografia: Corpo do Texto"
                        value={config.theme?.typography?.font_family}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, font_family: e.target.value } as any } })}
                        placeholder="Inter, Outfit, Roboto"
                    />
                    <Input
                        label="Tipografia: Títulos e H1"
                        value={config.theme?.typography?.heading_font}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, typography: { ...config.theme?.typography, heading_font: e.target.value } as any } })}
                        placeholder="Poppins, Montserrat"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border-main pt-6">
                    <Select
                        label="Arredondamento Padrão (Cards)"
                        value={config.theme?.border_radius || '2rem'}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, border_radius: e.target.value } })}
                    >
                        <option value="0px">Nenhum (Square)</option>
                        <option value="0.5rem">Suave (8px)</option>
                        <option value="1rem">Arredondado (16px)</option>
                        <option value="2rem">Premium (32px)</option>
                        <option value="3rem">Ultra Circular (48px)</option>
                    </Select>
                    <Select
                        label="Modo de Layout Central"
                        value={config.theme?.layout_mode || 'wide'}
                        onChange={(e) => setConfig({ ...config, theme: { ...config.theme, layout_mode: e.target.value as any } })}
                    >
                        <option value="wide">Largo (Container Máximo)</option>
                        <option value="boxed">Boxado (Limites laterais visíveis)</option>
                        <option value="full">Tela Cheia (Sem Limites)</option>
                        <option value="compact">Compacto (Concentrado ao Centro)</option>
                    </Select>
                </div>
            </Card>
        </div>
    );
};
