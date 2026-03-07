import React, { useState } from 'react';
import { ShieldCheck, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../Button';
import { leadService } from '../../services/leadService';
import { formatPhone } from '../../lib/formatters';

interface AboutContactProps {
    title?: string;
    subtitle?: string;
}

export const AboutContact: React.FC<AboutContactProps> = ({
    title,
    subtitle
}) => {
    const [formState, setFormState] = useState('idle');
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        interest: 'Consultoria Estratégica (Geral)'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        try {
            const success = await leadService.saveContactLead({
                name: formData.name,
                email: formData.email,
                phone: formData.whatsapp,
                interest: `Sobre Nós - Interesse: ${formData.interest}`,
                companySize: 'N/A'
            });
            if (success) {
                setFormState('success');
                setFormData({ name: '', whatsapp: '', email: '', interest: 'Consultoria Estratégica (Geral)' });
            } else {
                setFormState('error');
            }
        } catch (error) {
            console.error(error);
            setFormState('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'whatsapp') {
            formattedValue = formatPhone(value);
        }
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    return (
        <section id="contact" className="relative py-24 lg:py-40 bg-[#020617] dark:bg-[#0f172a] overflow-hidden">
            {/* Abstract background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[150px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="text-white space-y-10">
                        <div id="contact-tag" className="inline-block text-brand-blue border-b border-brand-blue pb-1 text-[10px] font-mono  tracking-[0.2em]">
                            SEGURANÇA DE DADOS_
                        </div>
                        <h2 id="contact-title" className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1] ">
                            {title || (
                                <>
                                    Sua empresa no <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400 italic font-medium">próximo nível</span> <br />
                                    com quem joga limpo.
                                </>
                            )}
                        </h2>
                        <p id="contact-subtitle" className="text-xl text-slate-400 leading-relaxed font-medium">
                            {subtitle || 'Agende sua conversa estratégica. Vamos analisar seu negócio sem filtros e com foco total em lucro.'}
                        </p>

                        <div className="flex flex-wrap gap-8 pt-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors bg-white/5"><Users size={20} /></div>
                                <div className="text-[10px] font-mono   text-slate-400">ATENDIMENTO<br /> EXCLUSIVO</div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors bg-white/5"><ShieldCheck size={20} /></div>
                                <div className="text-[10px] font-mono   text-slate-400">CONTRATOS<br /> TRANSPARENTES</div>
                            </div>
                        </div>
                    </div>

                    <div id="contact-form-container" className="bg-[#0a0a0a] border-2 border-border-main p-8 md:p-12 relative flex flex-col">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-brand-blue"></div>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-brand-blue"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-brand-blue"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-brand-blue"></div>

                        {formState === 'success' ? (
                            <div className="text-center py-10 animate-fade-in border border-brand-green/20 p-8 bg-white/5">
                                <div className="w-16 h-16 border-2 border-brand-green text-brand-green flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl  font-bold text-white   mb-4">SOLICITAÇÃO ENVIADA_</h3>
                                <p className="text-slate-400 font-mono text-xs  tracking-wider mb-8">Nossa equipe entrará em contato em breve através do seu WhatsApp.</p>
                                <Button onClick={() => setFormState('idle')} variant="outline" className="rounded-none border-border-main text-[10px] font-mono tracking-[0.2em] px-8">Nova Solicitação</Button>
                            </div>
                        ) : (
                            <form id="about-contact-form" onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
                                <div className="text-left mb-10 border-l-2 border-brand-blue pl-4">
                                    <h3 className="text-2xl  font-bold text-white   mb-2">SOLICITAR ATENDIMENTO</h3>
                                    <p className="text-slate-500 font-mono text-[10px]  ">Preencha os dados abaixo para iniciar o protocolo.</p>
                                </div>
                                <div className="space-y-4">
                                    <input type="text" name="name" placeholder="SEU NOME" value={formData.name} onChange={handleChange} required className="w-full h-14 px-4 bg-transparent border border-border-main outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-mono text-sm text-white placeholder-slate-600 rounded-none shadow-none" />
                                    <input type="tel" name="whatsapp" placeholder="WHATSAPP COM DDD" value={formData.whatsapp} onChange={handleChange} required className="w-full h-14 px-4 bg-transparent border border-border-main outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-mono text-sm text-white placeholder-slate-600 rounded-none shadow-none" />
                                    <input type="email" name="email" placeholder="E-MAIL CORPORATIVO" value={formData.email} onChange={handleChange} required className="w-full h-14 px-4 bg-transparent border border-border-main outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-mono text-sm text-white placeholder-slate-600 rounded-none shadow-none" />
                                    <div className="relative">
                                        <select name="interest" title="Área de Interesse" value={formData.interest} onChange={handleChange} required className="w-full h-14 px-4 bg-[#0a0a0a] border border-border-main outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors font-mono text-[11px] text-white  tracking-wider rounded-none shadow-none appearance-none">
                                            <option value="Consultoria Estratégica (Geral)">Consultoria Estratégica (Geral)</option>
                                            <option value="Estratégia de Tráfego Pago">Estratégia de Tráfego Pago</option>
                                            <option value="Desenvolvimento de Sites/LP">Desenvolvimento de Sites/LP</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <ArrowRight size={14} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full py-5 text-[11px] font-mono font-bold  tracking-[0.2em] bg-brand-blue text-white border-2 border-brand-blue hover:bg-transparent hover:text-brand-blue mt-8 rounded-none transition-all" disabled={formState === 'loading'}>
                                    {formState === 'loading' ? 'ENVIANDO...' : 'FALAR COM UM ESTRATEGISTA'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Garantia footer within contact section */}
            <div className="mt-40 border-t border-white/5 pt-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className="text-blue-400" />
                        <span className="text-[10px] font-bold  tracking-[0.3em] text-white">Garantia de Integridade</span>
                    </div>
                    <div className="flex gap-8 items-center grayscale">
                        <img src="https://img.shields.io/badge/SSL-Protected-blue" alt="SSL" className="h-4" loading="lazy" />
                        <img src="https://img.shields.io/badge/LGPD-Compliant-blue" alt="LGPD" className="h-4" loading="lazy" />
                        <img src="https://img.shields.io/badge/AWS-Infra-yellow" alt="AWS" className="h-4" loading="lazy" />
                    </div>
                </div>
                <div className="text-center mt-12 pb-10">
                    <p className="text-[10px] font-bold   text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
                        "Nós nunca recomendaremos uma estratégia que nós mesmos não usaríamos com o nosso próprio dinheiro."
                    </p>
                </div>
            </div>
        </section>
    );
};
