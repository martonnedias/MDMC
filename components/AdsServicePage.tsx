import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { PLANS, ADS_FAQ, ADS_TESTIMONIALS, ADS_CONTENT } from '../constants';
import { adminService } from '../services/adminService';
import { leadService } from '../services/leadService';
import { Check, Megaphone, Target, BarChart3, Share2, Copy, Check as CheckIcon, Instagram, Facebook, Youtube, Linkedin, Sparkles, ArrowUpRight, TrendingUp, ShieldCheck, PieChart, Zap, LayoutDashboard, X, Star, ChevronDown } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';
import { formatPhone } from '../lib/formatters';
import { useAuth } from './Auth/AuthProvider';
import { Wand2 } from 'lucide-react';

const AdsServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  const isAdmin = user?.email && allowedEmails.includes(user.email);
  const section = config.content?.sections?.ads;
  const [displayPlans, setDisplayPlans] = useState<any[]>(PLANS);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    budget: ''
  });

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
        interest: `Estratégias de Anúncios Pagos - Verba: ${formData.budget}`,
        companySize: 'N/A'
      });
      if (success) {
        setFormState('success');
        setFormData({ name: '', whatsapp: '', email: '', budget: '' });
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

    if (name === 'whatsapp') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await adminService.getServices();
        const adsItems = data.filter(s => (s.page === 'ads' || s.category === 'marketing') && s.is_active !== false);

        if (adsItems.length > 0) {
          const plans = adsItems.filter(i => i.section_id === 'pricing' || !i.section_id);
          if (plans.length > 0) {
            const sorted = [...plans].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayPlans(sorted.map((s, index) => {
              const defaultPlan = PLANS[index] || PLANS[0];
              return {
                name: s.name || defaultPlan.name,
                subtitle: s.subtitle || defaultPlan.subtitle,
                price: s.price || defaultPlan.price,
                adBudget: s.extra_info || defaultPlan.adBudget,
                ctaText: s.cta_text || defaultPlan.ctaText || "Solicitar Orçamento",
                features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '')
                  ? s.features
                  : defaultPlan.features,
                highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight
              };
            }));
          } else {
            setDisplayPlans(PLANS);
          }
        } else {
          setDisplayPlans(PLANS);
        }
      } catch (err) {
        console.error('Error fetching ads services:', err);
        setDisplayPlans(PLANS);
      }
    };
    fetchServices();
  }, []);


  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(section?.title || 'MD Solution - Estratégias de Anúncios Pagos');
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  if (section?.is_active === false) return null;

  const titleFontSize = section?.font_size_title || 'text-5xl sm:text-6xl lg:text-7xl';
  const subtitleFontSize = section?.font_size_subtitle || 'text-xl lg:text-2xl';

  return (
    <div className="pt-0 pb-0" style={{ fontFamily: section?.font_family }}>
      {/* Hero (Attention) */}
      <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-40 overflow-hidden bg-slate-950 text-white">
        {/* Mesh Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-blue/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-brand-orange/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-[1.2]">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md text-brand-orange px-4 py-1.5 rounded-full mb-8 font-black text-[9px] uppercase tracking-[0.2em] border border-white/10 shadow-xl">
                <Sparkles size={14} className="animate-pulse" /> Performance de Elite
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[0.95] tracking-tighter mb-12 max-w-4xl text-white"
                dangerouslySetInnerHTML={{
                  __html: section?.title || 'Sua empresa <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic pr-1">invisível</span>? Ninguém compra de quem não vê.'
                }}
              />

              <p className="text-lg md:text-xl lg:text-2xl text-blue-100/90 mb-12 leading-relaxed font-bold max-w-2xl border-l-4 border-brand-orange/30 pl-8 transition-all">
                {section?.subtitle || section?.description || 'Gestão profissional de Estratégias de Anúncios Pagos no Google Ads e Meta Ads. Pare de "tentar a sorte" com o botão impulsionar. Vamos construir uma máquina de leads qualificados.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 mb-16">
                <Button onClick={scrollToContact} variant="primary" className="h-16 px-10 text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                  {section?.button_text || 'Parar de Perder Vendas'}
                </Button>

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=ads${i}`} className="w-11 h-11 rounded-full border-2 border-slate-900 bg-slate-800 shadow-xl" alt="Feedback Cliente" />
                    ))}
                  </div>
                  <div className="text-left border-l border-white/10 pl-6">
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} size={10} className="text-brand-orange fill-brand-orange" />)}
                    </div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">MD Solution</p>
                    <p className="text-[10px] font-bold text-white/40">Especialistas Certificados</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 hidden lg:block">
              <div className="relative group p-4 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl rotate-3">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-orange to-brand-blue opacity-20 blur-xl"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden aspect-square w-full">
                  <img
                    src={section?.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"}
                    alt="Alta Performance Digital"
                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                </div>
                {/* Float info card */}
                <div className="absolute -bottom-10 -right-10 bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/10 animate-float">
                  <div className="flex items-center gap-4 text-brand-orange">
                    <TrendingUp size={32} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ROI Médio</p>
                      <p className="text-2xl font-black text-white tracking-tighter">ALTA ESCALA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social Section (Trust) */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="text-brand-orange" size={24} />
              <p className="font-black text-sm text-slate-900 uppercase tracking-tighter text-center">Google Partner Premium</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-brand-blue" size={24} />
              <p className="font-black text-sm text-slate-900 uppercase tracking-tighter text-center">Meta Business Support</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="text-brand-orange" size={24} />
              <p className="font-black text-sm text-slate-900 uppercase tracking-tighter text-center">+200 Clientes Ativos</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Target className="text-brand-blue" size={24} />
              <p className="font-black text-sm text-slate-900 uppercase tracking-tighter text-center">98% de Retenção</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interest Section: The Unique Mechanism */}
      <section className="py-24 lg:py-40 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blue/5 -skew-x-12 translate-x-32 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionTitle
            badge="O nosso método"
            title="Sua empresa no radar de quem <span class='text-brand-blue italic pr-1'>decide o lucro</span>"
            subtitle="As Estratégias de Anúncios Pagos da MD Solution não são sobre curtidas ou visualizações. É sobre dominar o leilão e capturar a intenção de compra."
            alignment="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mt-20">
            <div>
              <div className="space-y-12 mt-12">
                <div className="flex gap-8 group">
                  <div className="w-14 h-14 bg-white shadow-xl text-brand-blue rounded-2xl flex items-center justify-center shrink-0 font-black text-xl group-hover:scale-110 transition-transform duration-500">01</div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-darkBlue mb-2">Engenharia de Público</h4>
                    <p className="text-slate-600 leading-relaxed font-medium">Mapeamos cirurgicamente quem é o seu decisor. Não gastamos seu orçamento com curiosos, focamos em quem tem o cartão na mão.</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="w-14 h-14 bg-white shadow-xl text-brand-orange rounded-2xl flex items-center justify-center shrink-0 font-black text-xl group-hover:scale-110 transition-transform duration-500">02</div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-darkBlue mb-2">Criativos Imã de Leads</h4>
                    <p className="text-slate-600 leading-relaxed font-medium">Desenvolvemos peças visuais e copy que falam diretamente com a dor do seu cliente. O anúncio vira uma oferta irresistível.</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="w-14 h-14 bg-white shadow-xl text-brand-blue rounded-2xl flex items-center justify-center shrink-0 font-black text-xl group-hover:scale-110 transition-transform duration-500">03</div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-darkBlue mb-2">Escalabilidade com ROI</h4>
                    <p className="text-slate-600 leading-relaxed font-medium">Usamos inteligência de dados para saber quando acelerar. Transformamos investimento em previsibilidade de faturamento.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-brand-darkBlue rounded-[3rem] p-12 text-white shadow-3xl relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/20">
                      <BarChart3 size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Status em Tempo Real</p>
                      <p className="text-xl font-black uppercase tracking-tight">Otimização Ativa</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 text-green-400 text-[10px] font-black uppercase px-4 py-1.5 rounded-full border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> AO VIVO
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 group hover:border-brand-orange/30 transition-all duration-500">
                    <p className="text-xs text-blue-100/40 mb-3 font-bold uppercase tracking-widest">Novos Leads Qualificados</p>
                    <div className="flex items-end justify-between">
                      <span className="text-5xl font-black text-white">+52</span>
                      <span className="text-green-400 text-sm font-black mb-1 flex items-center gap-1 bg-green-400/10 px-3 py-1 rounded-lg">↑ 32.5%</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/5 group hover:border-brand-blue/30 transition-all duration-500">
                    <p className="text-xs text-blue-100/40 mb-3 font-bold uppercase tracking-widest">Custo por Oportunidade</p>
                    <div className="flex items-end justify-between">
                      <span className="text-5xl font-black text-white">R$ 3,85</span>
                      <span className="text-green-400 text-sm font-black mb-1 flex items-center gap-1 bg-green-400/10 px-3 py-1 rounded-lg">↓ 14.2%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-white/10">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Zap className="text-brand-orange" size={24} />
                    </div>
                    <p className="text-sm font-medium text-blue-100/90 leading-relaxed italic">
                      "Antes da MD Solution, o tráfego era um buraco negro. Agora, sei exatamente quanto entra por cada real gasto."
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative behind card */}
              <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-brand-orange/20 rounded-[3.5rem] -z-10 translate-x-4 translate-y-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Amador vs Profissional Section */}
      <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="O jogo da escala"
            title={ADS_CONTENT.comparison.title}
            subtitle={ADS_CONTENT.comparison.subtitle}
            alignment="center"
          />

          <div className="mt-16 overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl bg-white max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-6 md:p-8 text-sm font-black uppercase tracking-widest">Dimensão</th>
                    <th className="p-6 md:p-8 text-sm font-black uppercase tracking-widest text-red-400">Modo Amador</th>
                    <th className="p-6 md:p-8 text-sm font-black uppercase tracking-widest text-brand-blue">Estratégia MDigital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ADS_CONTENT.comparison.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 md:p-8 font-black text-brand-darkBlue bg-slate-50/50">{row[0]}</td>
                      <td className="p-6 md:p-8 text-slate-400 font-bold italic flex items-center gap-3">
                        <X size={16} className="text-red-400 shrink-0" /> {row[1]}
                      </td>
                      <td className="p-6 md:p-8 text-brand-darkBlue font-black">
                        <div className="flex items-center gap-3">
                          <CheckIcon size={18} className="text-green-500 shrink-0" strokeWidth={4} /> {row[2]}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Desire Section: Benefits (Advantages) */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Benefícios exclusivos"
            title="Mais que anúncios: <span class='text-brand-orange italic'>inteligência de vendas</span>"
            subtitle="Não se contente com volume de tráfego. Busque volume de faturamento."
            alignment="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {[
              { icon: Target, title: "Precisão Cirúrgica", text: "Apareça na frente de quem pesquisou pelo seu produto nos últimos 30 minutos." },
              { icon: TrendingUp, title: "Foco Total em ROAS", text: "Nossa meta é retorno sobre o investimento. Se não gera lucro, não faz sentido." },
              { icon: ShieldCheck, title: "Domínio de Marca", text: "Seja a autoridade absoluta no seu nicho, aparecendo em todos os canais estratégicos." },
              { icon: PieChart, title: "Análise Transparente", text: "Dashboard exclusivo para você acompanhar seus resultados sem termos técnicos complexos." }
            ].map((b, i) => (
              <div key={i} className="group bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02]">
                <div className="w-16 h-16 bg-white shadow-lg text-brand-blue rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                  <b.icon size={32} />
                </div>
                <h4 className="text-xl font-heading font-black mb-4 text-brand-darkBlue tracking-tighter uppercase leading-tight">{b.title}</h4>
                <p className="text-slate-600 text-sm font-bold leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof: Testimonials */}
      <section className="py-24 lg:py-40 bg-brand-darkBlue relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionTitle
            badge="Prova real"
            title="Quem domina o jogo <span class='text-brand-orange italic pr-1'>recomenda</span>"
            subtitle="Resultados que falam mais alto que qualquer promessa vazia."
            alignment="center"
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
            {ADS_TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-[3.5rem] border border-white/10 hover:bg-white/10 transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white tracking-tighter leading-tight">{t.name}</h4>
                    <p className="text-xs text-brand-orange font-black uppercase tracking-[0.2em]">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-brand-orange text-brand-orange" />)}
                </div>
                <p className="text-xl md:text-2xl text-blue-100/90 font-medium leading-relaxed italic relative">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realistic Pricing */}
      <section className="py-24 lg:py-40 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionTitle
            badge="Investimento estratégico"
            title="Escolha seu <span class='text-brand-blue italic'>nível de escala</span>"
            subtitle="Planos desenhados para o momento atual da sua empresa."
            alignment="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto mt-20">
            {displayPlans.map((plan, index) => (
              <div
                key={index}
                className={`group relative rounded-[2.5rem] transition-all duration-700 flex flex-col h-full overflow-hidden
                                  ${plan.highlight
                    ? 'bg-brand-darkBlue text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] lg:scale-110 z-10 border border-white/10'
                    : 'bg-white border border-slate-200 shadow-xl'
                  }
                                `}
              >
                {plan.highlight && (
                  <div className="bg-brand-orange text-white py-3 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                    Performance Acelerada
                  </div>
                )}
                <div className="p-12 flex-grow flex flex-col">
                  <h3 className={`text-3xl font-heading font-black mb-1 uppercase tracking-tighter ${plan.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>{plan.name}</h3>
                  <p className="text-brand-orange font-bold text-[10px] uppercase tracking-[0.2em] mb-10">{plan.subtitle}</p>

                  <div className="mb-10">
                    <span className={`text-5xl font-black tracking-tighter ${plan.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? 'text-blue-100/90' : 'text-slate-600'}`}>/mês</span>
                  </div>

                  <ul className="space-y-6 mb-12 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-blue/10 text-brand-blue'}`}>
                          <Check size={12} strokeWidth={4} />
                        </div>
                        <span className={`text-sm font-bold leading-snug ${plan.highlight ? 'text-blue-100/90' : 'text-slate-700'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`p-6 rounded-[2rem] mb-10 border ${plan.highlight ? 'bg-white/5 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                    <p className={`text-[10px] font-black uppercase text-center tracking-[0.1em] ${plan.highlight ? 'text-brand-orange' : 'text-slate-500'}`}>Investimento Sugerido: {plan.adBudget}</p>
                  </div>

                  <Button
                    onClick={scrollToContact}
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className={`h-16 text-xs font-black uppercase tracking-widest ${plan.highlight ? 'shadow-2xl shadow-brand-orange/40' : 'border-slate-200 hover:border-brand-blue hover:text-brand-blue'}`}
                  >
                    {plan.ctaText || "Solicitar Orçamento"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <SectionTitle
            badge="Tira-dúvidas"
            title="Perguntas <span class='text-brand-blue italic pr-1'>Frequentes</span>"
            alignment="center"
          />

          <div className="mt-16 space-y-4 text-left">
            {ADS_FAQ.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden hover:border-brand-blue/20 transition-all duration-300">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                >
                  <h4 className="text-lg md:text-xl font-black text-brand-darkBlue tracking-tight flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs">Q.</span>
                    {faq.question}
                  </h4>
                  <div className={`p-2 rounded-full bg-white shadow-sm transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-brand-orange' : 'text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-8 pt-0 text-slate-600 font-bold leading-relaxed border-t border-slate-100/50 ml-12">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action: Success CTA / Form */}
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
                  <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Um de nossos especialistas analisará seu perfil e entrará em contato em breve.</p>
                  <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova consultoria</Button>
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
                            name: 'Empresa Teste Ads',
                            whatsapp: '(11) 99999-9999',
                            email: 'admin@ads.com',
                            budget: 'R$ 3.000 - R$ 5.000'
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
                      <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Pretensão de verba</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-500 font-bold cursor-pointer appearance-none"
                      >
                        <option value="">Investimento...</option>
                        <option value="R$ 1.000 - R$ 3.000">R$ 1k - R$ 3k</option>
                        <option value="R$ 3.000 - R$ 5.000">R$ 3k - R$ 5k</option>
                        <option value="R$ 5.000 - R$ 10.000">R$ 5k - R$ 10k</option>
                        <option value="Acima de R$ 10.000">+ R$ 10k</option>
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

                  <div className="pt-6">
                    <Button
                      fullWidth
                      variant="primary"
                      loading={formState === 'loading'}
                      className="h-20 text-lg font-black uppercase tracking-widest bg-brand-orange hover:bg-brand-orange/90 shadow-xl shadow-brand-orange/20 rounded-2xl"
                    >
                      SOLICITAR PROPOSTA
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                      Seus dados estão protegidos pela LGPD
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* INFORMAÇÕES À DIREITA */}
            <div className="text-white text-left order-1 lg:order-2">
              <SectionTitle
                badge="Fale com um estrategista"
                title="Vamos <span class='text-brand-orange italic'>escalar</span> seu negócio?"
                subtitle="Não queime dinheiro com amadores. Coloque sua verba nas mãos de quem entende de performance e ROI real."
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
                    <p className="font-bold text-white text-xl tracking-tight">Otimização semanal de ROI</p>
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
      </section>

    </div>
  );
};

export default AdsServicePage;
