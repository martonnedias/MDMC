import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { Smartphone, Zap, Search, Target } from 'lucide-react';

const SitesAndLandingPages: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="sites" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <SectionTitle
          title="Sites e Landing Pages que vendem por você"
          subtitle="Não tenha apenas um cartão de visitas digital. Tenha uma máquina de conversão."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              De nada adianta investir em anúncios se o seu site é lento, feio ou confuso. Na MD Solution, criamos estruturas focadas no que importa: <strong>transformar visitantes em clientes.</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Smartphone, title: "100% Mobile", text: "Perfeito em qualquer celular." },
                { icon: Zap, title: "Ultra Rápido", text: "Velocidade que o Google ama." },
                { icon: Search, title: "SEO Ready", text: "Pronto para ser encontrado." },
                { icon: Target, title: "Conversão", text: "Focado em cliques e vendas." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-blue-50 text-brand-blue p-2 rounded-lg h-fit">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <p className="text-sm text-green-700 font-bold mb-1 uppercase tracking-wider">Investimento Acessível</p>
              <p className="text-3xl font-heading font-bold text-green-800">A partir de R$ 800</p>
              <p className="text-sm text-green-600 mt-2 italic">Pagamento facilitado e entrega ágil.</p>
            </div>

            <Button onClick={scrollToContact} variant="primary" withIcon className="w-full sm:w-auto">
              Quero um site profissional
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-brand-blue/5 rounded-[3rem] -rotate-2"></div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              alt="Design de Landing Page Profissional"
              className="relative rounded-[2.5rem] shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitesAndLandingPages;
