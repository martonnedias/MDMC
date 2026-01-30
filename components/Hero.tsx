
import React, { useMemo } from 'react';
import Button from './Button';
import { HERO_CONTENT } from '../constants';
import { Sparkles, BarChart3, TrendingUp } from 'lucide-react';

interface HeroProps {
  onStartBriefing: () => void;
  onStartSwot: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartBriefing, onStartSwot }) => {
  // Lista de Headlines estratégicas para variação de Copy
  const headlines = useMemo(() => [
    "Sua empresa merece ser vista por quem realmente importa.",
    "Seu negócio no topo do digital com estratégia de elite.",
    "Resultados reais e faturamento previsível para sua empresa.",
    "Transforme sua presença online em uma máquina de vendas.",
    "O crescimento da sua empresa não pode ser por acaso.",
    "A estratégia certa para colocar sua marca em destaque real.",
    "Domine seu mercado local com performance e inteligência."
  ], []);

  // Seleciona uma headline aleatória no carregamento da página
  const dynamicHeadline = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * headlines.length);
    return headlines[randomIndex];
  }, [headlines]);

  const scrollToPlans = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-40 md:pt-48 lg:pt-56 pb-20 lg:pb-32 overflow-hidden bg-brand-darkBlue">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'0.5\' fill=\'rgba(255,255,255,0.05)\'/%3E%3C/svg%3E')] opacity-40 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white/10 text-brand-orange px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" /> Operação de Performance Digital
            </div>

            {/* Headline Dinâmica */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6 animate-fade-in">
              {dynamicHeadline}
            </h1>

            <p className="text-xl md:text-2xl text-blue-200 font-bold mb-4">
              {HERO_CONTENT.subheadline}
            </p>
            <p className="text-blue-100/70 mb-8 max-w-xl text-lg leading-relaxed">
              {HERO_CONTENT.pain}
            </p>

            <div className="block lg:hidden pb-10 relative z-10 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-orange/20 rounded-3xl transform rotate-3 blur-sm"></div>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
                  alt="Empresários trabalhando em performance digital"
                  className="relative rounded-3xl shadow-2xl object-cover w-full max-w-md h-auto border-4 border-white/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="w-full min-h-[84px] text-lg px-4 flex flex-col items-center justify-center leading-tight py-4 border-2 hover:bg-white hover:text-brand-darkBlue"
                  >
                    <span className="block text-center">{HERO_CONTENT.swotCta}</span>
                  </Button>
                  <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest text-center">Foco em Gestão e Estratégia</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-2">
                <button
                  onClick={scrollToPlans}
                  className="text-blue-200 hover:text-brand-orange font-bold text-sm transition-colors flex items-center gap-2 group"
                >
                  Ou veja nossos Planos de Gestão Mensal
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 hidden lg:flex justify-center lg:justify-end lg:order-2">
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
                  <div className="flex items-center gap-1 text-xs text-brand-orange font-bold"><TrendingUp size={14} /> Estratégia?</div>
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
