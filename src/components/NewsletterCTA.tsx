import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { leadService } from '../services/leadService';

const NewsletterCTA: React.FC = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNewsletterState('loading');
        const success = await leadService.saveNewsletterSubscriber(newsletterEmail);
        if (success) {
            setNewsletterState('success');
            setNewsletterEmail('');
            setTimeout(() => setNewsletterState('idle'), 5000);
        } else {
            setNewsletterState('error');
            alert('Ocorreu um erro ao assinar a newsletter. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="bg-brand-darkBlue/60 border-t border-white/5 backdrop-blur-sm pt-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-brand-blue/10 p-8 rounded-[2.5rem] border border-brand-blue/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h4 className="text-2xl lg:text-3xl font-black text-white mb-2 tracking-tight">Assine os Insights da MD</h4>
                        <p className="text-blue-100/80 font-bold text-sm lg:text-base">Dicas avançadas de marketing, vendas e gestão direto na sua caixa de entrada.</p>
                    </div>
                    <form className="flex w-full md:w-auto gap-3 relative z-10" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            className="flex-1 md:w-72 h-14 px-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-brand-gold backdrop-blur-sm transition-all"
                            disabled={newsletterState === 'loading' || newsletterState === 'success'}
                        />
                        <button
                            type="submit"
                            disabled={newsletterState === 'loading' || newsletterState === 'success'}
                            className="h-14 px-8 bg-brand-gold text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-brand-gold/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {newsletterState === 'loading' ? 'Enviando...' : newsletterState === 'success' ? 'Assinado!' : <><Star size={14} /> Assinar</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewsletterCTA;
