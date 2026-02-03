import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { Layout, Smartphone, Zap, Search, Target, ShieldCheck, CheckCircle2, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useSiteConfig } from '../lib/SiteContext';

const SitesServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const section = config.content?.sections?.sites;
  const [investment, setInvestment] = useState<string>('R$ 800');
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      const data = await adminService.getServices();
      const sitesService = data.find(s => s.category === 'sites');
      if (sitesService) {
        setInvestment(sitesService.price || 'R$ 800');
      }
    };
    fetchSites();
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
    const text = encodeURIComponent(section?.title || 'MD Solution - Sites & Landing Pages');
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

  const titleFontSize = section?.font_size_title || 'text-4xl md:text-6xl';
  const subtitleFontSize = section?.font_size_subtitle || 'text-xl';

  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans" style={{ fontFamily: section?.font_family }}>
      {/* Hero */}
      <section className="pt-20 lg:pt-32 pb-12 lg:pb-32 bg-top overflow-hidden" style={heroStyle}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest">
                <Layout size={14} /> Presença Digital Premium
              </div>
              <h1 className={`${titleFontSize} font-heading font-black leading-tight mb-6`} style={{ color: section?.title_color || 'var(--color-title)' }}>
                {section?.title || 'Sua empresa merece uma casa digital que vende.'}
              </h1>
              <p className={`${subtitleFontSize} text-subtitle mb-10 leading-relaxed`}>
                {section?.subtitle || section?.description || 'Sites rápidos, modernos e focados em converter visitantes em clientes. Não tenha apenas um cartão de visitas, tenha uma ferramenta de lucro.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                <div className="bg-card p-6 rounded-2xl border border-gray-200 shadow-xl mb-10 max-w-sm">
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Investimento Inicial</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-sm font-bold">A partir de</span>
                    <span className="text-4xl font-black text-title">{investment}</span>
                  </div>
                  <p className="text-xs text-brand-green font-bold mt-2">Pagamento facilitado em até 10x</p>
                </div>

                <div className="flex flex-col gap-6 justify-center">
                  <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
                    {section?.button_text || 'Solicitar Orçamento de Site'}
                  </Button>

                  {/* Social & Share Controls */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                    {(section?.show_social_icons !== false) && (
                      <div className="flex items-center gap-4">
                        <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Instagram size={18} /></a>
                        <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Facebook size={18} /></a>
                        <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Youtube size={18} /></a>
                        {config.linkedin_url && <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Linkedin size={18} /></a>}
                      </div>
                    )}

                    {(section?.show_share_menu !== false) && (
                      <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                        <div className="relative">
                          <button
                            onClick={() => setShowShare(!showShare)}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Share2 size={16} /> Compartilhar
                          </button>
                          {showShare && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[150px] z-50 animate-fade-in border border-gray-50">
                              <button onClick={() => handleShare('whatsapp')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">WhatsApp</button>
                              <button onClick={() => handleShare('facebook')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Facebook</button>
                              <button onClick={() => handleShare('linkedin')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">LinkedIn</button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {copied ? <Check size={16} className="text-brand-green" /> : <Copy size={16} />}
                          {copied ? 'Copiado!' : 'Copiar Link'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-[4rem] rotate-3 blur-2xl"></div>
              <img
                src={section?.image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                alt="Layout de landing page profissional para conversão - sites MD Solution"
                className="relative rounded-[3rem] shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            title="O que um site da MD Solution tem de diferente?"
            subtitle="Construímos pensando no algoritmo do Google e na experiência do seu cliente."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { icon: Smartphone, title: "100% Mobile", text: "Navegação perfeita em qualquer smartphone ou tablet." },
              { icon: Zap, title: "Velocidade Ultra", text: "Sites que carregam em menos de 2 segundos. Sem espera." },
              { icon: Search, title: "SEO Integrado", text: "Código limpo para que o Google encontre você mais rápido." },
              { icon: Target, title: "Foco em Lead", text: "Botões de WhatsApp e formulários em pontos estratégicos." }
            ].map((d, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-card text-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm border border-gray-100">
                  <d.icon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-title">{d.title}</h4>
                <p className="text-content text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Checklist */}
      <section className="py-24 bg-footer text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-black mb-12 text-center">Tudo o que está incluso:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Registro de Domínio (.com.br)",
                "E-mails profissionais personalizados",
                "Certificado de Segurança SSL",
                "Integração com WhatsApp Direto",
                "Links para Redes Sociais",
                "Treinamento básico de uso",
                "Painel de edição intuitivo",
                "Configuração de Google Analytics"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <CheckCircle2 className="text-brand-orange" size={24} />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-title mb-8">Sua empresa na primeira prateleira.</h2>
          <p className="text-xl text-subtitle mb-10 max-w-2xl mx-auto">Um site profissional é o primeiro passo para parar de ser visto como um amador e começar a ser visto como uma autoridade.</p>
          <Button onClick={scrollToContact} variant="primary" className="px-12 py-5 text-lg">
            Quero meu site profissional
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SitesServicePage;
