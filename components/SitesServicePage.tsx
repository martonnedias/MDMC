import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { Layout, Smartphone, Zap, Search, Target, ShieldCheck, CheckCircle2, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Sparkles, Monitor, Globe, MousePointer2, Check as CheckIcon, ArrowUpRight, Code, PenTool, Rocket, Clock, LayoutDashboard, AlertTriangle, ChevronDown, Star, Quote, Wand2, X, PieChart } from 'lucide-react';
import { adminService } from '../services/adminService';
import { leadService } from '../services/leadService';
import { useSiteConfig } from '../lib/SiteContext';
import { useAuth } from './Auth/AuthProvider';
import { formatPhone } from '../lib/formatters';

import { SITES_CONTENT, SITES_PLANS, SITES_FAQ, SITES_TESTIMONIALS } from '../constants';

const SitesServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  const isAdmin = user?.email && allowedEmails.includes(user.email);
  const section = config.content?.sections?.sites;
  const [investment, setInvestment] = useState<string>('R$ 1.200');
  const [displayProblems, setDisplayProblems] = useState<any[]>([]);
  const [displayFeatures, setDisplayFeatures] = useState<any[]>([]);
  const [displayFullPackage, setDisplayFullPackage] = useState<string[]>([]);
  const [pricingPlans, setDisplayPricingPlans] = useState<any[]>([]);
  const [faqItems, setFaqItems] = useState<any[]>([]);
  const [displayGallery, setDisplayGallery] = useState<any[]>([]);
  const [displayTestimonials, setDisplayTestimonials] = useState<any[]>([]);
  const [displayMethodology, setDisplayMethodology] = useState<any[]>([
    { title: "Estratégia & UX", text: "Mapeamos a jornada do seu cliente para maximizar cliques.", icon: Target },
    { title: "Design de Impacto", text: "Identidade visual premium que gera desejo e confiança.", icon: Sparkles },
    { title: "Engenharia", text: "Código limpo e rápido, pronto para o Google e escala.", icon: Code }
  ]);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSitesData = async () => {
      try {
        const data = await adminService.getServices();
        const sitesItems = data.filter(s =>
          (s.page === 'sites' || s.category === 'sites') && s.is_active !== false
        );

        if (sitesItems.length > 0) {
          const pricingItem = sitesItems.find(i => i.section_id === 'pricing');
          if (pricingItem) setInvestment(pricingItem.price);

          const plans = sitesItems.filter(i => i.section_id === 'pricing' || (!i.section_id && i.category === 'sites'));
          if (plans.length > 0) {
            const sortedPlans = [...plans].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayPricingPlans(sortedPlans.map((p, idx) => {
              const defaultPlan = SITES_PLANS[idx] || SITES_PLANS[0];
              return {
                name: p.name || defaultPlan.name,
                subtitle: p.subtitle || defaultPlan.subtitle || "",
                description: p.description || defaultPlan.description,
                price: p.price || defaultPlan.price,
                features: (Array.isArray(p.features) && p.features.length > 0) ? p.features : defaultPlan.features,
                highlight: p.is_highlighted !== undefined ? p.is_highlighted : defaultPlan.highlight,
                badge: p.badge_text || defaultPlan.badge
              };
            }));
          } else {
            setDisplayPricingPlans(SITES_PLANS);
          }

          const faqs = sitesItems.filter(i => i.section_id === 'faq');
          if (faqs.length > 0) {
            const sortedFaqs = [...faqs].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setFaqItems(sortedFaqs.map(f => ({
              question: f.name,
              answer: f.description
            })));
          } else {
            setFaqItems(SITES_FAQ);
          }

          const gallery = sitesItems.filter(i => i.section_id === 'gallery');
          if (gallery.length > 0) {
            const sortedGallery = [...gallery].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayGallery(sortedGallery.map(g => ({
              img: g.extra_info || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
              title: g.name
            })));
          } else {
            setDisplayGallery(SITES_CONTENT.gallery.map(img => ({ img, title: "Projeto MD Solution" })));
          }

          const testimonials = sitesItems.filter(i => i.section_id === 'testimonials');
          if (testimonials.length > 0) {
            const sortedTest = [...testimonials].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayTestimonials(sortedTest.map((t, idx) => {
              const defaultTest = SITES_TESTIMONIALS[idx] || SITES_TESTIMONIALS[0];
              return {
                name: t.name || defaultTest.name,
                role: t.subtitle || defaultTest.role || "",
                text: t.description || defaultTest.text,
                image: t.extra_info || defaultTest.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400"
              };
            }));
          } else {
            setDisplayTestimonials(SITES_TESTIMONIALS);
          }

          const methodology = sitesItems.filter(i => i.section_id === 'methodology');
          if (methodology.length > 0) {
            const sortedMeth = [...methodology].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            const icons = [Target, Sparkles, Code];
            setDisplayMethodology(sortedMeth.map((m, idx) => ({
              title: m.name,
              text: m.description,
              icon: icons[idx % icons.length]
            })));
          }

          const painPoints = sitesItems.filter(i => i.section_id === 'pain-points');
          if (painPoints.length > 0) {
            const sorted = [...painPoints].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayProblems(sorted.map((p, idx) => ({
              title: p.name,
              text: p.description,
              icon: SITES_CONTENT.problems[idx]?.icon || AlertTriangle,
              color: SITES_CONTENT.problems[idx]?.color || "text-red-600 bg-red-100"
            })));
          } else {
            setDisplayProblems(SITES_CONTENT.problems);
          }

          const benefits = sitesItems.filter(i => i.section_id === 'benefits');
          if (benefits.length > 0) {
            const sorted = [...benefits].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setDisplayFeatures(sorted.map((b, idx) => ({
              title: b.name,
              desc: b.description,
              icon: SITES_CONTENT.features[idx]?.icon || Zap,
              size: SITES_CONTENT.features[idx]?.size || "normal"
            })));
          } else {
            setDisplayFeatures(SITES_CONTENT.features);
          }

          const modules = sitesItems.find(i => i.section_id === 'modules');
          if (modules && Array.isArray(modules.features) && modules.features.length > 0) {
            setDisplayFullPackage(modules.features);
          } else {
            setDisplayFullPackage(SITES_CONTENT.fullPackage);
          }
        } else {
          setInvestment('R$ 1.200');
          setDisplayPricingPlans(SITES_PLANS);
          setFaqItems(SITES_FAQ);
          setDisplayGallery(SITES_CONTENT.gallery);
          setDisplayTestimonials(SITES_TESTIMONIALS);
          setDisplayProblems(SITES_CONTENT.problems);
          setDisplayFeatures(SITES_CONTENT.features);
          setDisplayFullPackage(SITES_CONTENT.fullPackage);
        }
      } catch (err) {
        console.error('Error fetching sites data:', err);
      }
    };
    fetchSitesData();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [formState, setFormState] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    projectType: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const success = await leadService.saveContactLead({
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        interest: `Site/LP - Tipo: ${formData.projectType}`,
        companySize: 'N/A'
      });
      if (success) {
        setFormState('success');
        setFormData({ name: '', whatsapp: '', email: '', projectType: '' });
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

  if (section?.is_active === false) return null;

  return (
    <div className="pt-0 pb-0" style={{ fontFamily: section?.font_family }}>
      {/* HERO SECTION */}
      <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-40 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-blue/5 rounded-full blur-[120px] -mr-[10%] -mt-[10%]"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[100px] -ml-[5%] -mb-[5%]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-slate-50 text-brand-blue px-4 py-1.5 rounded-full mb-8 font-black text-[9px] uppercase tracking-[0.2em] border border-slate-100 shadow-sm animate-fade-in">
                <Globe size={14} className="animate-spin-slow" /> Engenharia de Conversão
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[0.95] tracking-tighter mb-12 max-w-4xl"
                style={{ color: section?.title_color || 'var(--color-title)' }}
                dangerouslySetInnerHTML={{
                  __html: section?.title || 'Sua empresa merece uma <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400 italic pr-1">casa digital</span> que vende.'
                }}
              />

              <p className="text-lg md:text-xl lg:text-2xl text-slate-500 mb-12 leading-relaxed font-bold max-w-2xl border-l-4 border-brand-blue/30 pl-8 transition-all">
                {section?.subtitle || section?.description || 'Sites rápidos, modernos e focados em converter visitantes em clientes. Não tenha apenas um cartão de visitas, tenha uma ferramenta estratégica.'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full lg:max-w-xl">
                <div className="flex-1 bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Projeto Inicial</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white tracking-tighter truncate">{investment}</span>
                  </div>
                </div>

                <div className="flex-[1.2] flex flex-col gap-4">
                  <Button onClick={scrollToContact} variant="primary" className="h-16 px-8 text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20 hover:scale-105 transition-transform">
                    {section?.button_text || 'Solicitar Orçamento de Site'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative group lg:mt-0">
              <div className="relative p-2 bg-white rounded-[3rem] shadow-2xl border border-slate-100 transition-all duration-1000 overflow-hidden">
                <img
                  src={section?.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"}
                  alt="Landing Page Premium"
                  className="rounded-[2.5rem] w-full aspect-[4/3] object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION */}
      <section className="py-20 bg-white relative z-10 -mt-10 lg:-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-brand-darkBlue rounded-[3rem] p-8 lg:p-16 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 items-start">
              {displayMethodology.map((m, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-6 group">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
                    <m.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-black mb-4 uppercase tracking-tighter">{m.title}</h3>
                    <p className="text-blue-100/60 font-medium leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTEREST SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="O que está em jogo"
            title={section?.problems_title || "Seu site está <span class='text-brand-orange italic'>expulsando</span> clientes?"}
            subtitle={section?.problems_subtitle || "Na internet, você tem menos de 3 segundos para convencer alguém a ficar."}
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {displayProblems.map((prob, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 ${prob.color || 'bg-blue-100 text-brand-blue'} rounded-2xl flex items-center justify-center mb-6`}>
                  <prob.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{prob.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{prob.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURES */}
      <section className="py-24 lg:py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Tecnologia de ponta"
            title={section?.features_title || 'Muito mais que um <span class="text-brand-blue italic pr-1">rostinho bonito</span>'}
            subtitle={section?.features_subtitle || 'Nossos sites são máquinas de vendas construídas com as melhores tecnologias.'}
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-20">
            {displayFeatures.map((feature, i) => (
              <div key={i} className={`bg-white rounded-[2.5rem] p-10 border border-slate-100 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between shadow-sm ${i === 0 ? 'md:col-span-2 md:row-span-2 bg-brand-darkBlue text-white' : 'md:col-span-1'}`}>
                <div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-all ${i === 0 ? 'bg-white/10 text-white' : 'bg-brand-blue/10 text-brand-blue'}`}>
                    <feature.icon size={32} />
                  </div>
                  <h4 className={`text-2xl font-black mb-4 uppercase tracking-tighter ${i === 0 ? 'text-white' : 'text-brand-darkBlue'}`}>{feature.title}</h4>
                  <p className={`text-sm font-medium leading-relaxed ${i === 0 ? 'text-blue-100/60' : 'text-slate-500'}`}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="py-24 lg:py-40 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <SectionTitle
            badge="Investimento estratégico"
            title={section?.pricing_title || 'Estruturas que <span class="text-brand-orange italic">geram lucro</span>'}
            subtitle={section?.pricing_subtitle || 'Escolha o modelo ideal para seu momento.'}
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative p-10 rounded-[3.5rem] border transition-all duration-700 flex flex-col hover:translate-y-[-10px] ${plan.highlight ? 'bg-brand-darkBlue text-white border-brand-orange shadow-2xl scale-105 z-10' : 'bg-white border-slate-100 shadow-sm'}`}>
                <h3 className={`text-2xl font-black mb-2 uppercase tracking-tighter ${plan.highlight ? 'text-white' : 'text-brand-darkBlue'}`}>{plan.name}</h3>
                <p className={`text-5xl font-black mb-8 ${plan.highlight ? 'text-brand-orange' : 'text-brand-darkBlue'}`}>{plan.price}</p>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold">
                      <CheckIcon size={14} className={plan.highlight ? 'text-brand-orange' : 'text-green-500'} />
                      <span className={plan.highlight ? 'text-blue-50' : 'text-slate-600'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={scrollToContact} variant={plan.highlight ? "primary" : "outline-dark"} className="w-full">Contratar</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Prova social"
            title="Aprovado por <span class='text-brand-orange italic pr-1'>grandes líderes</span>"
            subtitle="Veja o que dizem nossos clientes."
            alignment="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {displayTestimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-darkBlue text-lg">{t.name}</h4>
                    <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic font-medium">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="py-24 lg:py-40 bg-brand-darkBlue relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white rounded-[3rem] p-10 shadow-3xl">
              {formState === 'success' ? (
                <div className="text-center py-10">
                  <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-brand-darkBlue">Sucesso!</h3>
                  <Button onClick={() => setFormState('idle')} variant="outline-dark" className="mt-6">Voltar</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-3xl font-black text-brand-darkBlue uppercase text-center mb-8">Solicitar Orçamento</h3>
                  {isAdmin && (
                    <button type="button" onClick={() => setFormData({ name: 'Admin Teste', email: 'admin@teste.com', whatsapp: '(11) 99999-9999', projectType: 'Landing Page' })} className="mx-auto block text-[10px] font-black uppercase tracking-widest bg-slate-100 p-2 rounded-lg mb-4">Auto-Preencher</button>
                  )}
                  <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required className="w-full h-14 px-6 bg-slate-50 border rounded-2xl outline-none focus:border-brand-orange" />
                  <input type="tel" name="whatsapp" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} required className="w-full h-14 px-6 bg-slate-50 border rounded-2xl outline-none focus:border-brand-orange" />
                  <select name="projectType" value={formData.projectType} onChange={handleChange} required className="w-full h-14 px-6 bg-slate-50 border rounded-2xl outline-none focus:border-brand-orange">
                    <option value="">Tipo de Projeto</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Site Institucional">Site Institucional</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                  <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="w-full h-14 px-6 bg-slate-50 border rounded-2xl outline-none focus:border-brand-orange" />
                  <Button type="submit" className="w-full h-16 font-black uppercase tracking-widest" disabled={formState === 'loading'}>Enviar Solicitação</Button>
                </form>
              )}
            </div>
            <div className="text-white">
              <h2 className="text-4xl lg:text-6xl font-black mb-6 uppercase leading-tight">Vamos construir seu <span className="text-brand-orange italic">sucesso digital</span>?</h2>
              <p className="text-blue-100/70 text-lg mb-12">Fale com um especialista agora mesmo.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SitesServicePage;
