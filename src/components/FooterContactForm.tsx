import React, { useState } from 'react';
import { MessageCircle, CheckCircle, ArrowRight, ShieldCheck, Sparkles, Globe, Wand2 } from 'lucide-react';
import { FOOTER_CTA, FORM_VALIDATION_MSGS } from '../constants';
import { leadService } from '../services/leadService';
import { formatPhone } from '../lib/formatters';
import Button from './Button';
import { useAuth } from './Auth/AuthProvider';

interface FooterContactFormProps {
    config: any;
    sectionConfig: any;
    titleStyle: any;
}

const FooterContactForm: React.FC<FooterContactFormProps> = ({ config, sectionConfig, titleStyle }) => {
    const { isAdmin } = useAuth();
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: '',
        companySize: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');

        try {
            const success = await leadService.saveContactLead(formData);
            if (success) {
                setFormState('success');
                setFormData({ name: '', email: '', phone: '', interest: '', companySize: '' });
            } else {
                setFormState('error');
                alert(FORM_VALIDATION_MSGS.sendError);
            }
        } catch (error) {
            console.error(error);
            setFormState('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'phone') {
            formattedValue = formatPhone(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const inputStyles = "w-full h-14 px-5 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300 text-base placeholder:text-gray-600 font-bold text-gray-900 shadow-sm hover:bg-white";
    const selectStyles = "w-full h-14 px-5 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300 text-base text-gray-800 font-black shadow-sm cursor-pointer appearance-none hover:bg-white";

    return (
        <div className="pt-20 lg:pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[3rem] p-[1px] bg-gradient-to-br from-white/20 to-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">
                    <div className="bg-brand-navy/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden relative">

                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[128px] -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

                        <div className="text-left space-y-10 relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full mb-8 font-black text-xs uppercase tracking-[0.2em] border border-brand-gold/20 shadow-lg shadow-brand-gold/5">
                                    <Sparkles size={14} className="animate-pulse" /> Atendimento Premium
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-8 text-white leading-[0.95] tracking-tight" style={titleStyle}>
                                    {sectionConfig?.title || FOOTER_CTA.title}
                                </h2>
                                <p className="text-blue-100/95 text-lg md:text-xl leading-relaxed max-w-xl font-bold">
                                    {sectionConfig?.subtitle || sectionConfig?.description || FOOTER_CTA.text}
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-all -ml-4 border border-transparent hover:border-white/5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-2xl flex items-center justify-center text-brand-darkBlue shadow-lg shadow-brand-gold/20 group-hover:scale-110 transition-transform duration-300">
                                        <MessageCircle size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200/90 font-black uppercase tracking-[0.2em] mb-1">WhatsApp direto</p>
                                        <button
                                            onClick={() => window.open(`https://wa.me/${config.whatsapp}`, '_blank')}
                                            className="font-black text-white text-3xl tracking-tight hover:text-brand-gold transition-colors"
                                        >
                                            {config.phone}
                                        </button>
                                        <p className="text-white font-black text-lg mt-1">{config.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group p-4 -ml-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-brand-blue shadow-lg group-hover:bg-brand-blue/20 group-hover:text-white transition-all duration-300">
                                        <Globe size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200/90 font-black uppercase tracking-[0.2em] mb-1">Abrangência</p>
                                        <p className="font-bold text-white text-xl tracking-tight">Atendimento Nacional Digital</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 flex items-center gap-6 border-t border-white/10">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-navy bg-slate-200 overflow-hidden relative shadow-lg">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Consultor" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Consultores Online</p>
                                    <p className="text-xs text-blue-200/80 font-bold">Tempo médio de resposta: <span className="text-brand-green">5 min</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-gray-900 shadow-2xl relative overflow-hidden group border border-white/50">
                            {formState === 'success' ? (
                                <div className="text-center animate-fade-in py-16 flex flex-col items-center justify-center min-h-[460px]">
                                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-xl shadow-green-500/10 animate-bounce">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h3 className="text-3xl font-heading font-black text-gray-900 mb-4 tracking-tight">Recebemos sua solicitação!</h3>
                                    <p className="text-gray-700 mb-10 leading-relaxed max-w-xs mx-auto text-lg font-bold">
                                        Um de nossos especialistas analisará seu perfil e entrará em contato.
                                    </p>
                                    <button
                                        onClick={() => setFormState('idle')}
                                        className="text-brand-blue font-black text-xs uppercase tracking-widest hover:text-brand-darkBlue transition-colors flex items-center gap-2 border-b-2 border-transparent hover:border-brand-blue py-1"
                                    >
                                        Nova Solicitação <ArrowRight size={14} />
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                                    <div className="mb-8">
                                        <span className="inline-block w-12 h-1 bg-brand-gold rounded-full mb-4"></span>
                                        <div className="flex flex-col items-start gap-4 mb-4">
                                            <h3 className="text-3xl font-heading font-black text-brand-darkBlue tracking-tight">Vamos escalar seu negócio?</h3>
                                            {isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({
                                                            name: 'Empresa Teste Geral',
                                                            email: 'admin@geral.com',
                                                            phone: '(11) 99999-9999',
                                                            interest: 'Sites & Landing Pages',
                                                            companySize: '1-10 Funcionários'
                                                        });
                                                    }}
                                                    className="flex items-center gap-2 bg-brand-darkBlue text-white px-4 py-2 rounded-full font-bold text-[9px] hover:bg-brand-darkBlue/90 transition-all uppercase tracking-widest shadow-lg shadow-brand-darkBlue/20"
                                                >
                                                    <Wand2 size={12} /> Auto-Preencher
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-700 font-bold">Preencha para receber um diagnóstico inicial.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Nome</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }}
                                                onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }}
                                                placeholder="Seu Nome"
                                                className={inputStyles}
                                                required
                                                title={FORM_VALIDATION_MSGS.required}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">WhatsApp</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }}
                                                onInvalid={e => { (e.target as HTMLInputElement).setCustomValidity(FORM_VALIDATION_MSGS.required); }}
                                                placeholder="(00) 00000-0000"
                                                className={inputStyles}
                                                required
                                                title={FORM_VALIDATION_MSGS.required}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">E-mail Profissional</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => { handleChange(e); (e.target as HTMLInputElement).setCustomValidity(''); }}
                                            onInvalid={e => { const el = e.target as HTMLInputElement; el.setCustomValidity(el.validity.typeMismatch ? FORM_VALIDATION_MSGS.email : FORM_VALIDATION_MSGS.required); }}
                                            placeholder="seu@empresa.com.br"
                                            className={inputStyles}
                                            required
                                            title={FORM_VALIDATION_MSGS.email}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Interesse Principal</label>
                                            <select
                                                name="interest"
                                                value={formData.interest}
                                                onChange={(e) => { handleChange(e); (e.target as HTMLSelectElement).setCustomValidity(''); }}
                                                onInvalid={e => { (e.target as HTMLSelectElement).setCustomValidity(FORM_VALIDATION_MSGS.select); }}
                                                className={selectStyles}
                                                required
                                                title={FORM_VALIDATION_MSGS.select}
                                            >
                                                <option value="" disabled>Selecione...</option>
                                                <option value="Google Meu Negócio">Google Meu Negócio</option>
                                                <option value="Estratégias de Anúncios Pagos">Estratégias de Anúncios Pagos</option>
                                                <option value="Site/Landing Page">Site/Landing Page</option>
                                                <option value="Consultoria">Consultoria de Vendas</option>
                                                <option value="CONVERTE Sim.">CONVERTE Sim. (CRM)</option>
                                                <option value="SWOT">Análise SWOT</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">Tamanho da Equipe</label>
                                            <select
                                                name="companySize"
                                                value={formData.companySize}
                                                onChange={(e) => { handleChange(e); (e.target as HTMLSelectElement).setCustomValidity(''); }}
                                                onInvalid={e => { (e.target as HTMLSelectElement).setCustomValidity(FORM_VALIDATION_MSGS.select); }}
                                                className={selectStyles}
                                                required
                                                title={FORM_VALIDATION_MSGS.select}
                                            >
                                                <option value="" disabled>Selecione...</option>
                                                <option value="Só eu">Só eu (1)</option>
                                                <option value="2-5">2 a 5 pessoas</option>
                                                <option value="6-10">6 a 10 pessoas</option>
                                                <option value="11+">Mais de 11 pessoas</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button
                                            fullWidth
                                            variant="primary"
                                            loading={formState === 'loading'}
                                            className="py-6 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50 bg-brand-gold hover:bg-yellow-500 text-brand-darkBlue border-none"
                                            withIcon
                                        >
                                            Agendar Diagnóstico
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <ShieldCheck size={14} className="text-brand-green" />
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest"> 100% Seguro & Livre de Spam</p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterContactForm;
