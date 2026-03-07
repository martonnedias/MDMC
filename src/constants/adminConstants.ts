import { SiteConfig, ServiceData } from '../services/adminService';
import { PLANS, SWOT_PLANS, SOCIAL_MEDIA_PLANS, MD_CONVERTE_PLANS, SITES_PLANS, CONTACT_INFO } from './index';

export const DEFAULT_SITE_CONFIG: Partial<SiteConfig> = {
    site_name: "MD Solution Marketing & Consultoria",
    phone: CONTACT_INFO.whatsappFormatted,
    whatsapp: CONTACT_INFO.whatsapp,
    instagram_url: CONTACT_INFO.instagram,
    facebook_url: CONTACT_INFO.facebook,
    youtube_url: CONTACT_INFO.youtube,
    primary_color: "#0052FF",
    secondary_color: "#D4AF37",
    slogan: "Estrategistas Digitais em Escala",
    logo_url: "/logo.png",
    logo_light_url: "/logo-light.png",
    is_blog_active: true,
    is_swot_active: true,
    theme: {
        colors: {
            background: "#FFFFFF",
            card_background: "#FFFFFF",
            header_background: "#FFFFFF",
            footer_background: "#0F172A",
            text_primary: "#111827",
            text_secondary: "#6B7280",
            brand_blue: "#0052FF",
            brand_gold: "#D4AF37"
        },
        border_radius: "2rem",
        typography: {
            font_family: "Inter",
            heading_font: "Poppins"
        }
    },
    content: {
        sections: {
            hero: { is_active: true, title: "Transformamos Cliques em Clientes Reais", subtitle: "Estratégias validadas para escalar seu negócio.", button_text: "Quero Escalar", button_redirect: "diagnosis" },
            services: { is_active: true, title: "Soluções de Impacto", subtitle: "O que entregamos de melhor." },
            swot: { is_active: true, title: "Auditoria Estratégica", subtitle: "Descubra onde você está perdendo dinheiro." },
            sites: { is_active: true, title: "Sites de Alta Conversão", subtitle: "Design que vende por você 24h." },
            ads: { is_active: true, title: "Tráfego Pago (Ads)", subtitle: "Atraia clientes qualificados todos os dias." },
            gmb: { is_active: true, title: "Dominância Local (GMB)", subtitle: "Seja encontrado primeiro no Google." },
            social_media: { is_active: true, title: "Social Media & Branding", subtitle: "Autoridade que converte seguidores em fãs." },
            md_converte: { is_active: true, title: "MD Converte (CRM)", subtitle: "Gestão comercial eficiente." },
            consultancy: { is_active: true, title: "Consultoria Comercial", subtitle: "Mentoria para sua equipe de vendas." },
            diagnosis: { is_active: true, title: "Diagnóstico Gratuito", subtitle: "Avaliação completa do seu momento digital." },
            footer: { is_active: true, title: "Vamos escalar seu negócio?", subtitle: "Fale com um estrategista agora." }
        }
    }
};

export const DEFAULT_SERVICES: ServiceData[] = [
    // Marketing Plans
    ...PLANS.map((p, i) => ({
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        price: p.price,
        features: p.features,
        category: 'marketing',
        is_active: true,
        display_order: i,
        cta_text: p.ctaText,
        badge_text: p.badge,
        is_highlighted: p.highlight
    })),
    // SWOT Plans
    ...SWOT_PLANS.map((p, i) => ({
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        price: p.price,
        features: p.features,
        category: 'swot',
        is_active: true,
        display_order: i,
        cta_text: p.cta,
        badge_text: p.badge,
        is_highlighted: p.highlight
    })),
    // Social Media
    ...SOCIAL_MEDIA_PLANS.map((p, i) => ({
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        price: p.price,
        features: p.features,
        category: 'social-media',
        is_active: true,
        display_order: i,
        cta_text: p.ctaText,
        badge_text: p.badge,
        is_highlighted: p.highlight
    })),
    // MD Converte
    ...MD_CONVERTE_PLANS.map((p, i) => ({
        name: p.name,
        subtitle: p.subtitle,
        description: '',
        price: p.price,
        features: p.features,
        category: 'md-converte',
        is_active: true,
        display_order: i,
        cta_text: p.ctaText,
        badge_text: p.badge,
        is_highlighted: p.highlight
    })),
    // Sites
    ...SITES_PLANS.map((p, i) => ({
        name: p.name,
        subtitle: p.description,
        description: '',
        price: p.price,
        features: p.features,
        category: 'sites',
        is_active: true,
        display_order: i,
        cta_text: 'Solicitar Orçamento',
        badge_text: p.badge,
        is_highlighted: p.highlight
    }))
];
