import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/src/components/Hero';
import PainPoints from '@/src/components/PainPoints';
import Checklist from '../../components/Checklist';
import Services from '@/src/components/Services';
import SwotSection from '@/src/components/SwotSection';
import Combos from '@/src/components/Combos';
import Testimonials from '@/src/components/Testimonials';
import Trust from '@/src/components/Trust';
import Faq from '@/src/components/Faq';
import FadeIn from '@/src/components/FadeIn';
import { SEO } from '@/src/components/SEO';

export const HomePage: React.FC<{ config: any }> = ({ config }) => {
    const navigate = useNavigate();

    const handleNavigate = (view: any) => {
        // Lógica simples de navegação baseada no App antigo
        if (view === 'marketing-diagnosis') {
            navigate('/marketing-diagnosis');
        } else if (view === 'swot-service') {
            navigate('/swot-service');
        } else {
            navigate('/' + view);
        }
    };

    return (
        <>
            <SEO
                title="Performance Digital e Consultoria de Vendas"
                description="Agência de marketing digital focada em resultados reais. Google Ads, Meta Ads, Sites Profissionais e Diagnóstico SWOT para PMEs."
                keywords="marketing digital, tráfego pago, google ads, meta ads, consultoria de vendas, análise swot, teresina"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "ProfessionalService",
                    "name": "MD Solution Marketing & Consultoria",
                    "url": "https://mdsolution.com.br",
                    "logo": "https://mdsolution.com.br/logo.png",
                    "sameAs": [
                        "https://instagram.com/mdsolution",
                        "https://linkedin.com/company/mdsolution"
                    ],
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Teresina",
                        "addressRegion": "PI",
                        "addressCountry": "BR"
                    },
                    "description": "Consultoria especializada em tráfego pago, criação de sites e inteligência de vendas para PMEs."
                }}
            />
            <Hero
                onStartBriefing={() => navigate('/marketing-diagnosis')}
                onStartSwot={() => navigate('/swot-service')}
                onNavigate={handleNavigate as any}
            />

            {config?.content?.sections?.['pain_points']?.is_active !== false && (
                <FadeIn>
                    <PainPoints />
                </FadeIn>
            )}

            {config?.content?.sections?.['checklist']?.is_active !== false && (
                <FadeIn>
                    <Checklist />
                </FadeIn>
            )}

            {config?.content?.sections?.['services']?.is_active !== false && (
                <FadeIn>
                    <Services onNavigate={handleNavigate as any} />
                </FadeIn>
            )}

            {(config?.is_swot_active || config?.content?.sections?.['swot']?.is_active !== false) && (
                <FadeIn>
                    <SwotSection onNavigate={handleNavigate as any} />
                </FadeIn>
            )}

            {config?.content?.sections?.['combos']?.is_active !== false && (
                <FadeIn>
                    <Combos />
                </FadeIn>
            )}

            {config?.content?.sections?.['testimonials']?.is_active !== false && (
                <FadeIn>
                    <Testimonials />
                </FadeIn>
            )}

            {config?.content?.sections?.['trust']?.is_active !== false && (
                <FadeIn>
                    <Trust />
                </FadeIn>
            )}

            {config?.content?.sections?.['faq']?.is_active !== false && (
                <FadeIn>
                    <Faq />
                </FadeIn>
            )}
            {config?.content?.sections?.['blog']?.is_active !== false && (
                <FadeIn>
                    <section className="py-24 bg-white">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-heading font-black text-brand-darkBlue mb-4 tracking-tighter uppercase">Insights <span className="text-brand-gold italic">Estratégicos</span></h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">Conteúdo prático para escalar seu negócio.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((post) => (
                                    <div key={post} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full cursor-pointer" onClick={() => navigate('/blog')}>
                                        <div className="h-48 bg-gray-200 overflow-hidden">
                                            <img src={`https://picsum.photos/seed/bg${post}/800/600`} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex gap-2 mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Marketing</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">5 min leitura</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-brand-darkBlue mb-3 group-hover:text-brand-blue transition-colors">Como escalar suas vendas usando tráfego pago em 2024</h3>
                                            <p className="text-sm text-gray-600 mb-6 flex-1">Descubra as estratégias validadas que estão gerando mais ROI para negócios locais neste ano.</p>
                                            <div className="flex items-center text-brand-blue font-bold text-sm">
                                                Ler Artigo <span className="text-xl leading-none ml-2 mb-1 group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <button onClick={() => navigate('/blog')} className="inline-block border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 rounded-full font-bold transition-colors">
                                    Ver Todos os Artigos
                                </button>
                            </div>
                        </div>
                    </section>
                </FadeIn>
            )}

            <FadeIn>
                <section className="py-24 bg-brand-darkBlue relative overflow-hidden">
                    {/* Elementos decorativos */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
                                <span className="text-3xl">✉️</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6 tracking-tighter uppercase">Quer receber <span className="text-brand-gold italic">dicas práticas</span> toda semana?</h2>
                            <p className="text-gray-300 text-lg mb-10">Assine nossa newsletter gratuita e junte-se a mais de 5.000 empresários que recebem nossas estratégias validadas de marketing e vendas.</p>

                            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert("Obrigado por assinar!"); }}>
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail corporativo"
                                    required
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
                                />
                                <button type="submit" className="bg-brand-gold hover:bg-yellow-600 text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-colors shadow-lg shadow-brand-gold/20 whitespace-nowrap">
                                    Assinar Grátis
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-4">Zero spam. Cancele quando quiser.</p>
                        </div>
                    </div>
                </section>
            </FadeIn>
            <FadeIn>
                <section className="py-24 md:py-32 bg-white relative overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="bg-brand-darkBlue rounded-[3rem] p-12 md:p-24 text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
                            {/* Decorative bg */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 tracking-tighter uppercase leading-[1.1]">
                                    Pronto para <span className="text-brand-gold italic">escalar</span> o seu negócio?
                                </h2>
                                <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto font-medium">
                                    Agende agora uma consultoria gratuita e descubra como a MD Solution pode transformar seus resultados digitais em lucratividade real.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button onClick={() => navigate('/marketing-diagnosis')} className="bg-brand-gold hover:bg-yellow-500 text-brand-darkBlue font-black uppercase tracking-widest text-sm px-10 py-5 rounded-xl transition-all duration-300 shadow-xl hover:scale-105 active:scale-95">
                                        Agendar Consultoria Grátis
                                    </button>
                                    <button onClick={() => navigate('/planos')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-black uppercase tracking-widest text-sm px-10 py-5 rounded-xl transition-all duration-300 backdrop-blur-sm">
                                        Ver Planos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeIn>
        </>
    );
};
