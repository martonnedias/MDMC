import React, { useState } from 'react';
import { MapPin, ArrowRight, Instagram, Facebook, Youtube, Linkedin, Share2, Copy, Check, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSiteConfig } from '../lib/SiteContext';
import FooterContactForm from './FooterContactForm';
import NewsletterCTA from './NewsletterCTA';

interface FooterProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const Footer: React.FC<FooterProps> = ({ currentView = 'landing' }) => {
  const { config } = useSiteConfig();
  const sectionConfig = config.content?.sections?.footer;

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  if (sectionConfig?.is_active === false) return null;

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

      {currentView === 'landing' && (
        <FooterContactForm config={config} sectionConfig={sectionConfig} titleStyle={titleStyle} />
      )}

      <NewsletterCTA />

      {/* Footer Links & Info - Refined */}
      <div className="bg-brand-darkBlue/60 pt-16 pb-12 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20 border-b border-white/5 pb-20">
            <div className="space-y-8">
              <div className="inline-block mb-6 transition-transform hover:scale-105 active:scale-95 text-left">
                <Link
                  to="/"
                  onClick={() => window.scrollTo(0, 0)}
                  aria-label="Voltar para Início"
                >
                  <Logo size="lg" variant="light" customHeight={config.logo_height_footer} />
                </Link>
              </div>
              <p className="text-blue-100/90 text-base leading-relaxed max-w-sm font-bold">
                Transformamos empresas comuns em máquinas de vendas através de estratégias digitais validadas e tecnologia de ponta.
              </p>

              {(sectionConfig?.show_share_menu !== false) && (
                <div className="flex items-center gap-6 pt-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowShare(!showShare)}
                      className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200/90 hover:text-brand-gold transition-colors"
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
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200/90 hover:text-brand-gold transition-colors"
                  >
                    {copied ? <Check size={16} className="text-brand-gold" /> : <Copy size={16} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-heading font-black text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-40">Ecossistema</h4>
              <ul className="space-y-4 text-blue-100/90 text-base font-bold">
                {config.content?.sections?.['md_converte']?.is_active !== false && <li><Link to="/md-converte" className="hover:text-white hover:translate-x-1 transition-all inline-block">MD Converte (CRM)</Link></li>}
                {config.content?.sections?.['gmb']?.is_active !== false && <li><Link to="/google-meu-negocio" className="hover:text-white hover:translate-x-1 transition-all inline-block">Dominância Local (GMB)</Link></li>}
                {config.content?.sections?.['ads']?.is_active !== false && <li><Link to="/anuncios-pagos" className="hover:text-white hover:translate-x-1 transition-all inline-block">Anúncios Pagos (Performance)</Link></li>}
                {config.content?.sections?.['social_media']?.is_active !== false && <li><Link to="/social-media" className="hover:text-white hover:translate-x-1 transition-all inline-block">Social Media & Branding</Link></li>}
                {config.content?.sections?.['sites']?.is_active !== false && <li><Link to="/sites" className="hover:text-white hover:translate-x-1 transition-all inline-block">Websites & LPs</Link></li>}
                {config.content?.sections?.['consultancy']?.is_active !== false && <li><Link to="/consultoria" className="hover:text-white hover:translate-x-1 transition-all inline-block">Consultoria Comercial</Link></li>}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-40">Inteligência</h4>
              <ul className="space-y-4 text-blue-100/90 text-base font-bold">
                {config.is_blog_active && (
                  <li><Link to="/blog" className="hover:text-white hover:translate-x-1 transition-all inline-block">Blog & Insights</Link></li>
                )}
                {config.is_swot_active && config.content?.sections?.['swot']?.is_active !== false && (
                  <li><Link to="/swot-service" className="hover:text-white hover:translate-x-1 transition-all inline-block">Auditoria SWOT</Link></li>
                )}
                {config.content?.sections?.['diagnosis']?.is_active !== false && <li><Link to="/marketing-diagnosis" className="hover:text-white hover:translate-x-1 transition-all inline-block">Diagnóstico Marketing</Link></li>}
                <li><Link to="/showcase" className="hover:text-white hover:translate-x-1 transition-all inline-block">Showcase Visual</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-black text-sm mb-8 text-white uppercase tracking-[0.2em] opacity-40">Contato</h4>
              <ul className="space-y-6 text-blue-100/90 text-base font-bold mb-10">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand-gold shrink-0 mt-0.5" />
                  <span>Brasil<br /><span className="text-xs opacity-50">Atendimento 100% Remoto</span></span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail size={20} className="text-brand-gold shrink-0" />
                  <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">{config.email || 'contato@mdsolution.com.br'}</a>
                </li>
                <li className="flex items-center gap-4">
                  <ArrowRight size={20} className="text-brand-gold shrink-0" />
                  <Link to="/contato" className="hover:text-white transition-colors underline underline-offset-4 decoration-brand-gold/30">Fale Conosco (Formulário)</Link>
                </li>
              </ul>

              {(sectionConfig?.show_social_icons !== false) && (
                <div className="flex gap-4">
                  <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:border-brand-gold hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:border-brand-gold hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:border-brand-gold hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="YouTube">
                    <Youtube size={20} />
                  </a>
                  {config.linkedin_url && (
                    <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-gold hover:border-brand-gold hover:-translate-y-1 transition-all duration-300 shadow-lg" aria-label="LinkedIn">
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
              <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
              <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
              <Link to="/regras-comunidade" className="hover:text-white transition-colors">Regras</Link>
              <Link to="/admin" className="hover:text-white transition-colors opacity-50 hover:opacity-100">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
