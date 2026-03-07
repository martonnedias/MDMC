import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService, CmsPage, ServiceData } from '@/src/services/adminService';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { SEO } from '@/src/components/SEO';

const CmsPageView: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState<CmsPage | null>(null);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            navigate('/');
            return;
        }

        const loadPage = async () => {
            setLoading(true);
            const pages = await adminService.getCmsPages();
            const found = pages.find(p => p.slug === slug && p.status === 'published' && p.is_active);

            if (found) {
                setPage(found);

                // If it is a service page, pull the associated dynamic services from DB
                if (found.page_type === 'service' && found.service_page_key) {
                    const allServices = await adminService.getServices();
                    const relatedServices = allServices.filter(s => s.page === found.service_page_key && s.is_active);
                    setServices(relatedServices.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
                }
            } else {
                navigate('/');
            }
            setLoading(false);
        };

        loadPage();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-page)] pt-32 pb-20 flex justify-center items-center">
                <div className="animate-pulse flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 bg-brand-blue rounded-full"></div>
                    <div className="w-4 h-4 bg-brand-gold rounded-full"></div>
                    <div className="w-4 h-4 bg-brand-blue rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!page) return null; // handled by navigate('/') above

    return (
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-32 pb-20">
            <SEO
                title={page.meta_title || page.title}
                description={page.meta_description}
                canonical={`/pagina/${page.slug}`}
                ogType="article"
            />
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <header className="mb-12 border-b border-[var(--bg-card)] pb-8">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{page.title}</h1>
                    <div className="w-20 h-1 bg-brand-gold rounded-full"></div>
                </header>

                <div
                    className="prose prose-lg dark:prose-invert prose-headings:font-black prose-a:text-brand-blue prose-img:rounded-3xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content_html }}
                />

                {/* Renderização condicional de Serviços caso page_type === 'service' e haja pacotes associados */}
                {page.page_type === 'service' && services.length > 0 && (
                    <div className="mt-24 space-y-12">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-[var(--text-primary)]">Conheça Nossos <span className="text-brand-gold">Pacotes</span></h2>
                            <p className="text-[var(--text-secondary)] text-lg">Soluções modulares para cada fase do seu crescimento digital.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <div key={service.id} className={`bg-white rounded-[2.5rem] p-8 border ${service.is_highlighted ? 'border-brand-gold shadow-[0_20px_40px_-15px_rgba(230,86,0,0.15)] ring-4 ring-brand-gold/10 transform -translate-y-2 relative' : 'border-gray-100 shadow-sm hover:border-brand-blue hover:shadow-lg transition-all duration-300'} flex flex-col h-full`}>
                                    {service.is_highlighted && (
                                        <div className="absolute top-0 right-10 -translate-y-1/2 bg-brand-gold text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                                            {service.badge_text || 'Premium'}
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{service.name}</h3>
                                    {service.subtitle && <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-4">{service.subtitle}</p>}
                                    <p className="text-gray-500 text-sm mb-6 flex-grow">{service.description}</p>

                                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                        <div className="text-3xl font-black text-brand-darkBlue tracking-tighter">{service.price}</div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {service.features.map((feature, i) => (
                                            <div key={i} className="flex gap-3 text-sm text-gray-700">
                                                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        to={`https://wa.me/556199999999?text=Olá,%20tenho%20interesse%20no%20pacote%20${encodeURIComponent(service.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`mt-auto w-full py-4 text-center rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${service.is_highlighted ? 'bg-brand-gold text-white hover:bg-[#B8860B]' : 'bg-gray-100 text-gray-900 hover:bg-brand-blue hover:text-white'}`}
                                    >
                                        {service.cta_text || 'Quero Este Pacote'} <ArrowRight size={16} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CmsPageView;
