
import React from 'react';
import { SERVICES_CONTENT } from '../constants';
import SectionTitle from './SectionTitle';
import { Lightbulb, ArrowUpRight } from 'lucide-react';
import { ViewState } from '../App';

import { useSiteConfig } from '../lib/SiteContext';

interface ServicesProps {
  onNavigate?: (view: ViewState) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const { config } = useSiteConfig();
  const serviceViews: Record<string, ViewState> = {
    "Campanhas de Captação": "ads",
    "Sites & Landing Pages": "sites",
    "Redes Sociais & Google": "gmb",
    "Consultoria de Vendas": "consultancy"
  };

  const bgColor = config.content?.sections?.services?.background_color || '#f9fafb'; // fallback bg-gray-50 hex

  return (
    <section id="servicos" className="py-12 lg:py-20" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title={config.content?.sections?.services?.title || SERVICES_CONTENT.title}
          subtitle={config.content?.sections?.services?.subtitle || SERVICES_CONTENT.intro}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SERVICES_CONTENT.items.map((service, index) => (
            <div
              key={index}
              onClick={() => onNavigate && onNavigate(serviceViews[service.title])}
              className="bg-card p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100/5 cursor-pointer flex flex-col h-full"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-txtPrimary">{service.title}</h3>
              <p className="text-txtSecondary leading-relaxed text-sm mb-6 flex-grow">{service.description}</p>

              <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest mt-auto group-hover:gap-4 transition-all">
                Ver Detalhes e Preços <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-brand-darkBlue rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden border border-brand-orange/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="bg-gradient-to-br from-brand-orange to-brand-orangeHover text-white p-4 rounded-2xl shrink-0 shadow-lg">
            <Lightbulb size={32} className="animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-bold text-white text-xl mb-2">Estratégia Sob Medida</h4>
            <p className="text-blue-100/80 leading-relaxed text-sm">
              Cada negócio tem um desafio diferente. Por isso, oferecemos páginas detalhadas para cada solução, ajudando você a entender qual o melhor investimento para o seu momento atual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
