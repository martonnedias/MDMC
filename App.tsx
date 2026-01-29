
import React, { useState } from 'react';
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
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { AuthPage } from './components/AuthPage';

export type ViewState = 'landing' | 'briefing' | 'terms' | 'privacy' | 'swot' | 'swot-pricing' | 'gmb' | 'ads' | 'sites' | 'consultancy' | 'swot-service' | 'marketing-diagnosis' | 'about' | 'auth';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedSwotPlan, setSelectedSwotPlan] = useState<string | null>(null);
  const { user, loading } = useAuth();

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

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
      <Header currentView={currentView} onNavigate={navigateTo} />

      <main className={`flex-grow ${currentView !== 'landing' ? 'pt-12 lg:pt-16' : ''}`}>
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
          <FadeIn>
            <GoogleBusinessProfile />
          </FadeIn>
        )}

        {currentView === 'ads' && (
          <FadeIn>
            <AdsServicePage />
          </FadeIn>
        )}

        {currentView === 'sites' && (
          <FadeIn>
            <SitesServicePage />
          </FadeIn>
        )}

        {currentView === 'consultancy' && (
          <FadeIn>
            <ConsultancyServicePage />
          </FadeIn>
        )}

        {currentView === 'swot-service' && (
          <FadeIn>
            <SwotServicePage onSelectPlan={handleSwotPlanSelection} />
          </FadeIn>
        )}

        {currentView === 'marketing-diagnosis' && (
          <FadeIn>
            <MarketingDiagnosisPage onStart={() => navigateTo('briefing')} />
          </FadeIn>
        )}

        {currentView === 'briefing' && (
          <FadeIn>
            <Briefing />
          </FadeIn>
        )}

        {currentView === 'swot-pricing' && (
          <FadeIn>
            <SwotPricing onSelectPlan={handleSwotPlanSelection} />
          </FadeIn>
        )}

        {currentView === 'auth' && (
          <AuthPage onSuccess={() => navigateTo('swot')} />
        )}

        {currentView === 'swot' && (
          <FadeIn>
            <SwotBriefing selectedPlan={selectedSwotPlan} />
          </FadeIn>
        )}

        {currentView === 'terms' && (
          <FadeIn>
            <TermsOfUse />
          </FadeIn>
        )}

        {currentView === 'privacy' && (
          <FadeIn>
            <PrivacyPolicy />
          </FadeIn>
        )}
      </main>

      <Footer onNavigate={navigateTo} currentView={currentView} />
      <WhatsAppWidget />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
