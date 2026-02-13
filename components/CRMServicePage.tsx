import React, { useState } from 'react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import { leadService } from '../services/leadService';
import { Users, Check, ArrowUpRight, Sparkles, ShieldCheck, Zap, Database, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import { useSiteConfig } from '../lib/SiteContext';
import { formatPhone } from '../lib/formatters';

const CRMServicePage: React.FC = () => {
    const { config } = useSiteConfig();
    const section = config.content?.sections?.crm;
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        email: '',
        companySize: ''
    });

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        try {
            const success = await leadService.saveContactLead({
                name: formData.name,
                email: formData.email,
                phone: formData.whatsapp,
                interest: `CRM Management - Empresa: ${formData.companySize}`,
                companySize: formData.companySize
            });
            if (success) {
                setFormState('success');
                setFormData({ name: '', whatsapp: '', email: '', companySize: '' });
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

    if (section?.is_active === false) return null;

    return (
        <div className="pt-0 pb-0">
            {/* Hero */}
            <section className="relative pt-44 lg:pt-60 pb-20 lg:pb-40 overflow-hidden bg-brand-darkBlue text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-blue/30 rounded-full blur-[120px]"></div>
                    <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-brand-orange/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-[1.2]">
                            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md text-brand-orange px-4 py-1.5 rounded-full mb-8 font-black text-[9px] uppercase tracking-[0.2em] border border-white/10">
                                <Users size={14} /> Inteligência de Relacionamento
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[0.95] tracking-tighter mb-12"
                                dangerouslySetInnerHTML={{
                                    __html: section?.title || 'Pare de <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400 italic pr-1">perder leads</span> por falta de organização.'
                                }}
                            />

                            <p className="text-xl lg:text-2xl text-blue-100/90 mb-12 leading-relaxed font-bold max-w-2xl border-l border-brand-orange/40 pl-8">
                                {section?.subtitle || 'Implementamos e gerimos seu CRM para garantir que cada oportunidade seja aproveitada e transformada em venda.'}
                            </p>

                            <Button onClick={scrollToContact} variant="primary" className="h-16 px-10 text-xs font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20">
                                Organizar Minhas Vendas
                            </Button>
                        </div>

                        <div className="flex-1 hidden lg:block">
                            <div className="relative group p-4 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-2xl rotate-3">
                                <div className="absolute -inset-1 bg-gradient-to-br from-brand-orange to-brand-blue opacity-20 blur-xl"></div>
                                <div className="relative rounded-[2.5rem] overflow-hidden aspect-square w-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
                                        alt="CRM Management"
                                        className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-1000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 lg:py-40 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <SectionTitle
                        badge="Gestão de leads"
                        title="Por que o CRM é o <span class='text-brand-blue italic'>cofre da sua empresa</span>"
                        subtitle="Gerar leads é apenas metade da batalha. A outra metade é o acompanhamento impecável."
                        alignment="center"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                        {[
                            { icon: Database, title: "Centralização Total", text: "Todos os seus contatos em um só lugar, com histórico completo de interação." },
                            { icon: Zap, title: "Automação de Follow-up", text: "Não deixe nenhum lead esfriar. Automatizamos o primeiro contato e lembretes." },
                            { icon: BarChart3, title: "Métricas Reais", text: "Saiba exatamente qual canal traz os melhores clientes e qual o seu ticket médio." }
                        ].map((b, i) => (
                            <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-500">
                                <div className="w-16 h-16 bg-white shadow-lg text-brand-blue rounded-3xl flex items-center justify-center mb-8">
                                    <b.icon size={32} />
                                </div>
                                <h4 className="text-xl font-heading font-black mb-4 text-brand-darkBlue uppercase tracking-tighter">{b.title}</h4>
                                <p className="text-slate-600 text-sm font-bold leading-relaxed">{b.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Form */}
            <section id="contact" className="py-24 lg:py-40 bg-brand-darkBlue relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* FORMULÁRIO À ESQUERDA */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-3xl relative overflow-hidden text-left border-[12px] border-white/5 order-2 lg:order-1">
                            {formState === 'success' ? (
                                <div className="text-center py-20 flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                                        <Check size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-brand-darkBlue mb-4">Acesso liberado!</h3>
                                    <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Nossa equipe analisará seu caso e entrará em contato em breve.</p>
                                    <Button onClick={() => setFormState('idle')} variant="outline-dark" className="text-xs font-black uppercase tracking-widest px-8">Nova solicitação</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <h3 className="text-3xl font-heading font-black text-brand-darkBlue mb-8 uppercase tracking-tighter text-center">Solicitar diagnóstico</h3>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Empresa / Responsável</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Identifique-se"
                                            required
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">WhatsApp comercial</label>
                                            <input
                                                type="tel"
                                                name="whatsapp"
                                                value={formData.whatsapp}
                                                onChange={handleChange}
                                                placeholder="(00) 00000-0000"
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">Tamanho do time</label>
                                            <select
                                                name="companySize"
                                                value={formData.companySize}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/10 transition-all text-slate-500 font-bold cursor-pointer appearance-none shadow-inner"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="Apenas eu">Apenas eu</option>
                                                <option value="2-5 pessoas">2-5 pessoas</option>
                                                <option value="Mais de 5">+5 pessoas</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-slate-400 ml-1">E-mail profissional</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="contato@empresa.com"
                                            required
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/50 transition-all text-slate-900 font-bold placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="pt-4 text-center">
                                        <Button
                                            type="submit"
                                            className="w-full h-20 text-lg font-black uppercase tracking-widest bg-brand-orange hover:bg-brand-orange/90 shadow-xl shadow-brand-orange/20 rounded-2xl"
                                            disabled={formState === 'loading'}
                                        >
                                            {formState === 'loading' ? 'Enviando...' : 'Receber diagnóstico agora'}
                                        </Button>
                                        <p className="text-center text-[10px] font-bold text-slate-300 mt-4 uppercase tracking-widest">
                                            *Análise gratuita de processos comerciais
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* INFORMAÇÕES À DIREITA */}
                        <div className="text-white text-left order-1 lg:order-2">
                            <SectionTitle
                                badge="Canal de atendimento direto"
                                title={<>Assuma o <span className="text-brand-orange italic">controle</span> das suas vendas.</>}
                                subtitle="Pare de depender de planilhas ou da memória do seu time. Implemente um processo de vendas profissional e previsível."
                                alignment="left"
                                light={true}
                            />

                            <div className="space-y-8 mt-12">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
                                        <Database size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-widest">Inteligência</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Implementação de RD Station / HubSpot</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-brand-blue border border-white/10 group-hover:scale-110 transition-transform">
                                        <Zap size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-widest">Performance</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Configuração de funis de venda</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CRMServicePage;
