import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Globe, Instagram, Facebook, Youtube, Linkedin, Share2, Copy, Check } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';
import { FOOTER_CTA, FORM_VALIDATION_MSGS } from '../constants';
import { ViewState } from '../App';
import { leadService } from '../services/leadService';
import { useSiteConfig } from '../lib/SiteContext';
import { formatPhone } from '../lib/formatters';
import { useAuth } from './Auth/AuthProvider';
import { Wand2 } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
  currentView?: ViewState;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, currentView = 'landing' }) => {
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const allowedEmails = (import.meta as any).env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  const isAdmin = user?.email && allowedEmails.includes(user.email);
  const sectionConfig = config.content?.sections?.footer;
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    companySize: ''
  });
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  if (sectionConfig?.is_active === false) return null;

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
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleLinkClick = (e: React.MouseEvent, view: ViewState) => {
    e.preventDefault();
    if (onNavigate) onNavigate(view);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(config.site_name);
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShare(false);
  };

  const inputStyles = "w-full h-14 px-5 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300 text-base placeholder:text-gray-600 font-bold text-gray-900 shadow-sm hover:bg-white";
  const selectStyles = "w-full h-14 px-5 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300 text-base text-gray-800 font-black shadow-sm cursor-pointer appearance-none hover:bg-white";

  const footerStyle = {
    backgroundColor: sectionConfig?.background_color || 'var(--bg-footer)',
    fontFamily: sectionConfig?.font_family,
    color: sectionConfig?.text_color || 'white'
  };

  const titleStyle = {
    color: sectionConfig?.title_color || 'white',
    fontSize: sectionConfig?.font_size_title ? `var(--${sectionConfig.font_size_title})` : undefined
  };

  return (
    <footer id="contact" style={footerStyle} className="overflow-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>

      {/* Contact Form Section - Only on Landing Page */}
      {currentView === 'landing' && (
        <div className="pt-20 lg:pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            {/* Main Container with Glass/Gradient border effect */}
            <div className="relative rounded-[3rem] p-[1px] bg-gradient-to-br from-white/20 to-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">

              <div className="bg-brand-navy/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden relative">

                {/* Decorative Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[128px] -mr-32 -mt-32 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

                {/* Left Side: Content */}
                <div className="text-left space-y-10 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-1.5 rounded-full mb-8 font-black text-xs uppercase tracking-[0.2em] border border-brand-orange/20 shadow-lg shadow-brand-orange/5">
                      <Sparkles size={14} className="animate-pulse" /> Atendimento Premium
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-8 text-white leading-[0.95] tracking-tight" style={titleStyle}>
                      {sectionConfig?.title || FOOTER_CTA.title}
                    </h2>
                    <p className="text-blue-100/95 text-lg md:text-xl leading-relaxed max-w-xl font-bold">
                      {sectionConfig?.subtitle || sectionConfig?.description || FOOTER_CTA.text}
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all -ml-4 border border-transparent hover:border-white/5">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange/80 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-orange/20 group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle size={32} />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/90 font-black uppercase tracking-[0.2em] mb-1">WhatsApp direto</p>
                        <button
                          onClick={() => window.open(`https://wa.me/${config.whatsapp}`, '_blank')}
                          className="font-black text-white text-3xl tracking-tight hover:text-brand-orange transition-colors"
                        >
                          {config.phone}
                        </button>
                        <p className="text-white font-black text-lg mt-1">{config.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 group p-4 -ml-4">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-brand-blue shadow-lg group-hover:bg-brand-blue/20 group-hover:text-white transition-all duration-300">
                        <Globe size={32} />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200/90 font-black uppercase tracking-[0.2em] mb-1">Abrangência</p>
                        <p className="font-bold text-white text-xl tracking-tight">Atendimento Nacional Digital</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 flex items-center gap-6 border-t border-white/10">
                    <div className="flex -space-x-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-navy bg-slate-200 overflow-hidden relative shadow-lg">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Consultor" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Consultores Online</p>
                      <p className="text-xs text-blue-200/80 font-bold">Tempo médio de resposta: <span className="text-brand-green">5 min</span></p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-gray-900 shadow-2xl relative overflow-hidden group border border-white/50">
                  {formState === 'success' ? (
                    <div className="text-center animate-fade-in py-16 flex flex-col items-center justify-center min-h-[460px]">
                      <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-xl shadow-green-500/10 animate-bounce">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-3xl font-heading font-black text-gray-900 mb-4 tracking-tight">Recebemos sua solicitação!</h3>
                      <p className="text-gray-700 mb-10 leading-relaxed max-w-xs mx-auto text-lg font-bold">
                        Um de nossos especialistas analisará seu perfil e entrará em contato.
                      </p>
                      <button
                        onClick={() => setFormState('idle')}
                        className="text-brand-blue font-black text-xs uppercase tracking-widest hover:text-brand-darkBlue transition-colors flex items-center gap-2 border-b-2 border-transparent hover:border-brand-blue py-1"
                      >
                        Nova Solicitação <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                      <div className="mb-8">
                        <span className="inline-block w-12 h-1 bg-brand-orange rounded-full mb-4"></span>
                        <div className="flex flex-col items-start gap-4 mb-4">
                          <h3 className="text-3xl font-heading font-black text-brand-darkBlue tracking-tight">Vamos escalar seu negócio?</h3>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  name: 'Empresa Teste Geral',
                                  email: 'admin@geral.com',
                                  phone: '(11) 99999-9999',
                                  interest: 'Sites & Landing Pages',
                                  companySize: '1-10 Funcionários'
                                });
                              }}
                              className="flex items-center gap-2 bg-brand-darkBlue text-white px-4 py-2 rounded-full font-bold text-[9px] hover:bg-brand-darkBlue/90 transition-all uppercase tracking-widest shadow-lg shadow-brand-darkBlue/20"
                            >
                              <Wand2 size={12} /> Auto-Preencher
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 font-bold">Preencha para receber um diagnóstico inicial.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Nome</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }}
                            onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }}
                            placeholder="Seu Nome"
                            className={inputStyles}
                            required
                            title={FORM_VALIDATION_MSGS.required}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">WhatsApp</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }}
                            onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }}
                            placeholder="(00) 00000-0000"
                            className={inputStyles}
                            required
                            title={FORM_VALIDATION_MSGS.required}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">E-mail Profissional</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }}
                          onInvalid={e => { const el = e.target as HTMLInputElement; el.setCustomValidity(el.validity.typeMismatch ? FORM_VALIDATION_MSGS.email : FORM_VALIDATION_MSGS.required); }}
                          placeholder="seu@empresa.com.br"
                          className={inputStyles}
                          required
                          title={FORM_VALIDATION_MSGS.email}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 relative">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Interesse Principal</label>
                          <select
                            name="interest"
                            value={formData.interest}
                            onChange={(e) => { handleChange(e); (e.target as HTMLSelectElement).setCustomValidity(''); }}
                            onInvalid={e => { (e.target as HTMLSelectElement).setCustomValidity(FORM_VALIDATION_MSGS.select); }}
                            className={selectStyles}
                            required
                            title={FORM_VALIDATION_MSGS.select}
                          >
                            <option value="" disabled>Selecione...</option>
                            <option value="Google Meu Negócio">Google Meu Negócio</option>
                            <option value="Estratégias de Anúncios Pagos">Estratégias de Anúncios Pagos</option>
                            <option value="Site/Landing Page">Site/Landing Page</option>
                            <option value="Consultoria">Consultoria de Vendas</option>
                            <option value="CONVERTE Sim.">CONVERTE Sim. (CRM)</option>
                            <option value="SWOT">Análise SWOT</option>
                          </select>
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Tamanho da Equipe</label>
                          <select
                            name="companySize"
                            value={formData.companySize}
                            onChange={(e) => { handleChange(e); (e.target as HTMLSelectElement).setCustomValidity(''); }}
                            onInvalid={e => { (e.target as HTMLSelectElement).setCustomValidity(FORM_VALIDATION_MSGS.select); }}
                            className={selectStyles}
                            required
                            title={FORM_VALIDATION_MSGS.select}
                          >
                            <option value="" disabled>Selecione...</option>
                            <option value="Só eu">Só eu (1)</option>
                            <option value="2-5">2 a 5 pessoas</option>
                            <option value="6-10">6 a 10 pessoas</option>
                            <option value="11+">Mais de 11 pessoas</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button
                          fullWidth
                          variant="primary"
                          loading={formState === 'loading'}
                          className="py-6 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-orange/30 hover:shadow-brand-orange/50"
                          withIcon
                        >
                          Agendar Diagnóstico
                        </Button>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2">
                        <ShieldCheck size={14} className="text-brand-green" />
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest"> 100% Seguro & Livre de Spam</p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}  {/* Footer Links & Info - Refined */}
      <div className="bg-brand-darkBlue/40 border-t border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 pt-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20 border-b border-white/5 pb-20">
            <div className="space-y-8">
              <div className="inline-block mb-6 transition-transform hover:scale-105 active:scale-95 text-left">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('landing'); }}
                  aria-label="Voltar para Início"
                >
                  <Logo size="lg" variant="light" customHeight={config.logo_height_footer} />
                </a>
              </div>
              <p className="text-blue-100/90 text-base leading-relaxed max-w-sm font-bold">
                Transformamos empresas comuns em máquinas de vendas através de estratégias digitais validadas e tecnologia de ponta.
              </p>

              {(sectionConfig?.show_share_menu !== false) && (
                <div className="flex items-center gap-6 pt-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowShare(!showShare)}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200/90 hover:text-brand-orange transition-colors"
                    >
                      <Share2 size={16} /> Compartilhar
                    </button>
                    {showShare && (
                      <div className="absolute bottom-full left-0 mb-4 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[150px] z-50 animate-fade-in border border-gray-100">
                        <button onClick={() => handleShare('whatsapp')} className="text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">WhatsApp</button>
                        <button onClick={() => handleShare('facebook')} className="text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Facebook</button>
                        <button onClick={() => handleShare('linkedin')} className="text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">LinkedIn</button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200/90 hover:text-brand-orange transition-colors"
                  >
                    {copied ? <Check size={16} className="text-brand-green" /> : <Copy size={16} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-heading font-black text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-40">Ecossistema</h4>
              <ul className="space-y-4 text-blue-100/90 text-base font-bold">
                {config.content?.sections?.['md-converte']?.is_active !== false && <li><a href="#" onClick={(e) => handleLinkClick(e, 'md-converte')} className="hover:text-white hover:translate-x-1 transition-all inline-block">CONVERTE Sim. (CRM)</a></li>}
                {config.content?.sections?.['gmb']?.is_active !== false && <li><a href="#" onClick={(e) => handleLinkClick(e, 'gmb')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Dominância Local (GMB)</a></li>}
                {config.content?.sections?.['ads']?.is_active !== false && <li><a href="#" onClick={(e) => handleLinkClick(e, 'ads')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Anúncios Pagos (Performance)</a></li>}
                {config.content?.sections?.['sites']?.is_active !== false && <li><a href="#" onClick={(e) => handleLinkClick(e, 'sites')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Websites & LPs</a></li>}
                {config.content?.sections?.['consultancy']?.is_active !== false && <li><a href="#" onClick={(e) => handleLinkClick(e, 'consultancy')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Consultoria Comercial</a></li>}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-40">Inteligência</h4>
              <ul className="space-y-4 text-blue-100/90 text-base font-bold">
                {config.is_blog_active && (
                  <li><a href="#" onClick={(e) => handleLinkClick(e, 'blog')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Blog & Insights</a></li>
                )}
                {config.is_swot_active && config.content?.sections?.['swot']?.is_active !== false && (
                  <li><a href="#" onClick={(e) => handleLinkClick(e, 'swot-service')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Auditoria SWOT</a></li>
                )}
                {config.content?.sections?.['diagnosis']?.is_active !== false && <li><a href="#" onClick={(e) => handleLinkClick(e, 'marketing-diagnosis')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Diagnóstico Gratuito</a></li>}
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'design-showcase')} className="hover:text-white hover:translate-x-1 transition-all inline-block">Showcase Visual</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-40">Contato</h4>
              <ul className="space-y-6 text-blue-100/90 text-base font-bold mb-10">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Brasil<br /><span className="text-xs opacity-50">Atendimento 100% Remoto</span></span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail size={20} className="text-brand-orange shrink-0" />
                  <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">{config.email || 'contato@mdsolution.com.br'}</a>
                </li>
              </ul>

              {(sectionConfig?.show_social_icons !== false) && (
                <div className="flex gap-4">
                  <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="YouTube">
                    <Youtube size={20} />
                  </a>
                  {config.linkedin_url && (
                    <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="LinkedIn">
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-blue-200/70 font-black uppercase tracking-widest">
            <p>© {new Date().getFullYear()} MD Solution Consultoria. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" onClick={(e) => handleLinkClick(e, 'terms')} className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" onClick={(e) => handleLinkClick(e, 'privacy')} className="hover:text-white transition-colors">Privacidade</a>
              <a href="#admin" onClick={(e) => handleLinkClick(e, 'admin')} className="hover:text-white transition-colors opacity-50 hover:opacity-100">Admin</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
