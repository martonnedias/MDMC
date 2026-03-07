import React from 'react';
import { Globe, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { SiteConfig } from '../../../../services/adminService';
import { Card } from '../../UI/Card';
import { Input } from '../../UI/Input';
import { Select } from '../../UI/Select';

interface IdentitySectionProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
    handleUpload: (file: File, callback: (url: string) => void) => Promise<void>;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({ config, setConfig, handleUpload }) => {
    return (
        <Card className="p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-border-main bg-card-bg">
            <div className="space-y-4">
                <Input
                    label="Nome da Empresa"
                    type="text"
                    value={config.site_name}
                    onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                />
                <Input
                    label="Telefone de Contato"
                    type="text"
                    value={config.phone}
                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                />
                <Input
                    label="WhatsApp Direct (Apenas números)"
                    type="text"
                    value={config.whatsapp}
                    onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                    placeholder="55869..."
                />
                <Input
                    label="Email de Contato"
                    type="email"
                    value={config.email || ''}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    placeholder="contato@empresa.com"
                />
            </div>

            <div className="space-y-4">
                <h5 className="text-[10px] font-bold   text-txt-subtitle mt-2">Links das Redes Sociais</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Instagram URL"
                        value={config.instagram_url || ''}
                        onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/..."
                    />
                    <Input
                        label="Facebook URL"
                        value={config.facebook_url || ''}
                        onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                        placeholder="https://facebook.com/..."
                    />
                    <Input
                        label="YouTube URL"
                        value={config.youtube_url || ''}
                        onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                    />
                    <Input
                        label="LinkedIn URL"
                        value={config.linkedin_url || ''}
                        onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                    />
                    <Input
                        label="TikTok URL"
                        value={config.tiktok_url || ''}
                        onChange={(e) => setConfig({ ...config, tiktok_url: e.target.value })}
                        placeholder="https://tiktok.com/@..."
                    />
                    <Input
                        label="Telegram URL"
                        value={config.telegram_url || ''}
                        onChange={(e) => setConfig({ ...config, telegram_url: e.target.value })}
                        placeholder="https://t.me/..."
                    />
                </div>
            </div>

            <div className="space-y-6 md:col-span-2 pt-6 border-t border-border-main">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Logo Principal */}
                    <div>
                        <div className="flex gap-4 items-start">
                            <div className="relative flex-1">
                                <Input
                                    label="Logo Principal (Fundo Claro)"
                                    value={config.logo_url || ''}
                                    onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                                    placeholder="URL da logo..."
                                />
                                <div className="absolute right-2 top-9 flex items-center gap-1">
                                    {config.logo_url && (
                                        <button
                                            type="button"
                                            onClick={() => setConfig({ ...config, logo_url: '' })}
                                            className="p-1.5 hover:bg-red-500/10 text-subtitle hover:text-red-500 rounded-lg transition-colors"
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
                                        className="p-1.5 hover:bg-brand-blue/10 text-brand-blue rounded-lg transition-colors"
                                        title="Upload Nova Imagem"
                                        aria-label="Upload de logo principal"
                                    >
                                        <Upload size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-surface-bg rounded-2xl border border-border-main flex items-center justify-center overflow-hidden shrink-0 mt-6 shadow-sm">
                                {config.logo_url ? <img src={config.logo_url} className="max-h-full" alt="Logo Principal" /> : <ImageIcon className="text-txt-subtitle opacity-30" />}
                            </div>
                        </div>
                        <div className="mt-3">
                            <Select
                                label="Tamanho no Cabeçalho"
                                value={config.logo_height_header || 'h-10'}
                                onChange={(e) => setConfig({ ...config, logo_height_header: e.target.value })}
                            >
                                <option value="h-6">Muito Pequeno (24px)</option>
                                <option value="h-8">Pequeno (32px)</option>
                                <option value="h-10">Normal (40px)</option>
                                <option value="h-12">Médio (48px)</option>
                                <option value="h-14">Médio-Grande (56px)</option>
                                <option value="h-16">Grande (64px)</option>
                            </Select>
                        </div>
                    </div>

                    {/* Logo Negativa */}
                    <div>
                        <div className="flex gap-4 items-start">
                            <div className="relative flex-1">
                                <Input
                                    label="Logo Negativa (Dark Mode)"
                                    value={config.logo_light_url || ''}
                                    onChange={(e) => setConfig({ ...config, logo_light_url: e.target.value })}
                                    placeholder="URL da logo branca..."
                                />
                                <div className="absolute right-2 top-9 flex items-center gap-1">
                                    {config.logo_light_url && (
                                        <button
                                            type="button"
                                            onClick={() => setConfig({ ...config, logo_light_url: '' })}
                                            className="p-1.5 hover:bg-red-500/10 text-subtitle hover:text-red-500 rounded-lg transition-colors"
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
                                        className="p-1.5 hover:bg-brand-blue/10 text-brand-blue rounded-lg transition-colors"
                                        title="Upload Nova Imagem"
                                    >
                                        <Upload size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 mt-6 shadow-inner">
                                {config.logo_light_url ? <img src={config.logo_light_url} className="max-h-full" alt="Logo Negativa" /> : <ImageIcon className="text-slate-600" />}
                            </div>
                        </div>
                    </div>

                    {/* Footer Slogan */}
                    <div className="flex flex-col justify-end">
                        <div className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                            <Input
                                label="Slogan do Rodapé"
                                value={config.slogan || ''}
                                onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
                                placeholder="Estrategistas Digitais..."
                            />
                            <p className="text-[9px] text-brand-blue font-bold mt-2  tracking-tight">
                                ✨ Exibido ao lado da logo no rodapé
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
