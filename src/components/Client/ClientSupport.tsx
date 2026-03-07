import React, { useState, useEffect } from 'react';
import {
    LifeBuoy,
    MessageCircle,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    Search,
    ArrowLeft,
    ChevronRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthProvider';
import { clientService, Ticket } from '../../services/clientService';
import { usePortal } from './ClientPortalProvider';

export const ClientSupport: React.FC = () => {
    const { user } = useAuth();
    const { activeTenant } = usePortal();
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [newTicketSubject, setNewTicketSubject] = useState('');

    useEffect(() => {
        if (activeTenant) {
            fetchTickets();
        }
    }, [activeTenant]);

    useEffect(() => {
        if (selectedTicket) {
            fetchMessages(selectedTicket.id);

            // Real-time subscription for messages
            const channel = supabase
                .channel(`ticket-${selectedTicket.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'support_messages',
                    filter: `ticket_id=eq.${selectedTicket.id}`
                }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [selectedTicket]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await clientService.getTickets(activeTenant.id);
            setTickets(data);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (ticketId: string) => {
        const { data, error } = await supabase
            .from('support_messages')
            .select('*')
            .eq('ticket_id', ticketId)
            .eq('is_internal', false)
            .order('created_at', { ascending: true });

        if (!error) setMessages(data || []);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket || sending) return;

        try {
            setSending(true);
            const { error } = await supabase
                .from('support_messages')
                .insert({
                    ticket_id: selectedTicket.id,
                    sender_id: user?.id,
                    content: newMessage,
                    is_internal: false
                });

            if (error) throw error;
            setNewMessage('');
            // Scroll to bottom logic would be nice here
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        } finally {
            setSending(false);
        }
    };

    const handleCreateTicket = async () => {
        if (!newTicketSubject.trim() || sending) return;

        try {
            setSending(true);
            const { data, error } = await supabase
                .from('support_tickets')
                .insert({
                    tenant_id: activeTenant.id,
                    subject: newTicketSubject,
                    created_by: user?.id
                })
                .select()
                .single();

            if (error) throw error;

            setTickets([data, ...tickets]);
            setSelectedTicket(data);
            setShowNewTicketModal(false);
            setNewTicketSubject('');
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
        } finally {
            setSending(false);
        }
    };

    if (selectedTicket) {
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <button
                    onClick={() => setSelectedTicket(null)}
                    title="Voltar para a Lista de Chamados"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para lista
                </button>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-180px)] md:h-[600px] shadow-2xl">
                    <div className="p-6 bg-gray-800/50 border-b border-gray-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">{selectedTicket.subject}</h2>
                            <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                                <span className="text-blue-500">Ticket #{selectedTicket.id.slice(0, 8)}</span>
                                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className={`flex items-center gap-1 ${selectedTicket.status === 'open' ? 'text-blue-400' :
                                    selectedTicket.status === 'in_progress' ? 'text-amber-400' :
                                        'text-emerald-400'
                                    }`}>
                                    {selectedTicket.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950/30">
                        {messages.length > 0 ? messages.map((msg) => {
                            const isMe = msg.sender_id === user?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-4`}>
                                    {!isMe && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg font-bold text-xs">
                                            MD
                                        </div>
                                    )}
                                    <div className={`space-y-1 max-w-[80%]`}>
                                        <div className={`p-4 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                        <p className={`text-[10px] text-gray-600 font-bold uppercase tracking-tighter ${isMe ? 'text-right' : 'text-left'}`}>
                                            {isMe ? 'Você' : 'Suporte'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                                <MessageCircle size={48} strokeWidth={1} />
                                <p className="text-sm">Inicie a conversa descrevendo seu problema.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-900 border-t border-gray-800">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-4">
                            <label htmlFor="support-message-input" className="sr-only">Nova Mensagem</label>
                            <input
                                id="support-message-input"
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl px-6 py-3 text-white focus:border-blue-600 outline-none transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                title="Enviar Mensagem"
                                aria-label="Enviar Mensagem"
                                disabled={!newMessage.trim() || sending}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Central de Suporte</h1>
                    <p className="text-gray-400">Como podemos ajudar você hoje? Abra um novo chamado ou gerencie os existentes.</p>
                </div>
                <button
                    onClick={() => setShowNewTicketModal(true)}
                    title="Abrir Novo Ticket de Suporte"
                    className="hidden md:flex px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    <Plus size={20} />
                    Novo Ticket
                </button>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={() => setShowNewTicketModal(true)}
                title="Novo Ticket"
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40 active:scale-95 transition-all z-40"
            >
                <Plus size={24} />
            </button>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-white">Seus Chamados</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-blue-600 outline-none w-64"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-800 min-h-[300px]">
                        {tickets.length > 0 ? tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="p-6 hover:bg-gray-800/30 transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                                            ticket.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            <MessageCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{ticket.subject}</h4>
                                            <p className="text-gray-500 text-xs mt-0.5">Criado em {new Date(ticket.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 mt-4 md:mt-0 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-center min-w-[100px] sm:min-w-[120px] ${ticket.status === 'open' ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/20' :
                                            ticket.status === 'in_progress' ? 'bg-amber-500 text-black' :
                                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            }`}>
                                            {ticket.status === 'open' ? 'Aberto' :
                                                ticket.status === 'in_progress' ? 'Em Progresso' :
                                                    'Resolvido'}
                                        </span>
                                        <ChevronRight size={20} className="text-gray-700 group-hover:text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center text-gray-500 flex flex-col items-center gap-2">
                                <LifeBuoy size={48} strokeWidth={1} className="opacity-20" />
                                <p>Você ainda não abriu nenhum chamado.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Novo Ticket Simple */}
            {showNewTicketModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-white">Novo Chamado</h2>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Assunto do Problema</label>
                                <input
                                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white focus:border-blue-600 outline-none transition-all"
                                    placeholder="Ex: Dúvida sobre o contrato..."
                                    value={newTicketSubject}
                                    onChange={(e) => setNewTicketSubject(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowNewTicketModal(false)}
                                    className="py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateTicket}
                                    disabled={!newTicketSubject.trim() || sending}
                                    className="py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all"
                                >
                                    {sending ? 'Criando...' : 'Abrir Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
