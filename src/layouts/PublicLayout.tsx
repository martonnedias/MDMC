import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrustSeals from '../components/TrustSeals';
import WhatsAppWidget from '../components/WhatsAppWidget';
import CookieConsent from '../components/CookieConsent';
import { SEO } from '../components/SEO';
import ErrorBoundary from '../components/ErrorBoundary';

export const PublicLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Compatibilidade com o formato antigo do Footer/Header:
    // "currentView" no antigo significava muito da ancora, agora passamos uma string simples
    const currentView = location.pathname === '/' ? 'landing' : 'page';

    const handleNavigate = (view: any, params?: any, options?: any) => {
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
            'marketing-diagnosis': '/marketing-diagnosis',
            'blog': '/blog',
            'design-showcase': '/showcase',
            'auth': '/acesso',
            'admin': '/admin',
            'dashboard': '/cliente',
            'pricing': '/planos',
            'swot-pricing': '/planos-swot',
        };

        const targetRoute = routeMap[view] || '/';
        navigate(targetRoute);

        if (!options?.skipScroll) {
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col w-full overflow-x-hidden">
            <Header currentView={currentView as any} onNavigate={handleNavigate as any} />

            <main id="main-content" role="main" aria-label="Conteúdo principal" className="flex-grow pt-0">
                <ErrorBoundary fallbackTitle="Algo deu errado">
                    <Outlet />
                </ErrorBoundary>
            </main>

            <TrustSeals />
            <Footer onNavigate={handleNavigate as any} currentView={currentView as any} />
            <WhatsAppWidget />
            <CookieConsent />
        </div>
    );
};
