import React from 'react';
import Hero from '../../../Hero';
import Services from '../../../Services';
import Combos from '../../../Combos';
import PainPoints from '../../../PainPoints';
import Checklist from '../../../Checklist';
import MDConverteSection from '../../../MDConverteSection';
import SwotSection from '../../../SwotSection';
import Testimonials from '../../../Testimonials';
import Trust from '../../../Trust';
import Faq from '../../../Faq';
import AboutPage from '../../../AboutPage';
import GoogleBusinessProfile from '../../../GoogleBusinessProfile';
import AdsServicePage from '../../../AdsServicePage';
import SitesServicePage from '../../../SitesServicePage';
import ConsultancyServicePage from '../../../ConsultancyServicePage';
import SwotServicePage from '../../../SwotServicePage';
import SocialMediaServicePage from '../../../SocialMediaServicePage';
import CRMServicePage from '../../../CRMServicePage';
import MDConverteServicePage from '../../../MDConverteServicePage';
import MarketingDiagnosisPage from '../../../MarketingDiagnosisPage';
import DesignShowcase from '../../../DesignShowcase';
import { AboutHero } from '../../../About/AboutHero';
import { StrategicPillars } from '../../../About/StrategicPillars';
import { TransparencyFoundation } from '../../../About/TransparencyFoundation';
import { Differentiation } from '../../../About/Differentiation';
import { AboutContact } from '../../../About/AboutContact';
import type { SectionBlock } from '../../../../stores/usePageBuilderStore';

interface SectionRendererProps {
    section: SectionBlock;
    isPreview?: boolean;
    onNavigate?: (view: any, params?: any, options?: any) => void;
}

