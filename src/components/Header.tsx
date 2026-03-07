import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Target, BarChart3, ArrowRight, MapPin, Megaphone, Globe, Handshake, FileText, MessageSquare, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import Logo from './Logo';

import { useSiteConfig } from '../lib/SiteContext';
import { useAuth } from './Auth/AuthProvider';
import { LogOut, User as UserIcon, Layout } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView = 'landing', onNavigate }) => {
  const { config } = useSiteConfig();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [activeMenuItemIndex, setActiveMenuItemIndex] = useState<number>(-1);
  const navigate = useNavigate();

  const routeMap: Record<string, string> = {
    'landing': '/',
    'about': '/sobre',
    'gmb': '/google-meu-negocio',
    'ads': '/anuncios-pagos',
    'sites': '/sites',
    'consultancy': '/consultoria',
    'md-converte': '/md-converte',
    'social-media': '/social-media',
    'crm': '/crm',
    'swot-service': '/swot-service',
    'swot': '/swot',
    'planos-swot': '/planos-swot',
    'marketing-diagnosis': '/marketing-diagnosis',
    'blog': '/blog',
    'design-showcase': '/showcase',
    'auth': '/acesso',
    'admin': '/admin',
    'dashboard': '/cliente',
    'pricing': '/planos',
    'services': '/planos',
    'swot-pricing': '/planos-swot',
  };

  const servicesRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesMenuOpen &&
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node) &&
        servicesButtonRef.current &&
        !servicesButtonRef.current.contains(event.target as Node)
      ) {
        setServicesMenuOpen(false);
      }
      if (
        toolsMenuOpen &&
        toolsRef.current &&
        !toolsRef.current.contains(event.target as Node) &&
        toolsButtonRef.current &&
        !toolsButtonRef.current.contains(event.target as Node)
      ) {
        setToolsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [servicesMenuOpen, toolsMenuOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (servicesMenuOpen || toolsMenuOpen) {
        const currentMenu = servicesMenuOpen ? services : tools;

        switch (e.key) {
          case 'Escape':
            setServicesMenuOpen(false);
            setToolsMenuOpen(false);
            setActiveMenuItemIndex(-1);
            if (servicesMenuOpen) servicesButtonRef.current?.focus();
            if (toolsMenuOpen) toolsButtonRef.current?.focus();
            break;
          case 'ArrowDown':
            e.preventDefault();
            setActiveMenuItemIndex((prev) =>
              prev < currentMenu.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveMenuItemIndex((prev) => prev > 0 ? prev - 1 : 0);
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (activeMenuItemIndex >= 0) {
              const item = currentMenu[activeMenuItemIndex];
              navigate(routeMap[item.view] || '/');
              setServicesMenuOpen(false);
              setToolsMenuOpen(false);
              setActiveMenuItemIndex(-1);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [servicesMenuOpen, toolsMenuOpen, activeMenuItemIndex, onNavigate]);

  const goHome = (e?: React.MouseEvent) => {
    // If it's passed as an onClick for Link it doesn't need to prevent default
    setMobileMenuOpen(false);
  };

  const services = [
    { label: 'MD Converte (CRM)', view: 'md-converte', icon: MessageSquare, desc: 'Atendimento & CRM IA', key: 'md_converte', color: "bg-blue-600 text-white" },
    { label: 'Google Meu Negócio', view: 'gmb', icon: MapPin, desc: 'Local SEO', key: 'gmb', color: "bg-blue-600 text-white" },
    { label: 'Estratégias de Anúncios Pagos', view: 'ads', icon: Megaphone, desc: 'Meta & Google Ads', key: 'ads', color: "bg-slate-800 text-white" },
    { label: 'Social Media & Branding', view: 'social-media', icon: Share2, desc: 'Autoridade & Design', key: 'social_media', color: "bg-brand-gold text-white" },
    { label: 'Sites & Landing Pages', view: 'sites', icon: Globe, desc: 'Alta Conversão', key: 'sites', color: "bg-indigo-600 text-white" },
    { label: 'Consultoria de Vendas', view: 'consultancy', icon: Handshake, desc: 'Gestão Comercial', key: 'consultancy', color: "bg-emerald-600 text-white" },
  ].filter(s => config.content?.sections?.[s.key]?.is_active !== false);

  const tools = [
    { label: 'Blog & Artigos', view: 'blog', icon: FileText, desc: 'Conteúdo Educativo', active: config.is_blog_active, color: "bg-blue-100 text-brand-blue" },
    { label: 'Auditoria SWOT (Info)', view: 'swot-service', icon: Target, desc: 'Estratégia de Gestão', active: config.is_swot_active && config.content?.sections?.['swot']?.is_active !== false, color: "bg-yellow-100 text-brand-gold" },
    { label: 'Diagnóstico Marketing', view: 'marketing-diagnosis', icon: BarChart3, desc: 'Análise de Vendas', active: config.content?.sections?.['diagnosis']?.is_active !== false, color: "bg-green-100 text-green-600" },
    { label: 'Visual Showcase', view: 'design-showcase', icon: Layout, desc: 'Modelos de Layout', active: true, color: "bg-purple-100 text-purple-600" },
  ].filter(t => t.active);

  const isSolid = isScrolled;
  const isDarkPage = ['landing', 'ads', 'consultancy', 'about', 'swot-service', 'blog-post'].includes(currentView);

  const headerBgClass = isSolid
    ? `bg-white/95 backdrop-blur-md ${isDarkPage ? 'shadow-sm' : 'shadow-[0_5px_30px_-10px_rgba(0,0,0,0.1)]'}`
    : currentView === 'landing'
      ? 'bg-transparent'
      : 'bg-white shadow-none border-b border-gray-100';

  const isHeaderWhite = isSolid || currentView !== 'landing';

  const navLinkClass = isHeaderWhite
    ? 'text-[14px] font-black tracking-widest uppercase transition-all relative group text-brand-darkBlue hover:text-brand-gold'
    : isDarkPage
      ? 'text-[14px] font-black tracking-widest uppercase transition-all relative group text-white hover:text-brand-gold'
      : 'text-[14px] font-black tracking-widest uppercase transition-all relative group text-brand-darkBlue hover:text-brand-gold';

  const buttonVariant = 'primary';

  const buttonExtraClass = isHeaderWhite
    ? 'bg-brand-gold text-brand-darkBlue hover:brightness-110 border-none shadow-xl shadow-brand-gold/20 h-12'
    : (isDarkPage ? 'shadow-xl shadow-brand-gold/20 h-12 glass-button !bg-brand-gold !text-brand-darkBlue' : 'bg-brand-darkBlue text-white hover:bg-brand-navy shadow-lg shadow-brand-darkBlue/20 h-12');

  const handleMouseEnter = (menu: 'services' | 'tools') => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (menu === 'services') {
      setServicesMenuOpen(true);
      setToolsMenuOpen(false);
      setActiveMenuItemIndex(-1);
    } else {
      setToolsMenuOpen(true);
      setServicesMenuOpen(false);
      setActiveMenuItemIndex(-1);
    }
  };

  const handleMouseLeave = (menu: 'services' | 'tools') => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (menu === 'services') setServicesMenuOpen(false);
      else setToolsMenuOpen(false);
      setActiveMenuItemIndex(-1);
    }, 150);
  };

  const toggleMenu = (menu: 'services' | 'tools') => {
    if (menu === 'services') {
      setServicesMenuOpen(!servicesMenuOpen);
      setToolsMenuOpen(false);
      setActiveMenuItemIndex(-1);
    } else {
      setToolsMenuOpen(!toolsMenuOpen);
      setServicesMenuOpen(false);
      setActiveMenuItemIndex(-1);
    }
  };

  const handleClick = (view: string) => {
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    setToolsMenuOpen(false);
    setActiveMenuItemIndex(-1);

    if (onNavigate) {
      onNavigate(view);
    } else {
      const path = routeMap[view] || '/';
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  const logoColor = isHeaderWhite || !isDarkPage ? 'dark' : 'light';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-20' : 'h-24'}`}>
            {/* Logo Group */}
            <div className="flex items-center gap-[60px] xl:gap-[80px]">
              <div className="flex-shrink-0 cursor-pointer w-[120px] xl:w-[150px] relative z-[60]" onClick={() => handleClick('landing')}>
                <Logo variant={logoColor} />
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-6 xl:gap-8 mx-6">
                <button onClick={() => handleClick('landing')} className={`font-bold transition-all duration-300 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${currentView === 'landing' ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                  Início
                </button>

                {/* Soluções Dropdown */}
                <div className="relative group/solutions"
                  onMouseEnter={() => handleMouseEnter('services')}
                  onMouseLeave={() => handleMouseLeave('services')}>
                  <button onClick={() => handleClick('services')} className={`font-bold transition-all duration-300 flex items-center gap-1.5 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${['services', 'gmb', 'ads', 'sites', 'md-converte', 'social-media'].includes(currentView) ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                    Soluções <ChevronDown size={14} className="group-hover/solutions:rotate-180 transition-transform duration-300" />
                  </button>

                  <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover/solutions:opacity-100 group-hover/solutions:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-[1.5rem] shadow-2xl w-[320px] p-2 border border-slate-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
                      {services.map((s) => (
                        <button
                          key={s.view}
                          onClick={() => handleClick(s.view)}
                          className="block w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl group"
                        >
                          <span className="text-sm font-bold text-slate-800 group-hover:text-brand-blue flex items-center justify-between">
                            {s.label}
                            {s.view === 'md-converte' && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-brand-gold text-brand-darkBlue tracking-widest uppercase ml-2">Novo</span>
                            )}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estratégia Dropdown */}
                {tools.length > 0 && (
                  <div className="relative group/strategy"
                    onMouseEnter={() => handleMouseEnter('tools')}
                    onMouseLeave={() => handleMouseLeave('tools')}>
                    <button onClick={() => handleClick('consultancy')} className={`font-bold transition-all duration-300 flex items-center gap-1.5 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${['consultancy', 'swot-service'].includes(currentView) ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                      Estratégia <ChevronDown size={14} className="group-hover/strategy:rotate-180 transition-transform duration-300" />
                    </button>

                    <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover/strategy:opacity-100 group-hover/strategy:visible transition-all duration-300 z-50">
                      <div className="bg-white rounded-[1.5rem] shadow-2xl w-[320px] p-2 border border-slate-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        {tools.map((t) => (
                          <button
                            key={t.view}
                            onClick={() => handleClick(t.view)}
                            className="block w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl group"
                          >
                            <span className="text-sm font-bold text-slate-800 group-hover:text-brand-blue block">{t.label}</span>
                            <span className="text-xs text-slate-500 font-medium">{t.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={() => handleClick('pricing')} className={`font-bold transition-all duration-300 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${currentView === 'pricing' ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                  Planos
                </button>
                <button onClick={() => handleClick('about')} className={`font-bold transition-all duration-300 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${currentView === 'about' ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                  Sobre
                </button>
                <button onClick={() => handleClick('blog')} className={`font-bold transition-all duration-300 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${currentView === 'blog' ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                  Blog
                </button>
                <button onClick={() => handleClick('contact')} className={`font-bold transition-all duration-300 text-[11px] xl:text-[13px] tracking-widest uppercase hover:-translate-y-0.5 ${currentView === 'contact' ? (isHeaderWhite ? 'text-brand-blue' : 'text-white') : navLinkClass}`}>
                  Contato
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/cliente" className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isHeaderWhite ? 'bg-brand-blue text-white hover:bg-brand-navy' : 'bg-white text-brand-blue hover:bg-gray-100'}`}>
                    <UserIcon size={18} />
                    <span className="font-bold text-sm">
                      {user?.user_metadata?.full_name?.split(' ')[0] ||
                        user?.user_metadata?.name?.split(' ')[0] ||
                        user?.email?.split('@')[0] ||
                        'Cliente'}
                    </span>
                  </Link>
                  <button onClick={signOut} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isHeaderWhite ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-red-600 text-white hover:bg-red-700'}`}>
                    <LogOut size={18} />
                    <span className="font-bold text-sm">Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/acesso" className={`font-bold text-sm transition-all duration-300 ${isHeaderWhite ? 'text-brand-darkBlue hover:text-brand-blue' : 'text-white hover:text-gray-200'}`}>
                    Entrar
                  </Link>
                  <Button onClick={() => handleClick('marketing-diagnosis')} variant={buttonVariant} className={buttonExtraClass}>
                    Diagnóstico Grátis <ArrowRight size={18} />
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-md focus:outline-none ${isHeaderWhite ? 'text-brand-darkBlue' : 'text-white'}`}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 lg:hidden overflow-y-auto pt-24">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Navegação</p>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-black text-2xl text-brand-darkBlue py-4 border-b border-gray-100 block">Início</Link>
                <Link to="/planos" onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-black text-2xl text-brand-darkBlue py-4 border-b border-gray-100 block">Planos</Link>
                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-black text-2xl text-brand-darkBlue py-4 border-b border-gray-100 block">Blog</Link>
                <Link to="/contato" onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-black text-2xl text-brand-darkBlue py-4 border-b border-gray-100 block">Contato</Link>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Soluções</p>
              <div className="grid grid-cols-1 gap-3">
                {services.map((s, i) => (
                  <Link to={routeMap[s.view] || '/'} key={i} onClick={() => setMobileMenuOpen(false)} className="w-full text-left p-4 bg-gray-50 rounded-2xl flex items-center gap-4 active:scale-95 transition-transform border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${s.color}`}>
                      <s.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">{s.label}</p>
                      <p className="text-xs text-gray-500 font-medium">{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Estratégia & Inteligência</p>
              <div className="grid grid-cols-1 gap-3">
                {tools.map((t, i) => (
                  <Link to={routeMap[t.view] || '/'} key={i} onClick={() => setMobileMenuOpen(false)} className="w-full text-left p-4 bg-gray-50 rounded-2xl flex items-center gap-4 active:scale-95 transition-transform border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${t.color}`}>
                      <t.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">{t.label}</p>
                      <p className="text-xs text-gray-500 font-medium">{t.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/sobre" onClick={() => setMobileMenuOpen(false)} className="w-full text-left font-black text-2xl text-brand-darkBlue py-4 border-t border-gray-100 block">Sobre Nós</Link>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                    {user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-brand-blue text-white flex items-center justify-center"><UserIcon size={20} /></div>}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logado como</p>
                    <p className="font-bold text-gray-900">
                      {user?.user_metadata?.full_name?.split(' ')[0] ||
                        user?.user_metadata?.name?.split(' ')[0] ||
                        user?.email?.split('@')[0] ||
                        'Usuário'}
                    </p>
                  </div>
                </div>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center" aria-label="Sair"><LogOut size={20} /></button>
              </div>
            ) : (
              <Link to="/acesso" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 mb-3 text-gray-900 font-black uppercase tracking-widest text-xs border border-gray-200 bg-white rounded-2xl shadow-sm block text-center">Entrar na Conta</Link>
            )}
            <Button onClick={() => { navigate('/marketing-diagnosis'); setMobileMenuOpen(false); }} fullWidth className="py-5 text-sm shadow-xl bg-brand-gold text-brand-darkBlue hover:brightness-110 rounded-2xl font-black uppercase tracking-widest">Diagnóstico Grátis</Button>
          </div>
        </div >
      )}
    </>
  );
};

export default Header;
