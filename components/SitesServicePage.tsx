
import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { Layout, Smartphone, Zap, Search, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ShareButtons from './ShareButtons';

const SitesServicePage: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans">
      {/* Hero */}
      <section className="pt-40 md:pt-48 lg:pt-56 pb-12 lg:pb-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest">
                <Layout size={14} /> Presença Digital Premium
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                Sua empresa merece uma <span className="text-brand-blue">casa digital</span> que vende.
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Sites rápidos, modernos e focados em converter visitantes em clientes. Não tenha apenas um cartão de visitas, tenha uma ferramenta de lucro.
              </p>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl mb-10 max-w-sm">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Investimento Inicial</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-500 text-sm font-bold">A partir de</span>
                  <span className="text-4xl font-black text-brand-darkBlue">R$ 800</span>
                </div>
                <p className="text-xs text-brand-green font-bold mt-2">Pagamento facilitado em até 10x</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
                  Solicitar Orçamento de Site
                </Button>
                <ShareButtons title="MD Solution - Criação de Sites e Landing Pages de Alta Conversão" />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-[4rem] rotate-3 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                alt="Layout de Landing Page"
                className="relative rounded-[3rem] shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="O que um site da MD Solution tem de diferente?"
            subtitle="Construímos pensando no algoritmo do Google e na experiência do seu cliente."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { icon: Smartphone, title: "100% Mobile", text: "Navegação perfeita em qualquer smartphone ou tablet." },
              { icon: Zap, title: "Velocidade Ultra", text: "Sites que carregam em menos de 2 segundos. Sem espera." },
              { icon: Search, title: "SEO Integrado", text: "Código limpo para que o Google encontre você mais rápido." },
              { icon: Target, title: "Foco em Lead", text: "Botões de WhatsApp e formulários em pontos estratégicos." }
            ].map((d, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-gray-50 text-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                  <d.icon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3">{d.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Checklist */}
      <section className="py-24 bg-brand-darkBlue text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center">Tudo o que está incluso:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Registro de Domínio (.com.br)",
                "E-mails profissionais personalizados",
                "Certificado de Segurança SSL",
                "Integração com WhatsApp Direto",
                "Links para Redes Sociais",
                "Treinamento básico de uso",
                "Painel de edição intuitivo",
                "Configuração de Google Analytics"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <CheckCircle2 className="text-brand-orange" size={24} />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-8">Sua empresa na primeira prateleira.</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Um site profissional é o primeiro passo para parar de ser visto como um amador e começar a ser visto como uma autoridade.</p>
          <Button onClick={scrollToContact} variant="primary" className="px-12 py-5 text-lg">
            Quero meu site profissional
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SitesServicePage;
