
import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { PLANS } from '../constants';
import { Check, Megaphone, Target, BarChart3 } from 'lucide-react';

const AdsServicePage: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-0 bg-white font-sans">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-900 to-brand-darkBlue text-white">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-white/10">
              <Megaphone size={14} className="text-brand-orange" /> Performance & Vendas
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6">
              Campanhas de Captação que <span className="text-brand-orange">não param</span> de vender.
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Gestão estratégica de tráfego pago no Google Ads e Meta Ads. Chega de "tentar a sorte" com o botão impulsionar. Vamos construir uma máquina de leads qualificados.
            </p>
            <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
              Quero Vender Mais Agora
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
           <BarChart3 size={600} className="text-white transform translate-x-1/4 translate-y-1/4" />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
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
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
                  <b.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-4">{b.title}</h4>
                <p className="text-gray-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle 
            title="Planos de Gestão de Anúncios" 
            subtitle="Escolha o fôlego que seu negócio precisa hoje."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-7xl mx-auto pt-8">
            {PLANS.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-[2.5rem] transition-all duration-300 flex flex-col h-full overflow-hidden
                  ${plan.highlight 
                    ? 'bg-white border-2 border-brand-blue shadow-2xl lg:scale-105 z-10' 
                    : 'bg-gray-50 border border-gray-200 shadow-lg'
                  }
                `}
              >
                {plan.highlight && (
                  <div className="bg-brand-blue text-white py-2 text-center text-xs font-black uppercase tracking-widest">
                    Performance Acelerada
                  </div>
                )}
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-brand-blue font-bold text-sm mb-6">{plan.subtitle}</p>
                  
                  <div className="mb-8">
                      <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-400 text-sm">/mês</span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={18} className="text-green-500 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-gray-600 text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
                    <p className="text-[10px] font-black text-blue-800 uppercase text-center">{plan.adBudget}</p>
                  </div>
                  <Button onClick={scrollToContact} variant={plan.highlight ? 'primary' : 'secondary'} fullWidth>
                    Solicitar Orçamento
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-brand-orange p-12 rounded-[3rem] text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Pronto para dominar seu mercado local?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Sua concorrência já está anunciando. O seu próximo cliente está te procurando no Google agora.</p>
            <Button onClick={scrollToContact} variant="outline" className="px-12 py-5 text-lg hover:bg-white hover:text-brand-orange border-white">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdsServicePage;
