import React, { useState } from 'react';
import Button from './Button';
import { HERO_CONTENT } from '../constants';
import { ArrowRight, BarChart3, Target, ChevronDown, Share2, Copy, Check, Instagram, Facebook, Youtube, Send, Linkedin } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';

interface HeroProps {
  onStartBriefing: () => void;
  onStartSwot: () => void;
  onNavigate?: (view: any) => void;
}

const Hero: React.FC<HeroProps> = ({ onStartBriefing, onStartSwot, onNavigate }) => {
  const { config } = useSiteConfig();
  const sectionConfig = config.content?.sections?.hero;
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  if (sectionConfig?.is_active === false) return null;

  const mainHeadline = sectionConfig?.title || config.content?.hero_title || HERO_CONTENT.headline;
  const subHeadline = sectionConfig?.subtitle || config.content?.hero_subtitle || HERO_CONTENT.subheadline;
  const heroImage = sectionConfig?.image_url || config.content?.hero_image || "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800";

  const fontFamily = sectionConfig?.font_family;
  const fontSizeTitle = sectionConfig?.font_size_title || 'text-4xl sm:text-5xl lg:text-7xl';
  const fontSizeSubtitle = sectionConfig?.font_size_subtitle || 'text-lg';

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(mainHeadline);
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  return (
    <section className="relative pt-32 lg:pt-44 pb-20 lg:pb-32 overflow-hidden text-white bg-top"
      style={{
        backgroundColor: sectionConfig?.background_color || config.content?.hero_background_color,
        fontFamily: fontFamily
      }}>

      {!(sectionConfig?.background_color || config.content?.hero_background_color) && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, #112240 0%, #0A1931 100%)'
          }}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Column: Text and Buttons */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full mb-8 font-bold text-xs uppercase tracking-widest border border-blue-500/20">
              <Target size={14} className="animate-pulse" /> Performance & Gestão
            </div>

            <h1 className={`${fontSizeTitle} font-heading font-black leading-[1.1] tracking-tight mb-6`}
              style={{ color: sectionConfig?.title_color || config.content?.hero_title_color || 'white' }}>
              {mainHeadline.split(' ').map((word, i) =>
                word.toLowerCase() === 'vendas' || word.toLowerCase() === 'marketing' ? <span key={i} className="text-brand-orange">{word} </span> : word + ' '
              )}
            </h1>

            <div className={`${fontSizeSubtitle} text-blue-100 mb-8 max-w-2xl leading-relaxed space-y-4 font-light`}>
              <p>
                {subHeadline}
              </p>
              <p>
                Oferecemos dois caminhos gratuitos para o seu crescimento: Um foco em <strong>Vendas Imediatas (Marketing)</strong> ou um foco em <strong>Estratégia de Negócio (SWOT)</strong>. Escolha o seu momento abaixo:
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {/* Botão Marketing */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      if (sectionConfig?.button_redirect && onNavigate) {
                        onNavigate(sectionConfig.button_redirect);
                      } else {
                        onStartBriefing();
                      }
                    }}
                    variant="primary"
                    className="w-full min-h-[84px] text-lg px-4 flex flex-col items-center justify-center leading-tight py-4"
                  >
                    <span className="block text-center">{HERO_CONTENT.secondaryCta}</span>
                  </Button>
                  <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest text-center">Foco em Vendas e Anúncios</p>
                </div>

                {/* Botão SWOT */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={onStartSwot}
                    variant="outline"
                    className="w-full min-h-[84px] text-lg px-4 flex flex-col items-center justify-center leading-tight py-4 border-2 hover:bg-white hover:text-brand-orange text-white border-white/20"
                  >
                    <span className="block text-center">{HERO_CONTENT.swotCta}</span>
                  </Button>
                  <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest text-center">Foco em Gestão e Estratégia</p>
                </div>
              </div>
            </div>

            {/* Social Icons & Share Controls */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6">
              {(sectionConfig?.show_social_icons !== false) && (
                <div className="flex items-center gap-4">
                  <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Instagram size={20} /></a>
                  <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Facebook size={20} /></a>
                  <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Youtube size={20} /></a>
                  {config.linkedin_url && <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Linkedin size={20} /></a>}
                  {config.telegram_url && <a href={config.telegram_url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-orange transition-colors"><Send size={20} /></a>}
                </div>
              )}

              {(sectionConfig?.show_share_menu !== false) && (
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
                        <button onClick={() => handleShare('whatsapp')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">WhatsApp</button>
                        <button onClick={() => handleShare('facebook')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">Facebook</button>
                        <button onClick={() => handleShare('linkedin')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">LinkedIn</button>
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

          {/* Right Column: Image */}
          <div className="relative z-10 hidden lg:flex justify-center lg:justify-end lg:order-2 flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-orange/20 rounded-3xl transform rotate-3 blur-sm"></div>
              <img
                src={heroImage}
                alt="Empresários trabalhando em performance digital"
                className="relative rounded-3xl shadow-2xl object-cover w-full max-w-md lg:max-w-xl h-auto border-8 border-white/10"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl border-l-8 border-brand-green hidden sm:block animate-fade-in">
                <p className="font-black text-gray-900 text-lg">Qual seu desafio hoje?</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-brand-blue font-bold"><BarChart3 size={14} /> Vendas?</div>
                  <div className="flex items-center gap-1 text-xs text-brand-orange font-bold"><Target size={14} /> Estratégia?</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
