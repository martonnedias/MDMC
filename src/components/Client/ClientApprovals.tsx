import React, { useState, useEffect } from 'react';
import {
    CheckSquare,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    MessageSquare,
    AlertCircle,
    ArrowRight,
    Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';
import { usePortal } from './ClientPortalProvider';

export const ClientApprovals: React.FC = () => {
    const { user } = useAuth();
    const { activeTenant } = usePortal();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (activeTenant) {
            fetchApprovals();
        }
    }, [activeTenant]);

    const fetchApprovals = async () => {
        try {
            setLoading(true);

            // Buscar Propostas pendentes de aprovação
            const { data, error } = await supabase
                .from('proposals')
                .select(`
                    id,
                    title,
                    status,
                    created_at,
                    proposal_public_links (
                        token
                    )
                `)
                .eq('tenant_id', activeTenant.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formatted = (data || []).map(p => ({
                id: p.id,
                title: p.title,
                type: 'proposta',
                status: p.status,
                date: p.created_at,
                token: (p.proposal_public_links as any)?.[0]?.token
            }));

            setItems(formatted);
        } catch (error) {
            console.error('Erro ao buscar aprovações:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const pendingCount = items.filter(i => i.status === 'sent' || i.status === 'viewed').length;

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Aprovações</h1>
                    <p className="text-gray-400">Revise e aprove entregáveis, propostas e estratégias.</p>
                </div>
            </div>

            {/* Alerta de Urgência */}
            {pendingCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle size={24} className="text-amber-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-amber-200 font-bold mb-1">Ações Pendentes Requeridas</h4>
                        <p className="text-amber-100/60 text-sm leading-relaxed">
                            Você possui {pendingCount} {pendingCount === 1 ? 'item' : 'itens'} aguardando sua revisão. Aprovações rápidas garantem que seu projeto continue no cronograma planejado.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {items.length > 0 ? items.map((item) => (
                    <div key={item.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                <CheckSquare size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.type}</span>
                                    <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span className={`text-xs font-bold flex items-center gap-1 ${item.status === 'approved' ? 'text-emerald-500' : 'text-blue-500'
                                        }`}>
                                        {item.status === 'approved' ? 'Aprovado' : 'Aguardando Revisão'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                    <Clock size={14} />
                                    Emitido em: {new Date(item.date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to={item.token ? `/p/${item.token}` : '#'}
                                className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                            >
                                <Eye size={18} />
                                Abrir Proposta
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center text-gray-600 bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
                        Nenhum item pendente de aprovação.
                    </div>
                )}
            </div>

            {/* Feed de Comentários Placeholder */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 text-center border-dashed">
                <MessageSquare size={40} className="text-gray-700 mx-auto mb-4" />
                <h4 className="text-gray-400 font-bold mb-2">Dúvidas sobre os itens?</h4>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Caso tenha dúvidas sobre algum entregável, você pode utilizar o **Suporte** para conversar diretamente com seu gestor de conta.
                </p>
            </div>
        </div>
    );
};
