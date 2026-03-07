import React, { useEffect, useState } from 'react';
import { adminService, ServiceData } from '@/src/services/adminService';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
    const [groupedServices, setGroupedServices] = useState<Record<string, ServiceData[]>>({});
    const [loading, setLoading] = useState(true);

    const categoryNames: Record<string, string> = {
        'marketing': 'Gestão de Tráfego e Marketing',
        'swot': 'Auditoria de Marca e Mercado',
        'social-media': 'Social Media & Branding',
        'md-converte': 'Automação Inbound (MD Converte)',
        'sites': 'Criação de Plataformas e Sites',
        'consultancy': 'Consultoria Comercial Estratégica'
    };

    const categoryOrder = ['marketing', 'sites', 'social-media', 'md-converte', 'swot', 'consultancy', 'outros'];

    useEffect(() => {
        const loadPlans = async () => {
            const allServices = await adminService.getServices();
            // Filtrar apenas serviços que estao na section "pricing" ou todos em destaque no MVP
            // Para garantir que mostramos pacotes principais, podemos filtrar is_active.
            const activeServices = allServices.filter(s => s.is_active);
            activeServices.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

            const grouped = activeServices.reduce((acc, curr) => {
                const cat = curr.category || 'outros';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(curr);
                return acc;
            }, {} as Record<string, ServiceData[]>);

            setGroupedServices(grouped);
            setLoading(false);

            document.title = "Planos e Pacotes | MD Solution";
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', 'Conheça nossos planos e pacotes de serviços para escalar seu marketing digital. Soluções de tráfego, social media, sites e consultoria VIP.');
            }
        };

        loadPlans();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-page)] pt-32 pb-20 flex justify-center items-center">
                <div className="animate-pulse flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-brand-blue rounded-full"></div>
                    <div className="w-4 h-4 bg-brand-gold rounded-full"></div>
                    <div className="w-4 h-4 bg-brand-blue rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFBFF] pt-32 pb-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-40 left-0 w-[30%] h-[30%] bg-yellow-100/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-widest border border-brand-gold/20">
                        <Star size={12} className="fill-brand-gold" /> Investimento
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-brand-darkBlue uppercase leading-[0.9]">
                        Nossos <span className="text-brand-gold">Planos</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Soluções diretas para momentos diferentes da sua empresa. Escolha o melhor formato para a sua operação.
                    </p>
                </header>

                {Object.keys(groupedServices)
                    .sort((a, b) => {
                        const indexA = categoryOrder.indexOf(a);
                        const indexB = categoryOrder.indexOf(b);
                        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                    })
                    .map((category) => (
                        <div key={category} className="mb-24 last:mb-0">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                                <h2 className="text-2xl md:text-3xl font-black text-brand-darkBlue uppercase tracking-tighter">
                                    {categoryNames[category] || category}
                                </h2>
                                <span className="hidden md:inline-block text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
                                    {groupedServices[category].length} {groupedServices[category].length === 1 ? 'Solução' : 'Soluções'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {groupedServices[category].map((service) => (
                                    <div key={service.id} className={`bg-white rounded-[3rem] p-10 border ${service.is_highlighted ? 'border-brand-gold shadow-[0_30px_60px_-15px_rgba(230,86,0,0.15)] ring-4 ring-brand-gold/10 transform -translate-y-2 relative' : 'border-gray-100 shadow-xl shadow-gray-200/20 hover:border-brand-blue hover:shadow-2xl transition-all duration-300'} flex flex-col h-full bg-clip-padding`}>
                                        {service.is_highlighted && (
                                            <div className="absolute top-0 right-12 -translate-y-1/2 bg-gradient-to-r from-brand-gold to-[#B8860B] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                {service.badge_text || 'Premium'}
                                            </div>
                                        )}

                                        <div className="mb-8">
                                            <h3 className="text-3xl font-black text-brand-darkBlue mb-2 uppercase tracking-tighter leading-[0.9]">{service.name}</h3>
                                            {service.subtitle && <p className="text-brand-gold text-xs font-black uppercase tracking-widest mb-4 inline-block bg-yellow-50 px-3 py-1 rounded-lg">{service.subtitle}</p>}
                                            <p className="text-gray-500 text-sm">{service.description}</p>
                                        </div>

                                        <div className={`rounded-3xl p-6 mb-8 ${service.is_highlighted ? 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-100' : 'bg-gray-50 border border-gray-100'}`}>
                                            <div className="text-4xl font-black text-brand-darkBlue tracking-tighter flex items-end gap-1">
                                                {service.price}
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-10 flex-grow">
                                            {service.features.map((feature, i) => (
                                                <div key={i} className="flex gap-4 text-sm text-gray-700 font-medium">
                                                    <CheckCircle className={`shrink-0 mt-0.5 ${service.is_highlighted ? 'text-brand-gold' : 'text-emerald-500'}`} size={20} />
                                                    <span className="leading-snug">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Link
                                            to={`https://wa.me/556199999999?text=Olá,%20tenho%20interesse%20no%20pacote%20${encodeURIComponent(service.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-auto w-full py-5 text-center rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${service.is_highlighted ? 'bg-gradient-to-r from-brand-gold to-[#B8860B] text-white hover:scale-[1.02]' : 'bg-brand-darkBlue text-white hover:bg-brand-blue hover:scale-[1.02]'}`}
                                        >
                                            {service.cta_text || 'Quero Este Pacote'} <ArrowRight size={18} />
                                        </Link>

                                        {service.slug && (
                                            <Link to={`/servicos/${service.slug}`} className="mt-6 text-center text-[10px] font-black text-gray-400 hover:text-brand-blue uppercase tracking-widest transition-colors block">
                                                Saber mais sobre o serviço
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PricingPage;
