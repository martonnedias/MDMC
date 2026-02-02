import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { PAGE_TITLES } from './constants';
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
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { AuthPage } from './components/AuthPage';

import CookieConsent from './components/CookieConsent';
import { SiteProvider } from './lib/SiteContext';
import { AdminPanel } from './components/Admin/AdminPanel';

import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';

export type ViewState = 'landing' | 'briefing' | 'terms' | 'privacy' | 'swot' | 'swot-pricing' | 'gmb' | 'ads' | 'sites' | 'consultancy' | 'swot-service' | 'marketing-diagnosis' | 'about' | 'auth' | 'blog' | 'admin' | 'blog-post';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [viewParams, setViewParams] = useState<any>(null);
  const [selectedSwotPlan, setSelectedSwotPlan] = useState<string | null>(null);
  const { user, loading } = useAuth();

  const navigateTo = (view: ViewState, params: any = null) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo(0, 0);
    // Atualiza a hash para permitir navegação direta
    if (view === 'admin') window.location.hash = 'admin';
    else if (view === 'blog') window.location.hash = 'blog';
    else window.location.hash = '';
  };

  // Monitora a Hash da URL para permitir acesso direto (ex: /#admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') setCurrentView('admin');
      if (hash === 'blog') setCurrentView('blog');
    };

    handleHashChange(); // Executa ao carregar
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // SEO: atualiza document.title por página
  useEffect(() => {
    const title = PAGE_TITLES[currentView] || PAGE_TITLES.landing;
    document.title = title;
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

      <main id="main-content" role="main" aria-label="Conteúdo principal" className={`flex-grow ${currentView !== 'landing' ? 'pt-0' : ''}`}>
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

            <FadeIn>
              <SwotSection
                onNavigate={navigateTo}
              />
            </FadeIn>

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
