import React from 'react';
import { Globe } from 'lucide-react';
import { SiteConfig } from '../../../../services/adminService';
import { Card } from '../../UI/Card';
import { Input } from '../../UI/Input';

interface AIConfigSectionProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
}

export const AIConfigSection: React.FC<AIConfigSectionProps> = ({ config, setConfig }) => {
    return (
        <Card className="p-6 mb-6 border-border-main bg-card-bg">
            <div className="space-y-4">
                <div className="bg-brand-blue/5 border border-brand-blue/10 p-6 rounded-2xl mb-4">
                    <h4 className="flex items-center gap-2 font-bold text-txt-title mb-2  text-xs ">
                        <Globe size={16} className="text-brand-blue" /> Google Gemini AI
                    </h4>
                    <p className="text-[11px] text-txt-subtitle mb-6 font-bold  tracking-tight opacity-70">
                        Inteligência artificial para o "IA Magic" do Editor e geração de conteúdo técnico.
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline ml-1">Gerar Chave Master</a>
                    </p>
                    <Input
                        label="Gemini API Key"
                        type="password"
                        value={config.content?.api_keys?.gemini || ''}
                        onChange={(e) => setConfig({
                            ...config,
                            content: {
                                ...config.content,
                                api_keys: {
                                    ...config.content?.api_keys,
                                    gemini: e.target.value
                                }
                            }
                        })}
                        placeholder="AIzaSy..."
                    />
                </div>
            </div>
        </Card>
    );
};