/**
 * Shared component renderer that maps component_ids to real React components.
 * Used by both BuilderCanvas (SectionWrapper) and VisualBuilder Preview.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, isPreview = false, onNavigate = (view?: any, params?: any, options?: any) => { } }) => {
    // If we are in preview mode (real site) and the section is disabled, return null immediately.
    if (isPreview && section.is_active === false) {
        return null;
    }

    const wrapperStyle: React.CSSProperties = {
        background: section.styles.background_gradient || section.styles.background_color || 'transparent'
    };

    const renderWithStyles = (children: React.ReactNode) => (
        <>
            {section.styles.custom_css && (
                <style>{`#section-${section.id} { ${section.styles.custom_css} }`}</style>
            )}
            <div id={`section-${section.id}`} style={wrapperStyle}>
                {children}
            </div>
        </>
    );

    // Native Component Mapping
    if (section.component_id === 'hero-v1' || section.component_id === 'cta-banner') {
        return (
            <Hero
                onStartBriefing={() => { }}
                onStartSwot={() => { }}
                overrideConfig={section.content}
                overrideStyles={section.styles}
            />
        );
    }

    if (section.component_id === 'features-grid') {
        return (
            <Services
                onNavigate={() => { }}
                overrideConfig={section.content}
                overrideStyles={section.styles}
            />
        );
    }

    if (section.component_id === 'pricing-table') {
        return (
            <Combos
                overrideConfig={section.content}
                overrideStyles={section.styles}
            />
        );
    }

    if (section.component_id === 'pain-points') {
        return <PainPoints />;
    }

    if (section.component_id === 'checklist') {
        return <Checklist />;
    }

    if (section.component_id === 'md-converte') {
        return <MDConverteSection onNavigate={onNavigate} />;
    }

    if (section.component_id === 'swot-section') {
        return <SwotSection onNavigate={onNavigate} />;
    }

    if (section.component_id === 'testimonials') {
        return <Testimonials />;
    }

    if (section.component_id === 'trust-brands') {
        return <Trust />;
    }

    if (section.component_id === 'faq-accordion') {
        return <Faq />;
    }

    // --- Specialized About Sections ---
    if (section.component_id === 'about-hero-v1') {
        return (
            <AboutHero
                title_parts={section.content?.hero_title_parts}
                subtitle={section.content?.hero_subtitle}
                cta={section.content?.hero_cta}
                image_url={section.content?.hero_image}
                onCtaClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            />
        );
    }

    if (section.component_id === 'about-pillars-v1') {
        return (
            <StrategicPillars
                mission_text={section.content?.mission_text}
                vision_text={section.content?.vision_text}
                delivery_text={section.content?.delivery_text}
            />
        );
    }

    if (section.component_id === 'about-transparency-v1') {
        return (
            <TransparencyFoundation
                title={section.content?.transparency_title}
                subtitle={section.content?.transparency_subtitle}
            />
        );
    }

    if (section.component_id === 'about-differentiation-v1') {
        return (
            <Differentiation
                diff_text={section.content?.diff_text}
                onNavigate={onNavigate}
            />
        );
    }

    if (section.component_id === 'about-contact-v1') {
        return (
            <AboutContact
                title={section.content?.contact_title}
                subtitle={section.content?.contact_subtitle}
            />
        );
    }

    // Dedicated Pages as Native Blocks (Auto-conversion)
    // IMPORTANT: If they are native, they don't always have .html content.
    // Let's wrap them in a way that if a user clicks, we can at least detect the container.
    const wrapNative = (comp: React.ReactNode) => renderWithStyles(
        <div className="native-component-container relative min-h-[50px]">
            {comp}
        </div>
    );

    if (section.component_id === 'page-about') return wrapNative(<AboutPage onNavigate={onNavigate} overrideConfig={section.content} />);
    if (section.component_id === 'page-gmb') return wrapNative(<GoogleBusinessProfile overrideConfig={section.content} />);
    if (section.component_id === 'page-ads') return wrapNative(<AdsServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-sites') return wrapNative(<SitesServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-consultancy') return wrapNative(<ConsultancyServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-swot-service') return wrapNative(<SwotServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-social-media') return wrapNative(<SocialMediaServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-crm-service') return wrapNative(<CRMServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-md-converte') return wrapNative(<MDConverteServicePage overrideConfig={section.content} />);
    if (section.component_id === 'page-marketing-diagnosis') return wrapNative(<MarketingDiagnosisPage onStart={() => onNavigate && onNavigate('briefing')} overrideConfig={section.content} />);
    if (section.component_id === 'page-design-showcase') return wrapNative(<DesignShowcase overrideConfig={section.content} />);

    // HTML Content Fallback
    if (section.content?.html) {
        return renderWithStyles(
            <div
                className={`${section.styles.padding_y} ${section.styles.padding_x} ${section.styles.text_theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                dangerouslySetInnerHTML={{ __html: section.content.html || '' }}
            />
        );
    }

    // Generic content renderer (title + subtitle)
    if (section.content?.title || section.content?.subtitle) {
        return renderWithStyles(
            <div className={`${section.styles.padding_y} ${section.styles.padding_x}`}>
                <div className={`max-w-6xl mx-auto text-center ${section.styles.text_theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <h2 className="text-3xl font-bold mb-4 tracking-tight">{section.content.title}</h2>
                    {section.content.subtitle && (
                        <p className="text-lg opacity-70 max-w-2xl mx-auto">{section.content.subtitle}</p>
                    )}
                    {section.content.button_text && (
                        <button className={`mt-8 px-8 py-3 rounded-xl font-bold text-sm transition-all ${section.styles.text_theme === 'dark'
                            ? 'bg-white text-slate-900 hover:bg-gray-200'
                            : 'bg-brand-blue text-white hover:opacity-90'
                            }`}>
                            {section.content.button_text}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Empty placeholder
    if (!isPreview) {
        return (
            <div className="p-12 text-center text-gray-400">
                <p className="text-lg font-bold">{section.component_id}</p>
                <p className="text-xs mt-1 opacity-60">Componente sem visualização definida no Canvas</p>
            </div>
        );
    }

    return (
        <div className={`p-10 border-2 border-dashed border-gray-100 rounded bg-white ${section.styles.padding_y}`}>
            <h3 className="font-bold text-lg text-gray-400 ">{section.component_id}</h3>
            <p className="text-gray-400 text-xs">Section ID: {section.id}</p>
            <p className="text-red-400 text-xs mt-2">Nenhum fallback encontrado.</p>
        </div>
    );
};
