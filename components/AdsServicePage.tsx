import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { PLANS } from '../constants';
import { adminService } from '../services/adminService';
import { Check, Megaphone, Target, BarChart3, Share2, Copy, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';

const AdsServicePage: React.FC = () => {
  const { config } = useSiteConfig();
  const section = config.content?.sections?.ads;
  const [displayPlans, setDisplayPlans] = useState<any[]>(PLANS);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchServices = async () => {
      const data = await adminService.getServices();
      const marketingPlans = data.filter(s => s.category === 'marketing');
      if (marketingPlans.length > 0) {
        setDisplayPlans(marketingPlans.map((s, index) => {
          const normalizedName = (s.name || '').toLowerCase().trim();
          const defaultPlan = PLANS.find(p => p.name.toLowerCase().includes(normalizedName)) || PLANS[index] || PLANS[0];
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
    const text = encodeURIComponent(section?.title || 'MD Solution - Tráfego Pago');
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
    <div className="pt-0 pb-0 font-sans" style={{ fontFamily: section?.font_family }}>
      {/* Hero */}
      <section className="relative pt-20 lg:pt-32 pb-12 lg:pb-32 overflow-hidden bg-top text-white" style={heroStyle}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md">
              <Megaphone size={14} className="text-brand-orange animate-pulse" /> Performance & Vendas
            </div>
            <h1 className={`${titleFontSize} font-heading font-black leading-tight mb-6 animate-fade-in`} style={{ color: section?.title_color || 'white' }}>
              {section?.title || 'Campanhas de Captação que não param de vender.'}
            </h1>
            <p className={`${subtitleFontSize} text-subtitle mb-10 leading-relaxed font-light`}>
              {section?.subtitle || section?.description || 'Gestão estratégica de tráfego pago no Google Ads e Meta Ads. Chega de "tentar a sorte" com o botão impulsionar. Vamos construir uma máquina de leads qualificados.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
              <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg shadow-2xl shadow-brand-orange/20" withIcon>
                {section?.button_text || 'Quero Vender Mais Agora'}
              </Button>

              {/* Social & Share Controls */}
              <div className="flex flex-wrap items-center gap-6">
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
        </div>
        {section?.image_url ? (
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none hidden lg:block">
            <img src={section.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none hidden lg:block">
            <BarChart3 size={600} className="text-white transform translate-x-1/4 translate-y-1/4" />
          </div>
        )}
      </section>

      {/* Benefits */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            title="Como nossa gestão acelera seu caixa"
            subtitle="Não focamos em curtidas. Focamos em cliques que viram orçamentos no seu WhatsApp."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Target, title: "Público Alvo Preciso", text: "Mostramos sua empresa apenas para quem já está pronto para comprar." },
              { icon: Megaphone, title: "Velocidade de Resultado", text: "Campanhas que podem gerar os primeiros contatos já nas primeiras 24 horas." },
              { icon: BarChart3, title: "Otimização Diária", text: "Nossos analistas cuidam do seu dinheiro como se fosse deles." }
            ].map((b, i) => (
              <div key={i} className="bg-card p-10 rounded-[2.5rem] shadow-sm border border-brand-blueLight hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-brand-orangeLight text-brand-orange rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <b.icon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-4 text-title">{b.title}</h4>
                <p className="text-content leading-relaxed text-sm">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            title="Planos de Gestão de Anúncios"
            subtitle="Escolha o fôlego que seu negócio precisa hoje."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-7xl mx-auto pt-8">
            {displayPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-[2.5rem] transition-all duration-300 flex flex-col h-full overflow-hidden
                                  ${plan.highlight
                    ? 'bg-card border-2 border-brand-orange shadow-2xl lg:scale-105 z-10'
                    : 'bg-card border border-brand-blue/10 shadow-lg'
                  }
                                `}
              >
                {plan.highlight && (
                  <div className="bg-brand-orange text-white py-2.5 text-center text-xs font-black uppercase tracking-widest">
                    Performance Acelerada
                  </div>
                )}
                <div className="p-10 flex-grow">
                  <h3 className="text-2xl font-heading font-bold text-title mb-1">{plan.name}</h3>
                  <p className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6">{plan.subtitle}</p>

                  <div className="mb-8">
                    <span className="text-4xl font-black text-title">{plan.price}</span>
                    <span className="text-gray-400 text-sm">/mês</span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={18} className="text-brand-green shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-content text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-10 pt-0 mt-auto">
                  <div className="bg-footer text-white p-4 rounded-2xl mb-6 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-center tracking-widest opacity-80">{plan.adBudget}</p>
                  </div>
                  <Button
                    onClick={scrollToContact}
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    fullWidth
                    className={plan.highlight ? '' : 'text-title border-title'}
                  >
                    {plan.ctaText || "Solicitar Orçamento"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-brand-orange to-brand-orangeHover p-12 lg:p-20 rounded-[4rem] text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 relative z-10">Pronto para dominar seu mercado local?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto relative z-10">Sua concorrência já está anunciando. O seu próximo cliente está te procurando no Google agora.</p>
            <Button onClick={scrollToContact} variant="outline" className="px-12 py-5 text-lg hover:bg-white hover:text-brand-orange border-white relative z-10 font-black uppercase tracking-widest">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdsServicePage;
