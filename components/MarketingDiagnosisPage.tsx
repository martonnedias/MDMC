import React, { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { BarChart3, Search, Target, Users, Smartphone, Zap, CheckCircle2, FileText, Sparkles, User, Mail, MessageCircle, Lock, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Send, ChevronRight, Clock, Star, Wand2 } from 'lucide-react';
import { leadService } from '../services/leadService';
import { FORM_VALIDATION_MSGS } from '../constants';
import { useSiteConfig } from '../lib/SiteContext';
import { formatPhone } from '../lib/formatters';

import { useAuth } from './Auth/AuthProvider';

interface MarketingDiagnosisPageProps {
  onStart: () => void;
}

const MarketingDiagnosisPage: React.FC<MarketingDiagnosisPageProps> = ({ onStart }) => {
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  const isAdmin = user?.email && allowedEmails.includes(user.email);
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

  const handleAuthenticatedStart = () => {
    onStart();
  };

  // ... (keep handleCopyLink and handleShare same as before) ...
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

  const titleFontSize = section?.font_size_title || 'text-5xl sm:text-6xl lg:text-7xl';
  const subtitleFontSize = section?.font_size_subtitle || 'text-xl lg:text-2xl';

  return (
    <div className="pt-0 pb-12 lg:pb-24 font-sans" style={{ fontFamily: section?.font_family }}>
      {/* Super Hero Section - Light & Friendly */}
      <section className="pt-44 lg:pt-60 pb-12 lg:pb-32 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden relative">
        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white text-brand-blue px-4 py-1.5 rounded-full mb-8 font-black text-[9px] uppercase tracking-[0.2em] border border-blue-100 shadow-sm animate-fade-in">
                <Sparkles size={14} className="text-brand-orange animate-pulse" /> Inteligência de Vendas
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black mb-8 leading-[0.95] pb-2 tracking-tighter text-brand-darkBlue"
                dangerouslySetInnerHTML={{
                  __html: section?.title || 'Por que você não está vendendo mais no <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400 italic pr-1">digital?</span>'
                }}>
              </h1>

              <p className={`${subtitleFontSize} text-slate-500 mb-10 leading-relaxed font-medium max-w-xl`}>
                {section?.subtitle || section?.description || 'Não é achismo, é dado. Nossa IA analisa sua presença digital e entrega um Plano de Ação personalizado para desbloquear seu faturamento.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Social Proof Mini */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm flex items-center justify-center text-xs font-bold text-slate-500">
                      {i === 4 ? '+99' : ''}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center text-left">
                  <div className="flex gap-1 text-brand-orange">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-xs font-medium text-slate-500">Empresas analisadas este mês</p>
                </div>
              </div>
            </div>

            {/* Assessment Card - The Form or Action Button */}
            <div className="relative order-1 lg:order-2 w-full max-w-md mx-auto lg:mr-0">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 rounded-[3rem] blur-2xl opacity-70 animate-pulse-slow"></div>
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10 transform transition-transform hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex flex-col items-center mb-8 gap-4">
                      <h3 className="text-3xl font-heading font-black text-brand-darkBlue tracking-tight uppercase text-center">Gere sua estratégia</h3>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              name: 'Empresa Teste Diagnosis',
                              phone: '(11) 99999-9999',
                              email: 'admin@diagnosis.com'
                            });
                          }}
                          className="flex items-center gap-2 bg-brand-darkBlue text-white px-4 py-2 rounded-full font-bold text-[9px] hover:bg-brand-darkBlue/90 transition-all uppercase tracking-widest shadow-lg shadow-brand-darkBlue/20"
                        >
                          <Wand2 size={12} /> Auto-Preencher
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-bold text-brand-green uppercase tracking-widest mt-1">Gratuito • Online • Instantâneo</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
                    <BarChart3 size={24} />
                  </div>
                </div>

                {user ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                      <User size={32} />
                    </div>

                    <div className="text-left mb-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Usuário Identificado</label>
                      <div className="relative group opacity-80">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue" size={18} />
                        <input
                          disabled
                          type="text"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 cursor-not-allowed"
                          value={user.user_metadata?.name || user.email?.split('@')[0]}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                          <CheckCircle2 size={18} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 px-1">Você já está logado. Vamos pular o cadastro.</p>
                    </div>

                    <Button
                      fullWidth
                      variant="primary"
                      onClick={handleAuthenticatedStart}
                      className="py-5 text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/30 transition-shadow"
                    >
                      Continuar para o Teste <ChevronRight size={16} />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRegistration} className="space-y-5">
                    <div className="space-y-4">
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                          required
                          type="text"
                          placeholder="Nome do Responsável"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-blue outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                          required
                          type="email"
                          placeholder="E-mail Comercial"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-blue outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="relative group">
                        <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={18} />
                        <input
                          required
                          type="tel"
                          placeholder="WhatsApp (com DDD)"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-blue outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                        />
                      </div>
                    </div>

                    <Button fullWidth variant="primary" loading={loading} className="py-5 text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/30 transition-shadow">
                      Iniciar Análise Agora <ChevronRight size={16} />
                    </Button>

                    <div className="bg-slate-50 rounded-lg p-3 flex items-start gap-3 border border-slate-100">
                      <Lock size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Seus dados são usados apenas para gerar o relatório. Respeitamos a LGPD e odiamos spam tanto quanto você.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition - Friendly Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionTitle
            badge="Checklist inteligente"
            title="O que vamos <span class='text-brand-blue italic'>descobrir juntos?</span>"
            subtitle="Nosso algoritmo varre os 6 pilares fundamentais do sucesso digital."
            alignment="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Search, title: "Visibilidade", text: "Você aparece quando o cliente precisa?", color: "blue" },
              { icon: Target, title: "Conversão", text: "Seu site vende ou só informa?", color: "orange" },
              { icon: Users, title: "Público", text: "Você atrai compradores ou curiosos?", color: "purple" },
              { icon: Zap, title: "Anúncios", text: "Seu dinheiro está trazendo retorno?", color: "yellow" },
              { icon: Smartphone, title: "Social", text: "Suas redes passam autoridade?", color: "pink" },
              { icon: FileText, title: "Plano Prático", text: "O passo a passo para crescer.", color: "green" }
            ].map((item, i) => (
              <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 hover:scale-[1.02] flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 shadow-sm bg-${item.color}-50 text-${item.color}-600`}>
                  <item.icon size={32} />
                </div>
                <h4 className="text-xl font-heading font-black text-brand-darkBlue mb-4 uppercase tracking-tighter">{item.title}</h4>
                <p className="text-slate-500 font-bold leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Visual Steps */}
      <section className="py-24 bg-brand-darkBlue text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-darkBlue via-slate-900 to-brand-navy opacity-80"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <SectionTitle
            className="mb-16"
            badge="Simples e rápido"
            title="Como funciona a <span class='text-brand-orange italic'>magia?</span>"
            subtitle="Em menos de 5 minutos você sai da dúvida para a certeza."
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: User, title: "Cadastro", desc: "Acesso liberado" },
              { icon: FileText, title: "Briefing", desc: "Responda rápido" },
              { icon: Zap, title: "Análise IA", desc: "Varredura total" },
              { icon: CheckCircle2, title: "Relatório", desc: "Seu plano pronto" }
            ].map((step, i) => (
              <div key={i} className="relative group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent group-hover:from-brand-orange/40 transition-all duration-500"></div>
                )}
                <div className="relative bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] backdrop-blur-md hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-center shadow-2xl">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-darkBlue to-brand-navy border border-white/10 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-brand-orange/50 transition-all duration-500 relative z-10">
                    <step.icon size={28} className="text-white group-hover:text-brand-orange transition-colors" />
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-brand-darkBlue">
                      {i + 1}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">{step.title}</h4>
                  <p className="text-sm text-slate-400 font-medium group-hover:text-white/70 transition-colors">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle
            title={<>Pare de adivinhar. <span className="text-brand-blue italic pr-1">comece a medir.</span></>}
            alignment="center"
          />
          <div className="mt-10">
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="primary" className="px-12 py-6 text-lg rounded-2xl shadow-xl shadow-brand-orange/20" withIcon>
              Quero meu Diagnóstico Agora
            </Button>
            <p className="mt-6 text-sm font-medium text-slate-400">
              <Clock size={14} className="inline mr-1 relative -top-0.5" /> Tempo estimado: 3 minutos
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketingDiagnosisPage;
