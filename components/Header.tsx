
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Target, BarChart3, ArrowRight, MapPin, Megaphone, Globe, Handshake, FileText, MessageSquare, Share2 } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';
import { ViewState } from '../App';
import { useSiteConfig } from '../lib/SiteContext';
import { useAuth } from './Auth/AuthProvider';
import { LogOut, User as UserIcon, Layout } from 'lucide-react';

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
    { label: 'CONVERTE Sim.', view: 'md-converte' as ViewState, icon: MessageSquare, desc: 'Atendimento + CRM', key: 'md-converte', color: "bg-cyan-600 text-white" },
    { label: 'Google Meu Negócio', view: 'gmb' as ViewState, icon: MapPin, desc: 'Local SEO', key: 'gmb', color: "bg-blue-600 text-white" },
    { label: 'Estratégias de Anúncios Pagos', view: 'ads' as ViewState, icon: Megaphone, desc: 'Meta & Google Ads', key: 'ads', color: "bg-slate-800 text-white" },
    { label: 'Social Media & Branding', view: 'social-media' as ViewState, icon: Share2, desc: 'Autoridade & Design', key: 'social_media', color: "bg-brand-orange text-white" },
    { label: 'Sites & Landing Pages', view: 'sites' as ViewState, icon: Globe, desc: 'Alta Conversão', key: 'sites', color: "bg-indigo-600 text-white" },
    { label: 'Consultoria de Vendas', view: 'consultancy' as ViewState, icon: Handshake, desc: 'Gestão Comercial', key: 'consultancy', color: "bg-emerald-600 text-white" },
  ].filter(s => config.content?.sections?.[s.key]?.is_active !== false);

  const tools = [
    { label: 'Blog & Artigos', view: 'blog' as ViewState, icon: FileText, desc: 'Conteúdo Educativo', active: config.is_blog_active, color: "bg-blue-100 text-brand-blue" },
    { label: 'Análise SWOT (Audit)', view: 'swot-service' as ViewState, icon: Target, desc: 'Auditoria Estratégica', active: config.is_swot_active && config.content?.sections?.['swot']?.is_active !== false, color: "bg-orange-100 text-brand-orange" },
    { label: 'Diagnóstico Marketing', view: 'marketing-diagnosis' as ViewState, icon: BarChart3, desc: 'Análise de Vendas', active: config.content?.sections?.['diagnosis']?.is_active !== false, color: "bg-green-100 text-green-600" },
    { label: 'Visual Showcase', view: 'design-showcase' as ViewState, icon: Layout, desc: 'Modelos de Layout', active: true, color: "bg-purple-100 text-purple-600" },
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
    ? 'text-[14px] font-black tracking-widest uppercase transition-all relative group text-brand-darkBlue hover:text-brand-orange'
    : isDarkPage
      ? 'text-[14px] font-black tracking-widest uppercase transition-all relative group text-white hover:text-brand-orange'
      : 'text-[14px] font-black tracking-widest uppercase transition-all relative group text-brand-darkBlue hover:text-brand-orange';

  const buttonVariant = 'primary';

  const buttonExtraClass = isHeaderWhite
    ? 'bg-brand-orange text-white hover:bg-brand-orangeHover border-none shadow-xl shadow-brand-orange/20 h-12'
    : (isDarkPage ? 'shadow-xl shadow-brand-orange/20 h-12 glass-button' : 'bg-brand-darkBlue text-white hover:bg-brand-navy shadow-lg shadow-brand-darkBlue/20 h-12');

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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 h-[100px] flex items-center ${headerBgClass}`}>
      <div className="max-w-[1400px] mx-auto w-full px-6 flex justify-between items-center">
        <a
          href="/"
          onClick={goHome}
          className="block transition-transform active:scale-95 p-1 transition-all duration-300"
          aria-label="Voltar para Início"
        >
          <Logo size={isScrolled ? 'sm' : 'md'} variant={isHeaderWhite || !isDarkPage ? 'dark' : 'light'} customHeight={config.logo_height_header} />
        </a>

        <nav className="hidden lg:flex items-center gap-12" role="navigation">
          <button onClick={goHome} className={navLinkClass}>
            Início
            <span className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-brand-orange`}></span>
          </button>

          <div className="relative group" ref={servicesRef}>
            <button
              ref={servicesButtonRef}
              className={`flex items-center gap-1.5 focus:outline-none rounded-lg px-2 py-2 ${navLinkClass} ${servicesMenuOpen ? 'text-brand-orange' : ''}`}
              onClick={() => toggleMenu('services')}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={() => handleMouseLeave('services')}
              aria-haspopup="true"
              aria-expanded={servicesMenuOpen}
            >
              Soluções <ChevronDown size={12} className={`transition-transform duration-300 ${servicesMenuOpen ? 'rotate-180 text-brand-orange' : ''}`} />
            </button>
            {servicesMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] animate-fade-in z-50"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={() => handleMouseLeave('services')}
              >
                <div className="bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 p-3 grid grid-cols-2 gap-2">
                  {services.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { onNavigate && onNavigate(s.view); setServicesMenuOpen(false); }}
                      className={`text-left p-4 rounded-2xl transition-all flex items-start gap-4 group/item focus:outline-none hover:bg-gray-50`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover/item:scale-110 ${s.color}`}>
                        <s.icon size={20} />
                      </div>
                      <div className="flex flex-col pt-1">
                        <span className="text-sm font-bold text-gray-900 group-hover/item:text-brand-blue transition-colors">{s.label}</span>
                        <span className="text-xs text-gray-500 font-medium">{s.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative group" ref={toolsRef}>
            <button
              ref={toolsButtonRef}
              className={`flex items-center gap-1.5 focus:outline-none rounded-lg px-2 py-2 ${navLinkClass} ${toolsMenuOpen ? 'text-brand-orange' : ''}`}
              onClick={() => toggleMenu('tools')}
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={() => handleMouseLeave('tools')}
              aria-haspopup="true"
              aria-expanded={toolsMenuOpen}
            >
              Inteligência <ChevronDown size={12} className={`transition-transform duration-300 ${toolsMenuOpen ? 'rotate-180 text-brand-orange' : ''}`} />
            </button>
            {toolsMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[400px] animate-fade-in z-50"
                onMouseEnter={() => handleMouseEnter('tools')}
                onMouseLeave={() => handleMouseLeave('tools')}
              >
                <div className="bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 p-3 flex flex-col gap-2">
                  {tools.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => { onNavigate && onNavigate(t.view); setToolsMenuOpen(false); }}
                      className={`text-left p-4 rounded-2xl transition-all flex items-center gap-4 group/item focus:outline-none hover:bg-gray-50`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover/item:scale-110 ${t.color}`}>
                        <t.icon size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 group-hover/item:text-brand-orange transition-colors">{t.label}</span>
                        <span className="text-xs text-gray-500 font-medium">{t.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => onNavigate && onNavigate('about')} className={navLinkClass}>
            Sobre Nós
            <span className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-brand-orange`}></span>
          </button>

          <div className="h-8 w-px bg-gray-200/50 mx-2"></div>

          <Button
            onClick={() => onNavigate && onNavigate('marketing-diagnosis')}
            variant={buttonVariant}
            className={`px-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-xl ${buttonExtraClass}`}
          >
            Diagnóstico Grátis
          </Button>

          {user ? (
            <div className="flex items-center gap-2 pl-2">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${isHeaderWhite ? 'text-gray-400' : (isDarkPage ? 'text-white/60' : 'text-gray-400')}`}>Olá,</p>
                  <p className={`text-sm font-bold leading-none ${isHeaderWhite ? 'text-brand-darkBlue' : (isDarkPage ? 'text-white' : 'text-brand-darkBlue')}`}>
                    {user?.user_metadata?.full_name?.split(' ')[0] ||
                      user?.user_metadata?.name?.split(' ')[0] ||
                      user?.email?.split('@')[0] ||
                      'Usuário'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 shadow-md">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-brand-blue flex items-center justify-center text-white">
                      <UserIcon size={18} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 border-l border-gray-200/50 ml-2 pl-2">
                <button
                  onClick={() => onNavigate && onNavigate('admin' as any)}
                  className={`p-2.5 rounded-xl transition-all flex items-center gap-2 group hover:bg-blue-50/50 ${isHeaderWhite ? 'text-gray-400' : (isDarkPage ? 'text-white/60' : 'text-gray-400')}`}
                  title="Painel Admin"
                >
                  <Layout size={18} className="group-hover:text-brand-blue" />
                  <span className={`text-[10px] font-black uppercase tracking-widest hidden xl:block group-hover:text-brand-blue`}>Admin</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className={`p-2.5 rounded-xl transition-all hover:bg-red-50 hover:text-red-500 ${isHeaderWhite ? 'text-gray-400' : (isDarkPage ? 'text-white/60' : 'text-gray-400')}`}
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => onNavigate && onNavigate('auth' as any)} className={`ml-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${isSolid || !isDarkPage ? 'border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-brand-orange' : 'border-white/20 text-white hover:bg-white/10'}`}>Entrar</button>
          )}
        </nav>

        <button
          className={`lg:hidden p-3 rounded-xl border transition-all duration-500 ${isSolid ? 'bg-gray-100 border-gray-200 text-gray-900' : (!isDarkPage ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-white/10 backdrop-blur-md border-white/20 text-white')}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[100px] bg-white z-[60] overflow-y-auto animate-fade-in flex flex-col pb-20">
          <div className="p-6 space-y-8 flex-grow">
            <button onClick={() => goHome()} className="w-full text-left font-black text-2xl text-brand-darkBlue flex justify-between items-center border-b border-gray-100 pb-4">
              Início <ArrowRight size={24} className="text-brand-orange" />
            </button>

            <div className="space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Soluções</p>
              <div className="grid grid-cols-1 gap-3">
                {services.map((s, i) => (
                  <button key={i} onClick={() => { onNavigate && onNavigate(s.view); setMobileMenuOpen(false); }} className="w-full text-left p-4 bg-gray-50 rounded-2xl flex items-center gap-4 active:scale-95 transition-transform border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${s.color}`}>
                      <s.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">{s.label}</p>
                      <p className="text-xs text-gray-500 font-medium">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Inteligência</p>
              <div className="grid grid-cols-1 gap-3">
                {tools.map((t, i) => (
                  <button key={i} onClick={() => { onNavigate && onNavigate(t.view); setMobileMenuOpen(false); }} className="w-full text-left p-4 bg-gray-50 rounded-2xl flex items-center gap-4 active:scale-95 transition-transform border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${t.color}`}>
                      <t.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">{t.label}</p>
                      <p className="text-xs text-gray-500 font-medium">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { onNavigate && onNavigate('about'); setMobileMenuOpen(false); }} className="w-full text-left font-black text-2xl text-brand-darkBlue py-4 border-t border-gray-100">Sobre Nós</button>
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
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><LogOut size={20} /></button>
              </div>
            ) : (
              <button onClick={() => { onNavigate && onNavigate('auth' as any); setMobileMenuOpen(false); }} className="w-full py-4 mb-3 text-gray-900 font-black uppercase tracking-widest text-xs border border-gray-200 bg-white rounded-2xl shadow-sm">Entrar na Conta</button>
            )}
            <Button onClick={() => { onNavigate && onNavigate('marketing-diagnosis'); setMobileMenuOpen(false); }} fullWidth className="py-5 text-sm shadow-xl bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest">Diagnóstico Grátis</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
