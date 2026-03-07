import React from 'react';
import { SiteConfig } from '../../../../services/adminService';
import { Card } from '../../UI/Card';

interface ModulesSectionProps {
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({ config, setConfig }) => {
    return (
        <Card className="p-8 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-border-main bg-card-bg">
            <label className="flex items-center justify-between p-6 bg-surface-bg/50 hover:bg-brand-blue/5 border border-border-main/50 rounded-2xl cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${config.is_blog_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'} shadow`}></div>
                    <div>
                        <h4 className="font-bold text-txt-title text-sm italic  tracking-tight">Módulo de Blog</h4>
                        <p className="text-[10px] font-bold text-txt-subtitle   mt-0.5">Visibilidade pública</p>
                    </div>
                </div>
                <input
                    type="checkbox"
                    checked={config.is_blog_active}
                    onChange={(e) => setConfig({ ...config, is_blog_active: e.target.checked })}
                    className="w-5 h-5 accent-emerald-500 rounded-lg"
                    aria-label="Ativar ou desativar módulo de blog"
                />
            </label>
            <label className="flex items-center justify-between p-6 bg-surface-bg/50 hover:bg-brand-blue/5 border border-border-main/50 rounded-2xl cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${config.is_swot_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'} shadow`}></div>
                    <div>
                        <h4 className="font-bold text-txt-title text-sm italic  tracking-tight">Análise SWOT</h4>
                        <p className="text-[10px] font-bold text-txt-subtitle   mt-0.5">Sistema de Diagnóstico</p>
                    </div>
                </div>
                <input
                    type="checkbox"
                    checked={config.is_swot_active}
                    onChange={(e) => setConfig({ ...config, is_swot_active: e.target.checked })}
                    className="w-5 h-5 accent-emerald-500 rounded-lg"
                    aria-label="Ativar ou desativar módulo SWOT"
                />
            </label>
        </Card >
    );
};
