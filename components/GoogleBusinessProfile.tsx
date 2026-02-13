import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { GMB_CONTENT } from '../constants';
import {
  MapPin, Star, TrendingUp, Search,
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin,
  Globe, Layers, Target, Check as CheckIcon, X, ChevronRight, LayoutDashboard
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { leadService } from '../services/leadService';
import { useSiteConfig } from '../lib/SiteContext';
import { formatPhone } from '../lib/formatters';
import { useAuth } from './Auth/AuthProvider';
import { Wand2 } from 'lucide-react';

const GoogleBusinessProfile: React.FC = () => {
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  const isAdmin = user?.email && allowedEmails.includes(user.email);
  const section = config.content?.sections?.gmb;
  const [displayPackages, setDisplayPackages] = useState<any[]>(GMB_CONTENT.packages);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchGmb = async () => {
      const data = await adminService.getServices();
      const gmbPlans = data.filter(s => s.category === 'gmb');
      if (gmbPlans.length > 0) {
        setDisplayPackages(gmbPlans.map((s, index) => {
          const defaultPkg = GMB_CONTENT.packages[index] || GMB_CONTENT.packages[0];
          return {
            name: s.name || defaultPkg.name,
            description: s.description || defaultPkg.description,
            price: s.price || defaultPkg.price,
            features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '')
              ? s.features
              : defaultPkg.features,
            cta: s.cta_text || defaultPkg.cta,
            highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPkg.highlight
          };
        }));
      }
    };
    fetchGmb();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    hasProfile: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    try {
      const success = await leadService.saveContactLead({
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        interest: `GMB - Perfil: ${formData.hasProfile}`,
        companySize: 'N/A'
      });
      if (success) {
        setFormState('success');
        setFormData({ name: '', whatsapp: '', email: '', hasProfile: '' });
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
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(GMB_CONTENT.hero.title);
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  if (section?.is_active === false) return null;

  return (
    <div className="pt-0 pb-0 bg-white" style={{ fontFamily: section?.font_family }}>
      {/* 1. HERO SECTION */}
      <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-32 overflow-hidden bg-slate-50 text-slate-900 border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] -mr-[10%] -mt-[10%] opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white text-brand-blue px-4 py-1.5 rounded-full mb-10 font-black text-[9px] uppercase tracking-[0.3em] border border-slate-200 shadow-sm">
                <Sparkles size={14} className="text-brand-orange animate-pulse" /> Visibilidade Geo-Localizada
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[0.95] tracking-tighter mb-12 text-brand-darkBlue max-w-4xl">
                Coloque sua empresa no <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic pr-1">mapa</span> com o Google Meu Negócio.
              </h1>

              <div className="space-y-8 mb-16 border-l-4 border-brand-orange/30 pl-8">
                <p className="text-lg md:text-xl lg:text-2xl text-slate-600 leading-relaxed font-bold max-w-2xl italic">
                  {GMB_CONTENT.hero.subtitle}
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black max-w-lg">
                  Não permita que o seu concorrente capture o cliente que <span className="text-brand-darkBlue">procura por você.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:justify-start">
                <Button onClick={scrollToContact} variant="primary" className="h-20 px-12 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/20 w-full sm:w-auto hover:scale-105 transition-all">
                  {GMB_CONTENT.hero.cta} <ArrowRight className="ml-2" />
                </Button>

                <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-5">
                    <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-orange transition-colors"><Instagram size={18} /></a>
                    <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-orange transition-colors"><Facebook size={18} /></a>
                    <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-orange transition-colors"><Youtube size={18} /></a>
                  </div>
                  <div className="w-px h-6 bg-slate-300"></div>
                  <div className="relative">
                    <button onClick={() => setShowShare(!showShare)} className="text-slate-500 hover:text-brand-blue transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest relative">
                      <Share2 size={14} /> Compartilhar
                      {showShare && (
                        <div className="absolute bottom-full left-0 mb-4 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 min-w-[160px] animate-fade-in z-50 text-left">
                          <button onClick={() => handleShare('whatsapp')} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">WhatsApp</button>
                          <button onClick={() => handleShare('facebook')} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Facebook</button>
                          <button onClick={() => handleShare('linkedin')} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">LinkedIn</button>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group flex justify-center lg:justify-end">
              <div className="absolute -inset-6 bg-brand-blue/5 rounded-[3rem] group-hover:bg-brand-blue/10 transition-all duration-1000 blur-2xl opacity-50"></div>
              <div className="relative p-3 bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl transition-all duration-1000 group-hover:border-brand-blue/20">
                <div className="relative rounded-[3rem] overflow-hidden aspect-[1/0.8] w-full max-w-[550px]">
                  <img src="/gmb/maps.png" alt="Google Maps MDigital" className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 via-transparent to-transparent"></div>
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-3xl border border-slate-100 flex items-center gap-4 animate-float">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Crescimento Real</p>
                    <p className="text-2xl font-black text-brand-darkBlue tracking-tighter">+35% Ligações</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPORTANCE SECTION */}
      <section className="py-24 lg:py-48 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <SectionTitle
            badge="Por que investir?"
            title="Por que o seu perfil é essencial hoje?"
            subtitle={`${GMB_CONTENT.importance.description} O perfil permite aparecer com nome, fotos, avaliações, horários e botão de rota exatamente quando o cliente procura por você.`}
            alignment="center"
            light={true}
          />

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 order-2 lg:order-1">
              {GMB_CONTENT.importance.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-5 text-white/90 group bg-white/5 p-6 lg:p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 hover:border-brand-blue/30 transition-all duration-500 shadow-2xl">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0 shadow-lg border border-white/5">
                    <benefit.icon size={28} />
                  </div>
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest leading-tight">{benefit.title}</span>
                </div>
              ))}
            </div>

            <div className="relative group order-1 lg:order-2">
              <div className="absolute -inset-10 bg-brand-orange/5 rounded-full blur-[100px] group-hover:bg-brand-orange/10 transition-all duration-1000"></div>
              <img src="/gmb/reviews.png" alt="Reviews Google" className="relative rounded-[3rem] shadow-2xl border border-white/10 transform group-hover:scale-[1.02] transition-transform duration-1000 w-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-3xl animate-float">
                <Star size={32} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICE PILLARS */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Escopo completo"
            title={<>O que a MDigital faz <span className='text-brand-blue italic'>por você</span></>}
            subtitle="Cuidamos de tudo, da criação técnica à gestão estratégica de presença local."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              {
                title: 'Criação & Reivindicação',
                desc: 'Verificamos sua existência no Google e assumimos a propriedade oficial do seu perfil se necessário.',
                icon: ShieldCheck,
                features: ['Verificação de duplicados', 'Recuperação de acesso', 'Perfil do zero']
              },
              {
                title: 'Verificação Oficial',
                desc: 'Solicitamos e acompanhamos o processo (carta, e-mail ou telefone) até seu perfil ficar "Ao Vivo".',
                icon: Globe,
                features: ['Acompanhamento de prazos', 'Inserção de códigos', 'Suporte técnico']
              },
              {
                title: 'Otimização Técnica',
                desc: 'Preenchimento técnico seguindo as diretrizes de SEO local para máxima relevância em buscas.',
                icon: Search,
                features: ['Categorias estratégicas', 'Palavras-chave regionais', 'Descrições premium']
              },
              {
                title: 'Gestão Visual & Info',
                desc: 'Curadoria de fotos (fachada, equipe, produtos) e atualização constante de horários especiais.',
                icon: Layers,
                features: ['Fotos de alta qualidade', 'Horários de feriados', 'Botões de ação']
              }
            ].map((pillar, i) => (
              <div key={i} className="flex flex-col bg-slate-50 p-7 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                <div className="w-12 h-12 bg-white rounded-[1.25rem] flex items-center justify-center text-brand-blue shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <pillar.icon size={22} />
                </div>
                <h3 className="text-2xl font-heading font-black text-brand-darkBlue mb-4 leading-tight tracking-tight">{pillar.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-semibold mb-6">{pillar.desc}</p>
                <ul className="mt-auto space-y-2">
                  {pillar.features.map((f, idx) => (
                    <li key={idx} className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                      <div className="w-1 h-1 bg-brand-orange rounded-full"></div> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPARISON TABLE */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Competitividade"
            title={GMB_CONTENT.comparison.title}
            subtitle={GMB_CONTENT.comparison.subtitle}
            alignment="center"
          />

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-white/10">
                  {GMB_CONTENT.comparison.headers.map((h, i) => (
                    <th key={i} className={`p-6 text-[10px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-slate-400' : 'text-white'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GMB_CONTENT.comparison.rows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 text-sm font-black text-brand-darkBlue border-r border-slate-50">{row[0]}</td>
                    <td className="p-6 text-xs font-bold text-slate-400 border-r border-slate-50 flex items-center gap-2 italic">
                      <X size={12} className="text-red-400 shrink-0" /> {row[1]}
                    </td>
                    <td className="p-6 text-xs font-black text-brand-blue">
                      <div className="flex items-center gap-2">
                        <CheckIcon size={14} className="text-green-500 shrink-0" /> {row[2]}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionTitle
            badge="Workflow MDigital"
            title={<>A jornada até o <span className="text-brand-orange italic">resultado</span></>}
            subtitle="Processo metódico focado em performance local"
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10 relative">
            <div className="hidden lg:block absolute top-[1.5rem] left-10 right-10 h-px bg-slate-200 -z-0"></div>

            {GMB_CONTENT.process.steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-brand-darkBlue text-white rounded-xl flex items-center justify-center font-black text-lg mb-6 shadow-lg border-4 border-white group-hover:bg-brand-blue transition-colors duration-500">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-heading font-black text-brand-darkBlue mb-3 tracking-tight">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-[280px] font-semibold">{step.text}</p>
              </div>
            ))}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center font-black text-lg mb-6 shadow-lg border-4 border-white group-hover:bg-brand-darkBlue transition-colors duration-500">
                6
              </div>
              <h3 className="text-2xl font-heading font-black text-brand-darkBlue mb-3 tracking-tight">Gestão Contínua</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-[280px] font-semibold">Posts estratégicos e resposta profissional para manter sua reputação sempre no topo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RESULTS & EXAMPLES */}
      <section className="py-24 lg:py-48 bg-brand-darkBlue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

          <SectionTitle
            badge="Impacto real"
            title={<>O que você pode <span className="text-brand-orange italic">esperar</span> de nós</>}
            alignment="center"
            light={true}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="text-left">
              <ul className="grid grid-cols-1 gap-6">
                {GMB_CONTENT.results.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-5 group bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-brand-orange/30 transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0 border border-white/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all shadow-lg">
                      <CheckIcon size={18} strokeWidth={4} />
                    </div>
                    <span className="text-lg text-blue-50 font-bold tracking-tight leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-orange to-brand-blue opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-1000"></div>
              <div className="relative p-10 md:p-14 bg-white rounded-[3rem] text-slate-900 shadow-3xl border-4 border-white/5 overflow-hidden">
                <div className="bg-brand-orange text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mb-8 shadow-md">Mini Case de Sucesso</div>
                <p className="text-2xl md:text-3xl font-heading font-black text-brand-darkBlue leading-tight mb-10 italic tracking-tighter">
                  "{GMB_CONTENT.results.case}"
                </p>
                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-100">
                  <div className="text-left">
                    <p className="text-5xl font-black text-brand-blue tracking-tighter">+35%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Ligações</p>
                  </div>
                  <div className="text-left">
                    <p className="text-5xl font-black text-green-600 tracking-tighter">Destaque</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Na Região</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <SectionTitle
            badge="Nossos pacotes"
            title={<>Invista no <span className='text-brand-blue italic'>topo das buscas</span></>}
            subtitle="Planos desenhados para cada momento do seu negócio local."
            alignment="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16 px-4">
            {displayPackages.map((pkg, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border transition-all duration-700 flex flex-col items-center text-center group h-full ${pkg.highlight ? 'bg-brand-darkBlue text-white border-brand-darkBlue shadow-2xl scale-105 z-10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl'}`}>
                {pkg.highlight && (
                  <div className="bg-brand-orange text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-8 shadow-md animate-pulse">Recomendado</div>
                )}
                <h3 className="text-3xl font-heading font-black tracking-tighter mb-4 leading-none">{pkg.name}</h3>
                <p className={`${pkg.highlight ? 'text-blue-100/60' : 'text-slate-500'} font-medium mb-8 text-sm max-w-[240px] leading-relaxed`}>{pkg.description}</p>
                <div className="text-4xl font-heading font-black tracking-tighter mb-10 uppercase italic text-brand-orange border border-white/10 rounded-2xl px-5 py-2 inline-block">
                  {pkg.price}
                </div>

                <ul className="space-y-4 mb-12 flex-grow text-left w-full border-t border-white/5 pt-8">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/li">
                      <div className={`w-6 h-6 rounded-lg ${pkg.highlight ? 'bg-brand-orange text-white' : 'bg-brand-blue/10 text-brand-blue'} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                        <CheckIcon size={12} strokeWidth={4} />
                      </div>
                      <span className={`text-xs font-bold leading-relaxed ${pkg.highlight ? 'text-blue-50' : 'text-slate-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button onClick={scrollToContact} variant={pkg.highlight ? 'primary' : 'secondary'} className="h-16 w-full px-8 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.02]">
                  {pkg.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <SectionTitle
            badge="Tira-Dúvidas"
            title="Perguntas Frequentes"
            alignment="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 text-left">
            {GMB_CONTENT.faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-brand-blue/10 transition-all duration-500 shadow-sm group">
                <h4 className="text-lg font-black text-brand-darkBlue mb-4 flex gap-3 tracking-tighter items-start">
                  <span className="text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded text-xs">Q.</span> {faq.question}
                </h4>
                <p className="text-slate-600 font-bold leading-relaxed pl-8 text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA - Form Section */}
      <section id="contact" className="pt-24 lg:pt-40 pb-40 lg:pb-48 bg-brand-darkBlue relative overflow-hidden text-left">
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
                  <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Nosso time analisará seu perfil e entrará em contato em breve.</p>
                  <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova solicitação</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="flex flex-col items-center mb-8 gap-4">
                    <h2 className="text-3xl font-heading font-black text-brand-darkBlue uppercase tracking-tighter text-center">Fale com um consultor</h2>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            name: 'Empresa Teste GMB',
                            whatsapp: '(11) 99999-9999',
                            email: 'admin@gmb.com',
                            hasProfile: 'não'
                          });
                        }}
                        className="flex items-center gap-2 bg-brand-darkBlue text-white px-4 py-2 rounded-full font-bold text-[9px] hover:bg-brand-darkBlue/90 transition-all uppercase tracking-widest shadow-lg shadow-brand-darkBlue/20"
                      >
                        <Wand2 size={12} /> Auto-Preencher
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Nome da empresa</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                      placeholder="Ex: Barbearia do João"
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
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Status do perfil</label>
                      <select
                        name="hasProfile"
                        value={formData.hasProfile}
                        onChange={handleChange}
                        required
                        className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 transition-all text-slate-500 font-bold cursor-pointer appearance-none shadow-inner"
                      >
                        <option value="">Selecione...</option>
                        <option value="não">Não tenho perfil</option>
                        <option value="sim-ruim">Já tenho (Preciso arrumar)</option>
                        <option value="sim-bom">Já tenho (Quero escalar)</option>
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
                      {formState === 'loading' ? 'Enviando...' : 'Aparecer no Google agora'}
                    </Button>
                    <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
                      *Diagnóstico gratuito de presença digital
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* INFORMAÇÕES À DIREITA */}
            <div className="text-white text-left order-1 lg:order-2">
              <SectionTitle
                badge="Canal de atendimento direto"
                title={<>Pronto para aparecer de <span className="text-brand-orange italic">verdade</span>?</>}
                subtitle="Se você não está no Google Maps, você é invisível. Vamos mudar essa realidade hoje? Fale com nossos especialistas."
                alignment="left"
                light={true}
              />

              <div className="space-y-8 mt-12">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
                    <Search size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-widest">SEO local</p>
                    <p className="font-bold text-white text-xl tracking-tight">Otimização de perfil pro</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 group-hover:scale-110 transition-transform">
                    <Star size={28} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-widest">Reputação</p>
                    <p className="font-bold text-white text-xl tracking-tight">Gestão de Google avaliações</p>
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

export default GoogleBusinessProfile;
