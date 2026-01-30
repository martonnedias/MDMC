
import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import SwotPricing from './SwotPricing';
import { Target, ShieldCheck, Zap, AlertTriangle, Lightbulb, TrendingUp, ClipboardList, CheckCircle2 } from 'lucide-react';
import { SWOT_SECTION_CONTENT } from '../constants';

interface SwotServicePageProps {
  onSelectPlan: (planId: string) => void;
}

const SwotServicePage: React.FC<SwotServicePageProps> = ({ onSelectPlan }) => {
  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans">
      {/* Hero */}
      <section className="relative pt-40 pb-12 lg:pt-32 lg:pb-32 overflow-hidden bg-gradient-to-br from-brand-darkBlue to-blue-900 text-white">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-white/10">
              <ShieldCheck size={14} className="text-brand-orange" /> Auditoria Empresarial
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6">
              A clareza estratégica que <span className="text-brand-orange">salva</span> o seu negócio.
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              O Marketing atrai clientes, mas a Análise SWOT garante que você tenha uma empresa sólida para atendê-los. Audite seus processos, identifique riscos e planeje o futuro com dados.
            </p>
            <Button onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })} variant="primary" className="px-10 py-5 text-lg">
              Ver Planos de Auditoria
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none hidden lg:block">
          <ClipboardList size={600} className="text-white transform translate-x-1/4 translate-y-1/4" />
        </div>
      </section>

      {/* Concept */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">O que é a Análise SWOT Audit?</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Diferente de um diagnóstico rápido, o nosso serviço de **SWOT Audit** é uma imersão na saúde da sua empresa. Analisamos quatro pilares fundamentais que determinam se o seu negócio vai prosperar ou quebrar nos próximos 12 meses.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: "Forças", text: "Suas vantagens competitivas reais.", color: "text-green-500" },
                  { icon: AlertTriangle, title: "Fraquezas", text: "Os gargalos que fazem você perder dinheiro.", color: "text-red-500" },
                  { icon: Lightbulb, title: "Oportunidades", text: "Caminhos inexplorados para novos lucros.", color: "text-blue-500" },
                  { icon: TrendingUp, title: "Ameaças", text: "Riscos do mercado e da concorrência.", color: "text-orange-500" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <item.icon className={item.color} size={24} />
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-darkBlue p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Por que contratar uma auditoria?</h3>
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
      <div id="precos">
        <SwotPricing onSelectPlan={onSelectPlan} />
      </div>
    </div>
  );
};

export default SwotServicePage;
