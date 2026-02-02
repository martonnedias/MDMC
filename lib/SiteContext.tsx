import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService, SiteConfig } from '../services/adminService';
import { CONTACT_INFO } from '../constants';

interface SiteContextType {
    config: SiteConfig;
    loading: boolean;
}

const defaultContext: SiteContextType = {
    config: {
        id: 1,
        site_name: 'MD Solution',
        phone: CONTACT_INFO.whatsappFormatted,
        whatsapp: CONTACT_INFO.whatsapp,
        instagram_url: CONTACT_INFO.instagram,
        facebook_url: CONTACT_INFO.facebook,
        youtube_url: CONTACT_INFO.youtube,
        primary_color: '#0052FF',
        secondary_color: '#FF6B00',
        is_blog_active: true,
        is_swot_active: true,
        theme: {
            colors: {
                background: '#ffffff',
                card_background: '#f9fafb',
                header_background: '#ffffff',
                footer_background: '#112240',
                text_primary: '#111827',
                text_secondary: '#6b7280'
            },
            typography: {
                font_family: 'Inter',
                heading_font: 'Poppins'
            }
        }
    },
    loading: true
};

const SiteContext = createContext<SiteContextType>(defaultContext);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SiteConfig>(defaultContext.config);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await adminService.getSiteConfig();
                if (data) {
                    // Merge inteligente para garantir que o tema exista
                    const mergedTheme = {
                        colors: {
                            ...defaultContext.config.theme!.colors,
                            ...(data.theme?.colors || {})
                        },
                        typography: {
                            ...defaultContext.config.theme!.typography,
                            ...(data.theme?.typography || {})
                        },
                        border_radius: data.theme?.border_radius || defaultContext.config.theme?.border_radius
                    };

                    setConfig({
                        ...data,
                        theme: mergedTheme as any
                    });
                }
            } catch (error) {
                console.error('Erro ao herdar configurações do Supabase:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    // Aplica as cores e temas ao CSS
    useEffect(() => {
        if (config) {
            const root = document.documentElement;

            // Cores Principais
            root.style.setProperty('--color-brand-blue', config.primary_color);
            root.style.setProperty('--color-brand-orange', config.secondary_color);

            // Tema Personalizado
            if (config.theme?.colors) {
                root.style.setProperty('--bg-page', config.theme.colors.background || '#ffffff');
                root.style.setProperty('--bg-card', config.theme.colors.card_background || '#f9fafb');
                root.style.setProperty('--bg-header', config.theme.colors.header_background || '#ffffff');
                root.style.setProperty('--bg-footer', config.theme.colors.footer_background || '#112240');
                root.style.setProperty('--text-primary', config.theme.colors.text_primary || '#111827');
                root.style.setProperty('--text-secondary', config.theme.colors.text_secondary || '#6b7280');
            }

            // Tipografia (se necessário carregar fontes externas, seria aqui ou no HTML)
            if (config.theme?.typography) {
                const fontFamily = config.theme.typography.font_family || 'Inter';
                const headingFont = config.theme.typography.heading_font || 'Poppins';

                root.style.setProperty('--font-sans', fontFamily);
                root.style.setProperty('--font-heading', headingFont);

                // Carregar fonte dinamicamente do Google Fonts se não for padrão
                if (fontFamily !== 'Inter' || headingFont !== 'Poppins') {
                    const linkId = 'dynamic-fonts';
                    let link = document.getElementById(linkId) as HTMLLinkElement;

                    if (!link) {
                        link = document.createElement('link');
                        link.id = linkId;
                        link.rel = 'stylesheet';
                        document.head.appendChild(link);
                    }

                    const fonts = [fontFamily, headingFont].filter(f => !['Inter', 'Poppins', 'sans-serif'].includes(f));
                    if (fonts.length > 0) {
                        const query = fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&');
                        link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
                    }
                }
            }

            if (config.theme?.border_radius) {
                root.style.setProperty('--border-radius-card', config.theme.border_radius);
            }
        }
    }, [config]);

    return (
        <SiteContext.Provider value={{ config, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteConfig = () => useContext(SiteContext);
