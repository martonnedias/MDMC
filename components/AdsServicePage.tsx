
import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { PLANS } from '../constants';
import { adminService } from '../services/adminService';
import { Check, Megaphone, Target, BarChart3 } from 'lucide-react';
import ShareButtons from './ShareButtons';

const AdsServicePage: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [displayPlans, setDisplayPlans] = React.useState<any[]>(PLANS);

  React.useEffect(() => {
    const fetchServices = async () => {
      const data = await adminService.getServices();
      const marketingPlans = data.filter(s => s.category === 'marketing');
      if (marketingPlans.length > 0) {
        setDisplayPlans(marketingPlans.map((s, index) => {
          const normalizedName = (s.name || '').toLowerCase().trim();
          const defaultPlan = PLANS.find(p => p.name.toLowerCase().includes(normalizedName)) || PLANS[index] || PLANS[0];
          return {
            name: s.name || defaultPlan.name,
            subtitle: s.subtitle || defaultPlan.subtitle,
            price: s.price || defaultPlan.price,
            adBudget: s.extra_info || defaultPlan.adBudget,
            ctaText: s.cta_text || defaultPlan.ctaText || "Solicitar Orçamento",
            features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '')
              ? s.features
              : defaultPlan.features,
            highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight
          };
        }));
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-0 pb-0 font-sans">
      {/* Hero */}
      <section className="relative pt-8 lg:pt-12 pb-12 lg:pb-32 overflow-hidden bg-gradient-to-br from-brand-darkBlue via-brand-navy to-brand-darkBlue text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md">
              <Megaphone size={14} className="text-brand-orange animate-pulse" /> Performance & Vendas
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-6 animate-fade-in text-white">
              Campanhas de Captação que <span className="text-brand-orange">não param</span> de vender.
            </h1>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed font-light">
              Gestão estratégica de tráfego pago no Google Ads e Meta Ads. Chega de "tentar a sorte" com o botão impulsionar. Vamos construir uma máquina de leads qualificados.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg shadow-2xl shadow-brand-orange/20" withIcon>
                Quero Vender Mais Agora
              </Button>
              <ShareButtons title="MD Solution - Campanhas de Captação e Tráfego Pago" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none hidden lg:block">
          <BarChart3 size={600} className="text-white transform translate-x-1/4 translate-y-1/4" />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-brand-blueLight/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
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
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-brand-blueLight hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-brand-orangeLight text-brand-orange rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <b.icon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-4 text-brand-darkBlue">{b.title}</h4>
                <p className="text-gray-600 leading-relaxed text-sm">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            title="Planos de Gestão de Anúncios"
            subtitle="Escolha o fôlego que seu negócio precisa hoje."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-7xl mx-auto pt-8">
            {displayPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-[2.5rem] transition-all duration-300 flex flex-col h-full overflow-hidden
                  ${plan.highlight
                    ? 'bg-white border-2 border-brand-orange shadow-2xl lg:scale-105 z-10'
                    : 'bg-brand-blueLight/20 border border-brand-blue/10 shadow-lg'
                  }
                `}
              >
                {plan.highlight && (
                  <div className="bg-brand-orange text-white py-2.5 text-center text-xs font-black uppercase tracking-widest">
                    Performance Acelerada
                  </div>
                )}
                <div className="p-10 flex-grow">
                  <h3 className="text-2xl font-heading font-bold text-brand-darkBlue mb-1">{plan.name}</h3>
                  <p className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6">{plan.subtitle}</p>

                  <div className="mb-8">
                    <span className="text-4xl font-black text-brand-darkBlue">{plan.price}</span>
                    <span className="text-gray-400 text-sm">/mês</span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={18} className="text-brand-green shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-gray-500 text-sm leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-10 pt-0 mt-auto">
                  <div className="bg-brand-navy text-white p-4 rounded-2xl mb-6 border border-white/10">
                    <p className="text-[10px] font-black uppercase text-center tracking-widest opacity-80">{plan.adBudget}</p>
                  </div>
                  <Button
                    onClick={scrollToContact}
                    variant={plan.highlight ? 'primary' : 'secondary'}
                    fullWidth
                    className={plan.highlight ? '' : 'text-brand-darkBlue border-brand-darkBlue'}
                  >
                    {plan.ctaText || "Solicitar Orçamento"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-brand-blueLight/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-brand-orange to-brand-orangeHover p-12 lg:p-20 rounded-[4rem] text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 relative z-10">Pronto para dominar seu mercado local?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto relative z-10">Sua concorrência já está anunciando. O seu próximo cliente está te procurando no Google agora.</p>
            <Button onClick={scrollToContact} variant="outline" className="px-12 py-5 text-lg hover:bg-white hover:text-brand-orange border-white relative z-10 font-black uppercase tracking-widest">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdsServicePage;
