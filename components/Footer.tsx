
import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Globe, Instagram, Facebook, Youtube } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';
import { FOOTER_CTA, CONTACT_INFO, FORM_VALIDATION_MSGS } from '../constants';
import { ViewState } from '../App';
import { leadService } from '../services/leadService';
import { useSiteConfig } from '../lib/SiteContext';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
  currentView?: ViewState;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, currentView = 'landing' }) => {
  const { config } = useSiteConfig();
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    companySize: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');

    try {
      const success = await leadService.saveContactLead(formData);
      if (success) {
        setFormState('success');
        setFormData({ name: '', email: '', phone: '', interest: '', companySize: '' });
      } else {
        setFormState('error');
        alert(FORM_VALIDATION_MSGS.sendError);
      }
    } catch (error) {
      console.error(error);
      setFormState('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkClick = (e: React.MouseEvent, view: ViewState) => {
    e.preventDefault();
    if (onNavigate) onNavigate(view);
  };

  const inputStyles = "w-full p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300 text-sm placeholder:text-gray-400 font-medium shadow-sm";
  const selectStyles = "w-full p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300 text-sm text-gray-500 font-medium shadow-sm cursor-pointer appearance-none";

  return (
    <footer id="contact" className="bg-brand-darkBlue text-white overflow-hidden font-sans">
      {/* Contact Form Section */}
      <div className="pt-16 pb-16 lg:pt-24 lg:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-brand-orange to-brand-orangeHover rounded-[3.5rem] p-1 md:p-1 shadow-[0_20px_50px_rgba(255,107,0,0.15)] border border-white/10 relative">

            <div className="bg-brand-navy/90 backdrop-blur-xl rounded-[3.4rem] p-6 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">

              {/* Lado Esquerdo: Persuasão */}
              <div className="text-left space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange px-4 py-1.5 rounded-full mb-6 font-black text-[10px] uppercase tracking-widest border border-brand-orange/30">
                    <Sparkles size={14} /> Atendimento Personalizado
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white leading-tight">
                    {FOOTER_CTA.title}
                  </h2>
                  <p className="text-blue-100/70 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                    {FOOTER_CTA.text}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-blue/20 group-hover:border-brand-blue/50 transition-all duration-500">
                      <MessageCircle size={28} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-40 font-black uppercase tracking-[0.2em]">WhatsApp Executivo</p>
                      <button
                        onClick={() => window.open(`https://wa.me/${config.whatsapp}`, '_blank')}
                        className="font-bold text-white text-2xl tracking-tight hover:text-brand-orange transition-colors"
                      >
                        {config.phone}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-brand-blue/20 group-hover:border-brand-blue/50 transition-all duration-500">
                      <Globe size={28} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-[10px] opacity-40 font-black uppercase tracking-[0.2em]">Sede Operacional</p>
                      <p className="font-bold text-white text-lg tracking-tight">Atendimento Nacional Digital</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex items-center gap-4 border-t border-white/5">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A1931] bg-gray-300 overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Especialista em marketing digital MD Solution" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-blue-100/50 font-medium">
                    Nossos estrategistas estão online para te atender.
                  </p>
                </div>
              </div>

              {/* Lado Direito: Formulário Elegante */}
              <div className="bg-white/95 rounded-[2.5rem] p-6 md:p-12 text-gray-900 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-blue/10 transition-all duration-1000"></div>

                {formState === 'success' ? (
                  <div className="text-center animate-fade-in py-12 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-24 h-24 bg-green-50 text-brand-green rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-inner">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">Solicitação Recebida!</h3>
                    <p className="text-gray-500 mb-10 leading-relaxed max-w-xs mx-auto">Um de nossos especialistas analisará seu perfil e entrará em contato em até 24h.</p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="text-brand-blue font-bold text-sm uppercase tracking-widest hover:text-brand-darkBlue transition-colors flex items-center gap-2"
                    >
                      Nova Solicitação <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <h3 className="text-2xl font-heading font-bold text-gray-900">Agendar Reunião</h3>
                      <p className="text-gray-400 text-sm mt-1">Preencha e receba um contato prioritário.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nome</label>
                        <input type="text" name="name" value={formData.name} onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }} onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }} placeholder="Seu Nome" className={inputStyles} required title={FORM_VALIDATION_MSGS.required} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">WhatsApp</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }} onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }} placeholder="(00) 00000-0000" className={inputStyles} required title={FORM_VALIDATION_MSGS.required} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">E-mail Corporativo</label>
                      <input type="email" name="email" value={formData.email} onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }} onInvalid={e => { const el = e.target as HTMLInputElement; el.setCustomValidity(el.validity.typeMismatch ? FORM_VALIDATION_MSGS.email : FORM_VALIDATION_MSGS.required); }} placeholder="seu@email.com.br" className={inputStyles} required title={FORM_VALIDATION_MSGS.email} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Objetivo</label>
                        <select name="interest" value={formData.interest} onChange={(e) => { handleChange(e); (e.target as HTMLSelectElement).setCustomValidity(''); }} onInvalid={e => { (e.target as HTMLSelectElement).setCustomValidity(FORM_VALIDATION_MSGS.select); }} className={selectStyles} required title={FORM_VALIDATION_MSGS.select}>
                          <option value="" disabled>Escolha...</option>
                          <option value="Google Meu Negócio">Google Meu Negócio</option>
                          <option value="Tráfego Pago">Tráfego Pago</option>
                          <option value="Site/Landing Page">Site/Landing Page</option>
                          <option value="Consultoria">Consultoria de Vendas</option>
                          <option value="SWOT">Análise SWOT</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Tamanho da Equipe</label>
                        <select name="companySize" value={formData.companySize} onChange={(e) => { handleChange(e); (e.target as HTMLSelectElement).setCustomValidity(''); }} onInvalid={e => { (e.target as HTMLSelectElement).setCustomValidity(FORM_VALIDATION_MSGS.select); }} className={selectStyles} required title={FORM_VALIDATION_MSGS.select}>
                          <option value="" disabled>Escolha...</option>
                          <option value="Só eu">Só eu</option>
                          <option value="2-5">2 a 5 pessoas</option>
                          <option value="6-10">6 a 10 pessoas</option>
                          <option value="11+">Mais de 11 pessoas</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        fullWidth
                        variant="primary"
                        loading={formState === 'loading'}
                        className="py-5 text-lg rounded-[1.2rem] shadow-xl shadow-brand-orange/20"
                        withIcon
                      >
                        Iniciar Conversa Estratégica
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-4">
                      <ShieldCheck size={14} className="text-brand-green" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seus dados estão protegidos pela LGPD</p>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E&quot;)] opacity-40 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Footer Links & Info */}
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-12 border-t border-white/5 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
          <div className="md:col-span-1 space-y-6">
            {/* Logo Linkável para Home em Versão Clara Conforme Solicitado */}
            <a
              href="/"
              className="inline-block transition-transform hover:scale-105 active:scale-95"
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('landing'); }}
              aria-label="Voltar para Início"
            >
              <Logo size="lg" variant="light" />
            </a>
            <p className="text-gray-500 text-sm leading-relaxed">
              Consultoria especializada em unir gestão estratégica e performance digital para pequenas e médias empresas brasileiras.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-50">Soluções</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'gmb')} className="hover:text-brand-blue transition-colors">Google Meu Negócio</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'ads')} className="hover:text-brand-blue transition-colors">Tráfego Pago (Anúncios)</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'sites')} className="hover:text-brand-blue transition-colors">Sites & Landing Pages</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'consultancy')} className="hover:text-brand-blue transition-colors">Consultoria de Vendas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-50">Inteligência</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              {config.is_blog_active && (
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'blog')} className="hover:text-brand-blue transition-colors">Blog & Artigos</a></li>
              )}
              {config.is_swot_active && (
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'swot-service')} className="hover:text-brand-blue transition-colors">Análise SWOT (Audit)</a></li>
              )}
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'marketing-diagnosis')} className="hover:text-brand-blue transition-colors">Diagnóstico Marketing (Free)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-50">Institucional</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium mb-8">
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'landing')} className="hover:text-brand-blue transition-colors">Início</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-brand-blue transition-colors">Sobre Nós</a></li>
              <li className="flex items-start gap-3 border-t border-white/5 pt-4 mt-4">
                <MapPin size={18} className="text-brand-blue shrink-0 mt-0.5" />
                <span>Atendimento Nacional & Remoto</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-blue shrink-0" />
                <span>{config.email || 'contato@mdsolution.com.br'}</span>
              </li>
            </ul>

            <div className="flex gap-4">
              <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} MD Solution Consultoria. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" onClick={(e) => handleLinkClick(e, 'terms')} className="hover:text-white transition-colors">Termos</a>
            <a href="#" onClick={(e) => handleLinkClick(e, 'privacy')} className="hover:text-white transition-colors">Privacidade</a>
            <a href="#admin" onClick={(e) => handleLinkClick(e, 'admin')} className="hover:text-white transition-colors opacity-30 hover:opacity-100">Painel</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
