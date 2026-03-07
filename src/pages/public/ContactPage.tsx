import React, { useEffect } from 'react';
import Footer from '@/src/components/Footer';

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-32 pb-0 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 mb-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-brand-darkBlue mb-4">Fale com um Especialista</h1>
                    <p className="text-gray-600 text-lg">Nossa equipe está pronta para ajudar você a traçar a melhor estratégia de crescimento.</p>
                </div>
            </div>
            {/* The Footer already contains the contact form when currentView is "landing" */}
            <Footer currentView="landing" />
        </div>
    );
};

export default ContactPage;
