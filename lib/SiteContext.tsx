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
        is_swot_active: true
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
                    setConfig(data);
                }
            } catch (error) {
                console.error('Erro ao herdar configurações do Supabase:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <SiteContext.Provider value={{ config, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteConfig = () => useContext(SiteContext);
