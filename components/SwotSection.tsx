
import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { SWOT_SECTION_CONTENT } from '../constants';
import { CheckCircle2, ClipboardList, Target, ShieldCheck } from 'lucide-react';
import { ViewState } from '../App';

import { useSiteConfig } from '../lib/SiteContext';

interface SwotSectionProps {
  onNavigate: (view: ViewState) => void;
}

const SwotSection: React.FC<SwotSectionProps> = ({ onNavigate }) => {
  const { config } = useSiteConfig();

  return (
    <section id="swot" className="py-12 lg:py-24 relative overflow-hidden" style={{ backgroundColor: config.content?.sections?.swot?.background_color || '#ffffff' }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <SectionTitle
            title={config.content?.sections?.swot?.title || SWOT_SECTION_CONTENT.title}
            subtitle={config.content?.sections?.swot?.subtitle || SWOT_SECTION_CONTENT.subtitle}
            alignment="center"
          />
        </div>

        {/* Comparativo Direto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Diagnóstico de Marketing</h3>
            <p className="text-gray-600 mb-6 flex-grow">Focado em <strong>resultados de curto prazo</strong>. Ideal se você precisa de clientes batendo no seu WhatsApp amanhã, quer começar a anunciar no Google ou organizar suas redes sociais.</p>
            <ul className="space-y-3 mb-8">
              {["Canais de Captação", "Scripts de Vendas", "Performance de Anúncios", "Google Meu Negócio"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-blue" /> {item}
                </li>
              ))}
            </ul>
            <Button onClick={() => onNavigate('marketing-diagnosis')} variant="primary" fullWidth>Ver Detalhes (Grátis)</Button>
          </div>

          <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-brand-orange text-white rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">Análise SWOT (Audit)</h3>
            <p className="text-gray-600 mb-6 flex-grow">Focado em <strong>estratégia e saúde do negócio</strong>. Ideal para o empresário que quer auditar seus processos internos, descobrir fraquezas ocultas e planejar o próximo ano.</p>
            <ul className="space-y-3 mb-8">
              {["Auditoria de Processos", "Diferenciais Competitivos", "Riscos de Mercado", "Plano Estratégico 12m"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-orange" /> {item}
                </li>
              ))}
            </ul>
            <Button onClick={() => onNavigate('swot-service')} variant="secondary" fullWidth className="border-brand-orange text-brand-orange hover:bg-brand-orange/5">Ver Planos de Auditoria</Button>
          </div>
        </div>

        {/* SWOT Grid (O que é SWOT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {SWOT_SECTION_CONTENT.definitions.map((def, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className={`w-14 h-14 ${def.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <def.icon size={28} />
              </div>
              <h3 className="text-4xl font-heading font-black text-gray-200 mb-2">{def.letter}</h3>
              <h4 className="text-xl font-heading font-bold text-gray-900 mb-3 leading-tight">{def.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{def.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SwotSection;
