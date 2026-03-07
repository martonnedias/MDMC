import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    keywords?: string;
    jsonLd?: any;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    ogImage = 'https://mdsolution.com.br/logo.png',
    ogType = 'website',
    keywords,
    jsonLd
}) => {
    const siteTitle = 'MD Solution Marketing & Consultoria';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDescription = 'Agência de marketing digital focada em resultados. Google Ads, Meta Ads, Sites, Google Meu Negócio e Consultoria de Vendas.';
    const finalDescription = description || defaultDescription;
    const url = canonical ? `https://mdsolution.com.br${canonical}` : 'https://mdsolution.com.br/';

    return (
        <Helmet>
            {/* Standard tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={ogImage} />
            {/* Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};
