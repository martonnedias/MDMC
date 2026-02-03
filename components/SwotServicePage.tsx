import React, { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import SwotPricing from './SwotPricing';
import { Target, ShieldCheck, Zap, AlertTriangle, Lightbulb, TrendingUp, ClipboardList, CheckCircle2, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react';
import { SWOT_SECTION_CONTENT } from '../constants';
import { useSiteConfig } from '../lib/SiteContext';

interface SwotServicePageProps {
  onSelectPlan: (planId: string) => void;
}

const SwotServicePage: React.FC<SwotServicePageProps> = ({ onSelectPlan }) => {
  const { config } = useSiteConfig();
  const section = config.content?.sections?.swot;
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(section?.title || 'MD Solution - Auditoria SWOT');
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
      <section className="relative pt-20 lg:pt-32 pb-12 lg:pb-32 overflow-hidden bg-top text-white" style={heroStyle}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center lg:text-left">
          <div className="max-w-3xl flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-white/10">
              <ShieldCheck size={14} className="text-brand-orange" /> Auditoria Empresarial
            </div>
            <h1 className={`${titleFontSize} font-heading font-black leading-tight mb-6 animate-fade-in`} style={{ color: section?.title_color || 'white' }}>
              {section?.title || 'A clareza estratégica que salva o seu negócio.'}
            </h1>
            <p className={`${subtitleFontSize} text-subtitle mb-10 leading-relaxed`}>
              {section?.subtitle || section?.description || 'O Marketing atrai clientes, mas a Análise SWOT garante que você tenha uma empresa sólida para atendê-los. Audite seus processos, identifique riscos e planeje o futuro com dados.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
              <Button onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })} variant="primary" className="px-10 py-5 text-lg">
                {section?.button_text || 'Ver Planos de Auditoria'}
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
            <ClipboardList size={600} className="text-white transform translate-x-1/4 translate-y-1/4" />
          </div>
        )}
      </section>

      {/* Concept */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-black text-title mb-6">O que é a Análise SWOT Audit?</h2>
              <p className="text-lg text-content leading-relaxed mb-6">
                Diferente de um diagnóstico rápido, o nosso serviço de **SWOT Audit** é uma imersão na saúde da sua empresa. Analisamos quatro pilares fundamentais que determinam se o seu negócio vai prosperar ou quebrar nos próximos 12 meses.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: "Forças", text: "Suas vantagens competitivas reais.", color: "text-green-500" },
                  { icon: AlertTriangle, title: "Fraquezas", text: "Os gargalos que fazem você perder dinheiro.", color: "text-red-500" },
                  { icon: Lightbulb, title: "Oportunidades", text: "Caminhos inexplorados para novos lucros.", color: "text-blue-500" },
                  { icon: TrendingUp, title: "Ameaças", text: "Riscos do mercado e da concorrência.", color: "text-orange-500" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-card rounded-2xl border border-gray-100">
                    <item.icon className={item.color} size={24} />
                    <div>
                      <h4 className="font-bold text-title">{item.title}</h4>
                      <p className="text-sm text-content">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-footer p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-2xl font-black mb-6">Por que contratar uma auditoria?</h3>
              <ul className="space-y-4 mb-8">
                {[
                  "Sair da 'cegueira' do dia a dia da operação.",
                  "Identificar por que o lucro não aparece no final do mês.",
                  "Preparar o negócio para uma expansão segura.",
                  "Ter um plano de ação prioritário (30, 90 e 180 dias).",
                  "Aumentar o valor de mercado (Equity) da sua marca."
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-brand-orange mt-1 shrink-0" />
                    <span className="text-blue-50">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-white/10 rounded-2xl border border-white/20 italic">
                "Marketing sem estratégia é apenas gasto. Estratégia sem marketing é lucro perdido. A SWOT une os dois."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Integrated */}
      <div id="precos" className="bg-mid">
        <SwotPricing onSelectPlan={onSelectPlan} />
      </div>
    </div>
  );
};

export default SwotServicePage;
