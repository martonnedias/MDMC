import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { CONSULTANCY_CONTENT } from '../constants';
import { LineChart, CheckCircle2, MessageSquare, Headphones, TrendingUp, Users, ShieldCheck, Star } from 'lucide-react';

const ConsultancyServicePage: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans">
      {/* Hero */}
      <section className="pt-40 pb-12 lg:pt-32 lg:pb-32 bg-brand-darkBlue text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-blue px-4 py-2 rounded-full mb-6 border border-blue-400">
                <LineChart className="text-brand-orange" size={20} />
                <span className="font-bold text-xs uppercase tracking-widest">Consultoria de Resultados</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-8">
                Marketing traz o lead. A Consultoria <span className="text-brand-orange">traz o lucro.</span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Não adianta encher seu WhatsApp de curiosos se você não sabe como fechar a venda. Ajustamos seu processo comercial do "Oi" ao faturamento.
              </p>
              <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/20 backdrop-blur-md mb-10">
                <p className="text-brand-orange font-black text-xs uppercase tracking-widest mb-2">Investimento em Performance</p>
                <div className="text-4xl font-black mb-4">R$ 1.800 <span className="text-sm font-normal text-blue-200">/ mês</span></div>
                <p className="text-sm text-blue-200">Ciclo recomendado: 3 meses para implementação completa e colheita de resultados.</p>
              </div>
              <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
                Agendar Reunião Diagnóstica
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Vendas", icon: TrendingUp, color: "bg-blue-500" },
                { label: "Equipe", icon: Users, color: "bg-orange-500" },
                { label: "Processo", icon: ShieldCheck, color: "bg-green-500" },
                { label: "Suporte", icon: Headphones, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center gap-4 transform hover:scale-105 transition-transform`}>
                  <item.icon size={40} />
                  <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="O que vamos construir juntos"
            subtitle="Uma imersão completa na sua operação comercial para tirar os gargalos que impedem você de escalar."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {CONSULTANCY_CONTENT.details.map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                <CheckCircle2 className="text-brand-green shrink-0" size={24} />
                <span className="font-bold text-gray-800 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Methodology */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-6">Por que contratar a Consultoria?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-brand-blue shrink-0"><MessageSquare /></div>
                  <div>
                    <h4 className="font-bold mb-1">Pare de perder leads</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Leads demoram a esfriar. Ensinamos seu time a responder rápido e com a abordagem certa.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-brand-orange shrink-0"><Star /></div>
                  <div>
                    <h4 className="font-bold mb-1">Aumente o Ticket Médio</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Estratégias de up-sell para fazer o mesmo cliente gastar mais na sua empresa de forma natural.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-brand-green shrink-0"><ShieldCheck /></div>
                  <div>
                    <h4 className="font-bold mb-1">Processo Previsível</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Saia da dependência da "vontade" do vendedor e tenha um script validado que funciona para todos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative">
              <div className="bg-brand-orange text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest absolute -top-4 left-10">Diferencial MDigital</div>
              <p className="text-2xl font-serif italic text-gray-800 leading-relaxed mb-6">"Não entregamos um relatório e vamos embora. Nós sentamos com você, ouvimos seus áudios de venda, analisamos sua conversa e corrigimos na hora."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                <span className="font-bold text-brand-darkBlue">Equipe de Estratégia MDigital</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Acelere seu faturamento real.</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Vendas é uma ciência. Vamos aplicar os métodos mais modernos do mercado na sua realidade.</p>
          <Button onClick={scrollToContact} variant="primary" className="px-12 py-5 text-lg">
            Quero Minha Reunião Diagnóstica
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ConsultancyServicePage;