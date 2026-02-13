import React from 'react';
import { AlertCircle, Clock, TrendingDown, SearchX, MousePointer2, Smartphone, ShieldAlert, Sparkles } from 'lucide-react';
import { PAIN_CONTENT } from '../constants';
import SectionTitle from './SectionTitle';

const icons = [TrendingDown, Clock, SearchX, ShieldAlert, MousePointer2, Smartphone];

const PainPoints: React.FC = () => {
  return (
    <section id="dor" className="py-24 lg:py-40 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-20">
          <SectionTitle
            badge="Diagnóstico de Cenário"
            title="A gente sabe <br /><span class='text-brand-blue italic'>exatamente</span> como é…"
            subtitle="O mercado digital pune quem tenta crescer sem estratégia. Identificamos os gargalos que estão travando seu faturamento hoje."
            alignment="center"
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {PAIN_CONTENT.items.map((point, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="group flex flex-col gap-8 p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden hover:scale-[1.02]">
                  {/* Decorative number */}
                  <span className="absolute top-8 right-10 text-8xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-0">0{index + 1}</span>

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-darkBlue group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-sm">
                      <Icon size={28} />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h4 className="font-heading font-black text-brand-darkBlue text-xl mb-4 tracking-tighter uppercase leading-tight">{point.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                      {point.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-orange rounded-[3rem] blur opacity-20 animate-pulse"></div>
            <div className="relative text-center bg-brand-darkBlue p-12 lg:p-20 rounded-[3rem] border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

              <div className="inline-flex items-center gap-2 mb-8 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-brand-orange text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={14} /> Solução Estratégica
              </div>

              <p className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white leading-[1.1] tracking-tighter max-w-4xl mx-auto mb-10">
                {PAIN_CONTENT.transition.split('Performance Digital').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="text-brand-orange">Performance Digital</span>}
                  </React.Fragment>
                ))}
              </p>

              <button className="h-14 px-10 bg-white text-brand-darkBlue font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-brand-orange hover:text-white transition-all shadow-xl">
                Agendar Meu Diagnóstico Gratuito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
