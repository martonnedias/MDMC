
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from './Button';
import { useSiteConfig } from '../lib/SiteContext';

interface ManifestoBannerProps {
    onStart?: () => void;
}

const ManifestoBanner: React.FC<ManifestoBannerProps> = ({ onStart }) => {
    const { config } = useSiteConfig();

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-12 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden text-center shadow-3xl border border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
                    <div className="absolute -top-32 -left-32 size-80 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-32 -right-32 size-80 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-3 mb-10 px-6 py-3 rounded-full bg-white/5 text-yellow-400 border border-white/10 text-xs font-semibold font-heading">
                            <Sparkles size={14} className="animate-pulse" /> Solução Estratégica
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 leading-tight text-white font-heading">
                            A MD Solution transforma <span className="text-yellow-500">gargalos técnicos</span> em operações de <span className="text-yellow-500">alta performance.</span>
                        </h2>

                        <div className="flex flex-col items-center">
                            <Button
                                onClick={onStart || scrollToContact}
                                variant="secondary"
                                className="h-16 px-12 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-yellow-500 hover:text-white transition-all shadow-3xl font-heading flex items-center gap-4 group"
                            >
                                Ativar Inteligência <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManifestoBanner;
