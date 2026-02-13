import React, { useState } from 'react';
import Button from './Button';
import { HERO_CONTENT } from '../constants';
import { ArrowRight, BarChart3, Target, ChevronDown, Share2, Copy, Check, Instagram, Facebook, Youtube, Send, Linkedin, Sparkles } from 'lucide-react';
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
  const fontSizeTitle = sectionConfig?.font_size_title || 'text-5xl sm:text-6xl lg:text-7xl';
  const fontSizeSubtitle = sectionConfig?.font_size_subtitle || 'text-xl';

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
    <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-32 overflow-hidden text-white bg-slate-950 font-heading"
      style={{
        backgroundColor: sectionConfig?.background_color || config.content?.hero_background_color,
        fontFamily: fontFamily
      }}>

      {/* Modern Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-blue/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-brand-orange/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Grain Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Column: Text and Buttons */}
          <div className="flex-[1.2] text-center lg:text-left animate-fade-in-up flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md text-brand-orange px-5 py-2 rounded-full mb-10 font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 shadow-xl">
              <Sparkles size={14} className="animate-pulse" /> Performance de Elite
            </div>

            <h1 className={`${fontSizeTitle} font-black leading-tight pb-4 tracking-tighter mb-8 max-w-4xl`}
              style={{ color: sectionConfig?.title_color || config.content?.hero_title_color || 'white' }}>
              {(() => {
                const words = mainHeadline.trim().split(/\s+/);
                return words.map((word, i) => {
                  const cleanWord = word.toLowerCase().replace(/[^\wáéíóúâêîôûãõç]/g, '');
                  const isHighlighted = ['vendas', 'marketing', 'importa'].includes(cleanWord);
                  return (
                    <React.Fragment key={i}>
                      {isHighlighted ? (
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic px-1">
                          {word}
                        </span>
                      ) : (
                        word
                      )}
                      {i < words.length - 1 && ' '}
                    </React.Fragment>
                  );
                });
              })()}
            </h1>

            <div className={`${fontSizeSubtitle} text-slate-400 mb-12 max-w-2xl leading-relaxed space-y-6 font-medium border-l-2 border-brand-orange/30 pl-6 lg:pl-8`}>
              <p className="italic">
                {subHeadline}
              </p>
              <p className="text-sm uppercase tracking-widest text-slate-500 font-bold">
                Duas vias para o lucro: <span className="text-white">Marketing</span> ou <span className="text-white">Estratégia</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <Button
                onClick={() => {
                  if (sectionConfig?.button_redirect && onNavigate) {
                    onNavigate(sectionConfig.button_redirect);
                  } else {
                    onStartBriefing();
                  }
                }}
                variant="primary"
                className="h-20 px-10 text-xs font-black uppercase tracking-[0.2em] transform hover:scale-105 transition-all shadow-2xl shadow-brand-orange/20 flex flex-col items-center justify-center min-w-[240px]"
              >
                <span>{HERO_CONTENT.secondaryCta.split('(')[0]}</span>
                <span className="text-[9px] opacity-60 font-bold lowercase tracking-normal">(foco em vendas)</span>
              </Button>

              <Button
                onClick={onStartSwot}
                variant="outline"
                className="h-20 px-10 text-xs font-black uppercase tracking-[0.2em] transform hover:scale-105 transition-all border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white hover:text-brand-darkBlue flex flex-col items-center justify-center min-w-[240px]"
              >
                <span>{HERO_CONTENT.swotCta.split('(')[0]}</span>
                <span className="text-[9px] opacity-60 font-bold lowercase tracking-normal">(foco em gestão)</span>
              </Button>
            </div>

            {/* Social Icons & Share Controls */}
            <div className="mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-5">
                <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-orange transition-colors"><Instagram size={18} /></a>
                <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-orange transition-colors"><Facebook size={18} /></a>
                <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-orange transition-colors"><Youtube size={18} /></a>
                {config.linkedin_url && <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-orange transition-colors"><Linkedin size={18} /></a>}
              </div>

              <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-brand-orange transition-colors"
                  >
                    <Share2 size={14} /> Compartilhar
                  </button>
                  {showShare && (
                    <div className="absolute bottom-full left-0 mb-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 min-w-[160px] animate-fade-in z-50">
                      <button onClick={() => handleShare('whatsapp')} className="text-left px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-xl transition-colors">WhatsApp</button>
                      <button onClick={() => handleShare('facebook')} className="text-left px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-xl transition-colors">Facebook</button>
                      <button onClick={() => handleShare('linkedin')} className="text-left px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-xl transition-colors">LinkedIn</button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-brand-orange transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copiado' : 'Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Image with Luxury Framing */}
          <div className="relative z-10 hidden lg:flex justify-center lg:justify-end flex-1">
            <div className="relative group p-4 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl">
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-orange to-brand-blue opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-[3rem]"></div>

              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] w-full max-w-[450px]">
                <img
                  src={heroImage}
                  alt="MD Solution Strategy"
                  className="w-full h-full object-cover grayscale brightness-110 hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
              </div>

              {/* Floating Real-time Impact Card */}
              <div className="absolute -bottom-10 -left-10 bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-float group-hover:scale-105 transition-transform duration-700">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Seu Desafio Hoje</p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center text-brand-blue"><BarChart3 size={18} /></div>
                    <span className="text-sm font-bold text-white tracking-tight uppercase">Vender Mais</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange"><Target size={18} /></div>
                    <span className="text-sm font-bold text-white tracking-tight uppercase">Organizar Gestão</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 animate-bounce cursor-pointer" onClick={() => document.getElementById('dor')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Scroll</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
};

export default Hero;

