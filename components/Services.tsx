
import React from 'react';
import { SERVICES_CONTENT } from '../constants';
import SectionTitle from './SectionTitle';
import { Lightbulb, ArrowUpRight } from 'lucide-react';
import { ViewState } from '../App';

interface ServicesProps {
  onNavigate?: (view: ViewState) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const serviceViews: Record<string, ViewState> = {
    "Campanhas de Captação": "ads",
    "Sites & Landing Pages": "sites",
    "Redes Sociais & Google": "gmb",
    "Consultoria de Vendas": "consultancy"
  };

  return (
    <section id="servicos" className="py-12 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title={SERVICES_CONTENT.title}
          subtitle={SERVICES_CONTENT.intro}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SERVICES_CONTENT.items.map((service, index) => (
            <div
              key={index}
              onClick={() => onNavigate && onNavigate(serviceViews[service.title])}
              className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100 cursor-pointer flex flex-col h-full"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-6 flex-grow">{service.description}</p>

              <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest mt-auto group-hover:gap-4 transition-all">
                Ver Detalhes e Preços <ArrowUpRight size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-brand-orange text-white p-2 rounded-lg shrink-0 mt-1">
            <Lightbulb size={24} />
          </div>
          <div>
            <h4 className="font-bold text-brand-orangeHover text-lg mb-1">Estratégia sob medida</h4>
            <p className="text-gray-700 leading-relaxed">
              Cada negócio tem um desafio diferente. Por isso, oferecemos páginas detalhadas para cada solução, ajudando você a entender qual o melhor investimento para o seu momento atual.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
