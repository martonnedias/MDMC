import React from 'react';
import { SERVICES_CONTENT } from '../constants';
import SectionTitle from './SectionTitle';
import { Lightbulb, ArrowUpRight, Target, BarChart3, Globe, Megaphone, Share2, LineChart, Sparkles, ChevronDown, Users } from 'lucide-react';
import { ViewState } from '../App';
import { useSiteConfig } from '../lib/SiteContext';

interface ServicesProps {
  onNavigate?: (view: ViewState) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const { config } = useSiteConfig();

  const serviceViews: Record<string, ViewState> = {
    "Auditoria SWOT (Estratégia)": "swot-service",
    "Diagnóstico de Marketing": "marketing-diagnosis",
    "Google Meu Negócio": "gmb",
    "Sites & Landing Pages": "sites",
    "Tráfego de Performance": "ads",
    "Branding & Social Media": "social-media",
    "Gestão de CRM": "crm-service",
    "Consultoria de Vendas": "consultancy"
  };

  const serviceConfigKeys: Record<string, string> = {
    "Auditoria SWOT (Estratégia)": "swot",
    "Diagnóstico de Marketing": "diagnosis",
    "Google Meu Negócio": "gmb",
    "Sites & Landing Pages": "sites",
    "Tráfego de Performance": "ads",
    "Branding & Social Media": "social_media",
    "Gestão de CRM": "crm",
    "Consultoria de Vendas": "consultancy"
  };

  // Phases for grouping steps
  const phases = [
    { range: [0, 1], label: "01. Diagnóstico", color: "text-brand-orange" },
    { range: [2, 3], label: "02. Estrutura", color: "text-brand-blue" },
    { range: [4, 5], label: "03. Tração", color: "text-emerald-500" },
    { range: [6, 7], label: "04. Escala", color: "text-purple-500" }
  ];

  const journeyInsights = [
    { title: "Visão 360º", text: "80% das empresas falham por falta de clareza. Começamos pelo 'porquê'.", status: "Vital" },
    { title: "Corte de Gastos", text: "Identificamos onde seu dinheiro vaza antes de acelerar.", status: "Foco" },
    { title: "Domínio Local", text: "Ser encontrado no Maps é a fundação para negócios físicos.", status: "Tráfego" },
    { title: "Conversão Real", text: "Um site comum informa. Nossa estrutura vende 24h por dia.", status: "Vendas" },
    { title: "Escala Previsível", text: "Anúncios que retornam lucro e clientes qualificados.", status: "ROI" },
    { title: "Autoridade Máxima", text: "Não é sobre likes, é sobre ser a solução premium.", status: "Marca" },
    { title: "Venda Inteligente", text: "Leads sem gestão são dinheiro jogado fora. O CRM é o seu cofre.", status: "Gestão" },
    { title: "Expansão de Caixa", text: "Transformação definitiva de audiência em faturamento líquido recorrente.", status: "Lucro" }
  ];

  const activeServices = SERVICES_CONTENT.items.filter(service => {
    const key = serviceConfigKeys[service.title];
    return config.content?.sections?.[key]?.is_active !== false;
  });

  const bgColor = config.content?.sections?.services?.background_color || '#ffffff';

