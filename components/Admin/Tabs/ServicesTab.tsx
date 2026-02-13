import React, { useState } from 'react';
import { Package, Plus, Search, RotateCcw, Edit2, Trash2, CheckCircle, ArrowRight, Star, Tag } from 'lucide-react';
import { ServiceData } from '../../../services/adminService';
import Button from '../../Button';

interface ServicesTabProps {
    services: ServiceData[];
    onEdit: (service: ServiceData) => void;
    onDelete: (id: string) => void;
    onSync: () => void;
    onNew: () => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, onEdit, onDelete, onSync, onNew }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [pageFilter, setPageFilter] = useState<string>('all');

    const getSortedServices = (list: ServiceData[]) => {
        return [...list].sort((a, b) => a.display_order - b.display_order);
    };

    const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];
    const pages = Array.from(new Set(services.filter(s => s.page).map(s => s.page))) as string[];

    const filtered = getSortedServices(services).filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.page || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
        const matchesPage = pageFilter === 'all' || s.page === pageFilter;
        return matchesSearch && matchesCategory && matchesPage;
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Serviços e Conteúdo</h1>
                    <p className="text-gray-500 font-medium">Gerencie cards e ofertas de todas as páginas.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button onClick={onSync} variant="outline" className="flex items-center gap-2 group whitespace-nowrap">
                        <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Sincronizar Padrões
                    </Button>
                    <Button onClick={onNew} variant="primary" className="flex items-center gap-2 px-8 shadow-xl shadow-blue-200 whitespace-nowrap">
                        <Plus size={18} /> Novo Ítem
                    </Button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, página ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                    <button
                        onClick={() => { setCategoryFilter('all'); setPageFilter('all'); }}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${categoryFilter === 'all' && pageFilter === 'all' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400'}`}
                    >
                        Tudo
                    </button>
                    {pages.map(p => (
                        <button
                            key={p}
                            onClick={() => { setPageFilter(p); setCategoryFilter('all'); }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${pageFilter === p ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-orange-100' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-400'}`}
                        >
                            {p.replace('-', ' ')}
                        </button>
                    ))}
                    <div className="w-[1px] bg-gray-100 mx-2"></div>
                    {categories.filter(c => c !== 'all').map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setCategoryFilter(cat); setPageFilter('all'); }}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${categoryFilter === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((service) => (
                    <div key={service.id} className={`group relative bg-white p-8 rounded-[3rem] border transition-all hover:shadow-2xl hover:-translate-y-1 ${service.is_highlighted ? 'border-brand-orange/30 shadow-lg shadow-orange-50' : 'border-gray-100 shadow-sm'}`}>
                        {service.is_highlighted && (
                            <div className="absolute -top-3 left-8 px-4 py-1 bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-orange-100 flex items-center gap-1">
                                <Star size={10} fill="currentColor" /> Destaque
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex gap-2">
                                    {service.page && <span className="text-[8px] font-black text-white uppercase tracking-widest px-2 py-0.5 bg-brand-orange rounded-md">{service.page}</span>}
                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded-md">{service.section_id || service.category}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mt-4 group-hover:text-blue-600 transition-colors line-clamp-1">{service.name}</h3>
                                {service.subtitle && <p className="text-xs font-bold text-gray-400 italic mt-1 line-clamp-1">{service.subtitle}</p>}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900 tracking-tighter">{service.price}</p>
                            </div>
                        </div>


                        <div className="space-y-3 mb-8 min-h-[140px]">
                            {service.features.slice(0, 4).map((f, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                    <CheckCircle size={14} className="text-green-500 shrink-0" /> <span className="truncate">{f}</span>
                                </div>
                            ))}
                            {service.features.length > 4 && (
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-5">+{service.features.length - 4} outros itens</p>
                            )}
                            {service.features.length === 0 && (
                                <p className="text-xs text-gray-400 italic py-4">Nenhuma feature cadastrada.</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-auto">
                            <button
                                onClick={() => onEdit(service)}
                                className="flex-grow flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Edit2 size={14} /> Editar Pacote
                            </button>
                            <button
                                onClick={() => service.id && onDelete(service.id)}
                                className="p-4 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <Package className="mx-auto text-gray-300" size={48} />
                        <p className="text-gray-400 font-bold italic">Nenhum serviço encontrado para os filtros atuais.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesTab;
