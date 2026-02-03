import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { CONSULTANCY_CONTENT } from '../constants';
import { LineChart, CheckCircle2, MessageSquare, Headphones, TrendingUp, Users, ShieldCheck, Star, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useSiteConfig } from '../lib/SiteContext';

const ConsultancyServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const section = config.content?.sections?.consultancy || config.content?.sections?.services;
  const [investment, setInvestment] = useState<string>(CONSULTANCY_CONTENT.pricing.split('(')[0].trim());
  const [scope, setScope] = useState<string[]>(CONSULTANCY_CONTENT.details);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchConsultancy = async () => {
      const data = await adminService.getServices();
      const consultancy = data.find(s => s.category === 'consultancy');
      if (consultancy) {
        setInvestment(consultancy.price || CONSULTANCY_CONTENT.pricing.split('(')[0].trim());
        if (Array.isArray(consultancy.features) && consultancy.features.length > 0 && consultancy.features[0] !== '') {
          setScope(consultancy.features);
        }
      }
    };
    fetchConsultancy();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(section?.title || 'MD Solution - Consultoria de Vendas');
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  if (section?.is_active === false) return null;

  const heroStyle = {
    backgroundColor: section?.background_color,
    fontFamily: section?.font_family
  };

  const titleFontSize = section?.font_size_title || 'text-4xl md:text-5xl lg:text-6xl';
  const subtitleFontSize = section?.font_size_subtitle || 'text-xl';

  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans focus:outline-none" style={{ fontFamily: section?.font_family }}>
      {/* Hero */}
      <section className="relative pt-20 lg:pt-32 pb-12 lg:pb-32 bg-top text-white overflow-hidden" style={heroStyle}>
        <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 bg-brand-blue px-4 py-2 rounded-full mb-6 border border-blue-400">
                <LineChart className="text-brand-orange" size={20} />
                <span className="font-bold text-xs uppercase tracking-widest">Consultoria de Resultados</span>
              </div>
              <h1 className={`${titleFontSize} font-heading font-black leading-tight mb-8`} style={{ color: section?.title_color || 'white' }}>
                {section?.title || 'Marketing traz o lead. A Consultoria traz o lucro.'}
              </h1>
              <p className={`${subtitleFontSize} text-subtitle mb-10 leading-relaxed font-light`}>
                {section?.subtitle || section?.description || 'Não adianta encher seu WhatsApp de curiosos se você não sabe como fechar a venda. Ajustamos seu processo comercial do "Oi" ao faturamento.'}
              </p>

              <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/20 backdrop-blur-md mb-10 w-full max-w-sm">
                <p className="text-brand-orange font-black text-xs uppercase tracking-widest mb-2">Investimento em Performance</p>
                <div className="text-4xl font-black mb-4">{investment} <span className="text-sm font-normal text-blue-200">/ mês</span></div>
                <p className="text-sm text-blue-200">Ciclo recomendado: 3 meses para implementação completa e colheita de resultados.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
                <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
                  {section?.button_text || 'Agendar Reunião Diagnóstica'}
                </Button>

                {/* Social & Share Controls */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  {(section?.show_social_icons !== false) && (
                    <div className="flex items-center gap-4">
                      <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Instagram size={20} /></a>
                      <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Facebook size={20} /></a>
                      <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Youtube size={20} /></a>
                      {config.linkedin_url && <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Linkedin size={20} /></a>}
                    </div>
                  )}

                  {(section?.show_share_menu !== false) && (
                    <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                      <div className="relative">
                        <button
                          onClick={() => setShowShare(!showShare)}
                          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                        >
                          <Share2 size={16} /> Compartilhar
                        </button>
                        {showShare && (
                          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[150px] z-50 animate-fade-in">
                            <button onClick={() => handleShare('whatsapp')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">WhatsApp</button>
                            <button onClick={() => handleShare('facebook')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Facebook</button>
                            <button onClick={() => handleShare('linkedin')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">LinkedIn</button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                      >
                        {copied ? <Check size={16} className="text-brand-green" /> : <Copy size={16} />}
                        {copied ? 'Copiado!' : 'Copiar Link'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Vendas", icon: TrendingUp, color: "bg-blue-500" },
                { label: "Equipe", icon: Users, color: "bg-orange-500" },
                { label: "Processo", icon: ShieldCheck, color: "bg-green-500" },
                { label: "Suporte", icon: Headphones, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center gap-4 transform hover:scale-105 transition-transform text-white`}>
                  <item.icon size={40} />
                  <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            title="O que vamos construir juntos"
            subtitle="Uma imersão completa na sua operação comercial para tirar os gargalos que impedem você de escalar."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {scope.map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-card rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                <CheckCircle2 className="text-brand-green shrink-0" size={24} />
                <span className="font-bold text-title leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Methodology */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h3 className="text-3xl font-heading font-bold text-title mb-6">Por que contratar a Consultoria?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl shadow-md flex items-center justify-center text-brand-blue shrink-0 border border-gray-100"><MessageSquare /></div>
                  <div>
                    <h4 className="font-bold mb-1 text-title">Pare de perder leads</h4>
                    <p className="text-sm text-content leading-relaxed">Leads demoram a esfriar. Ensinamos seu time a responder rápido e com a abordagem certa.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl shadow-md flex items-center justify-center text-brand-orange shrink-0 border border-gray-100"><Star /></div>
                  <div>
                    <h4 className="font-bold mb-1 text-title">Aumente o Ticket Médio</h4>
                    <p className="text-sm text-content leading-relaxed">Estratégias de up-sell para fazer o mesmo cliente gastar mais na sua empresa de forma natural.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-card rounded-xl shadow-md flex items-center justify-center text-brand-green shrink-0 border border-gray-100"><ShieldCheck /></div>
                  <div>
                    <h4 className="font-bold mb-1 text-title">Processo Previsível</h4>
                    <p className="text-sm text-content leading-relaxed">Saia da dependência da "vontade" do vendedor e tenha um script validado que funciona para todos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 bg-card p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative">
              <div className="bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest absolute -top-4 left-10">Diferencial MD Solution</div>
              <p className="text-2xl font-serif italic text-title leading-relaxed mb-6">"Não entregamos um relatório e vamos embora. Nós sentamos com você, ouvimos seus áudios de venda, analisamos sua conversa e corrigimos na hora."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                <span className="font-bold text-brand-darkBlue">Equipe de Estratégia MD Solution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-heading font-heading font-black text-title mb-6">Acelere seu faturamento real.</h2>
          <p className="text-subtitle text-subtitle mb-10 max-w-2xl mx-auto">Vendas é uma ciência. Vamos aplicar os métodos mais modernos do mercado na sua realidade.</p>
          <Button onClick={scrollToContact} variant="primary" className="px-12 py-5 text-lg">
            Quero Minha Reunião Diagnóstica
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ConsultancyServicePage;