import React, { useState } from 'react';
import { MessageSquare, Zap, BarChart3, ArrowRight, CheckCircle2, TrendingUp, MessageCircle, Share2, Copy, Check, Instagram, Facebook, Youtube, Linkedin, Send } from 'lucide-react';
import Button from './Button';
import { ViewState } from '../App';
import { useSiteConfig } from '../lib/SiteContext';

interface MDConverteSectionProps {
    onNavigate: (view: ViewState) => void;
}

const MDConverteSection: React.FC<MDConverteSectionProps> = ({ onNavigate }) => {
    const { config } = useSiteConfig();
    const section = config.content?.sections?.['md-converte'];
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    if (section?.is_active === false) return null;

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(section?.title || 'CONVERTE Sim.');
        let shareUrl = '';

        if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text}%20${url}`;
        if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

        if (shareUrl) window.open(shareUrl, '_blank');
        setShowShare(false);
    };

    const sectionStyle = {
        backgroundColor: section?.background_color,
        fontFamily: section?.font_family
    };

    const titleFontSize = section?.font_size_title || 'text-4xl md:text-5xl lg:text-6xl';
    const subtitleFontSize = section?.font_size_subtitle || 'text-xl';

    return (
        <section className="py-24 bg-top overflow-hidden" style={sectionStyle}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Visual Section */}
                    <div className="flex-1 relative order-2 lg:order-1">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#FF7A2F]/20 to-transparent rounded-[3rem] blur-2xl"></div>

                        <div className="relative bg-gradient-to-br from-[#0C3452] to-[#1a5a8a] rounded-[3rem] p-4 shadow-2xl overflow-hidden border border-white/10 group">
                            {(section?.image_url) ? (
                                <img src={section.image_url} alt={section.title} className="w-full h-[450px] object-cover rounded-[2rem]" />
                            ) : (
                                /* Dashboard Mockup Mimic as Fallback */
                                <div className="bg-slate-100 rounded-[2.5rem] p-4 border border-slate-200 shadow-2xl h-[450px] flex flex-col group-hover:scale-[1.02] transition-transform duration-700">
                                    <div className="bg-white rounded-[1.5rem] shadow-xl flex-1 flex flex-col overflow-hidden border border-slate-200/50">
                                        {/* Browser Header Unified */}
                                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center gap-4 shrink-0">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                                            </div>
                                            <div className="flex-1 max-w-[200px]">
                                                <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none block truncate">convertesim.online</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mockup Content */}
                                        <div className="p-6 flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                                            <img src="/convertesim_logo.png" alt="CONVERTE Sim." className="h-6 mb-6 object-contain self-start" />

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase">Leads Novos</span>
                                                    </div>
                                                    <div className="text-xl font-black text-brand-darkBlue tracking-tight">248</div>
                                                    <div className="text-[8px] text-emerald-500 font-bold mt-1">+12% vs ontem</div>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#FF7A2F]"></div>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase">Conversão</span>
                                                    </div>
                                                    <div className="text-xl font-black text-brand-darkBlue tracking-tight">18.4%</div>
                                                    <div className="text-[8px] text-emerald-500 font-bold mt-1">+2.4% vs ontem</div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex-1">
                                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                                                    <span className="text-[9px] font-black text-brand-darkBlue uppercase">Últimos Contatos</span>
                                                    <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { name: 'Ricardo Oliveira', time: '2m atrás', origin: 'Google' },
                                                        { name: 'Sofia Mendes', time: '15m atrás', origin: 'Meta' },
                                                        { name: 'Loja Tech S.A', time: '1h atrás', origin: 'Site' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between items-center opacity-80">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">{item.name[0]}</div>
                                                                <span className="text-[10px] font-bold text-slate-700">{item.name}</span>
                                                            </div>
                                                            <span className="text-[8px] text-slate-400 font-medium">{item.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Floating UI Elements */}
                            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 animate-float hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Novo Lead</p>
                                        <p className="text-sm font-bold text-gray-900 leading-none">WhatsApp</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-10 bg-[#FF7A2F] p-4 rounded-2xl shadow-2xl animate-pulse hidden md:block">
                                <TrendingUp className="text-white" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-8 order-1 lg:order-2 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#FF7A2F]/10 text-[#FF7A2F] px-4 py-2 rounded-full font-bold text-xs uppercase tracking-[0.2em] border border-[#FF7A2F]/20">
                            <Zap size={14} className="animate-pulse" /> Ecossistema CONVERTE Sim.
                        </div>

                        <h2 className={`${titleFontSize} font-heading font-black leading-[1.1] tracking-tighter`} style={{ color: section?.title_color || 'var(--color-title)' }}>
                            {section?.title || 'Organize seu atendimento e pare de perder leads.'}
                        </h2>

                        <p className={`${subtitleFontSize} text-subtitle leading-relaxed max-w-2xl mx-auto lg:mx-0`}>
                            {section?.subtitle || section?.description || 'Centralize WhatsApp, Instagram e Facebook em uma única tela. Organize seu funil de vendas com um CRM inteligente e automatize o que é repetitivo.'}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            {[
                                { title: 'Gestão Omnichannel', text: 'Todos os canais em um só lugar.' },
                                { title: 'CRM de Vendas', text: 'Saiba exatamente quem é cada lead.' },
                                { title: 'Automação Inteligente', text: 'Mensagens automáticas de follow-up.' },
                                { title: 'Relatórios Reais', text: 'Métricas de conversão e performance.' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <CheckCircle2 className="text-[#FF7A2F] shrink-0 mt-1 transition-transform group-hover:scale-125" size={20} />
                                    <div className="text-left">
                                        <h4 className="font-bold text-[#0C3452] text-sm md:text-base">{item.title}</h4>
                                        <p className="text-xs md:text-sm text-gray-500">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 justify-center lg:justify-start">
                            <Button
                                onClick={() => {
                                    if (section?.button_redirect) {
                                        onNavigate(section.button_redirect as ViewState);
                                    } else {
                                        onNavigate('md-converte');
                                    }
                                }}
                                variant="primary"
                                className="bg-[#FF7A2F] hover:bg-[#E65F00] px-10 py-5 text-lg shadow-xl shadow-[#FF7A2F]/20 border-none"
                                withIcon
                            >
                                {section?.button_text || 'Conhecer Plataforma'}
                            </Button>

                            <button
                                onClick={() => onNavigate('md-converte')}
                                className="group flex items-center gap-3 text-[#0C3452] font-black uppercase tracking-widest text-xs hover:text-[#FF7A2F] transition-colors"
                            >
                                Ver Demonstração <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                            </button>
                        </div>

                        {/* Social & Share Controls */}
                        <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-gray-100">
                            {(section?.show_social_icons !== false) && (
                                <div className="flex items-center gap-4">
                                    <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF7A2F] transition-colors"><Instagram size={18} /></a>
                                    <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF7A2F] transition-colors"><Facebook size={18} /></a>
                                    <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF7A2F] transition-colors"><Youtube size={18} /></a>
                                    {config.linkedin_url && <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF7A2F] transition-colors"><Linkedin size={18} /></a>}
                                </div>
                            )}

                            {(section?.show_share_menu !== false) && (
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShare(!showShare)}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                                        >
                                            <Share2 size={14} /> Compartilhar
                                        </button>
                                        {showShare && (
                                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[150px] z-50 animate-fade-in border border-gray-50">
                                                <button onClick={() => handleShare('whatsapp')} className="text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">WhatsApp</button>
                                                <button onClick={() => handleShare('facebook')} className="text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Facebook</button>
                                                <button onClick={() => handleShare('linkedin')} className="text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">LinkedIn</button>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleCopyLink}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        {copied ? 'Copiado!' : 'Copiar Link'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translate(50%, -50%) translateY(0); }
                    50% { transform: translate(50%, -50%) translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}} />
        </section>
    );
};

export default MDConverteSection;
