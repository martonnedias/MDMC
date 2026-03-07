import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';

interface StrategicPillarsProps {
    mission_text?: string;
    vision_text?: string;
    delivery_text?: string;
}

export const StrategicPillars: React.FC<StrategicPillarsProps> = ({
    mission_text,
    vision_text,
    delivery_text
}) => {
    return (
        <section id="strategic-pillars" className="relative py-24 lg:py-32 bg-page-bg dark:bg-[#0a0a0a] border-b-2 border-border-main">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border-main border-2 border-border-main">
                    {/* MISSÃO */}
                    <div id="pillar-mission" className="bg-card-bg p-8 lg:p-12 space-y-8 group hover:bg-page-bg transition-colors relative flex flex-col items-start">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500"></div>
                        <div className="w-12 h-12 border-2 border-yellow-500 text-yellow-500 flex items-center justify-center">
                            <Target size={24} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl  font-bold text-txt-title dark:text-white   mb-4">Nossa Missão_</h3>
                            <p className="text-txt-subtitle dark:text-slate-400 leading-relaxed font-mono">
                                {mission_text || 'Transformar pequenas e médias empresas brasileiras através de uma presença digital honesta, estratégica e altamente lucrativa. Existimos para que o empresário possa focar no que ama, enquanto nós cuidamos do motor de vendas.'}
                            </p>
                        </div>
                    </div>

                    {/* VISÃO */}
                    <div id="pillar-vision" className="bg-card-bg p-8 lg:p-12 space-y-8 group hover:bg-page-bg transition-colors relative flex flex-col items-start">
                        <div className="w-12 h-12 border-2 border-brand-blue text-brand-blue flex items-center justify-center">
                            <Eye size={24} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl  font-bold text-txt-title dark:text-white   mb-4">Nossa Visão_</h3>
                            <p className="text-txt-subtitle dark:text-slate-400 leading-relaxed font-mono">
                                {vision_text || 'Ser a consultoria de referência em integridade e resultados reais no Brasil. Queremos elevar o padrão do mercado digital, onde a transparência é o ativo mais valioso de uma parceria.'}
                            </p>
                        </div>
                    </div>

                    {/* ENTREGA (DESTAQUE) */}
                    <div id="pillar-delivery" className="bg-brand-blue p-8 lg:p-12 text-white space-y-8 relative flex flex-col items-start">
                        <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>
                        <div className="w-12 h-12 bg-white text-brand-blue flex items-center justify-center">
                            <Heart size={24} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl  font-bold text-white   mb-4">Nossa Entrega_</h3>
                            <p className="text-white/80 leading-relaxed font-mono">
                                {delivery_text || 'Não entregamos apenas "posts" ou "anúncios". Entregamos compromisso. Se o resultado não aparece, nós não descansamos. Sua empresa é tratada com o mesmo zelo que tratamos a nossa.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
