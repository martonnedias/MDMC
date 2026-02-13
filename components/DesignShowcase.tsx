import React from 'react';
import { Target, Zap, Shield, TrendingUp, BarChart, Globe, MousePointer2, Sparkles, Layout, Eye, Star } from 'lucide-react';
import SectionTitle from './SectionTitle';
import Button from './Button';

const DesignShowcase: React.FC = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Introductory Hero */}
            <section className="pt-44 lg:pt-60 pb-16 px-6 text-center bg-slate-50 border-b border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <span className="px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-brand-orange/20">
                        Galeria de Conceitos UI/UX
                    </span>
                    <h1 className="text-5xl md:text-7xl font-heading font-black text-brand-darkBlue mb-8 tracking-tighter">
                        Modelos de <br /><span className="text-brand-orange italic">Alta Performance</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Explore as diferentes linguagens visuais que podemos aplicar ao seu projeto para maximizar a conversão e a autoridade da marca.
                    </p>
                </div>
            </section>

            {/* 1. MODO BENTO GRID (Funcional e Moderno) */}
            <section className="py-24 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <SectionTitle
                            badge="Estilo 01: Bento Grid"
                            title="Organização & <span class='text-brand-blue'>Clareza</span>"
                            subtitle="Inspirado em dashboards de elite. Perfeito para apresentar múltiplos benefícios ou serviços de forma modular."
                            alignment="left"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
                        {/* Big Card */}
                        <div className="md:col-span-2 md:row-span-2 bg-brand-darkBlue rounded-[2.5rem] p-12 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                                        <TrendingUp className="text-brand-orange" size={32} />
                                    </div>
                                    <h3 className="text-4xl font-heading font-black mb-6 leading-tight">Escalabilidade <br /> Sem Atrito</h3>
                                    <p className="text-blue-100/70 text-lg font-medium max-w-sm">
                                        Unimos engenharia de dados e criatividade para criar funis que não apenas atraem, mas convertem lucros reais.
                                    </p>
                                </div>
                                <Button variant="primary" className="w-fit h-14 px-8 text-xs font-black uppercase tracking-widest bg-brand-orange border-none shadow-xl shadow-brand-orange/20">
                                    Explorar Estratégia
                                </Button>
                            </div>
                        </div>

                        {/* Medium Card Top */}
                        <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex items-center gap-8 hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="w-20 h-20 bg-brand-blue text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-blue/20">
                                <Target size={36} />
                            </div>
                            <div>
                                <h4 className="text-xl font-heading font-black text-brand-darkBlue mb-2 uppercase tracking-tighter">Tráfego de Elite</h4>
                                <p className="text-slate-500 text-sm font-bold">Anúncios focados no público que já está pronto para comprar de você.</p>
                            </div>
                        </div>

                        {/* Small Card Left */}
                        <div className="bg-brand-orange text-white rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center group hover:scale-[1.02] transition-transform duration-500 shadow-xl shadow-brand-orange/10">
                            <Zap size={40} className="mb-4 animate-pulse" />
                            <span className="text-2xl font-heading font-black tracking-tighter uppercase">Velocidade</span>
                        </div>

                        {/* Small Card Right */}
                        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-brand-blue/50 transition-all">
                            <Shield className="text-white/30" size={24} />
                            <p className="text-white font-black text-lg tracking-tighter uppercase leading-none">Proteção de <br /> Marca</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. MODO EDITORIAL / LUXURY (Minimalista e Elegante) */}
            <section className="py-32 px-6 bg-slate-50 relative overflow-hidden border-y border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 lg:max-w-xl">
                        <span className="text-brand-orange font-black text-[11px] uppercase tracking-[0.5em] mb-8 block">
                            Estilo 02: Luxury Design
                        </span>
                        <h2 className="text-6xl md:text-8xl font-heading font-black text-brand-darkBlue leading-[0.9] tracking-tighter mb-10">
                            O <span className="italic">Design</span> <br />
                            <span className="text-slate-300">é a sua</span> <br />
                            Moeda.
                        </h2>
                        <div className="h-1 w-24 bg-brand-orange mb-10"></div>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium mb-12">
                            Não é sobre ser "bonito". É sobre ser percebido como a opção mais cara e confiável do seu mercado. Criamos identidades que impõem respeito antes mesmo do primeiro contato.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button className="h-16 px-10 bg-brand-darkBlue text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-brand-blue transition-colors">
                                Posicionar Minha Marca
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative group">
                        <div className="absolute -inset-10 bg-brand-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="rounded-[4rem] overflow-hidden border-[16px] border-white shadow-3xl bg-white aspect-[4/5] relative">
                            <img
                                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200"
                                alt="Escritório de Luxo"
                                className="w-full h-full object-cover grayscale brightness-110"
                            />
                            <div className="absolute inset-x-8 bottom-8 bg-brand-darkBlue/90 backdrop-blur-md p-8 rounded-3xl text-white">
                                <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-2">Padrão Ouro</p>
                                <p className="text-2xl font-heading font-black tracking-tighter">Integridade Total</p>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100 animate-float">
                            <Star className="text-brand-orange" size={40} />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MODO MODERN SAAS / GLASSMORPHISM (Tech e Fluidez) */}
            <section className="py-24 px-6 bg-brand-darkBlue relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="mb-20">
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-cyber text-brand-orange border border-white/10 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Sparkles size={14} /> Estilo 03: Modern SaaS
                        </span>
                        <h2 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tighter">
                            Interfaces Que <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Respiram Futuro</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Globe, title: "Sites Híbridos", desc: "Velocidade de SPA com autoridade de portal corporativo.", color: "blue" },
                            { icon: MousePointer2, title: "UX Otimizada", desc: "Cada clique é uma decisão estratégica desenhada pela nossa equipe.", color: "orange" },
                            { icon: BarChart, title: "Data Driven", desc: "Dashboards em tempo real para acompanhar seu ROI agressivo.", color: "blue" }
                        ].map((item, i) => (
                            <div key={i} className="glass-cyber rounded-[2.5rem] p-10 border border-white/5 hover:border-white/20 transition-all duration-700 bg-white/5 backdrop-blur-xl group hover:-translate-y-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-2xl ${item.color === 'orange' ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'}`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-heading font-black text-white mb-4 tracking-tighter uppercase">{item.title}</h3>
                                <p className="text-blue-100/60 font-medium text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. MODO DEEP TECH (Escuro e Neon) */}
            <section className="py-24 px-6 bg-black relative overflow-hidden font-mono">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-16">
                        <span className="text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
                            Estilo 04: Deep Tech Dark
                        </span>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 uppercase tracking-tighter">
                            A <span className="text-cyan-400 font-mono">Maquinaria</span> por trás das vendas
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 border border-cyan-500/20 p-8 rounded-none relative group hover:border-cyan-500/50 transition-all">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-500"></div>
                            <pre className="text-cyan-400/30 text-[10px] mb-6 overflow-hidden">
                                {`> initializing_conversion_core...
> analyzing_traffic_patterns...
> status: ready_to_scale`}
                            </pre>
                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Algoritmos de Precisão</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Engenharia reversa de concorrência e mineração de dados para encontrar o oceano azul do seu negócio.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">STABLE</div>
                                <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] font-bold">FAST</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-slate-900/50 border border-purple-500/20 p-6 rounded-none relative group hover:border-purple-500/50 transition-all flex flex-col items-center justify-center text-center">
                                <TrendingUp className="text-purple-400 mb-4" size={32} />
                                <span className="text-white font-bold text-lg uppercase tracking-widest">+240%</span>
                                <span className="text-slate-500 text-[10px] uppercase">CRESCIMENTO</span>
                            </div>
                            <div className="bg-slate-900/50 border border-emerald-500/20 p-6 rounded-none relative group hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center text-center">
                                <Shield className="text-emerald-400 mb-4" size={32} />
                                <span className="text-white font-bold text-lg uppercase tracking-widest">SAFE</span>
                                <span className="text-slate-500 text-[10px] uppercase">DATABASE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. MODO NEO-BRUTALISM (Agressivo e Direto) */}
            <section className="py-24 px-6 bg-brand-orange relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all transform hover:-translate-x-1 hover:-translate-y-1">
                            <span className="inline-block bg-yellow-400 border-2 border-black px-4 py-1 text-xs font-black uppercase tracking-widest mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                Estilo 05: Neo-Brutalism
                            </span>
                            <h2 className="text-5xl md:text-6xl font-heading font-black text-black mb-8 uppercase leading-none">
                                Vença no <br /><span className="bg-black text-white px-2">Grito.</span>
                            </h2>
                            <p className="text-xl font-bold text-black mb-10 leading-tight">
                                Design que para o scroll. Cores vibrantes, sombras duras e tipografia que exige atenção imediata.
                            </p>
                            <button className="w-full bg-brand-orange text-black border-4 border-black py-6 text-xl font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                                DOMINAR AGORA
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="bg-yellow-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square flex flex-col items-center justify-center">
                                <Zap size={48} className="text-black" />
                                <span className="mt-4 font-black text-black">RÁPIDO</span>
                            </div>
                            <div className="bg-pink-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square flex flex-col items-center justify-center">
                                <Target size={48} className="text-black" />
                                <span className="mt-4 font-black text-black">DIRETO</span>
                            </div>
                            <div className="bg-emerald-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square flex flex-col items-center justify-center">
                                <Eye size={48} className="text-black" />
                                <span className="mt-4 font-black text-black">VISÍVEL</span>
                            </div>
                            <div className="bg-blue-400 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square flex flex-col items-center justify-center">
                                <Star size={48} className="text-black" />
                                <span className="mt-4 font-black text-black">ELITE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl relative group bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent pointer-events-none group-hover:opacity-100 transition-opacity opacity-0"></div>
                    <div className="p-12 lg:p-24 relative z-10 flex flex-col items-center text-center">
                        <Layout className="text-brand-orange mb-8" size={64} />
                        <h3 className="text-4xl md:text-5xl font-heading font-black text-brand-darkBlue mb-8 tracking-tighter uppercase">Qual estilo mais combina <br /> com seu <span className="text-brand-blue italic">próximo nível?</span></h3>
                        <p className="text-slate-500 text-lg mb-12 max-w-2xl font-medium">Nossa equipe é especialista em adaptar essas linguagens para a realidade do seu negócio, mantendo a conversão como prioridade número 1.</p>
                        <button className="h-20 px-16 bg-brand-darkBlue text-white font-black uppercase text-sm tracking-widest rounded-[2rem] hover:bg-brand-blue transition-all shadow-xl shadow-brand-darkBlue/20 transform hover:scale-105 active:scale-95">
                            Solicitar Design Personalizado
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="py-20 text-center border-t border-slate-100">
                <Button onClick={() => window.history.back()} variant="secondary" className="h-14 px-8 uppercase font-black text-xs tracking-widest">
                    Voltar ao site principal
                </Button>
                <p className="mt-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest">MD Solution © Showcase 2025</p>
            </section>

            {/* Injected Style for Glassmorphism (Fallbacks) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .glass-cyber {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .shadow-3xl {
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.15);
                }
            ` }} />
        </div>
    );
};

export default DesignShowcase;
