import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './components/Auth/AuthProvider';
import { SiteProvider, useSiteConfig } from './lib/SiteContext';
import { HelmetProvider } from 'react-helmet-async';

// Layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout').then(m => ({ default: m.PublicLayout })));
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const ClientLayout = lazy(() => import('./layouts/ClientLayout').then(m => ({ default: m.ClientLayout })));

// Páginas Públicas
import { HomePage } from './pages/public/HomePage';
import CmsPageView from './pages/public/CmsPageView';
import PricingPage from './pages/public/PricingPage';
import ReportView from './pages/public/ReportView';
import ProposalView from './pages/public/ProposalView';
import ContractView from './pages/public/ContractView';
import AboutPage from './pages/public/AboutPage';
import BlogList from './pages/public/BlogList';
import BlogPostDetail from './pages/public/BlogPostDetail';
import NotFoundPage from './pages/public/NotFoundPage';
import ContactPage from './pages/public/ContactPage';
import { AuthPage } from './pages/public/AuthPage';
import UnderConstruction from './pages/public/UnderConstruction';

// Páginas de Serviços
import GoogleBusinessProfile from './pages/public/services/GoogleBusinessProfile';
import AdsServicePage from './pages/public/services/AdsServicePage';
import SitesServicePage from './pages/public/services/SitesServicePage';
import ConsultancyServicePage from './pages/public/services/ConsultancyServicePage';
import SwotServicePage from './pages/public/services/SwotServicePage';
import SocialMediaServicePage from './pages/public/services/SocialMediaServicePage';
import CRMServicePage from './pages/public/services/CRMServicePage';
import MDConverteServicePage from './pages/public/services/MDConverteServicePage';

// Tools & Funis
import MarketingDiagnosisPage from './pages/public/tools/MarketingDiagnosisPage';
import Briefing from './pages/public/tools/Briefing';
import SwotPricing from './pages/public/tools/SwotPricing';
import SwotBriefing from './pages/public/tools/SwotBriefing';
import DesignShowcase from './pages/public/tools/DesignShowcase';

// Legal
import TermsOfUse from './pages/public/legal/TermsOfUse';
import PrivacyPolicy from './pages/public/legal/PrivacyPolicy';
import CommentPolicy from './pages/public/legal/CommentPolicy';

// Componentes
import ErrorBoundary from './components/ErrorBoundary';

// Admin / App content bridge
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel').then(m => ({ default: m.AdminPanel })));
const ClientDashboard = lazy(() => import('./components/Client/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const ClientBilling = lazy(() => import('./components/Client/ClientBilling').then(m => ({ default: m.ClientBilling })));
const ClientReports = lazy(() => import('./components/Client/ClientReports').then(m => ({ default: m.ClientReports })));
const ClientDocuments = lazy(() => import('./components/Client/ClientDocuments').then(m => ({ default: m.ClientDocuments })));
const ClientApprovals = lazy(() => import('./components/Client/ClientApprovals').then(m => ({ default: m.ClientApprovals })));
const ClientSupport = lazy(() => import('./components/Client/ClientSupport').then(m => ({ default: m.ClientSupport })));
const ClientSettings = lazy(() => import('./components/Client/ClientSettings').then(m => ({ default: m.ClientSettings })));
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

import ScrollToTop from './components/ScrollToTop';

const AppRoutes: React.FC = () => {
  const { config } = useSiteConfig();

  const LoadingFallback = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-brand-blue rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">MD Solution</p>
    </div>
  );

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ROTAS PÚBLICAS (Dentro do PublicLayout) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<UnderConstruction />} />
            <Route path="/home-preview" element={<HomePage config={config} />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />

            {/* Serviços */}
            <Route path="/google-meu-negocio" element={<GoogleBusinessProfile />} />
            <Route path="/anuncios-pagos" element={<AdsServicePage />} />
            <Route path="/sites" element={<SitesServicePage />} />
            <Route path="/consultoria" element={<ConsultancyServicePage />} />
            <Route path="/swot-service" element={<SwotServicePage />} />
            <Route path="/social-media" element={<SocialMediaServicePage />} />
            <Route path="/crm" element={<CRMServicePage />} />
            <Route path="/md-converte" element={<MDConverteServicePage />} />

            {/* CMS Dinâmico (S1) */}
            <Route path="/pagina/:slug" element={<CmsPageView />} />
            <Route path="/servicos/:slug" element={<CmsPageView />} />

            {/* Funis / Conversão */}
            <Route path="/marketing-diagnosis" element={<MarketingDiagnosisPage />} />
            <Route path="/teste-gratuito" element={<MarketingDiagnosisPage />} />
            <Route path="/swot" element={<SwotBriefing selectedPlan={null} />} />
            <Route path="/planos" element={<PricingPage />} />
            <Route path="/planos-swot" element={<SwotPricing />} />
            <Route path="/r/:token" element={<ReportView />} />
            <Route path="/p/:token" element={<ProposalView />} />
            <Route path="/c/:token" element={<ContractView />} />

            {/* Conteúdo Blog/Legal */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/termos" element={<TermsOfUse />} />
            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/regras-comunidade" element={<CommentPolicy />} />
            <Route path="/showcase" element={<DesignShowcase />} />

            {/* Autenticação Global -> login para painel/admin */}
            <Route path="/acesso" element={<AuthPage />} />
          </Route>

          {/* ROTAS PROTEGIDAS (Simples com ProtectedRoute por enquanto) */}
          <Route element={<PublicLayout />}>
            <Route path="/questionario" element={
              <ProtectedRoute>
                <Briefing />
              </ProtectedRoute>
            } />
          </Route>

          {/* ROTAS DE ADMIN */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <ErrorBoundary fallbackTitle="Painel Admin indisponível">
                <AdminLayout />
              </ErrorBoundary>
            </ProtectedRoute>
          }>
            <Route index element={<AdminPanel />} />
          </Route>

          {/* ROTAS DE CLIENTE */}
          <Route path="/cliente" element={
            <ProtectedRoute>
              <ErrorBoundary fallbackTitle="Portal do Cliente indisponível">
                <ClientLayout />
              </ErrorBoundary>
            </ProtectedRoute>
          }>
            <Route index element={<ClientDashboard />} />
            <Route path="relatorios" element={<ClientReports />} />
            <Route path="aprovacoes" element={<ClientApprovals />} />
            <Route path="arquivos" element={<ClientDocuments />} />
            <Route path="financeiro" element={<ClientBilling />} />
            <Route path="suporte" element={<ClientSupport />} />
            <Route path="configuracoes" element={<ClientSettings />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SiteProvider>
          <AppRoutes />
        </SiteProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
