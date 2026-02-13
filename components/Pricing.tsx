import React from 'react';
import { Check, Star } from 'lucide-react';
import { PLANS } from '../constants';
import { adminService } from '../services/adminService';
import { useSiteConfig } from '../lib/SiteContext';
import Button from './Button';
import SectionTitle from './SectionTitle';

const Pricing: React.FC = () => {
  const { config } = useSiteConfig();
  const sectionConfig = config.content?.sections?.['services'];
  const [displayPlans, setDisplayPlans] = React.useState<any[]>(PLANS);

  React.useEffect(() => {
    const fetchServices = async () => {
      const data = await adminService.getServices();
      const marketingPlans = data.filter(s => (s.page === 'landing' || (!s.page && s.category === 'marketing')) && s.is_active !== false);

      if (marketingPlans.length > 0) {
        // Sort by display order
        const sorted = [...marketingPlans].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

        setDisplayPlans(sorted.map((s, index) => {
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
            highlight: s.is_highlighted !== undefined ? s.is_highlighted : defaultPlan.highlight,
            badge_text: s.badge_text
          };
        }));
      }
    };
    fetchServices();
  }, []);


  if (sectionConfig?.is_active === false) return null;

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="planos" className="py-24 bg-white relative overflow-hidden" style={{ fontFamily: sectionConfig?.font_family }}>
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title={sectionConfig?.title || "Nossos Planos de Gestão"}
          subtitle={sectionConfig?.subtitle || "Escolha o nível de aceleração ideal para o momento da sua empresa."}
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
                  <Star size={14} fill="white" /> {plan.badge_text || "Mais Escolhido"}
                </div>
              )}

              <div className="p-8 pb-0">
                <h3 className="text-2xl font-heading font-bold text-gray-900">{plan.name}</h3>
                <p className="text-brand-blue font-bold mb-4">{plan.subtitle}</p>
                <p className="text-gray-700 text-sm mb-6 h-auto min-h-[2.5rem] font-medium">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 font-bold">/mês</span>
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
                        <Check size={18} className="text-brand-green" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.adBudget && (
                  <div className="bg-brand-blue/5 p-4 rounded-lg mt-auto border border-brand-blue/10">
                    <p className="text-[11px] text-brand-blue font-black italic text-center uppercase tracking-widest">
                      {plan.adBudget}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