  return (
    <section id="servicos" className={`${config.content?.sections?.services?.is_active === false ? 'hidden' : 'py-24 lg:py-40'} overflow-hidden relative bg-[#FAFBFF]`} style={{ backgroundColor: bgColor }}>

      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-24">
          <SectionTitle
            badge="Método MD Scale"
            title={config.content?.sections?.services?.title || "Sua Jornada de <span class='text-brand-orange'>Escala Digital</span>"}
            subtitle={config.content?.sections?.services?.subtitle || "Não vendemos tarefas soltas. Seguimos um fluxo estratégico onde cada etapa alimenta a próxima, garantindo que sua empresa cresça de forma sólida e lucrativa."}
            alignment="center"
          />
        </div>

        {/* 
          NEW SNAKE PATH JOURNEY 
          We alternate between: [Card | Insight] and [Insight | Card]
        */}
        <div className="relative space-y-16 lg:space-y-0">

          {/* Main Visual Path Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-orange/20 via-brand-blue/30 to-purple-500/20 -translate-x-1/2 -z-10">
            {/* Animated Progress Pulse */}
            <div className="w-full h-20 bg-brand-orange shadow-[0_0_15px_rgba(230,86,0,0.5)] absolute animate-[moveLine_5s_linear_infinite]"
              style={{ top: '0', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
          </div>

          <div className="flex flex-col gap-8 lg:gap-0">
            {activeServices.map((service, index) => {
              const isLast = index === activeServices.length - 1;
              const isEven = index % 2 === 0;
              const stepNumber = (index + 1).toString().padStart(2, '0');
              const insight = journeyInsights[index];

              return (
                <div key={index} className="relative">
                  {/* Journey Card Wrapper */}
                  <div className={`flex flex-col lg:flex-row items-center justify-center lg:min-h-[400px] w-full ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

                    {/* ASPECT 1: THE SERVICE CARD */}
                    <div className="w-full lg:w-[45%]">
                      <div
                        onClick={() => onNavigate && onNavigate(serviceViews[service.title])}
                        className={`group relative bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 hover:border-transparent hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[360px] transform hover:scale-[1.03] ${isEven ? 'lg:mr-auto' : 'lg:ml-auto'}`}
                      >
                        {/* Interactive Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none
                          ${index === 0 ? 'from-orange-50/80 to-transparent' : ''}
                          ${index === 1 ? 'from-green-50/80 to-transparent' : ''}
                          ${index === 2 ? 'from-blue-50/80 to-transparent' : ''}
                          ${index === 3 ? 'from-indigo-50/80 to-transparent' : ''}
                          ${index === 4 ? 'from-slate-100/80 to-transparent' : ''}
                          ${index === 5 ? 'from-orange-50/80 to-transparent' : ''}
                          ${index === 6 ? 'from-blue-50/80 to-transparent' : ''}
                          ${index === 7 ? 'from-purple-50/80 to-transparent' : ''}
                        `}></div>

                        {/* Animated Glow Border */}
                        <div className={`absolute inset-0 p-[1.5px] rounded-[2.5rem] bg-gradient-to-br transition-opacity duration-700 opacity-0 group-hover:opacity-100
                          ${index === 0 ? 'from-brand-orange/40 via-orange-200/20 to-transparent' : ''}
                          ${index === 1 ? 'from-green-500/40 via-green-200/20 to-transparent' : ''}
                          ${index === 2 ? 'from-brand-blue/40 via-blue-200/20 to-transparent' : ''}
                          ${index === 3 ? 'from-indigo-500/40 via-indigo-200/20 to-transparent' : ''}
                          ${index === 4 ? 'from-brand-darkBlue/40 via-slate-400/20 to-transparent' : ''}
                          ${index === 5 ? 'from-brand-orange/40 via-orange-200/20 to-transparent' : ''}
                          ${index === 6 ? 'from-brand-blue/40 via-blue-200/20 to-transparent' : ''}
                          ${index === 7 ? 'from-purple-500/40 via-purple-200/20 to-transparent' : ''}
                        `}>
                          <div className="w-full h-full bg-white rounded-[calc(2.5rem-1.5px)]"></div>
                        </div>

                        <div className="absolute top-6 right-8 text-7xl font-black text-slate-100/50 group-hover:text-current group-hover:opacity-[0.03] transition-all duration-700 pointer-events-none italic select-none">
                          {stepNumber}
                        </div>

                        <div className="relative z-10">
                          <div className={`w-16 h-16 ${service.icon_bg || service.color} rounded-2xl flex items-center justify-center mb-8 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
                            <service.icon size={28} />
                          </div>

                          <span className={`text-[10px] font-black uppercase tracking-widest mb-3 block transition-colors duration-500
                            ${index === 0 ? 'text-brand-orange' : ''}
                            ${index === 1 ? 'text-green-600' : ''}
                            ${index === 2 ? 'text-brand-blue' : ''}
                            ${index === 3 ? 'text-indigo-600' : ''}
                            ${index === 4 ? 'text-slate-800' : ''}
                            ${index === 5 ? 'text-brand-orange' : ''}
                            ${index === 6 ? 'text-brand-blue' : ''}
                            ${index === 7 ? 'text-purple-600' : ''}
                          `}>Fase {stepNumber}</span>

                          <h3 className="text-2xl lg:text-3xl font-heading font-black text-brand-darkBlue mb-4 tracking-tighter uppercase leading-[1.1]">
                            {service.title}
                          </h3>
                          <p className="text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors text-base max-w-sm">
                            {service.description}
                          </p>
                        </div>

                        <div className={`mt-8 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative z-10
                          ${index === 0 ? 'text-brand-orange' : ''}
                          ${index === 1 ? 'text-green-600' : ''}
                          ${index === 2 ? 'text-brand-blue' : ''}
                          ${index === 3 ? 'text-indigo-600' : ''}
                          ${index === 4 ? 'text-slate-800' : ''}
                          ${index === 5 ? 'text-brand-orange' : ''}
                          ${index === 6 ? 'text-blue-600' : ''}
                          ${index === 7 ? 'text-purple-600' : ''}
                        `}>
                          Ver Detalhes da Etapa <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* ASPECT 2: THE CENTRAL NODE (Desktop) */}
                    <div className="hidden lg:flex w-[10%] justify-center relative">
                      <div className={`w-14 h-14 rounded-full border-4 border-white shadow-[0_0_30px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-700 z-20 group-hover:scale-125 group-hover:shadow-[0_0_40px_rgba(var(--node-glow-color),0.4)] ${isEven ? 'bg-brand-orange' : 'bg-brand-blue'}`}
                        style={{ '--node-glow-color': isEven ? '255,102,0' : '0,123,255' } as React.CSSProperties}>
                        <div className="w-5 h-5 bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                      </div>
                    </div>

                    {/* ASPECT 3: THE INSIGHT / CTA BOX (Fills the space) */}
                    <div className="hidden lg:flex w-[45%] px-12">
                      {insight && (
                        <div className={`max-w-xs group ${isEven ? 'text-left' : 'text-right'}`}>
                          <div className={`inline-flex items-center gap-2 mb-4 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500
                            ${index < 2 ? 'bg-orange-50 text-brand-orange border-orange-100' : ''}
                            ${index >= 2 && index < 4 ? 'bg-blue-50 text-brand-blue border-blue-100' : ''}
                            ${index >= 4 && index < 6 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                            ${index >= 6 ? 'bg-purple-50 text-purple-600 border-purple-100' : ''}
                          `}>
                            <Sparkles size={10} className="animate-pulse" /> Insight de Valor
                          </div>
                          <h4 className="text-xl font-black text-brand-darkBlue mb-3 group-hover:text-brand-blue transition-colors duration-500">{insight.title}</h4>
                          <p className="text-slate-700 font-bold italic leading-relaxed text-sm">
                            "{insight.text}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Mobile Arrow Connector */}
                    {!isLast && (
                      <div className="lg:hidden flex flex-col items-center py-6">
                        <div className="w-1 h-12 bg-gradient-to-b from-brand-orange/30 to-brand-blue/30 rounded-full"></div>
                        <ChevronDown className="text-brand-blue animate-bounce" size={24} />
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

          {/* OBJETIVO FINAL - Centralized at the end of the journey */}
          <div className="relative mt-24 lg:mt-32 flex flex-col items-center">
            {/* Final Visual Connector */}
            <div className="hidden lg:block w-1 h-32 bg-gradient-to-b from-purple-500/20 to-brand-orange/40 opacity-50"></div>

            <div className="relative group w-full max-w-lg mx-auto">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-orange via-brand-blue to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-1000"></div>

              <div className="relative bg-white border border-slate-100 p-10 lg:p-14 rounded-[3.5rem] text-center shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-blue/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 mb-6 px-6 py-2 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] border border-brand-orange/20 shadow-sm">
                    <Target size={14} /> Destino Estratégico
                  </div>

                  <h3 className="text-3xl lg:text-5xl font-heading font-black text-brand-darkBlue mb-8 tracking-tighter uppercase leading-[0.9]">
                    Objetivo <span className="text-brand-orange italic">Final</span>
                  </h3>

                  <p className="text-2xl lg:text-5xl font-black text-brand-darkBlue leading-[1.1] tracking-tight">
                    Lucratividade Máxima e <br className="hidden sm:block" /> <span className="bg-gradient-to-r from-brand-orange via-brand-blue to-purple-600 bg-clip-text text-transparent">Escala Sustentável.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Final CTA */}
        <div className="mt-32 w-full bg-brand-darkBlue rounded-[3rem] p-10 lg:p-20 flex flex-col md:flex-row items-center gap-10 shadow-[0_50px_100px_-20px_rgba(0,10,40,0.4)] relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/10 rounded-full -mr-40 -mt-40 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full -ml-40 -mb-40 blur-[120px]"></div>

          <div className="relative">
            <div className="absolute -inset-8 bg-brand-orange/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-brand-orange to-[#E65600] text-white p-8 rounded-[2.5rem] shrink-0 shadow-2xl transform hover:rotate-6 transition-transform duration-500">
              <Lightbulb size={56} />
            </div>
          </div>

          <div className="text-center md:text-left relative z-10 flex-grow">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-widest border border-white/20">
              Próximo Passo Estratégico
            </div>
            <h4 className="font-heading font-black text-white text-3xl lg:text-5xl mb-6 tracking-tighter uppercase leading-[0.9]">Não escolha tarefas.<br />Inicie uma <span className="text-brand-orange italic">Jornada de Escala</span>.</h4>
            <p className="text-blue-100/90 leading-relaxed font-medium text-lg lg:text-xl max-w-2xl">
              Nossa Consultoria de Vendas é o topo da trilha, onde transformamos toda a estrutura digital em lucro real no seu bolso. Comece agora pelo diagnóstico.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => onNavigate && onNavigate('marketing-diagnosis')}
              className="bg-white text-brand-darkBlue hover:bg-brand-orange hover:text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95 whitespace-nowrap group/btn"
            >
              Iniciar Minha Trilha
              <ArrowUpRight className="inline-block ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes moveLine {
          0% { transform: translate(-50%, -100%); }
          100% { transform: translate(-50%, 500%); }
        }
      `}} />
    </section>
  );
};

export default Services;
