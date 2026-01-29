import React from 'react';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';
import { CONSULTANCY_CONTENT } from '../constants';
import Button from './Button';

const Consultancy: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="consultoria" className="py-20 bg-brand-darkBlue text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 bg-brand-blue px-4 py-2 rounded-full mb-6 border border-blue-400">
                <BrainCircuit className="text-brand-orange" size={20} />
                <span className="font-bold text-sm uppercase tracking-wide">Consultoria Estratégica</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white leading-tight">
              {CONSULTANCY_CONTENT.title}
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              {CONSULTANCY_CONTENT.description}
            </p>
            <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm mb-8">
                <p className="font-heading font-bold text-xl mb-2 text-brand-orange">Investimento</p>
                <p className="text-white text-lg">{CONSULTANCY_CONTENT.pricing}</p>
            </div>
            <Button onClick={scrollToContact} variant="primary" withIcon className="w-full sm:w-auto">
              Quero vender mais com a consultoria
            </Button>
          </div>

          <div className="lg:w-1/2 bg-white rounded-2xl p-8 text-gray-900 shadow-2xl w-full">
            <h3 className="text-2xl font-heading font-bold mb-6 text-brand-darkBlue">O que está incluso:</h3>
            <ul className="space-y-4">
              {CONSULTANCY_CONTENT.details.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="text-brand-green shrink-0" size={24} />
                  <span className="font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
              <p className="text-brand-orangeHover font-semibold text-center text-sm">
                💡 Dica: Você pode combinar um plano de marketing + consultoria para potencializar seus resultados.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Consultancy;