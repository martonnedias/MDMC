import React, { useState, useEffect } from 'react';
import Button from './Button';
import {
  ShieldCheck, Zap, AlertTriangle, Lightbulb, TrendingUp,
  CheckCircle2, ArrowRight, Star, Target, Check, MousePointer2, Briefcase,
  FileText, Presentation, LayoutDashboard, Clock, Search
} from 'lucide-react';
import { SWOT_SECTION_CONTENT, SWOT_PLANS, FORM_VALIDATION_MSGS } from '../constants';
import { leadService } from '../services/leadService';
import { useSiteConfig } from '../lib/SiteContext';
import { formatPhone } from '../lib/formatters';
import SectionTitle from './SectionTitle';
import { adminService } from '../services/adminService';

// Fallback safety for plans
const SAFE_SWOT_PLANS = SWOT_PLANS || [];

const SwotServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const section = config.content?.sections?.swot;

  // Ensure scroll works even if ID is slightly off
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    planInterest: ''
  });

  const [displayPlans, setDisplayPlans] = useState<any[]>(SWOT_PLANS);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await adminService.getServices();
        const swotPlans = data.filter(s =>
          (s.page === 'swot-service' || s.page === 'swot' || s.category === 'swot') && s.is_active !== false
        );
        if (swotPlans.length > 0) {
          setDisplayPlans(swotPlans.map((s, index) => {
            const normalizedName = (s.name || '').toLowerCase().trim();
            const defaultPlan = SWOT_PLANS.find(p => p.name.toLowerCase().includes(normalizedName)) || SWOT_PLANS[index] || SWOT_PLANS[0];
            return {
              name: s.name || defaultPlan.name,
              subtitle: s.subtitle || defaultPlan.subtitle,
              price: s.price || defaultPlan.price,
              description: s.description || defaultPlan.description,
              cta: s.cta_text || defaultPlan.cta,
              badge: s.badge_text || defaultPlan.badge,
              features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '') ? s.features : defaultPlan.features,
              highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight
            };
          }));
        } else {
          setDisplayPlans(SWOT_PLANS);
        }
      } catch (err) {
        console.error('Error fetching SWOT plans:', err);
        setDisplayPlans(SWOT_PLANS);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanSelect = (planName: string) => {
    setFormData(prev => ({ ...prev, planInterest: planName }));
    scrollToContact();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const success = await leadService.saveContactLead({
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        interest: `Auditoria SWOT - Plano: ${formData.planInterest || 'Indefinido'}`,
        companySize: 'N/A'
      });
      if (success) {
        setFormState('success');
        setFormData({ name: '', whatsapp: '', email: '', planInterest: '' });
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

  const titleFontSize = section?.font_size_title || 'text-5xl sm:text-6xl lg:text-7xl';
  const subtitleFontSize = section?.font_size_subtitle || 'text-xl md:text-2xl';

  return (
    <div className="bg-slate-50 font-sans leading-normal">
      {/* 1. HERO SECTION - High Impact & Authority */}
      <section className="relative pt-44 pb-20 lg:pt-60 lg:pb-32 overflow-hidden bg-brand-darkBlue text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 opacity-20 pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full mb-8 font-black text-[9px] uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md">
            <ShieldCheck size={14} className="text-brand-orange" /> Inteligência de Negócios
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black mb-12 leading-[0.95] pb-2 tracking-tighter max-w-5xl mx-auto text-white">
            {section?.title || <>Pare de operar no escuro. Tenha <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic pr-1">clareza total.</span></>}
          </h1>

          <p className={`${subtitleFontSize} text-blue-100/70 mb-12 max-w-3xl mx-auto leading-relaxed font-medium`}>
            {section?.subtitle || "A Auditoria SWOT MD Solution é o raio-x que revela onde sua empresa está perdendo dinheiro e onde estão as oportunidades de lucro que você não vê."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} variant="primary" className="h-16 px-10 text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-orange/20">
              Ver Opções de Auditoria
            </Button>
            <button onClick={scrollToContact} className="h-16 px-10 text-sm font-black uppercase tracking-widest text-white hover:text-brand-orange transition-colors flex items-center gap-2">
              Falar com Consultor <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM (PAIN) - "Symptoms" */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-darkBlue mb-4">Sua empresa apresenta estes sintomas?</h2>
            <p className="text-lg text-slate-700 font-bold">Se você se identifica com 2 ou mais itens, você precisa de um diagnóstico urgente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 items-start gap-4 hover:shadow-lg transition-all">
              <AlertTriangle className="text-red-500 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Vendas Instáveis</h3>
              <p className="text-slate-600">Um mês é ótimo, no outro é um deserto. Você não sabe o que causa os picos e vales.</p>
            </div>
            <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 items-start gap-4 hover:shadow-lg transition-all">
              <Clock className="text-brand-orange mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apagando Incêndios</h3>
              <p className="text-slate-600">Sua rotina é resolver problemas operacionais. Não sobra tempo para pensar no crescimento.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 items-start gap-4 hover:shadow-lg transition-all">
              <Target className="text-slate-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sem Direção</h3>
              <p className="text-slate-600">Muitas ideias, pouca execução. A equipe está perdida e cada um rema para um lado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION - Methodology Grid */}
      <section className="py-24 bg-brand-darkBlue relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/5 opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionTitle
            title="O método <span class='text-brand-orange italic pr-1'>s.w.o.t. profissional</span>"
            subtitle="Não é apenas uma tabelinha preenchida. É uma análise profunda de 4 dimensões vitais do seu negócio."
            alignment="center"
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">Strengths (Forças)</h3>
              </div>
              <p className="text-blue-100/90 leading-relaxed border-l-2 border-green-500/50 pl-4 font-medium">
                Mapeamos o que sua empresa tem de único. Blindamos seus diferenciais para que a concorrência não consiga copiar.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">Weaknesses (Fraquezas)</h3>
              </div>
              <p className="text-blue-100/90 leading-relaxed border-l-2 border-red-500/50 pl-4 font-medium">
                Identificamos os pontos cegos. Onde você está perdendo dinheiro? Onde o atendimento falha? Onde a operação trava?
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">Opportunities (Oportunidades)</h3>
              </div>
              <p className="text-blue-100/90 leading-relaxed border-l-2 border-blue-500/50 pl-4 font-medium">
                O dinheiro que está na mesa. Tendências de mercado, novos canais de venda e parcerias que você ainda não viu.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">Threats (Ameaças)</h3>
              </div>
              <p className="text-blue-100/90 leading-relaxed border-l-2 border-orange-500/50 pl-4 font-medium">
                Riscos externos. Concorrentes agressivos, mudanças na economia ou tecnologia. Preparamos sua defesa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DELIVERABLES - tangible value */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            title="O que <span class='text-brand-blue italic'>você recebe</span> na prática?"
            subtitle="Tangibilizamos a estratégia. Nada de conversinha, entregamos material de verdade."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <h4 className="text-xl font-bold text-brand-darkBlue mb-3">Relatório Executivo PDF</h4>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Documento completo e diagramado com toda a análise, gráficos e conclusões para você consultar sempre.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={32} />
              </div>
              <h4 className="text-xl font-bold text-brand-darkBlue mb-3">Matriz de Prioridade</h4>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">Não adianta saber tudo e não saber por onde começar. Entregamos um guia passo-a-passo: Fase 1, 2 e 3.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Presentation size={32} />
              </div>
              <h4 className="text-xl font-bold text-brand-darkBlue mb-3">Reunião de Devolutiva</h4>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">*(Planos Estratégicos)* Uma apresentação online gravada onde explicamos cada ponto e tiramos suas dúvidas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            title="Investimento em clareza"
            subtitle="Quanto custa continuar errando? Escolha o nível de profundidade que seu momento exige."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {displayPlans.map((pkg, i) => (
              <div
                key={i}
                className={`p-10 rounded-[3rem] border transition-all duration-500 relative flex flex-col ${pkg.highlight
                  ? 'bg-brand-darkBlue text-white border-brand-orange shadow-[0_40px_80px_-15px_rgba(255,102,0,0.15)] scale-105 z-10'
                  : 'bg-white border-slate-200 hover:border-brand-blue/30 shadow-sm hover:shadow-xl'
                  }`}
              >
                {pkg.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div className="mb-10 text-center">
                  <h4 className={`font-black text-xl uppercase tracking-tight mb-4 ${pkg.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>
                    {pkg.name}
                  </h4>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-8 ${pkg.highlight ? 'text-brand-orange' : 'text-brand-blue'}`}>
                    {pkg.subtitle}
                  </p>
                  <div className={`text-4xl font-black tracking-tighter mb-4 ${pkg.highlight ? 'text-white' : 'text-slate-800'}`}>
                    {pkg.price}
                  </div>
                  <p className={`text-sm font-black leading-relaxed italic ${pkg.highlight ? 'text-blue-100/90' : 'text-slate-600'}`}>
                    {pkg.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((feat: string, j: number) => (
                    <li key={j} className="flex gap-4 text-sm font-medium leading-relaxed">
                      <Check size={18} className={`shrink-0 mt-0.5 ${pkg.highlight ? 'text-brand-orange' : 'text-brand-green'}`} />
                      <span className={pkg.highlight ? 'text-white/90' : 'text-slate-700 font-medium'}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(pkg.name)}
                  variant={pkg.highlight ? 'primary' : 'outline'}
                  fullWidth
                  className={`h-16 text-[10px] font-black uppercase tracking-widest ${!pkg.highlight && 'border-slate-200 hover:border-brand-orange hover:text-brand-orange'
                    }`}
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
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-brand-darkBlue mb-4">Acesso liberado!</h3>
                  <p className="text-slate-700 mb-10 max-w-xs mx-auto text-lg font-medium">Um de nossos especialistas analisará sua empresa e entrará em contato em breve.</p>
                  <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova solicitação</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
                  <h3 className="text-3xl font-heading font-black text-brand-darkBlue mb-8 uppercase tracking-tighter text-center">Agendar auditoria</h3>

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
                        name="planInterest"
                        value={formData.planInterest}
                        onChange={handleChange}
                        required
                        className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 transition-all text-slate-700 font-bold cursor-pointer appearance-none shadow-inner"
                      >
                        <option value="">Selecione...</option>
                        {displayPlans.map((plan, idx) => (
                          <option key={idx} value={plan.name}>{plan.name}</option>
                        ))}
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
                      {formState === 'loading' ? 'Enviando...' : 'Solicitar auditoria agora'}
                    </Button>
                    <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
                      *Relatório estratégico personalizado
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* INFORMAÇÕES À DIREITA */}
            <div className="text-white text-left order-1 lg:order-2">
              <SectionTitle
                badge="Canal de atendimento direto"
                title={<>Vamos <span className="text-brand-orange italic pr-1">mapear</span> seu futuro?</>}
                subtitle="Sua empresa merece clareza estratégica para crescer. Solicite um diagnóstico SWOT completo e pare de agir por intuição."
                alignment="left"
                light={true}
              />

              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/90 font-black uppercase tracking-widest">Confidencialidade</p>
                    <p className="font-bold text-white text-xl tracking-tight">Seus dados 100% protegidos</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 group-hover:scale-110 transition-transform">
                    <Target size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-blue-200/90 font-black uppercase tracking-widest">Assertividade</p>
                    <p className="font-bold text-white text-xl tracking-tight">Diagnóstico direto ao ponto</p>
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

export default SwotServicePage;
