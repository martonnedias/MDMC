import React from 'react';
import Button from './Button';
import { HERO_CONTENT } from '../constants';
import { ArrowRight, BarChart3, Target, ChevronDown } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';

interface HeroProps {
  onStartBriefing: () => void;
  onStartSwot: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartBriefing, onStartSwot }) => {
  const { config } = useSiteConfig();

  const scrollToPricing = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const mainHeadline = config.content?.hero_title || HERO_CONTENT.headline;
  const subHeadline = config.content?.hero_subtitle || HERO_CONTENT.subheadline;
  const ctaText = config.content?.hero_cta || HERO_CONTENT.cta;

  return (
    <section className="relative pt-32 lg:pt-44 pb-20 lg:pb-32 overflow-hidden text-white">
      {/* Background Elements - Always Blue Gradient for Hero Identity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, #112240 0%, #0A1931 100%)'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Column: Text and Buttons */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full mb-8 font-bold text-xs uppercase tracking-widest border border-blue-500/20">
              <Target size={14} className="animate-pulse" /> Performance & Gestão
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6 text-white"
              style={{ fontFamily: 'var(--font-heading)' }}>
              {mainHeadline.split(' ').map((word, i) =>
                word.toLowerCase() === 'vendas' || word.toLowerCase() === 'marketing' ? <span key={i} className="text-brand-blue">{word} </span> : word + ' '
              )}
            </h1>

            <div className="text-lg text-blue-100 mb-8 max-w-2xl leading-relaxed space-y-4">
              <p>
                Unimos estratégia de gestão e performance digital para colocar sua empresa no topo.
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
                    onClick={onStartBriefing}
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

              {/* Link para planos removido para focar na escolha binária */}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative z-10 hidden lg:flex justify-center lg:justify-end lg:order-2 flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-orange/20 rounded-3xl transform rotate-3 blur-sm"></div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
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
