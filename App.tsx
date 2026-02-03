import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Checklist from './components/Checklist';
import Services from './components/Services';
import SwotSection from './components/SwotSection';
import SwotBriefing from './components/SwotBriefing';
import SwotPricing from './components/SwotPricing';
import Combos from './components/Combos';
import Testimonials from './components/Testimonials';
import Trust from './components/Trust';
import Faq from './components/Faq';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import FadeIn from './components/FadeIn';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import Briefing from './components/Briefing';
import GoogleBusinessProfile from './components/GoogleBusinessProfile';
import AdsServicePage from './components/AdsServicePage';
import SitesServicePage from './components/SitesServicePage';
import ConsultancyServicePage from './components/ConsultancyServicePage';
import SwotServicePage from './components/SwotServicePage';
import MarketingDiagnosisPage from './components/MarketingDiagnosisPage';
import AboutPage from './components/AboutPage';
import Pricing from './components/Pricing';
import MDConverteServicePage from './components/MDConverteServicePage';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { AuthPage } from './components/AuthPage';
import CommentPolicy from './components/CommentPolicy';

import CookieConsent from './components/CookieConsent';
import { SiteProvider, useSiteConfig } from './lib/SiteContext';
import { AdminPanel } from './components/Admin/AdminPanel';

import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';

export type ViewState = 'landing' | 'briefing' | 'terms' | 'privacy' | 'swot' | 'swot-pricing' | 'gmb' | 'ads' | 'sites' | 'consultancy' | 'swot-service' | 'marketing-diagnosis' | 'about' | 'auth' | 'blog' | 'admin' | 'blog-post' | 'comment-policy' | 'md-converte';

