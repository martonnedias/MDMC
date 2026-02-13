import React, { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import {
  LineChart,
  CheckCircle2,
  MessageSquare,
  Headphones,
  TrendingUp,
  Users,
  ShieldCheck,
  Star,
  Share2,
  Copy,
  Check,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Sparkles,
  Quote,
  ArrowRight,
  Check as CheckIcon,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  Briefcase,
  LayoutDashboard,
  Search,
  Layout,
  Wand2,
  ChevronDown
} from 'lucide-react';
import { leadService } from '../services/leadService';
import { useSiteConfig } from '../lib/SiteContext';
import { useAuth } from './Auth/AuthProvider';
import { formatPhone } from '../lib/formatters';
import { adminService } from '../services/adminService';
import { useEffect } from 'react';
import { MAESTRO_PACKAGES } from '../constants';

const MAESTRO_CONTENT = {
  hero: {
    badge: "Método Exclusivo MAESTRO",
    title: "Sua Equipe Está Perdendo Vendas Todos os Dias. Transforme-os em Maestros da Conversão.",
    subtitle: "O MAESTRO Pro é o único treinamento presencial que rege cada etapa das vendas — do atendimento presencial ao digital — com precisão, técnica e resultados mensuráveis em 90 dias.",
    cta: "QUERO TRANSFORMAR MINHA EQUIPE",
    stats: [
      "Mais de 150 vendedores certificados",
      "4.9/5 de satisfação",
      "Média de 67% de aumento em vendas"
    ]
  },
  problems: [
    { icon: TrendingUp, text: "Investimos em marketing mas conversão é baixa" },
    { icon: MessageSquare, text: "Cliente some entre WhatsApp e loja" },
    { icon: Users, text: "Cada vendedor atende de um jeito diferente" },
    { icon: Clock, text: "Demoramos horas para responder no digital" },
    { icon: Zap, text: "Equipe queima margem com desconto fácil" },
    { icon: ArrowRight, text: "Cliente compra uma vez e nunca volta" }
  ],
  methodology: {
    title: "O Treinamento que Transforma Vendedores em Maestros",
    description: "Assim como um maestro rege uma orquestra com precisão, vendedores treinados no MAESTRO Pro dominam cada nota do atendimento:",
    pillars: [
      { title: "Abertura Harmoniosa", desc: "Abordagem que encanta" },
      { title: "Desenvolvimento Técnico", desc: "Diagnóstico de necessidades" },
      { title: "Crescimento Orquestrado", desc: "Apresentação de valor" },
      { title: "Fechamento Maestral", desc: "Conversão com excelência" },
      { title: "Encores Memoráveis", desc: "Pós-venda que fideliza" }
    ]
  },
  modules: [
    {
      title: "MOVIMENTO 1: Excelência Presencial (8h)",
      subtitle: "Domine a arte do atendimento olho no olho",
      items: [
        "Abordagem harmoniosa sem ser invasivo",
        "Leitura de linguagem corporal (sinais de compra)",
        "Técnica SPIN para diagnóstico profundo",
        "Tratamento de objeções sem queimar margem",
        "4 métodos de fechamento maestral",
        "Criação de experiência memorável"
      ]
    },
    {
      title: "MOVIMENTO 2: Maestria Digital (8h)",
      subtitle: "Conquiste vendas pelo WhatsApp e redes sociais",
      items: [
        "WhatsApp Business configuração profissional",
        "Escrita persuasiva que converte",
        "50+ templates prontos do Maestro",
        "Videoconferências que fecham negócio",
        "Gestão de múltiplas conversas simultâneas",
        "Instagram como canal de vendas"
      ]
    },
    {
      title: "MOVIMENTO 3: Orquestração Omnichannel (8h)",
      subtitle: "Integre presencial + digital em uma sinfonia perfeita",
      items: [
        "Jornada unificada entre loja e WhatsApp",
        "CRM simplificado (implementação inclusa)",
        "Pós-venda que transforma cliente em fã",
        "Métricas do maestro (dashboard de controle)",
        "Programa de relacionamento contínuo",
        "Reativação de clientes inativos"
      ]
    }
  ],
  cases: [
    {
      title: "Loja de Roupas",
      quote: "Em 90 dias, nossa equipe virou maestros do atendimento",
      stats: ["Conversão: +58%", "Ticket: +36%", "Faturamento: +67%"],
      author: "Carla M."
    },
    {
      title: "Escritório de Arquitetura",
      quote: "Maestria digital mudou nosso jogo",
      stats: ["Conversão WhatsApp: +87%", "Tempo resposta: 3h → 12min", "3 contratos fechados direto do digital"],
      author: "Rafael C."
    }
  ],
  packages: [
    {
      name: "MAESTRO ESSENCIAL - Presencial",
      price: "R$ 4.800",
      installments: "ou 2x de R$ 2.400 sem juros",
      features: [
        "Movimento 1: Excelência Presencial (8h)",
        "Manual do Maestro Vol. 1",
        "Partitura de Vendas Presenciais",
        "Certificado de Maestria",
        "1 mentoria pós (2h)",
        "Grupo de suporte (60 dias)",
        "Até 6 participantes"
      ],
      cta: "INICIAR JORNADA DE MAESTRIA",
      highlight: false
    },
    {
      name: "MAESTRO ESSENCIAL - Digital",
      price: "R$ 4.800",
      installments: "ou 2x de R$ 2.400 sem juros",
      features: [
        "Movimento 2: Maestria Digital (8h)",
        "Manual do Maestro Vol. 2",
        "50+ Templates do Maestro",
        "Certificado de Maestria",
        "1 mentoria pós (2h)",
        "Grupo de suporte (60 dias)",
        "Até 6 participantes"
      ],
      cta: "INICIAR JORNADA DE MAESTRIA",
      highlight: false
    },
    {
      name: "MAESTRO COMPLETO",
      price: "R$ 14.500",
      installments: "ou 4x de R$ 3.625 sem juros",
      badge: "MAIS VENDIDO",
      features: [
        "3 Movimentos completos (24h)",
        "Manuais do Maestro (3 volumes)",
        "Implementação de CRM",
        "Certificado Premium de Maestria",
        "3 mentorias pós-treinamento",
        "Grupo de suporte (180 dias)",
        "Partitura Completa de Vendas",
        "Até 8 participantes"
      ],
      cta: "TORNAR-SE MAESTRO COMPLETO",
      highlight: true
    },
    {
      name: "TRANSFORMAÇÃO TOTAL",
      price: "R$ 32.000",
      installments: "ou 6x de R$ 5.333 sem juros",
      features: [
        "Todos os Movimentos + Gestão (28h)",
        "Diagnóstico 360º pré-treinamento",
        "Partitura personalizada exclusiva",
        "Implementação completa de CRM",
        "6 meses de mentoria mensal",
        "Consultoria trimestral estratégica",
        "Grupo VIP de maestros",
        "Até 12 participantes"
      ],
      cta: "QUERO ORÇAMENTO PERSONALIZADO",
      highlight: false
    }
  ]
};

const ConsultancyServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  const isAdmin = user?.email && allowedEmails.includes(user.email);
  const section = config.content?.sections?.consultancy;

  // UI States
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form and Scroll
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    interest: ''
  });

  const [displayPlans, setDisplayPlans] = useState<any[]>(MAESTRO_PACKAGES);
  const [displayProblems, setDisplayProblems] = useState<any[]>(MAESTRO_CONTENT.problems);
  const [displayPillars, setDisplayPillars] = useState<any[]>(MAESTRO_CONTENT.methodology.pillars);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await adminService.getServices();
        const consultancyItems = data.filter(s =>
          (s.page === 'consultancy' || s.category === 'consultoria') && s.is_active !== false
        );

        if (consultancyItems.length > 0) {
          // Update Plans
          const plans = consultancyItems.filter(i => i.section_id === 'pricing');
          if (plans.length > 0) {
            const sortedPlans = [...plans].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayPlans(sortedPlans.map((s, index) => {
              const defaultPlan = MAESTRO_PACKAGES[index] || MAESTRO_PACKAGES[0];
              return {
                name: s.name || defaultPlan.name,
                price: s.price || defaultPlan.price,
                installments: s.extra_info || defaultPlan.installments,
                badge: s.badge_text || defaultPlan.badge,
                features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '') ? s.features : defaultPlan.features,
                cta: s.cta_text || defaultPlan.cta,
                highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight
              };
            }));
          } else {
            setDisplayPlans(MAESTRO_PACKAGES);
          }

          // Update Problems
          const problems = consultancyItems.filter(i => i.section_id === 'pain-points');
          if (problems.length > 0) {
            const sortedProbs = [...problems].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayProblems(sortedProbs.map((p, index) => ({
              text: p.name || p.description,
              icon: MAESTRO_CONTENT.problems[index]?.icon || TrendingUp
            })));
          } else {
            setDisplayProblems(MAESTRO_CONTENT.problems);
          }

          // Update Pillars (Methodology)
          const pillars = consultancyItems.filter(i => i.section_id === 'methodology');
          if (pillars.length > 0) {
            const sortedPillars = [...pillars].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayPillars(sortedPillars.map((p) => ({
              title: p.name,
              desc: p.description
            })));
          } else {
            setDisplayPillars(MAESTRO_CONTENT.methodology.pillars);
          }
        } else {
          setDisplayPlans(MAESTRO_PACKAGES);
          setDisplayProblems(MAESTRO_CONTENT.problems);
          setDisplayPillars(MAESTRO_CONTENT.methodology.pillars);
        }
      } catch (err) {
        console.error('Error fetching consultancy content:', err);
        setDisplayPlans(MAESTRO_PACKAGES);
        setDisplayProblems(MAESTRO_CONTENT.problems);
        setDisplayPillars(MAESTRO_CONTENT.methodology.pillars);
      }
    };
    fetchContent();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const success = await leadService.saveContactLead({
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        interest: `Consultoria Maestro Pro - ${formData.interest || 'Geral'}`,
        companySize: 'N/A'
      });
      if (success) {
        setFormState('success');
        setFormData({ name: '', whatsapp: '', email: '', interest: '' });
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (section?.is_active === false) return null;

  return (
    <div className="font-sans antialiased text-slate-700 bg-white">

      {/* HERO SECTION */}
      <section className="relative pt-44 lg:pt-60 pb-24 bg-brand-darkBlue text-white overflow-hidden">
        {/* Background FX */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-10 backdrop-blur-md">
                <Sparkles size={16} className="text-brand-orange" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Método Exclusivo MAESTRO</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[0.95] mb-12 tracking-tighter">
                Sua equipe está perdendo vendas <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic pr-1">todos os dias</span>.
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-blue-100/90 mb-12 leading-relaxed font-bold max-w-2xl border-l-4 border-brand-orange/30 pl-8 transition-all">
                {MAESTRO_CONTENT.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mb-12">
                <Button onClick={scrollToContact} variant="primary" className="h-16 px-10 text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-orange/20">
                  {MAESTRO_CONTENT.hero.cta}
                </Button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-[10px] font-black uppercase tracking-wider text-blue-200/90">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={12} className="text-brand-green" /> +150 vendedores certificados
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={12} className="text-brand-green" /> 4.9/5 de satisfação
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={12} className="text-brand-green" /> +67% de aumento em vendas
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border border-white/10 rounded-[2rem] p-2 relative shadow-2xl">
                <img
                  src="/maestro_pro_logo.png"
                  alt="Maestro Pro Logo"
                  className="w-full h-auto max-w-[400px] mx-auto drop-shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-brand-orange text-white p-6 rounded-3xl shadow-xl hidden md:block animate-bounce-slow">
                  <p className="font-heading font-black text-2xl mb-1">ROI</p>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Garantido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Diagnóstico inicial"
            title="Reconhece alguma dessas <span class='text-red-500 italic'>situações</span>?"
            subtitle="Se você marcou 3 ou mais, está deixando de faturar 40-70% do seu potencial."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {displayProblems.map((prob, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <prob.icon size={24} />
                </div>
                <p className="font-bold text-slate-700 text-lg leading-relaxed">{prob.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Metodologia"
            title="O treinamento que transforma vendedores em <span class='text-brand-orange italic underline decoration-brand-orange/10 underline-offset-8 pr-1'>maestros.</span>"
            subtitle={MAESTRO_CONTENT.methodology.description}
            alignment="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              {displayPillars.map((pillar, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-brand-darkBlue text-white flex items-center justify-center font-black text-sm shadow-lg shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-brand-darkBlue uppercase text-sm tracking-wide">{pillar.title}</h4>
                    <p className="text-slate-600 text-sm font-bold">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 rounded-[3rem] rotate-3 blur-2xl"></div>
              <div className="bg-slate-900 p-10 rounded-[2.5rem] relative text-white border border-white/10 shadow-2xl">
                <Quote className="text-brand-orange mb-8 opacity-50" size={64} />
                <blockquote className="text-2xl md:text-3xl font-heading font-bold leading-relaxed italic mb-8">
                  "Não é apenas mais um curso de vendas. É uma transformação de identidade: de vendedor comum para maestro da conversão."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center font-black text-xl">M</div>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs">Equipe MD Solution</p>
                    <p className="text-white/40 text-[10px] uppercase">Especialistas em Vendas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Conteúdo programático"
            title="A regência completa do <span class='text-brand-orange italic'>maestro pro</span>"
            subtitle="Um programa intensivo dividido em movimentos estratégicos para cobrir todas as frentes de vendas."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {MAESTRO_CONTENT.modules.map((mod, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 hover:border-brand-orange/30 hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    Módulo 0{i + 1}
                  </span>
                  <h3 className="text-xl font-black text-brand-darkBlue uppercase leading-tight mb-2">{mod.title}</h3>
                  <p className="text-sm font-bold text-brand-orange">{mod.subtitle}</p>
                </div>
                <ul className="space-y-3">
                  {mod.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-slate-700 font-bold">
                      <CheckCircle2 size={16} className="text-brand-green mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="py-24 bg-brand-darkBlue relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionTitle
            badge="Resultados reais"
            title="Maestros em ação"
            subtitle="Não prometemos mágica, prometemos método. Veja o impacto em quem já aplicou."
            alignment="center"
            dark
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {MAESTRO_CONTENT.cases.map((scase, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white font-black text-lg">
                    {scase.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{scase.title}</p>
                    <p className="text-blue-200/90 text-xs font-black uppercase tracking-widest">{scase.author}</p>
                  </div>
                </div>
                <p className="text-xl font-medium text-white italic mb-8">"{scase.quote}"</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {scase.stats.map((stat, j) => (
                    <div key={j} className="bg-black/20 p-3 rounded-xl border border-white/5 text-center">
                      <p className="text-brand-green font-bold text-sm">{stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Planos"
            title="Escolha seu caminho para a <span class='text-brand-orange italic'>maestria</span>"
            subtitle="Investimento acessível com ROI rápido. Feito para PMEs."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-16">
            {displayPlans.map((pkg, i) => (
              <div key={i} className={`relative p-8 rounded-[2.5rem] border flex flex-col ${pkg.highlight ? 'bg-brand-darkBlue text-white border-brand-darkBlue shadow-2xl scale-105 z-10' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-orange/30'}`}>
                {pkg.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {pkg.badge}
                  </div>
                )}
                <div className="mb-8 text-center">
                  <h4 className={`font-black text-lg uppercase tracking-tight mb-4 ${pkg.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>{pkg.name}</h4>
                  <p className={`text-3xl font-black mb-1 ${pkg.highlight ? 'text-brand-orange' : 'text-slate-800'}`}>{pkg.price}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{pkg.installments}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-3 text-xs font-medium leading-relaxed">
                      <Check size={14} className={`shrink-0 mt-0.5 ${pkg.highlight ? 'text-brand-orange' : 'text-brand-green'}`} />
                      <span className={pkg.highlight ? 'opacity-80' : 'opacity-100'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, interest: pkg.name }));
                    scrollToContact();
                  }}
                  variant={pkg.highlight ? 'primary' : 'outline-dark'}
                  className={`w-full h-12 text-[10px] font-black uppercase tracking-widest ${!pkg.highlight && 'border-slate-200 hover:border-brand-orange hover:text-brand-orange'}`}
                >
                  {pkg.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA / CONTACT */}
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
                  <h3 className="text-3xl font-black text-brand-darkBlue mb-4">Acesso liberado!</h3>
                  <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Um de nossos consultores analisará seu caso e entrará em contato em breve.</p>
                  <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova solicitação</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="flex flex-col items-center mb-8 gap-4">
                    <h3 className="text-3xl font-heading font-black text-brand-darkBlue uppercase tracking-tighter text-center">Receber análise grátis</h3>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            name: 'Empresa Teste Consultoria',
                            whatsapp: '(11) 99999-9999',
                            email: 'admin@consultoria.com',
                            interest: 'Maestro Essencial Digital'
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
                      <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Modalidade</label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        required
                        className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 transition-all text-slate-700 font-bold cursor-pointer appearance-none"
                      >
                        <option value="">Selecione...</option>
                        <option value="Maestro Essencial Presencial">Maestro Essencial Presencial</option>
                        <option value="Maestro Essencial Digital">Maestro Essencial Digital</option>
                        <option value="Maestro Completo">Maestro Completo</option>
                        <option value="Transformação Total">Transformação Total</option>
                        <option value="Dúvidas Gerais">Dúvidas Gerais</option>
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
                      {formState === 'loading' ? 'Enviando...' : 'Falar com consultor agora'}
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
                title={<>Pronto para transformar sua <span className="text-brand-orange italic">equipe</span>?</>}
                subtitle="Pare de perder vendas por falta de técnica. Traga o treinamento MAESTRO para dentro da sua empresa e veja os resultados em 90 dias."
                alignment="left"
                light={true}
              />

              <div className="space-y-8 mt-12">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
                    <Users size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/90 font-black uppercase tracking-widest">Maestria</p>
                    <p className="font-bold text-white text-xl tracking-tight">Excelência no atendimento</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 group-hover:scale-110 transition-transform">
                    <TrendingUp size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/90 font-black uppercase tracking-widest">Conversão</p>
                    <p className="font-bold text-white text-xl tracking-tight">Mais vendas e lucro real</p>
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

export default ConsultancyServicePage;
