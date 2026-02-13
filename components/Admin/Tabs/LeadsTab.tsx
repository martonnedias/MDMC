import React, { useState } from 'react';
import { Users, Search, Download, Trash2, Layout, Mail, Phone, Calendar } from 'lucide-react';

interface LeadsTabProps {
    leads: any[];
    briefings: any[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ leads, briefings }) => {
    const [subTab, setSubTab] = useState<'leads' | 'briefings'>('leads');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(l =>
        (l.data?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.data?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBriefings = briefings.filter(b =>
        (b.data?.companyName || b.data?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.data?.responsibleName || b.data?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Leads e Briefings</h1>
                    <p className="text-gray-500 font-medium">Gestão de contatos e diagnósticos recebidos.</p>
                </div>
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </header>

            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setSubTab('leads')}
                    className={`pb-4 px-6 text-sm font-bold transition-all relative ${subTab === 'leads' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Leads de Contato ({leads.length})
                    {subTab === 'leads' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
                </button>
                <button
                    onClick={() => setSubTab('briefings')}
                    className={`pb-4 px-6 text-sm font-bold transition-all relative ${subTab === 'briefings' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Briefings SWOT ({briefings.length})
                    {subTab === 'briefings' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
                </button>
            </div>

            {subTab === 'leads' ? (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Lead / Empresa</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Contato</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Interesse</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-900">{lead.data?.name || lead.data?.company_name || 'Sem nome'}</div>
                                        <div className="text-xs text-slate-400 uppercase font-black tracking-widest mt-1">{lead.type}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <a href={`mailto:${lead.data?.email}`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-2"><Mail size={12} /> {lead.data?.email || '-'}</a>
                                            <a href={`tel:${lead.data?.phone}`} className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone size={12} /> {lead.data?.phone || lead.data?.whatsapp || '-'}</a>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs">
                                        <div className="text-sm text-gray-600 font-medium whitespace-pre-wrap">{lead.data?.interest || lead.data?.message || '-'}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="text-xs font-bold text-gray-400 flex items-center justify-end gap-2"><Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString('pt-BR')}</div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-gray-400 italic font-medium">Nenhum lead encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBriefings.map(briefing => (
                        <div key={briefing.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Layout size={24} /></div>
                                <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full">{briefing.plan || 'SWOT'}</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{briefing.data?.companyName || briefing.data?.company_name}</h3>
                            <p className="text-sm font-bold text-gray-500 mb-6 italic">Responsável: {briefing.data?.responsibleName || briefing.data?.name}</p>

                            <div className="space-y-4 pt-6 border-t border-gray-50 text-xs font-medium text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 uppercase tracking-widest font-black text-[9px]">Email:</span>
                                    <span className="font-bold">{briefing.data?.email || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 uppercase tracking-widest font-black text-[9px]">Telefone:</span>
                                    <span className="font-bold">{briefing.data?.whatsapp || briefing.data?.phone || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 uppercase tracking-widest font-black text-[9px]">Data:</span>
                                    <span className="font-bold">{new Date(briefing.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    alert(JSON.stringify(briefing.data, null, 2));
                                }}
                                className="w-full mt-8 py-4 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                Ver Detalhes Completos
                            </button>
                        </div>
                    ))}
                    {filteredBriefings.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400 italic">Nenhum briefing encontrado.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeadsTab;
