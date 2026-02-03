import React, { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { BarChart3, Search, Target, Users, Smartphone, Zap, CheckCircle2, FileText, Sparkles, User, Mail, MessageCircle, Lock, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react';
import { leadService } from '../services/leadService';
import { FORM_VALIDATION_MSGS } from '../constants';
import { useSiteConfig } from '../lib/SiteContext';

interface MarketingDiagnosisPageProps {
  onStart: () => void;
}

const MarketingDiagnosisPage: React.FC<MarketingDiagnosisPageProps> = ({ onStart }) => {
  const { config } = useSiteConfig();
  const section = config.content?.sections?.diagnosis;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await leadService.saveContactLead({
      ...formData,
      interest: 'Diagnóstico de Marketing Grátis',
      companySize: 'Não informado'
    });

    if (success) {
      onStart();
    } else {
      alert(FORM_VALIDATION_MSGS.processError);
    }
    setLoading(false);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(section?.title || 'MD Solution - Diagnóstico de Marketing');
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  if (section?.is_active === false) return null;

  const heroStyle = {
    backgroundColor: section?.background_color,
    fontFamily: section?.font_family
  };

  const titleFontSize = section?.font_size_title || 'text-heading';
  const subtitleFontSize = section?.font_size_subtitle || 'text-xl';

  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans" style={{ fontFamily: section?.font_family }}>
      {/* Hero with Lead Gate */}
      <section className="pt-20 lg:pt-32 pb-12 lg:pb-32 bg-top overflow-hidden" style={heroStyle}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-brand-blue px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-blue-200">
                <Sparkles size={14} className="animate-pulse" /> 100% Gratuito & IA-Powered
              </div>
              <h1 className={`${titleFontSize} font-heading font-black leading-tight mb-6`} style={{ color: section?.title_color || 'var(--color-title)' }}>
                {section?.title || 'Descubra por que sua empresa não vende mais no digital.'}
              </h1>
              <p className={`${subtitleFontSize} text-subtitle mb-10 leading-relaxed font-light`}>
                {section?.subtitle || section?.description || 'Nosso sistema analisa seus gargalos de vendas e gera um plano de ação profissional. Cadastre-se abaixo para liberar seu acesso imediato.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10">
                {(section?.show_social_icons !== false) && (
                  <div className="flex items-center gap-4">
                    <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Instagram size={20} /></a>
                    <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Facebook size={20} /></a>
                    <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Youtube size={20} /></a>
                    {config.linkedin_url && <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors"><Linkedin size={20} /></a>}
                  </div>
                )}

                {(section?.show_share_menu !== false) && (
                  <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
                    <div className="relative">
                      <button
                        onClick={() => setShowShare(!showShare)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Share2 size={16} /> Compartilhar
                      </button>
                      {showShare && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[150px] z-50 animate-fade-in border border-gray-50">
                          <button onClick={() => handleShare('whatsapp')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">WhatsApp</button>
                          <button onClick={() => handleShare('facebook')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Facebook</button>
                          <button onClick={() => handleShare('linkedin')} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">LinkedIn</button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {copied ? <Check size={16} className="text-brand-green" /> : <Copy size={16} />}
                      {copied ? 'Copiado!' : 'Copiar Link'}
                    </button>
                  </div>
                )}
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-content font-medium">
                  <CheckCircle2 className="text-brand-green" /> Relatório em PDF na hora
                </div>
                <div className="flex items-center gap-3 text-content font-medium">
                  <CheckCircle2 className="text-brand-green" /> Auditoria de Concorrência
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-brand-blue/10 rounded-[4rem] rotate-3 blur-2xl"></div>
              <div className="bg-card p-8 md:p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative z-10">
                <h3 className="text-2xl font-heading font-bold text-title mb-2 text-center">Libere seu Diagnóstico</h3>
                <p className="text-subtitle text-sm mb-8 text-center">Preencha os dados básicos para iniciar a análise.</p>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="Seu Nome Completo"
                      title={FORM_VALIDATION_MSGS.required}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-brand-blue outline-none transition-all"
                      value={formData.name}
                      onChange={e => { setFormData({ ...formData, name: e.target.value }); (e.target as HTMLInputElement).setCustomValidity(''); }}
                      onInvalid={e => { const el = e.target as HTMLInputElement; el.setCustomValidity(FORM_VALIDATION_MSGS.required); }}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type="email"
                      placeholder="E-mail Profissional"
                      title={FORM_VALIDATION_MSGS.email}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-brand-blue outline-none transition-all"
                      value={formData.email}
                      onChange={e => { setFormData({ ...formData, email: e.target.value }); (e.target as HTMLInputElement).setCustomValidity(''); }}
                      onInvalid={e => { const el = e.target as HTMLInputElement; el.setCustomValidity(el.validity.typeMismatch ? FORM_VALIDATION_MSGS.email : FORM_VALIDATION_MSGS.required); }}
                    />
                  </div>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type="tel"
                      placeholder="Seu WhatsApp"
                      title={FORM_VALIDATION_MSGS.required}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-brand-blue outline-none transition-all"
                      value={formData.phone}
                      onChange={e => { setFormData({ ...formData, phone: e.target.value }); (e.target as HTMLInputElement).setCustomValidity(''); }}
                      onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }}
                    />
                  </div>

                  <Button fullWidth variant="primary" loading={loading} className="py-5 text-lg rounded-2xl shadow-xl shadow-orange-500/20">
                    Iniciar Diagnóstico Grátis
                  </Button>

                  <p className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
                    <Lock size={12} /> Seus dados estão protegidos pela LGPD
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="py-24 bg-mid">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            title="O que analisamos no seu Diagnóstico?"
            subtitle="Nosso sistema de inteligência audita os pilares que geram faturamento no digital."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Search, title: "Visibilidade", text: "Sua empresa é encontrada por quem te procura hoje?" },
              { icon: Target, title: "Conversão", text: "Seu site e WhatsApp estão prontos para fechar vendas?" },
              { icon: Users, title: "Público", text: "Você está falando com quem realmente tem dinheiro para pagar?" },
              { icon: Zap, title: "Performance", text: "Seus anúncios estão dando lucro ou apenas gerando cliques?" },
              { icon: Smartphone, title: "Social", text: "Suas redes sociais passam credibilidade ou afastam clientes?" },
              { icon: FileText, title: "Plano de Ação", text: "O que você deve fazer exatamente nos próximos 30 dias." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-card rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white text-brand-blue rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <item.icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-title mb-3">{item.title}</h4>
                <p className="text-content text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Step by Step */}
      <section className="py-24 bg-footer text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-black mb-16 text-center">Como funciona o processo</h2>
            <div className="space-y-12">
              {[
                { step: "01", title: "Cadastro de Acesso", text: "Você informa seus dados de contato para liberar o sistema." },
                { step: "02", title: "Responda o Briefing", text: "Você preenche dados sobre seu negócio, faturamento e desafios." },
                { step: "03", title: "IA & Benchmarking", text: "Nossa tecnologia compara seus dados com os melhores resultados do seu setor." },
                { step: "04", title: "Geração de Relatório", text: "Você recebe um PDF detalhado com suas forças e pontos de melhoria." }
              ].map((s, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <span className="text-5xl font-black text-brand-orange opacity-50">{s.step}</span>
                  <div>
                    <h4 className="text-2xl font-black mb-2">{s.title}</h4>
                    <p className="text-blue-100 leading-relaxed font-light">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-mid text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-title mb-6">Pare de adivinhar. Comece a medir.</h2>
          <p className="text-xl text-subtitle mb-10 max-w-2xl mx-auto">Mais de 100 empresas já utilizaram nosso diagnóstico para redefinir suas estratégias de marketing digital.</p>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="primary" className="px-12 py-5 text-lg" withIcon>
            Quero meu Diagnóstico Agora
          </Button>
        </div>
      </section>
    </div>
  );
};

export default MarketingDiagnosisPage;
