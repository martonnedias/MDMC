import React from 'react';
import { Save, ArrowLeft, Star, Trash2, Plus, Info, Layout, Tag, DollarSign, List } from 'lucide-react';
import { ServiceData } from '../../../services/adminService';
import Button from '../../Button';

interface ServiceEditFormProps {
    service: ServiceData;
    setService: (service: ServiceData) => void;
    onSave: (e: React.FormEvent) => void;
    onCancel: () => void;
    loading: boolean;
}

const ServiceEditForm: React.FC<ServiceEditFormProps> = ({
    service, setService, onSave, onCancel, loading
}) => {
    const inputStyles = "w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium";
    const labelStyles = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block";

    return (
        <form onSubmit={onSave} className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
            <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm sticky top-6 z-40">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            {service.id ? 'Refinar Pacote' : 'Novo Serviço Estratégico'}
                        </h1>
                        <p className="text-[10px] font-black uppercase text-brand-blue tracking-widest italic">{service.category || 'Configure a Categoria'}</p>
                    </div>
                </div>
                <Button type="submit" loading={loading} variant="primary" className="px-10 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-100">
                    <Save size={18} /> Salvar Alterações
                </Button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-5 mb-5 uppercase tracking-tighter">
                            <Info size={18} className="text-blue-500" /> Informações Base
                        </h3>

                        <div>
                            <label className={labelStyles}>Nome Comercial do Pacote</label>
                            <input
                                type="text"
                                value={service.name}
                                onChange={(e) => setService({ ...service, name: e.target.value })}
                                className={inputStyles}
                                placeholder="Ex: MD Ads Premium..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Categoria de Mercado</label>
                                <select
                                    value={service.category}
                                    onChange={(e) => setService({ ...service, category: e.target.value })}
                                    className={inputStyles}
                                >
                                    <option value="marketing">Gestão de Tráfego</option>
                                    <option value="social_media">Gestão de Redes Sociais</option>
                                    <option value="md-converte">CRM e Vendas</option>
                                    <option value="consultoria">Consultoria Maestro</option>
                                    <option value="swot">Diagnóstico SWOT</option>
                                    <option value="gmb">Google Business</option>
                                    <option value="sites">Expansão Digital (Sites)</option>
                                    <option value="combos">Combos Integrados</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelStyles}>Ordem de Destaque (Menor primeiro)</label>
                                <input
                                    type="number"
                                    value={service.display_order}
                                    onChange={(e) => setService({ ...service, display_order: parseInt(e.target.value) })}
                                    className={inputStyles}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-50 mb-6">
                            <div>
                                <label className={labelStyles}>Página de Exibição</label>
                                <select
                                    value={service.page || 'landing'}
                                    onChange={(e) => setService({ ...service, page: e.target.value })}
                                    className={inputStyles}
                                >
                                    <option value="landing">Home (Landing)</option>
                                    <option value="about">Quem Somos</option>
                                    <option value="swot">SWOT Diagnosis</option>
                                    <option value="ads">Anúncios Pagos</option>
                                    <option value="gmb">Google Business</option>
                                    <option value="sites">Sites e LPs</option>
                                    <option value="md-converte">CONVERTE Sim</option>
                                    <option value="consultancy">Consultoria Maestro</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelStyles}>Bloco / Seção Interna</label>
                                <select
                                    value={service.section_id || 'pricing'}
                                    onChange={(e) => setService({ ...service, section_id: e.target.value })}
                                    className={inputStyles}
                                >
                                    <option value="pricing">Tabela de Preços</option>
                                    <option value="pain-points">Pontos de Dor (Problemas)</option>
                                    <option value="benefits">Benefícios (Vantagens)</option>
                                    <option value="methodology">Metodologia (Pillars)</option>
                                    <option value="hero-stats">Stats do Hero</option>
                                    <option value="modules">Módulos de Entrega</option>
                                    <option value="cases">Cases de Sucesso</option>
                                    <option value="faq">FAQ (Dúvidas)</option>
                                    <option value="gallery">Galeria (Showcase)</option>
                                </select>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Valor / Investimento Mensal</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input
                                        type="text"
                                        value={service.price}
                                        onChange={(e) => setService({ ...service, price: e.target.value })}
                                        className={inputStyles + " pl-10 text-brand-blue font-black"}
                                        placeholder="R$ 997/mês"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelStyles}>Status de Visibilidade</label>
                                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer">
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{service.is_active ? 'Ativo no Site' : 'Pausado'}</span>
                                    <input
                                        type="checkbox"
                                        checked={service.is_active}
                                        onChange={(e) => setService({ ...service, is_active: e.target.checked })}
                                        className="w-8 h-4 accent-emerald-500 scale-110"
                                    />
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-5 mb-5 uppercase tracking-tighter">
                            <Layout size={18} className="text-orange-500" /> Gatilhos e Estilo
                        </h3>

                        <div>
                            <label className={labelStyles}>Subtítulo / Promo (Appears in lists)</label>
                            <input
                                type="text"
                                value={service.subtitle || ''}
                                onChange={(e) => setService({ ...service, subtitle: e.target.value })}
                                className={inputStyles}
                                placeholder="Escale sua base de clientes agora"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelStyles}>Texto do Botão (CTA)</label>
                                <input
                                    type="text"
                                    value={service.cta_text || ''}
                                    onChange={(e) => setService({ ...service, cta_text: e.target.value })}
                                    className={inputStyles}
                                    placeholder="Começar Agora"
                                />
                            </div>
                            <div>
                                <label className={labelStyles}>Badge Extra (Selo)</label>
                                <input
                                    type="text"
                                    value={service.badge_text || ''}
                                    onChange={(e) => setService({ ...service, badge_text: e.target.value })}
                                    className={inputStyles}
                                    placeholder="Mais Vendido"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-orange-50/30 rounded-3xl border border-orange-100">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${service.is_highlighted ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-300 border border-gray-100'}`}>
                                    <Star size={20} fill={service.is_highlighted ? 'currentColor' : 'none'} />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-gray-900 block uppercase tracking-tighter">Destacar Card</span>
                                    <span className="text-[10px] font-bold text-gray-500 italic">O card aparecerá flutuante ou com borda vibrante na vitrine.</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={service.is_highlighted || false}
                                    onChange={(e) => setService({ ...service, is_highlighted: e.target.checked })}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Features & Content */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 flex flex-col h-full min-h-[600px]">
                        <h3 className="font-black text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-5 mb-5 uppercase tracking-tighter">
                            <List size={18} className="text-teal-500" /> Entrega e Escopo
                        </h3>

                        <div className="flex-grow space-y-4 overflow-y-auto max-h-[800px] pr-4 custom-scrollbar">
                            <label className={labelStyles}>Itens do Escopo (Checklist)</label>
                            {service.features.map((feature, index) => (
                                <div key={index} className="flex gap-3 items-center group animate-fade-in">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all border border-gray-100 shrink-0">{index + 1}</div>
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...service.features];
                                            newFeatures[index] = e.target.value;
                                            setService({ ...service, features: newFeatures });
                                        }}
                                        className={inputStyles}
                                        placeholder="Ex: Gestão de Google Ads..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newFeatures = service.features.filter((_, i) => i !== index);
                                            setService({ ...service, features: newFeatures });
                                        }}
                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setService({ ...service, features: [...service.features, ''] })}
                                className="w-full py-5 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-black text-xs uppercase tracking-widest hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <Plus size={16} /> Incluir Novo Ítem de Entrega
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <label className={labelStyles}>Resumo Técnico Interno</label>
                        <textarea
                            value={service.description}
                            onChange={(e) => setService({ ...service, description: e.target.value })}
                            className={inputStyles + " h-32 resize-none"}
                            placeholder="Descreva o ROI e a entrega deste serviço..."
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ServiceEditForm;
