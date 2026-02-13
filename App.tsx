import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Checklist from './components/Checklist';
import Services from './components/Services';
import SwotSection from './components/SwotSection';
import MDConverteSection from './components/MDConverteSection';
import SwotBriefing from './components/SwotBriefing';
import SwotPricing from './components/SwotPricing';
import Combos from './components/Combos';
import Testimonials from './components/Testimonials';
import Trust from './components/Trust';
import TrustSeals from './components/TrustSeals';
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
import SocialMediaServicePage from './components/SocialMediaServicePage';
import CRMServicePage from './components/CRMServicePage';
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
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';
import DesignShowcase from './components/DesignShowcase';

export type ViewState = 'landing' | 'briefing' | 'terms' | 'privacy' | 'swot' | 'swot-pricing' | 'gmb' | 'ads' | 'sites' | 'consultancy' | 'swot-service' | 'social-media' | 'marketing-diagnosis' | 'about' | 'auth' | 'blog' | 'admin' | 'blog-post' | 'comment-policy' | 'md-converte' | 'design-showcase' | 'crm-service';

const VIEW_CONFIGS: Record<ViewState, { hash: string; title: string }> = {
  landing: { hash: '', title: '' },
  about: { hash: 'sobre', title: 'Sobre Nós' },
  gmb: { hash: 'google-meu-negocio', title: 'Google Meu Negócio' },
  ads: { hash: 'anuncios-pagos', title: 'Estratégias de Anúncios Pagos' },
  sites: { hash: 'sites', title: 'Sites & Landing Pages' },
  consultancy: { hash: 'consultoria', title: 'Consultoria de Vendas' },
  'swot-service': { hash: 'auditoria', title: 'Auditoria Estratégica' },
  'social-media': { hash: 'social-media', title: 'Social Media & Branding' },
  'marketing-diagnosis': { hash: 'diagnostico', title: 'Diagnóstico de Marketing' },
  'crm-service': { hash: 'crm', title: 'Gestão de CRM' },
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
  'md-converte': { hash: 'md-converte', title: 'CONVERTE Sim.' },
  'design-showcase': { hash: 'showcase', title: 'Showcase de Design' }
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [viewParams, setViewParams] = useState<any>(null);
  const [selectedSwotPlan, setSelectedSwotPlan] = useState<string | null>(null);
  const [returnTo, setReturnTo] = useState<ViewState | null>(null);
  const { user, loading } = useAuth();
  const { config } = useSiteConfig();

  const navigateTo = (view: ViewState, params: any = null, options: { skipScroll?: boolean } = {}) => {
    let targetView = view;

    // Salva para onde voltar se estiver indo para auth e estiver em uma área restrita
    if (view === 'auth') {
      if (currentView === 'admin' || currentView === 'swot') {
        setReturnTo(currentView);
      }
    }

    // Removal of auto-redirect logic to allow viewing landing pages even when logged in
    // if (user) {
    //   if (view === 'marketing-diagnosis') targetView = 'briefing';
    //   if (view === 'swot-service') targetView = 'swot-pricing';
    // }

    setCurrentView(targetView);
    setViewParams(params);

    if (!options.skipScroll) {
      window.scrollTo(0, 0);
    }

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

        // Verificação de ativação da seção
        const sectionMapping: Record<string, string> = {
          'gmb': 'gmb',
          'ads': 'ads',
          'sites': 'sites',
          'consultancy': 'consultancy',
          'swot-service': 'swot',
          'social-media': 'social_media',
          'marketing-diagnosis': 'diagnosis',
          'md-converte': 'md-converte',
          'about': 'about'
        };

        const sectionKey = sectionMapping[view];
        if (sectionKey && config.content?.sections?.[sectionKey]?.is_active === false) {
          setCurrentView('landing');
          window.location.hash = '';
          return;
        }

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
  }, [config]); // Adicionado config como dependência

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

      <main id="main-content" role="main" aria-label="Conteúdo principal" className="flex-grow pt-0">
        {currentView === 'landing' && (
          <>
            <Hero
              onStartBriefing={() => navigateTo('marketing-diagnosis')}
              onStartSwot={() => navigateTo('swot-service')}
              onNavigate={navigateTo}
            />

            {config.content?.sections?.['pain_points']?.is_active !== false && (
              <FadeIn>
                <PainPoints />
              </FadeIn>
            )}

            {config.content?.sections?.['checklist']?.is_active !== false && (
              <FadeIn>
                <Checklist />
              </FadeIn>
            )}

            {config.content?.sections?.['md_converte']?.is_active !== false && (
              <FadeIn>
                <MDConverteSection onNavigate={navigateTo} />
              </FadeIn>
            )}

            {config.content?.sections?.['services']?.is_active !== false && (
              <FadeIn>
                <Services onNavigate={navigateTo} />
              </FadeIn>
            )}

            {(config.is_swot_active || config.content?.sections?.['swot']?.is_active !== false) && (
              <FadeIn>
                <SwotSection
                  onNavigate={navigateTo}
                />
              </FadeIn>
            )}

            {config.content?.sections?.['combos']?.is_active !== false && (
              <FadeIn>
                <Combos />
              </FadeIn>
            )}

            {config.content?.sections?.['testimonials']?.is_active !== false && (
              <FadeIn>
                <Testimonials />
              </FadeIn>
            )}

            {config.content?.sections?.['trust']?.is_active !== false && (
              <FadeIn>
                <Trust />
              </FadeIn>
            )}

            {config.content?.sections?.['faq']?.is_active !== false && (
              <FadeIn>
                <Faq />
              </FadeIn>
            )}
          </>
        )}

        {currentView === 'about' && (
          <FadeIn>
            <AboutPage onNavigate={navigateTo} />
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
          <SwotServicePage />
        )}

        {currentView === 'social-media' && (
          <SocialMediaServicePage />
        )}

        {currentView === 'crm-service' && (
          <CRMServicePage />
        )}

        {currentView === 'marketing-diagnosis' && (
          <MarketingDiagnosisPage onStart={() => navigateTo('briefing', null, { skipScroll: true })} />
        )}

        {currentView === 'briefing' && (
          <ProtectedRoute onNavigate={navigateTo}>
            <Briefing />
          </ProtectedRoute>
        )}

        {currentView === 'swot-pricing' && (
          <SwotPricing onSelectPlan={handleSwotPlanSelection} />
        )}

        {currentView === 'auth' && (
          <AuthPage onSuccess={() => {
            const nextView = returnTo || 'swot';
            setReturnTo(null);
            navigateTo(nextView);
          }} />
        )}

        {currentView === 'swot' && (
          <ProtectedRoute onNavigate={navigateTo}>
            <SwotBriefing selectedPlan={selectedSwotPlan} />
          </ProtectedRoute>
        )}

        {currentView === 'terms' && (
          <TermsOfUse />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicy />
        )}

        {currentView === 'admin' && (
          <ProtectedRoute onNavigate={navigateTo} adminOnly>
            <AdminPanel onNavigate={navigateTo} />
          </ProtectedRoute>
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

        {currentView === 'design-showcase' && (
          <DesignShowcase />
        )}
      </main>

      {currentView !== 'admin' && (
        <>
          <TrustSeals />
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
