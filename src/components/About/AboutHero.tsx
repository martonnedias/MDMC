import React from 'react';
import Button from '../Button';
import { Target } from 'lucide-react';

interface AboutHeroProps {
    title_parts?: string[];
    subtitle?: string;
    cta?: string;
    image_url?: string;
    onCtaClick?: () => void;
}

export const AboutHero: React.FC<AboutHeroProps> = ({
    title_parts,
    subtitle,
    cta,
    image_url,
    onCtaClick
}) => {
    return (
        <section id="manifesto-hero" className="relative pt-32 lg:pt-48 pb-20 lg:pb-40 bg-page-bg text-txt-title dark:text-white overflow-hidden border-b-2 border-border-main">
            {/* Grid background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
                style={{
                    
                    backgroundSize: '40px 40px'
                }}>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="animate-fade-in space-y-8">
                        <div id="manifesto-tag" className="inline-flex items-center gap-2 px-4 py-1 border-2 border-brand-blue text-brand-blue font-mono font-bold text-[10px]  tracking-[0.2em] bg-transparent">
                            <Target size={10} className="animate-pulse" /> NOSSO_MANIFESTO_V3
                        </div>
                        <h1 id="manifesto-title" className="text-5xl sm:text-7xl lg:text-9xl font-mono font-bold leading-[0.85] tracking-tight text-txt-title dark:text-white  break-words">
                            {title_parts ? (
                                <>
                                    {title_parts[0].toUpperCase()} <br />
                                    <span className="text-brand-blue italic">{title_parts[1].toUpperCase()}</span> <br />
                                    <span className="text-yellow-500">{title_parts[2].toUpperCase()}</span>
                                </>
                            ) : (
                                <>
                                    O_MARKETING <br /> DIGITAL_ESTÁ <br /> QUEBRADO. NÓS <br />
                                    <span className="text-brand-blue italic">VIEMOS</span> <br />
                                    <span className="text-yellow-500">CONSERTAR_V5.</span>
                                </>
                            )}
                        </h1>
                        <p id="manifesto-subtitle" className="text-lg md:text-xl text-txt-subtitle dark:text-slate-400 leading-relaxed font-mono font-bold  tracking-tight max-w-2xl border-l-4 border-yellow-500 pl-6 opacity-80">
                            {subtitle ? subtitle.toUpperCase() : 'CHEGA_DE_PROMESSAS_MILAGROSAS_E_RELATÓRIOS_CHEIOS_DE_MÉTRICAS_DE_VAIDADE. A_MD_SOLUTION_NASCEU_PARA_UNIR_A_CLAREZA_DA_ESTRATÉGIA_V3.'}
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row gap-6 items-center">
                            <Button id="manifesto-cta" onClick={onCtaClick} variant="primary" className="px-10 py-5 text-[11px]  tracking-[0.3em] font-mono font-bold border-4 border-yellow-500 bg-yellow-500 text-white rounded-none hover:bg-transparent hover:text-yellow-500 transition-all shadow-xl" withIcon>
                                {cta ? cta.toUpperCase() : 'FAZER_PARTE_DO_FUTURO_00'}
                            </Button>

                            <div className="flex flex-col gap-1 border-l-2 border-border-main pl-4">
                                <div className="flex -space-x-2 overflow-hidden mb-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="inline-block h-8 w-8 bg-slate-200 dark:bg-slate-800 border-2 border-txt-title dark:border-white rounded-none">
                                            <img className="w-full h-full object-cover grayscale mix-blend-multiply dark:mix-blend-screen opacity-70" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" />
                                        </div >
                                    ))}
                                </div >
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold   text-slate-500 hover:text-yellow-500 cursor-pointer">Compartilhar</span>
                                    <div className="h-px w-4 bg-border-main"></div>
                                    <span className="text-[10px] font-mono font-bold   text-slate-500 hover:text-yellow-500 cursor-pointer">Copiar Link</span>
                                </div>
                            </div >
                        </div >
                    </div >

                    <div id="manifesto-visual-container" className="relative hidden lg:block">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-brand-blue"></div>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-brand-blue"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-brand-blue"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-brand-blue"></div>

                        <div className="relative border-2 border-txt-title dark:border-border-main p-4 bg-page-bg">
                            <img
                                id="manifesto-main-image"
                                src={image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"}
                                alt="MD Solution Team"
                                className="w-full h-auto object-cover aspect-[4/3] grayscale mix-blend-multiply dark:mix-blend-screen opacity-80 border-2 border-border-main"
                            />
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );
};
