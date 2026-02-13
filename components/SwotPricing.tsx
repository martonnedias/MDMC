import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { SWOT_PLANS } from '../constants';
import { adminService } from '../services/adminService';
import { Check, Star, ShieldCheck, Zap, Users } from 'lucide-react';

interface SwotPricingProps {
  onSelectPlan: (planId: string) => void;
}

const SwotPricing: React.FC<SwotPricingProps> = ({ onSelectPlan }) => {
  const [displayPlans, setDisplayPlans] = React.useState<any[]>(SWOT_PLANS);

  React.useEffect(() => {
    const fetchSwot = async () => {
      const data = await adminService.getServices();
      const swotPlans = data.filter(s => (s.page === 'swot' || s.category === 'swot') && s.is_active !== false);
      if (swotPlans.length > 0) {
        setDisplayPlans(swotPlans.map((s, index) => {
          const defaultPlan = SWOT_PLANS[index] || SWOT_PLANS[0];
          return {
            id: s.id,
            name: s.name || defaultPlan.name,
            subtitle: s.subtitle || defaultPlan.subtitle,
            price: s.price || defaultPlan.price,
            description: s.description || defaultPlan.description,
            features: (Array.isArray(s.features) && s.features.length > 0 && s.features[0] !== '')
              ? s.features
              : defaultPlan.features,
            cta: s.cta_text || defaultPlan.cta,
            highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight,
            badge: s.badge_text || defaultPlan.badge
          };
        }));
      }
    };
    fetchSwot();
  }, []);

  return (
    <section id="swot-pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Qual nível de profundidade você precisa agora?"
          subtitle="Temos a solução ideal, desde um raio-x estratégico rápido até um acompanhamento de 30 dias na sua implementação."
          alignment="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8">
          {displayPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col h-full rounded-[2.5rem] p-8 md:p-10 transition-all duration-300 border ${plan.highlight
                ? 'bg-white border-brand-blue shadow-2xl lg:scale-105 z-10'
                : 'bg-white/50 border-gray-100 hover:border-gray-300 shadow-xl'
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Star size={14} fill="white" /> {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <p className="text-brand-blue font-black text-xs uppercase tracking-widest mb-2">{plan.subtitle}</p>
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm font-medium">/ análise</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 border-b border-gray-100 pb-6">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-50 rounded-full p-1">
                      <Check size={14} className="text-brand-green" strokeWidth={3} />
                    </div>
                    <span className={`text-sm ${feature.startsWith('Ideal para') ? 'font-bold text-brand-blue italic mt-2' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.id)}
                fullWidth
                variant={plan.highlight ? 'primary' : 'secondary'}
                className={`py-4 text-base font-bold rounded-2xl ${!plan.highlight && '!border-gray-200 !text-gray-700 hover:!bg-gray-50'}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <ShieldCheck className="text-brand-blue" />
            <p className="text-xs font-bold text-gray-600">Sigilo Profissional Garantido</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Zap className="text-brand-orange" />
            <p className="text-xs font-bold text-gray-600">Relatório Pronto em Minutos</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Users className="text-brand-green" />
            <p className="text-xs font-bold text-gray-600">Suporte Humano de Especialistas</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwotPricing;