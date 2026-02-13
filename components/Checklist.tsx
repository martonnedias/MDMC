import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, ShieldAlert, Sparkles, ChevronDown } from 'lucide-react';
import { CHECKLIST_ITEMS } from '../constants';
import Button from './Button';

const Checklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const scrollToPlans = () => {
    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRiskDetails = () => {
    const count = checkedItems.length;
    if (count === 0) return null;
    if (count <= 2) return {
      label: "Risco Moderado",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      shadow: "shadow-yellow-500/20",
      text: "Sua operação tem pontos cegos que impedem o crescimento exponencial. É o momento ideal para ajustes preventivos."
    };
    if (count <= 4) return {
      label: "Risco Alto",
      color: "bg-brand-orange",
      textColor: "text-brand-orange",
      shadow: "shadow-brand-orange/20",
      text: "Você está perdendo competitividade. Cada dia sem resolver esses gargalos é faturamento que vai direto para a mão da concorrência."
    };
    return {
      label: "Risco Crítico",
      color: "bg-red-600",
      textColor: "text-red-600",
      shadow: "shadow-red-600/30",
      text: "Sua viabilidade digital está em xeque. Sua empresa está 'sangrando' oportunidades e precisa de uma intervenção estratégica imediata."
    };
  };

  const risk = getRiskDetails();

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-slate-50 rounded-[10rem] blur-[120px] -z-0 opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <span className="px-4 py-1 rounded-full bg-brand-blue/5 text-brand-blue text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-brand-blue/10">
              Auto-Auditoria Digital
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-brand-darkBlue mb-6 tracking-tighter uppercase leading-[0.9]">
              Sua Empresa está <span className="text-brand-orange italic underline decoration-brand-orange/20">Ganhando</span> ou <span className="text-slate-400">Perdendo</span> Dinheiro?
            </h2>
            <p className="text-slate-600 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Dê um choque de realidade na sua operação. Selecione os problemas que você enfrenta hoje:
            </p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
            {/* Header of the card */}
            <div className="bg-brand-darkBlue p-8 lg:p-12 text-white flex items-center justify-between border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-heading font-black tracking-tighter uppercase mb-2">Checklist de Performance</h3>
                <p className="text-blue-100/90 text-sm lg:text-base font-medium">Seja 100% honesto com o seu faturamento</p>
              </div>
              <div className="hidden sm:flex w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 items-center justify-center relative z-10">
                <ShieldAlert className={checkedItems.length > 4 ? "text-red-500 animate-pulse" : "text-brand-orange"} size={36} />
              </div>
            </div>

            <div className="p-8 lg:p-16">
              {/* Dynamic Risk Bar */}
              <div className="mb-12">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-heading">Nível de Urgência</span>
                  <span className={`text-xs font-black uppercase tracking-widest ${risk ? risk.textColor : 'text-slate-400'}`}>
                    {risk ? risk.label : "Aguardando Seleção"}
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                  {[...Array(CHECKLIST_ITEMS.length)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-grow rounded-sm transition-all duration-500 ${i < checkedItems.length ? (risk?.color || 'bg-brand-orange') : 'bg-slate-200 opacity-20'}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* TWO COLUMN GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {CHECKLIST_ITEMS.map((item, index) => {
                  const isChecked = checkedItems.includes(index);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleItem(index)}
                      className={`group flex items-start gap-5 p-6 lg:p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 border ${isChecked
                        ? 'bg-slate-900 border-slate-800 shadow-2xl scale-[1.03] z-10'
                        : 'bg-slate-50 border-transparent hover:border-brand-blue/20 hover:bg-white'
                        }`}
                    >
                      <div className={`shrink-0 mt-1 transition-all duration-500 ${isChecked ? 'text-brand-orange rotate-12' : 'text-slate-300'}`}>
                        {isChecked ? <CheckCircle2 size={28} /> : <Circle size={28} className="opacity-40" />}
                      </div>
                      <p className={`text-base lg:text-lg font-medium tracking-tight leading-tight transition-colors duration-500 ${isChecked ? 'text-white' : 'text-slate-700 group-hover:text-brand-darkBlue'}`}>
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>

              {risk ? (
                <div className="mt-16 pt-16 border-t border-slate-100 animate-fade-in">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                      <div className={`absolute -inset-6 ${risk.color}/20 rounded-full blur-2xl animate-pulse`}></div>
                      <div className={`relative ${risk.color} text-white p-6 rounded-[2rem] shadow-2xl ${risk.shadow}`}>
                        <AlertCircle size={40} />
                      </div>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-heading font-black text-brand-darkBlue mb-6 tracking-tighter uppercase leading-none">
                      Diagnóstico: <span className={risk.textColor}>{risk.label}</span>
                    </h3>
                    <p className="text-slate-600 mb-12 max-w-3xl text-lg lg:text-xl font-medium leading-relaxed">
                      Você identificou <strong>{checkedItems.length} gargalos fatais</strong>. {risk.text}
                    </p>

                    <Button onClick={scrollToPlans} variant="primary" className="h-20 px-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl transform hover:scale-105 transition-all group/btn">
                      <span className="relative z-10">Falar com Estrategista Agora</span>
                      <Sparkles className="inline-block ml-3 group-hover/btn:rotate-12 transition-transform" size={18} />
                    </Button>

                    <p className="mt-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Consultoria Gratuita • Vagas Limitadas para este Mês</p>
                  </div>
                </div>
              ) : (
                <div className="mt-12 flex items-center justify-center gap-3 text-slate-400 animate-pulse border-2 border-dashed border-slate-100 rounded-3xl py-12">
                  <Sparkles size={20} />
                  <p className="text-sm font-black uppercase tracking-widest italic">Selecione os problemas acima para gerar seu diagnóstico</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checklist;
