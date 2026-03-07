import React, { useState, useEffect } from 'react';
import {
    LifeBuoy,
    MessageCircle,
    Clock,
    CheckCircle2,
    ChevronRight,
    Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const SupportTab = () => {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('support_tickets')
                .select(`
                    *,
                    tenants ( name )
                `)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setTickets(data || []);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tenants?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center uppercase font-black text-xs tracking-widest animate-pulse">Carregando Chamados...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-1">Central de Atendimento</h2>
                    <p className="text-slate-500 text-sm font-medium italic">Gerencie e responda aos chamados ativos.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Pesquisar por assunto ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-80 font-medium"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                    {filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-all cursor-pointer group flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ticket.status === 'open' ? 'bg-blue-50 text-blue-500' :
                                        ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-500' :
                                            'bg-emerald-50 text-emerald-500'
                                    }`}>
                                    <LifeBuoy size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">#{ticket.id.slice(0, 8)}</span>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{ticket.tenants?.name}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{ticket.subject}</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter flex items-center gap-2 mt-1">
                                        <Clock size={12} />
                                        Atualizado {new Date(ticket.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${ticket.status === 'open' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                        ticket.status === 'in_progress' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                                            'border-emerald-200 bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {ticket.status}
                                </span>
                                <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-400" />
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum chamado encontrado.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
