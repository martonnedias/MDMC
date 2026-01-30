
import React from 'react';
import SectionTitle from './SectionTitle';
import { ShieldCheck, Target, TrendingUp, Search, Eye, Users, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import { CONTACT_INFO } from '../constants';

const AboutPage: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-0 font-sans">
      {/* Manifesto Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-32 bg-brand-darkBlue text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-4 py-1.5 rounded-full mb-8 font-black text-[10px] uppercase tracking-widest border border-brand-orange/30 shadow-lg">
              Nosso Manifesto
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
              O marketing digital está quebrado. <span className="text-brand-orange">Nós viemos consertar.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/80 leading-relaxed mb-10 max-w-2xl font-light">
              Chega de promessas milagrosas e relatórios cheios de métricas de vaidade. A MDigital nasceu para unir a clareza da **estratégia de gestão** com a força da **performance digital**.
            </p>
          </div>
        </div>
      </section>

      {/* Visão, Missão e Valores */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-start gap-6 hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg"><Target size={28} /></div>
              <h3 className="text-2xl font-heading font-bold text-gray-900">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Transformar pequenas e médias empresas brasileiras através de uma presença digital honesta, estratégica e altamente lucrativa. Existimos para que o empresário possa focar no que ama, enquanto nós cuidamos do motor de vendas.
              </p>
            </div>
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col items-start gap-6 hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg"><Eye size={28} /></div>
              <h3 className="text-2xl font-heading font-bold text-gray-900">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser a consultoria de referência em integridade e resultados reais no Brasil. Queremos elevar o padrão do mercado digital, onde a transparência é o ativo mais valioso de uma parceria.
              </p>
            </div>
            <div className="bg-brand-darkBlue p-10 rounded-[2.5rem] text-white flex flex-col items-start gap-6 shadow-2xl scale-105 z-10">
              <div className="w-14 h-14 bg-white text-brand-darkBlue rounded-2xl flex items-center justify-center shadow-lg"><Heart size={28} /></div>
              <h3 className="text-2xl font-heading font-bold">Nossa Entrega</h3>
              <p className="text-blue-100 leading-relaxed">
                Não entregamos apenas "posts" ou "anúncios". Entregamos compromisso. Se o resultado não aparece, nós não descansamos. Sua empresa é tratada com o mesmo zelo que tratamos a nossa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Os 4 Pilares da Transparência Radical */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="A Transparência como Fundação"
            subtitle="Na MDigital, a honestidade não é um diferencial, é o pré-requisito."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              {
                icon: ShieldCheck,
                title: "Integridade de Dados",
                text: "Você tem acesso total aos gerenciadores de anúncios. O dinheiro investido vai direto para a plataforma, sem intermediários.",
                color: "text-green-500"
              },
              {
                icon: TrendingUp,
                title: "Crescimento Real",
                text: "Focamos em faturamento e lucro, não em curtidas ou visualizações que não pagam as contas da sua empresa.",
                color: "text-brand-blue"
              },
              {
                icon: Search,
                title: "Diagnóstico Sem Filtro",
                text: "Se acharmos que seu site ou processo de vendas está ruim, nós falaremos. Só conserta quem admite o erro.",
                color: "text-brand-orange"
              },
              {
                icon: Sparkles,
                title: "Inovação Humana",
                text: "Usamos as melhores IAs do mundo (como você vê aqui), mas o toque final é sempre de um estrategista experiente.",
                color: "text-purple-500"
              }
            ].map((pilar, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gray-50 ${pilar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <pilar.icon size={24} />
                </div>
                <h4 className="text-lg font-bold mb-3 text-gray-900 leading-tight">{pilar.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{pilar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Compromisso */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-brand-blue/5 rounded-[4rem] -rotate-3 blur-2xl"></div>
              <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100">
                <h3 className="text-3xl font-heading font-bold text-brand-darkBlue mb-6">Por que somos diferentes?</h3>
                <div className="space-y-4">
                  {[
                    "Foco 100% em PMEs e negócios locais.",
                    "Sem contratos de fidelidade abusivos: ficamos por resultado.",
                    "Atendimento direto com quem executa sua estratégia.",
                    "Linguagem simples: nada de 'internetês' para te confundir."
                  ].map((t, i) => (
                    <div key={i} className="flex gap-4">
                      <CheckCircle2 className="text-brand-green shrink-0" size={24} />
                      <p className="text-gray-700 font-medium">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                Nossa entrega tem o seu <span className="text-brand-orange">nome escrito nela.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Não somos uma agência de massa. Somos uma consultoria boutique. Isso significa que limitamos o número de clientes que atendemos para garantir que o seu projeto receba a atenção, a originalidade e a honestidade que ele merece.
              </p>
              <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
                Conheça Nossos Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Selo de Integridade */}
      <section className="py-24 bg-brand-darkBlue text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <ShieldCheck size={64} className="text-brand-orange mx-auto mb-8 animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Compromisso MDigital</h2>
            <p className="text-xl md:text-2xl font-light opacity-80 mb-12 italic leading-relaxed">
              "Nós nunca recomendaremos uma estratégia que nós mesmos não usaríamos com o nosso próprio dinheiro."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={scrollToContact} variant="primary" className="bg-brand-orange hover:bg-brand-orangeHover border-none px-12 py-5 text-lg">
                Agendar Diagnóstico Grátis
              </Button>
              <Button onClick={() => window.open(`${CONTACT_INFO.whatsappLink}?text=Olá! Gostaria de falar sobre a consultoria MDigital.`, '_blank')} variant="outline" className="px-12 py-5 text-lg">
                Falar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
