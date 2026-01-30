import React from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { GMB_CONTENT, CONTACT_INFO } from '../constants';
import {
  MapPin, Star, MessageCircle, TrendingUp, Search,
  CheckCircle2, ChevronRight, Smartphone, Clock,
  ArrowRight, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';

const GoogleBusinessProfile: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-24 bg-white font-sans">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-blue-200">
                <MapPin size={14} className="text-red-500" /> Domine as Buscas Locais
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                {GMB_CONTENT.hero.title}
              </h1>
              <p className="text-xl text-brand-blue font-bold mb-6">
                {GMB_CONTENT.hero.subtitle}
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-xl">
                {GMB_CONTENT.hero.pain}
              </p>
              <Button onClick={scrollToContact} variant="primary" className="px-10 py-5 text-lg" withIcon>
                {GMB_CONTENT.hero.cta}
              </Button>
            </div>
            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="relative max-w-md w-full">
                <div className="absolute -inset-4 bg-brand-blue/5 rounded-[3rem] rotate-3 blur-sm"></div>
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 overflow-hidden relative">
                  {/* Mockup do Google Card */}
                  <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">G</div>
                    <div>
                      <div className="h-3 w-32 bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      <span className="text-xs text-gray-400 ml-1 font-bold">5.0 (48 avaliações)</span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs font-bold text-brand-blue mb-2">Aberto agora</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-white rounded-lg border border-blue-100"></div>)}
                      </div>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="flex-1 h-10 bg-gray-50 rounded-xl border border-gray-100"></div>
                      <div className="flex-1 h-10 bg-brand-blue rounded-xl"></div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 p-2 rounded-full border border-green-200 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Importance Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title={GMB_CONTENT.importance.title}
            subtitle={GMB_CONTENT.importance.description}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
            {GMB_CONTENT.importance.benefits.map((benefit, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group text-center">
                <div className="w-14 h-14 bg-white text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <benefit.icon size={28} />
                </div>
                <h4 className="font-bold text-gray-900 leading-tight text-sm">{benefit.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Checklist Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-10 md:p-16 bg-brand-darkBlue text-white flex flex-col justify-center">
              <Sparkles className="text-brand-orange mb-6" size={40} />
              <h2 className="text-3xl font-heading font-bold mb-6">{GMB_CONTENT.infoList.title}</h2>
              <p className="text-blue-100 leading-relaxed mb-8">{GMB_CONTENT.infoList.intro}</p>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Compromisso MDigital</p>
                <p className="text-sm mt-1">Seguimos rigorosamente as diretrizes do Google para evitar suspensões e garantir o topo.</p>
              </div>
            </div>
            <div className="lg:w-1/2 p-10 md:p-16">
              <ul className="space-y-4">
                {GMB_CONTENT.infoList.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="mt-1 bg-green-50 p-1 rounded-full">
                      <CheckCircle2 className="text-brand-green" size={18} />
                    </div>
                    <span className="text-gray-700 font-medium text-sm md:text-base leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Step-by-Step */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title={GMB_CONTENT.process.title}
            subtitle="Simplificamos tudo para você não se preocupar com nada técnico."
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-16 max-w-6xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 hidden md:block -translate-y-1/2"></div>
            {GMB_CONTENT.process.steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-black text-lg mb-6 shadow-lg border-4 border-white">
                  {i + 1}
                </div>
                <h4 className="font-heading font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results & Case */}
      <section className="py-24 bg-brand-darkBlue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-10">{GMB_CONTENT.results.title}</h2>
              <ul className="space-y-6">
                {GMB_CONTENT.results.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="text-brand-orange mt-1" size={24} />
                    <span className="text-lg text-blue-50 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-10 rounded-[3rem] text-gray-900 shadow-2xl relative">
              <div className="absolute -top-6 left-10 bg-brand-orange text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Case de Sucesso</div>
              <p className="text-2xl font-serif italic text-gray-700 leading-relaxed mb-8">
                "{GMB_CONTENT.results.case}"
              </p>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-brand-blue"><Smartphone size={24} /></div>
                <div>
                  <p className="font-bold">Aumento em Ligações</p>
                  <p className="text-sm text-gray-500">Métrica real auditada pelo Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle
            title="Escolha sua estratégia de visibilidade"
            subtitle="Temos a solução ideal para o seu momento."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            {GMB_CONTENT.packages.map((pkg, i) => (
              <div key={i} className={`bg-white rounded-[2.5rem] p-10 border transition-all duration-300 flex flex-col h-full ${pkg.highlight ? 'border-brand-blue shadow-2xl scale-105 z-10' : 'border-gray-100 shadow-xl'}`}>
                {pkg.highlight && (
                  <div className="bg-brand-blue text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 w-fit">Mais Procurado</div>
                )}
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{pkg.description}</p>
                <div className="text-3xl font-black text-brand-darkBlue mb-8">{pkg.price}</div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-brand-green mt-1" size={18} />
                      <span className="text-sm text-gray-600 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={scrollToContact} variant={pkg.highlight ? 'primary' : 'secondary'} fullWidth>
                  {pkg.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Specific */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionTitle title="Dúvidas sobre o Google Meu Negócio" />
          <div className="max-w-3xl mx-auto space-y-4 mt-16">
            {GMB_CONTENT.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-3">
                  <AlertCircle className="text-brand-blue shrink-0" size={20} /> {faq.question}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-blue to-brand-darkBlue p-12 md:p-20 rounded-[4rem] text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Pronto para aparecer de verdade no Google?</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Enquanto você decide, alguém na sua região está procurando pelo seu serviço. Não deixe o seu próximo cliente encontrar o seu concorrente.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={scrollToContact} variant="primary" className="bg-brand-orange hover:bg-brand-orangeHover px-12 py-5 border-none text-lg">
                  Quero aparecer agora
                </Button>
                <Button onClick={() => window.open(`${CONTACT_INFO.whatsappLink}?text=Olá! Gostaria de falar sobre o serviço de Google Meu Negócio.`, '_blank')} variant="outline" className="px-12 py-5 text-lg">
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoogleBusinessProfile;