import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import {
    MessageSquare,
    Users,
    Zap,
    BarChart3,
    CheckCircle2,
    TrendingUp,
    Layout,
    Sparkles,
    Check as CheckIcon,
    Play,
    Minus,
    Plus,
    ShieldCheck,
    Target,
    BrainCircuit,
    Smartphone,
    Rocket,
    Lock,
    MessageCircle,
    Bot,
    Building2,
    LayoutDashboard,
    ChevronDown,
    Wand2
} from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';
import { useAuth } from './Auth/AuthProvider';
import { leadService } from '../services/leadService';
import { formatPhone } from '../lib/formatters';
import { MD_CONVERTE_PLANS } from '../constants';
import { adminService, ServiceData } from '../services/adminService';

type TabType = 'crm' | 'agente' | 'conversoes' | 'central';

const MDConverteServicePage: React.FC = () => {
    const { config } = useSiteConfig();
    const { user } = useAuth();
    const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
    const isAdmin = user?.email && allowedEmails.includes(user.email);
    const section = config.content?.sections?.['md-converte'];

    const [activeTab, setActiveTab] = useState<TabType>('crm');
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        segment: '',
        teamSize: '',
        interest: ''
    });

    const [displayPlans, setDisplayPlans] = useState<any[]>(MD_CONVERTE_PLANS);

    useEffect(() => {
        const fetchPlans = async () => {
            const data = await adminService.getServices();
            const mdPlans = data.filter(s => s.category === 'md-converte');
            if (mdPlans.length > 0) {
                setDisplayPlans(mdPlans.map((s, index) => {
                    const normalizedName = (s.name || '').toLowerCase().trim();
                    const defaultPlan = MD_CONVERTE_PLANS.find(p => p.name.toLowerCase().includes(normalizedName)) || MD_CONVERTE_PLANS[index] || MD_CONVERTE_PLANS[0];
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
            }
        };
        fetchPlans();
    }, []);

    // FAQ State
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        try {
            const success = await leadService.saveContactLead({
                name: formData.name,
                email: formData.email,
                phone: formData.whatsapp,
                interest: `CONVERTE Sim. - ${formData.interest || formData.segment || 'Geral'}`,
                companySize: formData.teamSize
            });
            if (success) {
                setFormState('success');
                setFormData({ name: '', whatsapp: '', email: '', segment: '', teamSize: '', interest: '' });
            } else {
                setFormState('error');
            }
        } catch (error) {
            console.error(error);
            setFormState('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'whatsapp') formattedValue = formatPhone(value);
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const scrollToContact = () => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const tabs = [
        { id: 'crm' as TabType, label: 'CRM de Vendas', icon: BarChart3, color: 'text-cyan-600' },
        { id: 'agente' as TabType, label: 'Agente de Atendimento IA', icon: Bot, color: 'text-cyan-600' },
        { id: 'conversoes' as TabType, label: 'Conversões', icon: TrendingUp, color: 'text-orange-600' },
        { id: 'central' as TabType, label: 'Central de Atendimento', icon: Building2, color: 'text-cyan-600' }
    ];

    return (
        <div className="pt-0 pb-0" style={{ fontFamily: section?.font_family }}>

            {/* 1. HERO SECTION */}
            <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-32 overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-600 px-4 py-1.5 rounded-full mb-8 border border-cyan-200 shadow-lg shadow-cyan-500/5">
                                <Sparkles size={14} className="animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Tecnologia Oficial MD Solution</span>
                            </div>

                            <img src="/convertesim_logo.png" alt="CONVERTE Sim." className="h-12 md:h-16 mb-6 object-contain lg:mx-0 mx-auto" />

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-brand-darkBlue mb-12 tracking-tighter leading-[0.95] max-w-4xl">
                                Transforme <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-500 italic pr-1">leads</span> em clientes reais.
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                                O fim da bagunça no WhatsApp e das planilhas perdidas. Organize seu funil, automatize processos e venda mais com a tecnologia <strong>CONVERTE Sim.</strong>
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Button onClick={scrollToContact} variant="primary" className="h-16 px-10 text-xs font-black uppercase tracking-widest shadow-2xl shadow-cyan-600/20 hover:shadow-cyan-600/40 transition-shadow bg-cyan-600 hover:bg-cyan-700">
                                    Agendar Demonstração
                                </Button>
                                <button className="h-16 px-8 flex items-center gap-3 text-brand-darkBlue hover:text-cyan-600 transition-colors group font-black uppercase text-xs tracking-widest">
                                    <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                    Como Funciona
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-600" /> Implementação Rápida</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-600" /> Suporte no Brasil</span>
                            </div>
                        </div>

                        {/* High-Fidelity Dashboard Mockup (Inspirado na Bolten) */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-orange-500/10 blur-[100px] rounded-full animate-pulse-slow"></div>

                            {/* Browser Frame */}
                            <div className="relative bg-slate-50 rounded-[2rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-700 ease-out hover:shadow-cyan-500/10 h-[480px] flex flex-col">

                                {/* Browser Header */}
                                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                    </div>
                                    <div className="flex-1 max-w-sm mx-auto">
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">convertesim.mdsolution.online</span>
                                        </div>
                                    </div>
                                    <div className="w-20"></div>
                                </div>

                                <div className="flex flex-1 overflow-hidden">
                                    {/* Sidebar */}
                                    <div className="w-48 bg-white border-r border-slate-100 hidden md:flex flex-col p-4 shrink-0">
                                        <img src="/convertesim_logo.png" alt="CONVERTE Sim." className="h-8 mb-8 object-contain" />

                                        <div className="space-y-1">
                                            {[
                                                { icon: MessageSquare, label: 'Agente de chat' },
                                                { icon: MessageCircle, label: 'WhatsApp' },
                                                { icon: CheckCircle2, label: 'Tarefas' },
                                                { icon: Users, label: 'Contatos' },
                                                { icon: BarChart3, label: 'Funil de vendas', active: true }
                                            ].map((item, i) => (
                                                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${item.active ? 'bg-cyan-50 text-cyan-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                                                    <item.icon size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Main Grid */}
                                    <div className="flex-1 bg-[#F8FAFC] p-6 overflow-hidden">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex gap-2">
                                                <div className="h-8 w-16 bg-white border border-slate-200 rounded-lg"></div>
                                                <div className="h-8 w-16 bg-white border border-slate-200 rounded-lg"></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg"></div>
                                                <div className="h-8 px-4 bg-brand-darkBlue text-white rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-widest">+ Adicionar</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-5 gap-3 h-full">
                                            {[
                                                { label: 'Novos', color: 'bg-cyan-500', amount: 'R$ 1.520', count: 12, leads: [{ name: 'Lead Premium', val: 'R$ 450' }] },
                                                { label: 'Contato', color: 'bg-orange-500', amount: 'R$ 840', count: 4, leads: [{ name: 'Maria J.', val: 'R$ 390' }] },
                                                { label: 'Apresent.', color: 'bg-purple-500', amount: 'R$ 0', count: 0 },
                                                { label: 'Negoc.', color: 'bg-blue-500', amount: 'R$ 9.200', count: 2, leads: [{ name: 'Soluções Tech', val: 'R$ 9.200' }] },
                                                { label: 'Ganhos', color: 'bg-emerald-500', amount: 'R$ 14.500', count: 15 }
                                            ].map((col, i) => (
                                                <div key={i} className="flex flex-col gap-3">
                                                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                                                        <div className="flex flex-col mb-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{col.label}</span>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${col.color}`}></div>
                                                            </div>
                                                            <div className="text-[10px] font-black text-brand-darkBlue mt-0.5">{col.amount}</div>
                                                        </div>
                                                    </div>

                                                    {col.leads?.map((lead, j) => (
                                                        <div key={j} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm animate-float" style={{ animationDelay: `${i * 100}ms` }}>
                                                            <div className="text-[9px] font-black text-slate-800 mb-1">{lead.name}</div>
                                                            <div className="text-[8px] font-bold text-cyan-600">{lead.val}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating AI Badge */}
                                <div className="absolute bottom-10 right-10 flex items-center gap-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white animate-float">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                        <Bot size={20} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Resumo IA</p>
                                        <p className="text-xs font-black text-brand-darkBlue">Leads Quentes: 5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PROBLEM SECTION (PAIN POINTS) */}
            <section className="py-24 lg:py-32 bg-brand-darkBlue relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <SectionTitle
                        badge="O caos comercial"
                        title="Sua empresa ainda depende da memória dos vendedores?"
                        subtitle="Você não sabe quanto dinheiro está deixando na mesa por falta de acompanhamento (follow-up)."
                        light
                        alignment="center"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: MessageSquare,
                                title: "Leads Esfriando",
                                desc: "O cliente manda mensagem e fica horas sem resposta. Resultado: ele fecha com o concorrente que respondeu primeiro."
                            },
                            {
                                icon: Users,
                                title: "Sem Dono",
                                desc: "No WhatsApp pessoal, você não sabe quem falou, o que foi prometido ou se o vendedor esqueceu de cobrar o fechamento."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Risco de Dados",
                                desc: "Seu vendedor saiu da empresa? O histórico e os contatos vão embora com ele se estiverem no celular pessoal."
                            },
                            {
                                icon: BarChart3,
                                title: "Gestão Cega",
                                desc: "Sem dados, você apenas 'acha' que vendeu bem. Você não sabe a taxa de conversão real da sua equipe."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-heading font-black text-white uppercase tracking-wider mb-4">{item.title}</h3>
                                <p className="text-blue-100/60 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. TABS SECTION - Inspirado na Bolten */}
            <section className="py-24 lg:py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <SectionTitle
                        badge="Funcionalidades"
                        title="Tudo que você precisa para <span class='text-cyan-600 italic'>vender mais</span>"
                        subtitle="Sistema completo de gestão comercial com IA integrada"
                        alignment="center"
                    />

                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-16">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id
                                    ? 'bg-white shadow-lg border-2 border-cyan-600 text-cyan-600'
                                    : 'bg-white/50 border-2 border-transparent text-slate-600 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                <tab.icon size={20} className={activeTab === tab.id ? tab.color : 'text-slate-400'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-200">
                        {/* CRM de Vendas */}
                        {activeTab === 'crm' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[480px]">
                                <div className="flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 shrink-0 shadow-sm">
                                            <BarChart3 size={28} />
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-heading font-black text-brand-darkBlue tracking-tighter leading-tight">CRM de vendas <span className="text-cyan-600 italic">inteligente</span></h3>
                                    </div>
                                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                                        Gerencie leads, acompanhe negociações e maximize suas conversões com um funil visual e intuitivo.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        {[
                                            'Gestão de Leads e Contatos',
                                            'Tarefas e Responsáveis',
                                            'Funil Kanban Personalizável',
                                            'Relatórios em Tempo Real',
                                            'Integração WhatsApp',
                                            'Webhooks e API Robustas'
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-[3rem] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                    <div className="relative bg-slate-100 rounded-[2.5rem] p-4 border border-slate-200 shadow-2xl h-[420px] flex flex-col">
                                        <div className="bg-white rounded-[1.5rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-slate-200/50">
                                            {/* Browser Header Unified */}
                                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-4 shrink-0">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                                                </div>
                                                <div className="flex-1 max-w-[200px]">
                                                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-center">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block truncate">convertesim.online</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mockup Content */}
                                            <div className="p-6 flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                                                <img src="/convertesim_logo.png" alt="CONVERTE Sim." className="h-6 mb-6 object-contain self-start" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pipeline de Vendas</p>
                                                <div className="grid grid-cols-3 gap-3 flex-1">
                                                    {[
                                                        { label: 'Novos', val: 'R$ 1.5k', leads: [{ n: 'André S.', v: 'R$ 450' }, { n: 'Beatriz L.', v: 'R$ 600' }] },
                                                        { label: 'Contato', val: 'R$ 840', leads: [{ n: 'Carlos D.', v: 'R$ 840' }] },
                                                        { label: 'Fechado', val: 'R$ 14k', leads: [{ n: 'Empresa ABC', v: 'R$ 14k' }] }
                                                    ].map((stage, i) => (
                                                        <div key={i} className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col">
                                                            <div className="flex flex-col mb-3">
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">{stage.label}</span>
                                                                <span className="text-[10px] font-black text-cyan-600 leading-none">{stage.val}</span>
                                                            </div>
                                                            <div className="space-y-2 flex-1">
                                                                {stage.leads.map((lead, idx) => (
                                                                    <div key={idx} className="bg-slate-50 rounded-lg p-2 text-[8px] border border-slate-100 shadow-inner">
                                                                        <div className="font-black text-slate-800 leading-tight mb-0.5">{lead.n}</div>
                                                                        <div className="text-cyan-600 font-bold">{lead.v}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agente de Atendimento IA */}
                        {activeTab === 'agente' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[480px]">
                                <div className="flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                                            <Bot size={28} />
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-heading font-black text-brand-darkBlue tracking-tighter leading-tight">Agente de <span className="text-orange-600 italic">atendimento IA</span></h3>
                                    </div>
                                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                                        Comunicação multicanal eficiente feita com Agente de IA para respostas rápidas e personalizadas.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        {[
                                            'Conectado direto ao WhatsApp',
                                            'Intervenção Humana a Qualquer Hora',
                                            'Base de Conhecimento Própria',
                                            'Transcrição de Áudios por IA',
                                            'Escalonamento Inteligente',
                                            'Gestão de Fila e Triagem'
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-[3rem] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                    <div className="relative bg-slate-100 rounded-[2.5rem] p-4 border border-slate-200 shadow-2xl h-[420px] flex flex-col">
                                        <div className="bg-slate-900 rounded-[1.5rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-slate-800">
                                            {/* Browser Header Unified */}
                                            <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center gap-4 shrink-0">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                                                </div>
                                                <div className="flex-1 max-w-[200px]">
                                                    <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1 text-center">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block truncate">convertesim.online</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mockup Content */}
                                            <div className="p-6 flex-1 flex flex-col overflow-hidden gap-4">
                                                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 self-start max-w-[80%] shadow-lg">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px] font-black">AI</div>
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Agente Inteligente</span>
                                                    </div>
                                                    <div className="bg-orange-500 text-white text-[11px] p-3 rounded-xl font-bold leading-relaxed">
                                                        Olá! Sou o assistente da sua empresa. Como posso ajudar você hoje?
                                                    </div>
                                                </div>
                                                <div className="self-end max-w-[70%]">
                                                    <div className="bg-slate-700 text-white text-[11px] p-3 rounded-xl font-bold shadow-md">
                                                        Quero saber os valores dos planos.
                                                    </div>
                                                </div>
                                                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 self-start max-w-[80%] shadow-lg">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px] font-black">AI</div>
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Agente Inteligente</span>
                                                    </div>
                                                    <div className="bg-orange-500 text-white text-[11px] p-3 rounded-xl font-bold leading-relaxed">
                                                        Temos 3 opções: Starter, Business e Premium. Qual seu volume médio mensal de leads?
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Conversões */}
                        {activeTab === 'conversoes' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[480px]">
                                <div className="flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                            <TrendingUp size={28} />
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-heading font-black text-brand-darkBlue tracking-tighter leading-tight">Análise de <span className="text-blue-600 italic">conversões</span></h3>
                                    </div>
                                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                                        Rastreie a origem real de cada lead e descubra quais campanhas estão gerando lucro de verdade.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        {[
                                            'Rastreio de Origem (UTM)',
                                            'Relatórios Customizados',
                                            'Live Dashboards de Vendas',
                                            'Atribuição de Conversão',
                                            'Sincronia com CRM Local',
                                            'API Conversão Meta/Google'
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-[3rem] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                    <div className="relative bg-slate-100 rounded-[2.5rem] p-4 border border-slate-200 shadow-2xl h-[420px] flex flex-col">
                                        <div className="bg-white rounded-[1.5rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-slate-200/50">
                                            {/* Browser Header Unified */}
                                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-4 shrink-0">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                                                </div>
                                                <div className="flex-1 max-w-[200px]">
                                                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-center">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block truncate">convertesim.online</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mockup Content */}
                                            <div className="p-6 flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                                                <div className="flex items-center justify-between mb-6">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dashboard Analytics</p>
                                                    <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[8px] font-black uppercase">Live</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 flex-1">
                                                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                                                        <div className="w-20 h-20 mb-4 animate-pulse">
                                                            <svg viewBox="0 0 100 100">
                                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="180 251" />
                                                                <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray="70 251" strokeDashoffset="-180" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex gap-4 text-[9px] font-black uppercase">
                                                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Ads</div>
                                                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Org.</div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-end gap-1 px-4">
                                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-t h-[40%]"></div>
                                                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-t h-[65%]"></div>
                                                        <div className="bg-blue-500/40 border border-blue-500/50 rounded-t h-[85%]"></div>
                                                        <div className="bg-brand-orange rounded-t h-[100%] shadow-lg shadow-orange-500/20"></div>
                                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-2 text-center">ROI Acelerado</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Central de Atendimento */}
                        {activeTab === 'central' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[480px]">
                                <div className="flex flex-col justify-center h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                                            <Building2 size={28} />
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-heading font-black text-brand-darkBlue tracking-tighter leading-tight">Central de <span className="text-purple-600 italic">atendimento</span></h3>
                                    </div>
                                    <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium">
                                        Organize o suporte ao cliente com gestão de tickets, WhatsApp unificado e histórico completo.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                        {[
                                            'Gestão de Tickets por Status',
                                            'Histórico Unificado de Chat',
                                            'Atribuição de Agentes',
                                            'Notas Internas e Equipe',
                                            'Controle de SLA e Prazos',
                                            'Dashboards de Produtividade'
                                        ].map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-[3rem] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                    <div className="relative bg-slate-100 rounded-[2.5rem] p-4 border border-slate-200 shadow-2xl h-[420px] flex flex-col">
                                        <div className="bg-slate-900 rounded-[1.5rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-slate-800">
                                            {/* Browser Header Unified */}
                                            <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center gap-4 shrink-0">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                                                </div>
                                                <div className="flex-1 max-w-[200px]">
                                                    <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1 text-center">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block truncate">convertesim.online</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mockup Content */}
                                            <div className="p-6 flex-1 flex flex-col overflow-hidden bg-slate-900">
                                                <div className="flex items-center justify-between mb-6">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestão de Tickets</p>
                                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3 flex-1">
                                                    {['Pendente', 'Em Curso', 'Finalizado'].map((status, i) => (
                                                        <div key={i} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 flex flex-col">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
                                                                <div className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                                            </div>
                                                            <div className="space-y-2 flex-1">
                                                                <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/50 shadow-inner">
                                                                    <div className="text-[9px] font-black text-slate-200 mb-0.5">#{1024 + i}</div>
                                                                    <div className="text-[7px] font-bold text-slate-500 uppercase">Suporte Nível {i + 1}</div>
                                                                </div>
                                                                {i === 1 && (
                                                                    <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/50 shadow-inner">
                                                                        <div className="text-[9px] font-black text-slate-200 mb-0.5">#5021</div>
                                                                        <div className="text-[7px] font-bold text-slate-500 uppercase">Aguardando Cliente</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. BENEFITS (DIFFERENTIALS) */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-20">
                        <SectionTitle
                            badge="Diferenciais MD"
                            title="Por que usar o <span class='text-cyan-600 italic'>CONVERTE Sim.?</span>"
                            alignment="center"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Target,
                                title: "Dashboard Real",
                                text: "Tenha o controle total da sua empresa em uma tela. Métricas que importam."
                            },
                            {
                                icon: Rocket,
                                title: "Agilidade Total",
                                text: "Implementação 'No-Code' em 15 minutos. Sua equipe aprende a usar na hora."
                            },
                            {
                                icon: Layout,
                                title: "Escalabilidade",
                                text: "Prontos para crescer com você, seja 1 ou 100 vendedores conectados."
                            },
                            {
                                icon: Lock,
                                title: "Ativos Seguros",
                                text: "Seu vendedor saiu? O histórico fica seguro na sua empresa, não no celular dele."
                            }
                        ].map((d, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-[2.5rem] hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-cyan-600/20">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-brand-darkBlue group-hover:text-cyan-600 group-hover:scale-110 transition-all">
                                    <d.icon size={28} />
                                </div>
                                <h4 className="text-lg font-heading font-black text-brand-darkBlue uppercase mb-3">{d.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{d.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. PRICING */}
            <section className="py-24 lg:py-32 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <SectionTitle
                        badge="Investimento inteligente"
                        title="Planos que <span class='text-cyan-600 italic'>se pagam</span>"
                        subtitle="Escolha o modelo que encaixa no seu momento. Do autônomo à grande equipe."
                        alignment="center"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                        {displayPlans.map((pkg, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-[2.5rem] border shadow-lg transition-all relative flex flex-col ${pkg.highlight
                                    ? 'bg-brand-darkBlue text-white border-cyan-600 shadow-2xl z-10 md:-translate-y-6'
                                    : 'bg-white border-slate-200 hover:border-cyan-600/30'
                                    }`}
                            >
                                {pkg.badge && (
                                    <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${pkg.highlight ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {pkg.badge}
                                    </div>
                                )}

                                <h3 className={`text-2xl font-heading font-black mb-2 uppercase ${pkg.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>
                                    {pkg.name}
                                </h3>
                                <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${pkg.highlight ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    {pkg.subtitle}
                                </p>

                                <div className={`text-3xl font-black tracking-tighter mb-8 ${pkg.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>
                                    {pkg.price}
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {pkg.features.map((feat: string, j: number) => (
                                        <li key={j} className="flex gap-3 text-sm font-medium">
                                            <CheckIcon size={16} className={pkg.highlight ? 'text-cyan-400' : 'text-cyan-600'} />
                                            <span className={pkg.highlight ? 'text-white/90' : 'text-slate-600'}>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, segment: pkg.name }));
                                        scrollToContact();
                                    }}
                                    variant={pkg.highlight ? 'primary' : 'outline'}
                                    fullWidth
                                    className={`text-xs font-black uppercase tracking-widest ${pkg.highlight
                                        ? 'bg-cyan-600 hover:bg-white hover:text-cyan-600'
                                        : 'border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white'
                                        }`}
                                >
                                    {pkg.ctaText}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 md:px-8">
                    <SectionTitle
                        title="Dúvidas Frequentes"
                        alignment="center"
                    />
                    <div className="space-y-4">
                        {[
                            {
                                q: "É difícil de configurar?",
                                a: "Não. A implementação é 'No-Code', intuitiva e pronta para usar em minutos. Além disso, nós damos todo o suporte inicial."
                            },
                            {
                                q: "Funciona no celular?",
                                a: "Sim! Totalmente responsivo para que sua equipe de vendas possa atender de qualquer lugar."
                            },
                            {
                                q: "Posso importar meus contatos antigos?",
                                a: "Sim. Em poucos cliques você traz sua base de clientes para dentro do sistema e organiza a casa."
                            },
                            {
                                q: "Preciso ter um número novo de WhatsApp?",
                                a: "Não. Nós fazemos a conexão do seu número atual através de QR Code, mantendo seu histórico."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-cyan-600/30 transition-colors">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-bold text-brand-darkBlue text-lg pr-8">{faq.q}</span>
                                    {openFaqIndex === i ? <Minus size={20} className="text-cyan-600 shrink-0" /> : <Plus size={20} className="text-slate-400 shrink-0" />}
                                </button>
                                {openFaqIndex === i && (
                                    <div className="p-6 pt-0 bg-white text-slate-600 leading-relaxed animate-fade-in border-t border-slate-100">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CONTACT FORM */}
            <section id="contact-form" className="pt-24 lg:pt-40 pb-40 lg:pb-48 bg-brand-darkBlue relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* FORMULÁRIO À ESQUERDA */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-3xl relative overflow-hidden text-left border-[12px] border-white/5 order-2 lg:order-1">
                            {formState === 'success' ? (
                                <div className="text-center py-20 flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-brand-darkBlue mb-4">Acesso liberado!</h3>
                                    <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Nossa equipe entrará em contato em breve para agendar sua demonstração.</p>
                                    <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova solicitação</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="flex flex-col items-center mb-8 gap-4">
                                        <h3 className="text-3xl font-heading font-black text-brand-darkBlue uppercase tracking-tighter text-center">Fale com um consultor</h3>
                                        {isAdmin && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        name: 'Empresa Teste Converte',
                                                        whatsapp: '(11) 99999-9999',
                                                        email: 'admin@converte.com',
                                                        segment: '', // Keep segment empty as interest is set
                                                        teamSize: '2-5',
                                                        interest: 'Plano Pro'
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
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
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
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                                placeholder="(00) 00000-0000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Tamanho da equipe</label>
                                            <select
                                                name="teamSize"
                                                value={formData.teamSize}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/10 transition-all text-slate-500 font-bold cursor-pointer appearance-none"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="1 (Só eu)">1 (Só eu)</option>
                                                <option value="2-5">2 a 5 pessoas</option>
                                                <option value="6-10">6 a 10 pessoas</option>
                                                <option value="11+">Mais de 11 pessoas</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">E-mail profissional</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                            placeholder="contato@empresa.com"
                                        />
                                    </div>

                                    <div className="pt-4 text-center">
                                        <Button
                                            type="submit"
                                            className="w-full h-20 text-lg font-black uppercase tracking-widest bg-cyan-600 hover:bg-cyan-700 shadow-xl shadow-cyan-600/20 rounded-2xl"
                                            disabled={formState === 'loading'}
                                        >
                                            {formState === 'loading' ? 'Enviando...' : 'Solicitar demonstração agora'}
                                        </Button>
                                        <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
                                            *Setup completo incluso na contratação
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* INFORMAÇÕES À DIREITA */}
                        <div className="text-white text-left order-1 lg:order-2">
                            <SectionTitle
                                badge="Canal de atendimento direto"
                                title="Vamos <span class='text-cyan-400 italic'>integrar</span> sua equipe?"
                                subtitle="Nós geramos o interesse (tráfego) e te damos a arma para realizar a venda (CRM). Fale com um consultor agora."
                                alignment="left"
                                light={true}
                            />

                            <div className="space-y-8 mt-12">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10 group-hover:scale-110 transition-transform">
                                        <MessageSquare size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-blue-200/50 font-black uppercase tracking-widest">Suporte</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Atendimento via WhatsApp</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10 group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-blue-200/50 font-black uppercase tracking-widest">Garantia</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Setup completo incluso</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </section>

        </div>
    );
};

export default MDConverteServicePage;

