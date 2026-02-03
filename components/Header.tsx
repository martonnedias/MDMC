
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Target, BarChart3, ArrowRight, MapPin, Megaphone, Globe, Handshake, FileText, MessageSquare } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';
import { ViewState } from '../App';
import { useSiteConfig } from '../lib/SiteContext';
import { useAuth } from './Auth/AuthProvider';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  currentView?: ViewState;
  onNavigate?: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView = 'landing', onNavigate }) => {
  const { config } = useSiteConfig();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [activeMenuItemIndex, setActiveMenuItemIndex] = useState<number>(-1);

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
              if (onNavigate) {
                onNavigate(item.view);
                setServicesMenuOpen(false);
                setToolsMenuOpen(false);
                setActiveMenuItemIndex(-1);
              }
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [servicesMenuOpen, toolsMenuOpen, activeMenuItemIndex, onNavigate]);

  const goHome = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate('landing');
  };

  const services = [
    { label: 'MD Converte', view: 'md-converte' as ViewState, icon: MessageSquare, desc: 'Atendimento + CRM', key: 'md-converte' },
    { label: 'Google Meu Negócio', view: 'gmb' as ViewState, icon: MapPin, desc: 'Local SEO', key: 'gmb' },
    { label: 'Tráfego Pago (Anúncios)', view: 'ads' as ViewState, icon: Megaphone, desc: 'Meta & Google Ads', key: 'ads' },
    { label: 'Sites & Landing Pages', view: 'sites' as ViewState, icon: Globe, desc: 'Alta Conversão', key: 'sites' },
    { label: 'Consultoria de Vendas', view: 'consultancy' as ViewState, icon: Handshake, desc: 'Gestão Comercial', key: 'consultancy' },
  ].filter(s => config.content?.sections?.[s.key]?.is_active !== false);

  const tools = [
    { label: 'Blog & Artigos', view: 'blog' as ViewState, icon: FileText, desc: 'Conteúdo Educativo', active: config.is_blog_active },
    { label: 'Análise SWOT (Audit)', view: 'swot-service' as ViewState, icon: Target, desc: 'Auditoria Estratégica', active: config.is_swot_active && config.content?.sections?.['swot']?.is_active !== false },
    { label: 'Diagnóstico Marketing (Free)', view: 'marketing-diagnosis' as ViewState, icon: BarChart3, desc: 'Análise de Vendas', active: config.content?.sections?.['diagnosis']?.is_active !== false },
  ].filter(t => t.active);

  // Header turns solid ONLY on scroll now as requested for ALL pages
  const isSolid = isScrolled;

  // To ensure readability when transparent, we check if the current page has a dark or light top section
  const isDarkPage = ['landing', 'ads', 'consultancy', 'about', 'swot-service', 'blog-post'].includes(currentView);

  // Dynamic classes based on background state (altura fixa em todas as páginas)
  const headerBgClass = isSolid
    ? `bg-white ${isDarkPage ? 'shadow-sm' : 'shadow-[0_5px_25px_rgba(0,0,0,0.1)]'}`
    : currentView === 'landing'
      ? 'bg-transparent shadow-[0_10px_40px_rgba(0,0,0,0.3)]'
      : 'bg-white shadow-none border-b border-gray-100/50';

  const isHeaderWhite = isSolid || currentView !== 'landing';

  // When solid (scrolled) or on internal pages, we always use darkBlue text on white background.
  // When transparent (only on landing), we use white on dark pages and darkBlue on light pages.
  const navLinkClass = isHeaderWhite
    ? 'text-sm font-black tracking-tight transition-all relative group text-brand-darkBlue hover:text-brand-orange'
    : isDarkPage
      ? 'text-sm font-black tracking-tight transition-all relative group text-white hover:text-brand-orange'
      : 'text-sm font-black tracking-tight transition-all relative group text-brand-darkBlue hover:text-brand-orange';

  const iconColorClass = isHeaderWhite
    ? 'text-brand-darkBlue'
    : (isDarkPage ? 'text-white' : 'text-brand-darkBlue');

  const buttonVariant = 'primary';

  const buttonExtraClass = isHeaderWhite
    ? 'bg-brand-orange text-white hover:bg-brand-orangeHover border-none shadow-xl shadow-brand-orange/10'
    : (isDarkPage ? 'shadow-xl shadow-brand-orange/10' : 'bg-brand-darkBlue text-white hover:bg-brand-navy shadow-lg shadow-brand-darkBlue/20');

  // Enhanced hover handlers with delay
  const handleMouseEnter = (menu: 'services' | 'tools') => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (menu === 'services') {
      setServicesMenuOpen(true);
      setToolsMenuOpen(false); // Close the other menu
      setActiveMenuItemIndex(-1);
    } else {
      setToolsMenuOpen(true);
      setServicesMenuOpen(false); // Close the other menu
      setActiveMenuItemIndex(-1);
    }
  };

  const handleMouseLeave = (menu: 'services' | 'tools') => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (menu === 'services') {
        setServicesMenuOpen(false);
      } else {
        setToolsMenuOpen(false);
      }
      setActiveMenuItemIndex(-1);
    }, 150);
  };

  // Toggle handlers for click support
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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 h-[90px] flex items-center ${headerBgClass}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo Linkável para Home */}
        <a href="/" onClick={goHome} className="block transition-transform active:scale-95" aria-label="Voltar para Início">
          <Logo
            size={isScrolled ? 'sm' : 'md'}
            variant={isHeaderWhite || !isDarkPage ? 'dark' : 'light'}
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10" role="navigation" aria-label="Navegação principal">
          <button onClick={goHome} className={navLinkClass}>
            Início
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isSolid ? 'bg-brand-orange' : 'bg-brand-orange'}`}></span>
          </button>

          <div className="relative group" ref={servicesRef}>
            <button
              ref={servicesButtonRef}
              className={`flex items-center gap-1.5 text-sm font-black tracking-tight py-2 transition-all focus:outline-none rounded-lg px-2 ${navLinkClass}`}
              onClick={() => toggleMenu('services')}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={() => handleMouseLeave('services')}
              aria-haspopup="true"
              aria-expanded={servicesMenuOpen}
              aria-label="Menu de Soluções"
            >
              Soluções <ChevronDown size={14} className={`transition-transform duration-300 ${servicesMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] border border-gray-100 py-4 w-80 animate-fade-in z-50 overflow-hidden"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={() => handleMouseLeave('services')}
                role="menu"
                aria-label="Soluções"
              >
                {services.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate && onNavigate(s.view); setServicesMenuOpen(false); setActiveMenuItemIndex(-1); }}
                    className={`w-full text-left px-8 py-4 transition-all flex items-center gap-4 group/item focus:outline-none ${activeMenuItemIndex === i
                      ? 'bg-blue-50/70 ring-2 ring-inset ring-brand-blue/30'
                      : 'hover:bg-blue-50/50'
                      }`}
                    role="menuitem"
                    tabIndex={servicesMenuOpen ? 0 : -1}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue group-hover/item:bg-brand-blue group-hover/item:text-white transition-all">
                      <s.icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{s.label}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative group" ref={toolsRef}>
            <button
              ref={toolsButtonRef}
              className={`flex items-center gap-1.5 text-sm font-black tracking-tight py-2 transition-all focus:outline-none rounded-lg px-2 ${navLinkClass}`}
              onClick={() => toggleMenu('tools')}
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={() => handleMouseLeave('tools')}
              aria-haspopup="true"
              aria-expanded={toolsMenuOpen}
              aria-label="Menu de Inteligência"
            >
              Inteligência <ChevronDown size={14} className={`transition-transform duration-300 ${toolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {toolsMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] border border-gray-100 py-4 w-80 animate-fade-in z-50 overflow-hidden"
                onMouseEnter={() => handleMouseEnter('tools')}
                onMouseLeave={() => handleMouseLeave('tools')}
                role="menu"
                aria-label="Inteligência"
              >
                {tools.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate && onNavigate(t.view); setToolsMenuOpen(false); setActiveMenuItemIndex(-1); }}
                    className={`w-full text-left px-8 py-4 transition-all flex items-center gap-4 group/item focus:outline-none ${activeMenuItemIndex === i
                      ? 'bg-orange-50/70 ring-2 ring-inset ring-brand-orange/30'
                      : 'hover:bg-orange-50/50'
                      }`}
                    role="menuitem"
                    tabIndex={toolsMenuOpen ? 0 : -1}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-orange group-hover/item:bg-brand-orange group-hover/item:text-white transition-all">
                      <t.icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{t.label}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onNavigate && onNavigate('about')} className={navLinkClass} aria-label="Ir para Sobre Nós">
            Sobre Nós
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isSolid ? 'bg-brand-orange' : 'bg-brand-orange'}`}></span>
          </button>

          <Button
            onClick={() => onNavigate && onNavigate('marketing-diagnosis')}
            variant={buttonVariant}
            className={`py-3 px-7 text-xs font-black uppercase tracking-widest transition-all duration-500 ${buttonExtraClass}`}
          >
            Diagnóstico Grátis
          </Button>

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-6 border-l border-gray-100">
              <div className="flex items-center gap-3">
                <div className="text-right hidden xl:block">
                  <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isSolid ? 'text-gray-400' : (isDarkPage ? 'text-white/60' : 'text-gray-400')}`}>Olá,</p>
                  <p className={`text-xs font-bold leading-none ${isSolid ? 'text-gray-900' : (isDarkPage ? 'text-white' : 'text-gray-900')}`}>
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Usuário'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                      <UserIcon size={20} />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className={`p-2.5 rounded-xl transition-all hover:bg-red-50 hover:text-red-500 ${isSolid ? 'text-gray-400' : (isDarkPage ? 'text-white/60' : 'text-gray-400')}`}
                title="Sair da conta"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate('auth' as any)}
              className={`ml-4 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${isSolid || !isDarkPage ? 'border-gray-100 text-gray-900 hover:bg-gray-50' : 'border-white/20 text-white hover:bg-white/10'}`}
            >
              Entrar
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2.5 rounded-2xl border transition-all duration-500 ${isSolid ? 'bg-brand-darkBlue/10 border-brand-darkBlue/20 text-brand-darkBlue' : (!isDarkPage ? 'bg-brand-darkBlue/10 border-brand-darkBlue/20 text-brand-darkBlue' : 'bg-white/10 backdrop-blur-md border-white/20 text-white')}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[90px] bg-white border-t p-4 shadow-2xl flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-90px)] rounded-b-[2rem] animate-fade-in z-[60]">
          <button onClick={() => goHome()} className="text-left font-black text-lg text-brand-darkBlue flex justify-between items-center py-3 border-b border-gray-50 active:scale-98 transition-transform">
            Início <ArrowRight size={18} className="text-brand-orange" />
          </button>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">Nossas Soluções</p>
            <div className="grid grid-cols-1 gap-2">
              {services.map((s, i) => (
                <button key={i} onClick={() => { onNavigate && onNavigate(s.view); setMobileMenuOpen(false); }} className="w-full text-left py-3 px-5 bg-gray-50 rounded-xl text-gray-800 font-bold text-sm flex items-center gap-3 active:scale-98 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-blue shadow-sm">
                    <s.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    {s.label}
                    <span className="text-[9px] text-gray-400 uppercase tracking-tighter">{s.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">Inteligência</p>
            <div className="grid grid-cols-1 gap-2">
              {tools.map((t, i) => (
                <button key={i} onClick={() => { onNavigate && onNavigate(t.view); setMobileMenuOpen(false); }} className="w-full text-left py-3 px-5 bg-gray-50 rounded-xl text-gray-800 font-bold text-sm flex items-center gap-3 active:scale-98 transition-transform">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-orange shadow-sm">
                    <t.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    {t.label}
                    <span className="text-[9px] text-gray-400 uppercase tracking-tighter">{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { onNavigate && onNavigate('about'); setMobileMenuOpen(false); }} className="text-left font-black text-lg text-gray-800 py-3 border-t border-gray-50 active:scale-98 transition-transform">Sobre Nós</button>

          <div className="pt-2 flex flex-col gap-3">
            <Button onClick={() => { onNavigate && onNavigate('marketing-diagnosis'); setMobileMenuOpen(false); }} fullWidth className="py-4 text-base shadow-xl bg-brand-orange text-white">Diagnóstico Grátis</Button>

            {user ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white shadow-sm">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <UserIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Logado como</p>
                    <p className="font-bold text-gray-900">{user.user_metadata?.full_name || 'Usuário'}</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm active:scale-95 transition-transform"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onNavigate && onNavigate('auth' as any); setMobileMenuOpen(false); }}
                className="w-full py-4 text-gray-900 font-black uppercase tracking-widest text-xs border border-gray-100 rounded-2xl active:scale-98 transition-transform"
              >
                Entrar na Conta
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
