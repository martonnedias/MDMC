import React from 'react';
import { Check, Star } from 'lucide-react';
import { PLANS } from '../constants';
import { adminService } from '../services/adminService';
import Button from './Button';
import SectionTitle from './SectionTitle';

const Pricing: React.FC = () => {
  const [displayPlans, setDisplayPlans] = React.useState<any[]>(PLANS);

  React.useEffect(() => {
    const fetchServices = async () => {
      const data = await adminService.getServices();
      const marketingPlans = data.filter(s => s.category === 'marketing');
      if (marketingPlans.length > 0) {
        setDisplayPlans(marketingPlans.map((s, index) => {
          // Tenta encontrar o plano padrão pelo nome, ou usa o índice como fallback
          const normalizedName = (s.name || '').toLowerCase().trim();
          const defaultPlan = PLANS.find(p => p.name.toLowerCase().includes(normalizedName)) || PLANS[index] || PLANS[0];

          return {
            name: s.name || defaultPlan.name,
            subtitle: s.subtitle || defaultPlan.subtitle,
            description: s.description || defaultPlan.description,
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

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="planos" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Nossos Planos de Gestão"
          subtitle="Escolha o nível de aceleração ideal para o momento da sua empresa."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-7xl mx-auto pt-4">
          {displayPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all duration-300 flex flex-col h-full
                ${plan.highlight
                  ? 'bg-white border-2 border-brand-orange shadow-2xl lg:scale-105 z-10'
                  : 'bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <Star size={14} fill="white" /> Mais Escolhido
                </div>
              )}

              <div className="p-8 pb-0">
                <h3 className="text-2xl font-heading font-bold text-gray-900">{plan.name}</h3>
                <p className="text-brand-blue font-medium mb-4">{plan.subtitle}</p>
                <p className="text-gray-600 text-sm mb-6 h-auto min-h-[2.5rem]">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/mês</span>
                </div>

                <Button
                  onClick={scrollToContact}
                  fullWidth
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  className="mb-6"
                >
                  {plan.ctaText}
                </Button>
              </div>

              <div className="p-8 pt-0 flex-grow flex flex-col justify-between">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">
                        <Check size={18} className="text-green-500" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg mt-auto">
                  <p className="text-xs text-blue-800 italic text-center">
                    {plan.adBudget}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;