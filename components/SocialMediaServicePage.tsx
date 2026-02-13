import React, { useState } from 'react';
import {
    CheckCircle2,
    Users,
    TrendingUp,
    Target,
    BarChart3,
    Smartphone,
    Globe,
    Zap,
    Play,
    Award,
    Check,
    ArrowRight,
    Layout,
    Clock,
    ShieldCheck,
    Sparkles,
    MessageCircle,
    Instagram,
    Linkedin,
    Facebook,
    Plus,
    X,
    Quote,
    Rocket,
    Megaphone,
    CheckIcon,
    ChevronDown,
    Camera,
    LayoutDashboard
} from 'lucide-react';
import Button from './Button';
import SectionTitle from './SectionTitle';
import { leadService } from '../services/leadService';
import { formatPhone } from '../lib/formatters';
import { adminService, ServiceData } from '../services/adminService';
import { useAuth } from './Auth/AuthProvider';
import { Wand2 } from 'lucide-react';
import { useEffect } from 'react';
import { SOCIAL_MEDIA_PLANS } from '../constants';

// Constantes de Conteúdo
const SOCIAL_MEDIA_CONTENT = {
    hero: {
        badge: "Social media de alta performance",
        title: "Sua marca não precisa de +1 post.",
        highlight: "Precisa de estratégia.",
        subtitle: "Transformamos seguidores em clientes reais através de um posicionamento magnético, design de alto padrão e estratégias de conteúdo validadas.",
        cta: "Quero uma análise gratuita",
        stats: [
            { value: "+150k", label: "Leads gerados" },
            { value: "3.5x", label: "ROAS médio" },
            { value: "400+", label: "Projetos entregues" }
        ],
        // Imagem high-end de dashboard/estratégia para substituir a geração falha
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    transformation: {
        before: {
            title: "O padrão do mercado",
            items: [
                "Posts aleatórios sem intenção de venda",
                "Design genérico (Canva básico)",
                "Legendas que ninguém lê",
                "Sempre correndo atrás de 'trends'",
                "Zero previsibilidade de clientes"
            ]
        },
        after: {
            title: "O padrão MD Solution",
            items: [
                "Calendário estratégico focado em conversão",
                "Identidade visual única e memorável",
                "Conteúdo que gera desejo imediato",
                "Autoridade construída com solidez",
                "Ecossistema de vendas previsível"
            ]
        }
    },
    benefits: [
        {
            icon: <ShieldCheck size={32} />,
            title: "Autoridade Imediata",
            text: "Seu perfil se torna uma vitrine de luxo. Quem entra, percebe valor no primeiro segundo."
        },
        {
            icon: <Clock size={32} />,
            title: "Economia de Tempo",
            text: "Enquanto você foca no seu negócio, nós cuidamos de 100% da sua presença digital."
        },
        {
            icon: <TrendingUp size={32} />,
            title: "Vendas Recorrentes",
            text: "Não buscamos apenas likes. Buscamos directs chamando, cliques no link e vendas reais."
        }
    ],
    proof: {
        metrics: [
            { value: "+140%", label: "Crescimento Médio", detail: "Em alcance orgânico nos primeiros 90 dias." },
            { value: "95%", label: "Retenção", detail: "Dos seguidores permanecem engajados com a marca." },
            { value: "3.5x", label: "ROI", detail: "Retorno médio sobre o investimento em social media." }
        ],
        testimonials: [
            {
                name: "Juliana Mendes",
                role: "CEO da JM Estética",
                text: "Minhas redes eram paradas. Hoje, 70% dos meus agendamentos vêm do Instagram. O posicionamento mudou tudo."
            },
            {
                name: "Marcos Oliveira",
                role: "Sócio de Advocacia",
                text: "A MD Solution trouxe o luxo e a seriedade que nossa banca precisava. Passamos de 'mais um' para referência na cidade."
            }
        ]
    },
    mechanism: {
        title: "O Método <span class='text-brand-orange italic'>MD 360º</span>",
        subtitle: "Como transformamos seu perfil em uma máquina de vendas em 3 passos.",
        steps: [
            {
                num: "01",
                title: "Diagnóstico & Branding",
                text: "Analisamos sua concorrência, definimos sua voz, arquétipo e identidade visual. Criamos o 'Manual da Marca' que guiará tudo."
            },
            {
                num: "02",
                title: "Produção de Conteúdo",
                text: "Nossos designers e copywriters criam posts, carrosséis e reels de alto impacto. Nada é postado sem aprovação e estratégia."
            },
            {
                num: "03",
                title: "Gestão & Otimização",
                text: "Monitoramos métricas, respondemos comentários (opcional) e ajustamos a rota mensalmente para garantir crescimento constante."
            }
        ]
    },
    plans: [
        {
            name: "Essencial",
            subtitle: "Para quem está começando a se posicionar",
            price: "R$ 1.197",
            features: [
                "12 Posts Estratégicos (Feed/Reels)",
                "4 Stories Semanais",
                "Legendas com Copywriting Persuasivo",
                "Design Premium (Não é Canva)",
                "Relatório Mensal de Performance",
                "Otimização de Bio e Destaques"
            ],
            ctaText: "Começar com o Essencial",
            highlight: false,
            adBudget: "Recomendado: R$ 300/mês em anúncios"
        },
        {
            name: "Autoridade",
            subtitle: "O mais escolhido por empresas em crescimento",
            price: "R$ 1.997",
            features: [
                "20 Posts Estratégicos (Feed/Reels)",
                "8 Stories Semanais",
                "Roteiros para Vídeos Curtos",
                "Gestão de Tráfego Pago (Setup + Otimização)",
                "Design de Alta Conversão",
                "Reunião Mensal de Estratégia",
                "Análise de Concorrência Trimestral",
                "Suporte Prioritário no WhatsApp"
            ],
            ctaText: "Quero Dominar meu Nicho",
            highlight: true,
            adBudget: "Recomendado: R$ 600/mês em anúncios"
        },
        {
            name: "Dominância",
            subtitle: "Para marcas que querem liderar o mercado",
            price: "R$ 3.497",
            features: [
                "Posts Diários (30/mês)",
                "Stories Diários Estratégicos",
                "Edição de Vídeos Profissionais (Reels)",
                "Gestão de Tráfego Avançada (Múltiplos Canais)",
                "Consultoria de Branding Mensal",
                "Criação de Landing Page (Bonificação)",
                "Relatórios de BI em Tempo Real",
                "Acesso Direto ao Estrategista Chefe"
            ],
            ctaText: "Contratar Plano Elite",
            highlight: false,
            adBudget: "Recomendado: R$ 1.500+/mês em anúncios"
        }
    ]
};

export default function SocialMediaServicePage() {
    const { user } = useAuth();
    const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
    const isAdmin = user?.email && allowedEmails.includes(user.email);

    const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        currentPresence: ''
    });

    const [displayPlans, setDisplayPlans] = useState<any[]>(SOCIAL_MEDIA_PLANS);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await adminService.getServices();
                const smPlans = data.filter(s =>
                    (s.page === 'social-media' || s.category === 'social_media') && s.is_active !== false
                );
                if (smPlans.length > 0) {
                    setDisplayPlans(smPlans.map((s, index) => {
                        const normalizedName = (s.name || '').toLowerCase().trim();
                        const defaultPlan = SOCIAL_MEDIA_PLANS.find(p => p.name.toLowerCase().includes(normalizedName)) || SOCIAL_MEDIA_PLANS[index] || SOCIAL_MEDIA_PLANS[0];
                        return {
                            name: s.name || defaultPlan.name,
                            subtitle: s.subtitle || defaultPlan.subtitle,
                            price: s.price || defaultPlan.price,
                            ctaText: s.cta_text || defaultPlan.ctaText,
                            badge: s.badge_text || defaultPlan.badge,
                            features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '') ? s.features : defaultPlan.features,
                            highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight
                        };
                    }));
                } else {
                    setDisplayPlans(SOCIAL_MEDIA_PLANS);
                }
            } catch (err) {
                console.error('Error fetching social media plans:', err);
                setDisplayPlans(SOCIAL_MEDIA_PLANS);
            }
        };
        fetchPlans();
    }, []);

    const scrollToContact = () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');

        const success = await leadService.saveContactLead({
            name: formData.name,
            email: formData.email,
            phone: formData.whatsapp,
            interest: `Social Media - Objetivo: ${formData.currentPresence}`,
            companySize: 'N/A'
        });

        if (success) {
            setFormState('success');
            setFormData({ name: '', whatsapp: '', email: '', currentPresence: '' });
        } else {
            setFormState('idle');
            alert('Erro ao enviar. Tente novamente.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'whatsapp') formattedValue = formatPhone(value);
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-brand-orange/20 selection:text-brand-darkBlue">

            {/* Hero Section - Ajuste de Altura e Imagem */}
            <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-32 overflow-hidden bg-slate-50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Conteúdo Hero */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm mb-6 animate-fade-in-up">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{SOCIAL_MEDIA_CONTENT.hero.badge}</span>
                            </div>

                            {/* Títulos Corrigidos: Sentence Case sem sublinhado */}
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-brand-darkBlue tracking-tighter leading-[0.95] mb-12 max-w-4xl">
                                Sua marca não precisa de +1 post. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic pr-1">Precisa de estratégia.</span>
                            </h1>

                            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 mb-12 leading-relaxed font-bold max-w-2xl border-l-4 border-brand-orange/30 pl-8 transition-all">
                                {SOCIAL_MEDIA_CONTENT.hero.subtitle}
                            </p>

                            {/* Botões Corrigidos */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button
                                    onClick={scrollToContact}
                                    className="h-16 px-10 text-base font-black uppercase tracking-widest bg-brand-orange hover:bg-brand-orange/90 shadow-xl shadow-brand-orange/20 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                                >
                                    {SOCIAL_MEDIA_CONTENT.hero.cta}
                                </Button>
                                <Button variant="outline-dark" className="h-16 px-10 text-base font-black uppercase tracking-widest w-full sm:w-auto">
                                    Ver Planos
                                </Button>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-6">
                                {SOCIAL_MEDIA_CONTENT.hero.stats.map((stat, i) => (
                                    <div key={i}>
                                        <p className="text-2xl lg:text-3xl font-black text-brand-darkBlue tracking-tight mb-1">{stat.value}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Imagem Hero com "Card de Sucesso" simulado */}
                        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-darkBlue/20 border-8 border-white bg-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                                <img
                                    src={SOCIAL_MEDIA_CONTENT.hero.image}
                                    alt="Social Media Analytics Dashboard"
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-brand-darkBlue/10 mix-blend-multiply"></div>

                                {/* Card Flutuante "Crescimento Real" */}
                                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-xl animate-float">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                                <TrendingUp size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resultado</p>
                                                <p className="text-sm font-black text-brand-darkBlue">Crescimento Real</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">+127%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-orange w-[75%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Ícones Flutuantes */}
                            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-purple-600 to-pink-500 text-white p-4 rounded-2xl shadow-lg ring-4 ring-white animate-float hidden lg:block">
                                <Instagram size={28} />
                            </div>
                            <div className="absolute top-1/2 -left-8 bg-blue-600 text-white p-3 rounded-xl shadow-lg ring-4 ring-white animate-float delay-100 hidden lg:block">
                                <Linkedin size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transformation Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
                        <div className="flex-1 bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700">
                                <X size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-heading font-black text-brand-darkBlue mb-8 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                                        <X size={20} />
                                    </span>
                                    {SOCIAL_MEDIA_CONTENT.transformation.before.title}
                                </h3>
                                <ul className="space-y-5">
                                    {SOCIAL_MEDIA_CONTENT.transformation.before.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-700 font-medium group/item">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 group-hover/item:bg-red-400 transition-colors"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1 bg-brand-darkBlue rounded-[2.5rem] p-8 lg:p-12 text-white relative shadow-2xl shadow-brand-darkBlue/20 transform lg:-translate-y-8 border-4 border-brand-orange/20 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 p-6 text-brand-orange opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                                <CheckIcon size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-6">
                                    Experiência Premium
                                </div>
                                <h3 className="text-3xl font-heading font-black mb-10 flex items-center gap-3">
                                    <span className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-lg shadow-brand-orange/30">
                                        <CheckIcon size={24} />
                                    </span>
                                    {SOCIAL_MEDIA_CONTENT.transformation.after.title}
                                </h3>
                                <ul className="space-y-6">
                                    {SOCIAL_MEDIA_CONTENT.transformation.after.items.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 font-medium text-lg text-blue-50/90 group/item">
                                            <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5 border border-brand-orange/40 group-hover/item:bg-brand-orange group-hover/item:border-brand-orange transition-all">
                                                <CheckIcon size={12} className="text-brand-orange group-hover/item:text-white transition-colors" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <SectionTitle
                            badge="Vantagens reais"
                            title="O que você ganha com <span class='text-brand-orange italic'>MD Social</span>"
                            subtitle="Não é apenas sobre 'postar', é sobre construir um ecossistema de vendas constante."
                            alignment="center"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {SOCIAL_MEDIA_CONTENT.benefits.map((benefit, i) => (
                            <div key={i} className="group p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2">
                                <div className="w-14 h-14 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                                    {i === 0 && <ShieldCheck size={28} className="text-brand-orange group-hover:text-white" />}
                                    {i === 1 && <Clock size={28} className="text-brand-orange group-hover:text-white" />}
                                    {i === 2 && <TrendingUp size={28} className="text-brand-orange group-hover:text-white" />}
                                </div>
                                <h4 className="text-xl font-black text-brand-darkBlue mb-4 uppercase tracking-tighter group-hover:text-brand-orange transition-colors">{benefit.title}</h4>
                                <p className="text-slate-700 font-bold leading-relaxed text-sm">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            {/* Metrics Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="mb-20">
                        <SectionTitle
                            badge="Resultados de Elite"
                            title="Métricas que <span class='text-brand-orange italic underline decoration-brand-orange/10 underline-offset-[12px]'>Mudam o Jogo</span>"
                            alignment="center"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                        {SOCIAL_MEDIA_CONTENT.proof.metrics.map((m, i) => (
                            <div key={i} className="relative group p-8 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100 text-center">
                                <div className="flex flex-col items-center gap-2 mb-4">
                                    <span className="text-5xl lg:text-6xl font-heading font-black text-brand-darkBlue tracking-tighter">{m.value}</span>
                                    <span className="text-xs font-black text-brand-orange uppercase tracking-widest">{m.label}</span>
                                </div>
                                <p className="text-slate-700 font-bold text-lg uppercase tracking-tighter max-w-xs mx-auto">{m.detail}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {SOCIAL_MEDIA_CONTENT.proof.testimonials.map((t, i) => (
                            <div key={i} className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl relative hover:border-brand-orange/20 transition-all text-center md:text-left">
                                <Quote className="absolute top-8 right-8 text-brand-orange/10" size={48} />
                                <p className="text-lg text-slate-700 italic font-medium mb-8 leading-relaxed pr-8">"{t.text}"</p>
                                <div>
                                    <p className="text-lg font-black text-brand-darkBlue uppercase tracking-tighter mb-1">{t.name}</p>
                                    <p className="text-[10px] font-black text-brand-orange uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content / Bento Section */}
            <section className="py-32 bg-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-20">
                        <SectionTitle
                            badge="Diferenciais Elite"
                            title="Por que a <span class='text-brand-orange italic'>MD Solution?</span>"
                            subtitle="Não somos uma agência de posts. Somos o braço estratégico que transforma sua presença digital em um ativo de alto valor."
                            alignment="center"
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="flex-1 order-2 lg:order-1 relative w-full">
                            <div className="relative z-10 bg-brand-darkBlue rounded-[3rem] p-4 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700">
                                <div className="rounded-[2.5rem] overflow-hidden h-[500px] lg:h-[600px] border-2 border-white/10 relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=2000"
                                        className="w-full h-full object-cover opacity-80"
                                        alt="Mockup"
                                    />
                                    <div className="absolute inset-0 bg-brand-darkBlue/40"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2 space-y-12">
                            <div className="flex gap-8 group">
                                <div className="shrink-0 w-16 h-16 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Plus size={32} />
                                </div>
                                <div>
                                    <h4 className="font-heading font-black text-brand-darkBlue text-2xl uppercase tracking-tighter mb-2">Design & Psychology</h4>
                                    <p className="text-slate-700 font-bold text-lg leading-snug">Dominamos a ciência da percepção visual para gerar desejo imediato em cada pixel.</p>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="shrink-0 w-16 h-16 rounded-2xl bg-brand-darkBlue text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Rocket size={32} />
                                </div>
                                <div>
                                    <h4 className="font-heading font-black text-brand-darkBlue text-2xl uppercase tracking-tighter mb-2">Escala Previsível</h4>
                                    <p className="text-slate-700 font-bold text-lg leading-snug">Metodologia validada para transformar seguidores em advogados de marca e lucro recorrente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section - Integrada com Complementos */}
            <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <SectionTitle
                        badge="Investimento inteligente"
                        title="Escolha sua <span class='text-brand-orange italic'>velocidade de escala</span>"
                        subtitle="Planos esculpidos para diferentes momentos de faturamento e ambição."
                        alignment="center"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto mt-20 mb-16">
                        {displayPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`group relative rounded-[3rem] transition-all duration-700 flex flex-col h-full overflow-hidden
                                    ${plan.highlight
                                        ? 'bg-brand-darkBlue text-white shadow-2xl lg:scale-105 z-10 border border-white/10'
                                        : 'bg-white border border-slate-100 shadow-xl hover:border-brand-orange/30'
                                    }
                                `}
                            >
                                {plan.highlight && (
                                    <div className="bg-brand-orange text-white py-2.5 text-center text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 italic">
                                        <Sparkles size={10} /> Alta Autoridade <Sparkles size={10} />
                                    </div>
                                )}
                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="mb-6">
                                        <h3 className={`text-2xl font-heading font-black mb-1 uppercase tracking-tighter ${plan.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>{plan.name}</h3>
                                        <p className="text-brand-orange font-black text-[9px] uppercase tracking-[0.2em]">{plan.subtitle}</p>
                                    </div>

                                    <div className="mb-6 pb-6 border-b border-slate-100/10">
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-4xl lg:text-5xl font-black tracking-tighter ${plan.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>{plan.price}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${plan.highlight ? 'text-white/90' : 'text-slate-600'}`}>/mês</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {plan.features.slice(0, 10).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-orange/10 text-brand-orange'}`}>
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                                <span className={`text-[13px] font-black leading-tight ${plan.highlight ? 'text-white/90' : 'text-slate-700'}`}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={scrollToContact}
                                        variant={plan.highlight ? 'primary' : 'outline-dark'}
                                        className={`h-14 text-[10px] font-black uppercase tracking-widest ${plan.highlight ? 'shadow-xl shadow-brand-orange/20' : 'border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 group-hover:shadow-lg'}`}
                                    >
                                        {plan.ctaText || "Solicitar Diagnóstico"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Serviços Adicionais (Integrados à Seção de Preços) */}
                    <div className="max-w-5xl mx-auto pt-10 border-t border-slate-200/60">
                        <div className="text-center mb-8">
                            <h4 className="text-sm font-black text-brand-darkBlue tracking-widest flex items-center justify-center gap-2 opacity-70">
                                <Plus size={14} className="text-brand-orange" />
                                Complementos premium (Sob demanda)
                            </h4>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { title: "Tráfego Pago", price: "R$ 497", unit: "/mês", subtitle: "+ Verba" },
                                { title: "Fotografia", price: "R$ 800", unit: "/sessão", subtitle: "Profissional" },
                                { title: "Vídeo Maker", price: "R$ 1.200", unit: "", subtitle: "Reels & Ads" },
                                { title: "Consultoria", price: "R$ 497", unit: "/hora", subtitle: "Estratégica" },
                                { title: "Landing Page", price: "R$ 1.497", unit: "", subtitle: "Alta Conversão" },
                            ].map((addon, i) => (
                                <div key={i} className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 text-center hover:bg-white hover:border-brand-orange/30 transition-all hover:shadow-md cursor-default group">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1 group-hover:text-brand-orange transition-colors">{addon.subtitle}</p>
                                    <p className="font-bold text-brand-darkBlue text-xs mb-1">{addon.title}</p>
                                    <p className="text-sm font-black text-brand-darkBlue tracking-tight">{addon.price}<span className="text-[8px] text-slate-400 ml-0.5">{addon.unit}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mechanism Steps (Método 360) */}
            <section className="py-24 lg:py-32 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-20">
                        <SectionTitle
                            badge="Como Fazemos"
                            title={SOCIAL_MEDIA_CONTENT.mechanism.title}
                            subtitle={SOCIAL_MEDIA_CONTENT.mechanism.subtitle}
                            alignment="center"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {SOCIAL_MEDIA_CONTENT.mechanism.steps.map((step, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 text-center hover:bg-white hover:shadow-xl transition-all duration-500">
                                <div className="text-5xl font-black text-brand-orange/20 mb-6">{step.num}</div>
                                <h4 className="text-xl font-black text-brand-darkBlue mb-4 uppercase tracking-tighter">{step.title}</h4>
                                <p className="text-slate-700 font-bold leading-relaxed">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA / Contact - Espaçamento Aumentado */}
            <section id="contact" className="pt-24 lg:pt-40 pb-40 lg:pb-48 bg-brand-darkBlue relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[128px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* FORMULÁRIO À ESQUERDA */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-3xl relative overflow-hidden text-left border-[12px] border-white/5 order-2 lg:order-1">
                            {formState === 'success' ? (
                                <div className="text-center py-20 flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                                        <CheckIcon size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-brand-darkBlue mb-4">Acesso Liberado!</h3>
                                    <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Um de nossos especialistas analisará seu perfil e entrará em contato em breve.</p>
                                    <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova Consultoria</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-sans">
                                    <div className="flex flex-col items-center mb-8 gap-4">
                                        <h3 className="text-3xl font-heading font-black text-brand-darkBlue uppercase tracking-tighter text-center">Receber análise grátis</h3>
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        name: 'Empresa Teste Social',
                                                        whatsapp: '(11) 99999-9999',
                                                        email: 'admin@social.com',
                                                        currentPresence: 'Escalar vendas'
                                                    });
                                                }}
                                                className="flex items-center gap-2 bg-brand-darkBlue text-white px-4 py-2 rounded-full font-bold text-[9px] hover:bg-brand-darkBlue/90 transition-all uppercase tracking-widest shadow-lg shadow-brand-darkBlue/20"
                                            >
                                                <Wand2 size={12} /> Auto-Preencher
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Empresa / Responsável</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                            placeholder="Identifique-se"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">WhatsApp comercial</label>
                                            <input
                                                type="tel"
                                                name="whatsapp"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Plano de interesse</label>
                                            <select
                                                name="plan"
                                                value={formData.plan}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 transition-all text-slate-500 font-bold cursor-pointer appearance-none"
                                            >
                                                <option value="">Selecione o plano...</option>
                                                {displayPlans.map((plan, idx) => (
                                                    <option key={idx} value={plan.name}>{plan.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail Profissional</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                            placeholder="contato@empresa.com"
                                        />
                                    </div>

                                    <div className="pt-4 text-center">
                                        <Button
                                            type="submit"
                                            className="w-full h-20 text-lg font-black uppercase tracking-widest bg-brand-orange hover:bg-brand-orange/90 shadow-xl shadow-brand-orange/20 rounded-2xl"
                                            disabled={formState === 'loading'}
                                        >
                                            {formState === 'loading' ? 'Enviando...' : 'Quero minha análise'}
                                        </Button>
                                        <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
                                            *Vagas limitadas para consultoria gratuita
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* INFORMAÇÕES À DIREITA */}
                        <div className="text-white text-left order-1 lg:order-2">
                            <SectionTitle
                                badge="Canal de atendimento direto"
                                title="Vamos <span class='text-brand-orange italic'>reposicionar</span> sua marca?"
                                subtitle="Sua empresa merece um posicionamento de alto padrão que venda por você 24h por dia. Fale com um de nossos especialistas."
                                alignment="left"
                                light={true}
                            />

                            <div className="space-y-8 mt-12">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
                                        <Megaphone size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-blue-200/90 font-black uppercase tracking-widest">Estratégia</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Criação de conteúdo magnético</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 group-hover:scale-110 transition-transform">
                                        <Target size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-blue-200/90 font-black uppercase tracking-widest">Meta</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Escala de vendas previsível</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section >
        </div >
    );
}
