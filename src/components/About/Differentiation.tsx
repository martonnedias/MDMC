import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Button from '../Button';

interface DifferentiationProps {
    diff_text?: string;
    onNavigate?: (view: any) => void;
}

export const Differentiation: React.FC<DifferentiationProps> = ({
    diff_text,
    onNavigate
}) => {
    return (
        <section id="differentiation" className="relative py-24 lg:py-40 bg-page-bg dark:bg-[#0f172a] overflow-hidden border-y border-border-main">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24">
                    <div className="lg:w-1/2 w-full order-2 lg:order-1">
                        <div id="diff-card" className="relative bg-page-bg p-8 lg:p-12 shadow-none border-2 border-border-main">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-500"></div>
                            <h3 id="diff-card-title" className="text-2xl font-bold mb-12 text-txt-title dark:text-white   font-mono">/ DIFERENCIAL</h3>
                            <div className="space-y-6 border-t border-border-main pt-8">
                                {[
                                    "FOCO 100% EM PMEs E NEGÓCIOS LOCAIS.",
                                    "SEM CONTRATOS DE FIDELIDADE ABUSIVOS: FICAMOS POR RESULTADO.",
                                    "ATENDIMENTO DIRETO COM QUEM EXECUTA SUA ESTRATÉGIA.",
                                    "LINGUAGEM SIMPLES: NADA DE 'INTERNETÊS' PARA TE CONFUNDIR."
                                ].map((t, i) => (
                                    <div key={i} id={`diff-item-${i}`} className="flex gap-4 items-start group">
                                        <div className="w-5 h-5 border border-yellow-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-yellow-500 transition-colors">
                                            <Check size={12} className="text-yellow-500 group-hover:text-white dark:group-hover:text-white" />
                                        </div>
                                        <p className="text-sm text-txt-subtitle dark:text-slate-300 font-bold leading-tight  font-mono tracking-wider group-hover:text-yellow-500 transition-colors">{t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 space-y-8 order-1 lg:order-2">
                        <h2 id="diff-title" className="text-5xl lg:text-7xl  font-bold text-txt-title dark:text-white tracking-tight leading-[0.9] ">
                            TENHO SEU <br />
                            <span className="text-yellow-500">NOME</span> <br />
                            ESCRITO NELA.
                        </h2>
                        <p id="diff-text" className="text-lg text-txt-subtitle dark:text-slate-400 leading-relaxed font-mono border-l-2 border-yellow-500 pl-6">
                            {diff_text || 'Não somos uma agência de massa. Somos uma consultoria boutique. Isso significa que limitamos o número de clientes que atendemos para garantir que o seu projeto receba a atenção, a originalidade e a honestidade que ele merece.'}
                        </p>

                        <div className="flex justify-start gap-1 py-4">
                            <div className="w-16 h-1 bg-brand-blue"></div>
                            <div className="w-4 h-1 bg-yellow-500"></div>
                        </div>

                        <div className="pt-4">
                            <Button id="diff-cta" onClick={() => onNavigate?.('landing')} variant="primary" className="px-10 py-5 text-[11px]  tracking-[0.2em] font-mono border-2 border-yellow-500 bg-yellow-500 text-white rounded-none hover:bg-transparent hover:text-yellow-500" withIcon icon={<ArrowRight size={16} />}>
                                Conheça Nossos Planos
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