const VIEW_CONFIGS: Record<ViewState, { hash: string; title: string }> = {
  landing: { hash: '', title: '' },
  about: { hash: 'sobre', title: 'Sobre Nós' },
  gmb: { hash: 'google-meu-negocio', title: 'Google Meu Negócio' },
  ads: { hash: 'trafego-pago', title: 'Tráfego Pago' },
  sites: { hash: 'sites', title: 'Sites & Landing Pages' },
  consultancy: { hash: 'consultoria', title: 'Consultoria de Vendas' },
  'swot-service': { hash: 'auditoria', title: 'Auditoria Estratégica' },
  'marketing-diagnosis': { hash: 'diagnostico', title: 'Diagnóstico de Marketing' },
  briefing: { hash: 'questionario', title: 'Questionário' },
  'swot-pricing': { hash: 'planos-swot', title: 'Planos SWOT' },
  swot: { hash: 'swot', title: 'Análise SWOT' },
  terms: { hash: 'termos', title: 'Termos de Uso' },
  privacy: { hash: 'privacidade', title: 'Privacidade' },
  auth: { hash: 'acesso', title: 'Acesso' },
  blog: { hash: 'blog', title: 'Blog' },
  admin: { hash: 'admin', title: 'Painel Admin' },
  'blog-post': { hash: 'artigo', title: 'Artigo' },
  'comment-policy': { hash: 'regras-comunidade', title: 'Regras da Comunidade' },
  'md-converte': { hash: 'md-converte', title: 'MD Converte' }
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [viewParams, setViewParams] = useState<any>(null);
  const [selectedSwotPlan, setSelectedSwotPlan] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const { config } = useSiteConfig();

  const navigateTo = (view: ViewState, params: any = null) => {
    let targetView = view;

    // Se logado, pula as landing pages de serviço e vai direto para a ferramenta
    if (user) {
      if (view === 'marketing-diagnosis') targetView = 'briefing';
      if (view === 'swot-service') targetView = 'swot-pricing';
    }

    setCurrentView(targetView);
    setViewParams(params);
    window.scrollTo(0, 0);

    // Atualiza a hash para permitir navegação direta e persistência no refresh
    const config = VIEW_CONFIGS[targetView];
    if (targetView === 'blog-post' && params?.slug) {
      window.location.hash = `artigo/${params.slug}`;
    } else {
      window.location.hash = config.hash || '';
    }
  };

  // Monitora a Hash da URL para permitir acesso direto e persistência no refresh
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#', '');
      const [hash, slug] = fullHash.split('/');

      const entry = Object.entries(VIEW_CONFIGS).find(([_, v]) => v.hash === hash);

      if (entry) {
        const view = entry[0] as ViewState;
        setCurrentView(view);
        if (view === 'blog-post' && slug) {
          setViewParams({ slug });
        }
      } else if (!fullHash) {
        setCurrentView('landing');
      }
    };

    handleHashChange(); // Executa ao carregar
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // SEO: atualiza document.title de forma dinâmica
  useEffect(() => {
    const config = VIEW_CONFIGS[currentView];
    if (currentView === 'landing' || !config?.title) {
      document.title = 'MD Solution';
    } else {
      document.title = `MD Solution / ${config.title}`;
    }
  }, [currentView]);

  const handleSwotPlanSelection = (planId: string) => {
    setSelectedSwotPlan(planId);
    // Verifica se o usuário está logado
    if (!user && !loading) {
      navigateTo('auth');
    } else {
      navigateTo('swot');
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col w-full overflow-x-hidden">
      {currentView !== 'admin' && <Header currentView={currentView} onNavigate={navigateTo} />}

      <main id="main-content" role="main" aria-label="Conteúdo principal" className="flex-grow pt-24 lg:pt-32">
        {currentView === 'landing' && (
          <>
            <Hero
              onStartBriefing={() => navigateTo('marketing-diagnosis')}
              onStartSwot={() => navigateTo('swot-service')}
            />

            <FadeIn>
              <PainPoints />
            </FadeIn>

            <FadeIn>
              <Checklist />
            </FadeIn>

            <FadeIn>
              <Services onNavigate={navigateTo} />
            </FadeIn>

            {config.is_swot_active && (
              <FadeIn>
                <SwotSection
                  onNavigate={navigateTo}
                />
              </FadeIn>
            )}



            <FadeIn>
              <Combos />
            </FadeIn>

            <FadeIn>
              <Testimonials />
            </FadeIn>

            <FadeIn>
              <Trust />
            </FadeIn>

            <FadeIn>
              <Faq />
            </FadeIn>
          </>
        )}

        {currentView === 'about' && (
          <FadeIn>
            <AboutPage />
          </FadeIn>
        )}

        {currentView === 'gmb' && (
          <GoogleBusinessProfile />
        )}

        {currentView === 'ads' && (
          <AdsServicePage />
        )}

        {currentView === 'sites' && (
          <SitesServicePage />
        )}

        {currentView === 'consultancy' && (
          <ConsultancyServicePage />
        )}

        {currentView === 'swot-service' && (
          <SwotServicePage onSelectPlan={handleSwotPlanSelection} />
        )}

        {currentView === 'marketing-diagnosis' && (
          <MarketingDiagnosisPage onStart={() => navigateTo('briefing')} />
        )}

        {currentView === 'briefing' && (
          <Briefing />
        )}

        {currentView === 'swot-pricing' && (
          <SwotPricing onSelectPlan={handleSwotPlanSelection} />
        )}

        {currentView === 'auth' && (
          <AuthPage onSuccess={() => navigateTo('swot')} />
        )}

        {currentView === 'swot' && (
          <SwotBriefing selectedPlan={selectedSwotPlan} />
        )}

        {currentView === 'terms' && (
          <TermsOfUse />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicy />
        )}

        {currentView === 'admin' && (
          <AdminPanel onNavigate={navigateTo} />
        )}

        {currentView === 'blog' && (
          <BlogList onNavigate={navigateTo} />
        )}

        {currentView === 'blog-post' && (
          <BlogPostDetail slug={viewParams?.slug} onNavigate={navigateTo} />
        )}

        {currentView === 'comment-policy' && (
          <CommentPolicy onNavigate={navigateTo} />
        )}

        {currentView === 'md-converte' && (
          <MDConverteServicePage />
        )}
      </main>

      {currentView !== 'admin' && (
        <>
          <Footer onNavigate={navigateTo} currentView={currentView} />
          <WhatsAppWidget />
        </>
      )}
      <CookieConsent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteProvider>
        <AppContent />
      </SiteProvider>
    </AuthProvider>
  );
};

export default App;
