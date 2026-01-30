
import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Button from './Button';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verifica se o consentimento já foi dado
        const consent = localStorage.getItem('cookie-consent-accepted');
        if (!consent) {
            // Pequeno delay para a animação de entrada se destacar
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent-accepted', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 animate-fade-in">
            <div className="container mx-auto max-w-5xl">
                <div className="bg-[#0A1931]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                    {/* Luz de fundo sutil */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-orange/20 transition-all duration-700"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                            <Cookie size={32} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-white font-bold text-lg leading-tight">Valorizamos sua privacidade</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                                Utilizamos cookies para melhorar sua experiência e analisar nosso tráfego. Ao clicar em "Aceitar", você concorda com nosso uso de cookies de acordo com nossa <button onClick={() => window.open('/privacy', '_blank')} className="text-brand-orange hover:underline font-bold">Política de Privacidade</button>.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-white text-sm font-bold py-3 px-6 transition-colors"
                        >
                            Recusar
                        </button>
                        <Button
                            onClick={handleAccept}
                            variant="primary"
                            className="py-4 px-8 text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-orange/20"
                        >
                            Aceitar Cookies
                        </Button>

                        {/* Close Button Mobile Only / Optional */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute -top-2 -right-2 p-2 text-gray-500 hover:text-white md:hidden"
                            aria-label="Fechar"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
