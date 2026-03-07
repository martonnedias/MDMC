import React from 'react';
import { Sparkles, Key, Save, Cpu, BrainCircuit } from 'lucide-react';
import { SiteConfig } from '../../../services/adminService';
import Button from '../../Button';

interface IAConfigTabProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
    onSave: (e: React.FormEvent) => void;
    loading: boolean;
}

const IAConfigTab: React.FC<IAConfigTabProps> = ({ config, setConfig, onSave, loading }) => {
    const apiKeys = config.content?.api_keys || {};

    const updateKey = (service: string, value: string) => {
        setConfig({
            ...config,
            content: {
                ...config.content,
                api_keys: {
                    ...apiKeys,
                    [service]: value
                }
            }
        });
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <Sparkles className="text-blue-600" /> IA & Inteligência
                    </h1>
                    <p className="text-gray-500 font-medium tracking-tight mt-2">
                        Configure as chaves de API e preferências para automação de conteúdo e SEO.
                    </p>
                </div>
                <Button onClick={onSave} loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-200">
                    <Save size={18} /> Salvar Chaves
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* GEMINI AI */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <BrainCircuit size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 tracking-tight  text-sm">Google Gemini AI</h3>
                            <p className="text-[10px] font-bold text-gray-400  ">Motor de Redação e SEO</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400   ml-1 block">API Key (Gemini Pro)</label>
                        <div className="relative">
                            <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={apiKeys.gemini || ''}
                                onChange={(e) => updateKey('gemini', e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xs font-mono"
                                placeholder="Paste your API key here..."
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic pr-4">
                            Usado para gerar descrições de produtos, posts de blog e sugestões de otimização de SEO em tempo real.
                        </p>
                    </div>
                </div>

                {/* OPENAI (Optional Future) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 opacity-60 grayscale cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 tracking-tight  text-sm">OpenAI GPT-4</h3>
                            <p className="text-[10px] font-bold text-gray-400  ">Em breve</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400   ml-1 block">API Key</label>
                        <input disabled type="password" className="w-full px-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-xs" placeholder="••••••••••••••••" />
                    </div>
                </div>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100/50">
                <h4 className="font-bold text-blue-900 text-sm  tracking-tight mb-4 flex items-center gap-2">
                    <Sparkles size={16} /> Como funciona a Inteligência MD?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-blue-500  ">Otimização SEO</span>
                        <p className="text-xs text-blue-800/70 leading-relaxed">Analisa seus títulos e textos sugerindo palavras-chave de alto volume para o Google.</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-blue-500  ">Redação de Elite</span>
                        <p className="text-xs text-blue-800/70 leading-relaxed">Transforma rascunhos simples em copys profissionais focadas em conversão.</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-blue-500  ">Insights Locais</span>
                        <p className="text-xs text-blue-800/70 leading-relaxed">Sugere melhorias específicas para o seu nicho de atuação no mercado digital.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IAConfigTab;
