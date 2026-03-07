import React from 'react';
import { ShieldCheck, TrendingUp, Search, Sparkles } from 'lucide-react';

interface TransparencyFoundationProps {
    title?: string;
    subtitle?: string;
}

export const TransparencyFoundation: React.FC<TransparencyFoundationProps> = ({
    title,
    subtitle
}) => {
    const pilares = [
        { icon: ShieldCheck, title: "Integridade de Dados", text: "Você tem acesso total aos gerenciadores de anúncios. O dinheiro investido vai direto para a plataforma, sem intermediários ocultos.", color: "text-emerald-500", bg: "bg-emerald-50" },
        { icon: TrendingUp, title: "Crescimento Real", text: "Focamos em faturamento e lucro, não em curtidas ou visualizações que não pagam as contas da sua empresa no final do mês.", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: Search, title: "Diagnóstico Sem Filtro", text: "Se acharmos que seu site ou processo de vendas está ruim, nós falaremos. Só conserta quem admite o erro e olha no olho do problema.", color: "text-yellow-500", bg: "bg-yellow-50" },
        { icon: Sparkles, title: "Inovação Humana", text: "Usamos as melhores IAs do mundo para escala, mas o toque final é sempre de um estrategista humano que entende de gente.", color: "text-purple-500", bg: "bg-purple-50" }
    ];

    return (
        <section id="transparency-foundation" className="relative py-24 lg:py-40 bg-card-bg overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-24 space-y-6">
                    <h2 id="transparency-title" className="text-5xl lg:text-7xl  font-bold text-txt-title dark:text-white   leading-tight border-b-4 border-yellow-500 inline-block pb-4">
                        {title || 'A TRANSPARÊNCIA COMO FUNDAÇÃO'}
                    </h2>
                    <p id="transparency-subtitle" className="text-lg text-txt-subtitle dark:text-slate-400 max-w-2xl mx-auto font-mono   pt-4">
                        {subtitle || 'Na MD Solution, a honestidade não é um diferencial, é o pré-requisito absoluto.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border-main border-2 border-border-main">
                    {pilares.map((pilar, i) => (
                        <div key={i} id={`transparency-item-${i}`} className="group p-8 bg-page-bg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative flex flex-col">
                            {i === 0 && <div className="absolute top-0 left-0 w-2 h-2 bg-emerald-500"></div>}
                            {i === 1 && <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500"></div>}
                            {i === 2 && <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-500"></div>}
                            {i === 3 && <div className="absolute top-0 left-0 w-2 h-2 bg-purple-500"></div>}

                            <div className={`w-12 h-12 mb-8 flex items-center justify-center border-2 border-current ${pilar.color}`}>
                                <pilar.icon size={24} />
                            </div>
                            <h4 className="text-lg  font-bold text-txt-title dark:text-white mb-4  ">{pilar.title}_</h4>
                            <p className="text-txt-subtitle dark:text-slate-400 leading-relaxed text-xs font-mono  tracking-wider">{pilar.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
