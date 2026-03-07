import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    MessageSquare,
    ExternalLink,
    CheckSquare,
    ChevronRight,
    Files,
    LifeBuoy,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { usePortal } from './ClientPortalProvider';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, trend, icon: Icon, trendUp, to }: any) => (
    <Link to={to || '#'} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all duration-300 group block">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend}
                    {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
    </Link>
);

export const ClientDashboard: React.FC = () => {
    const { user } = useAuth();
    const { stats, activeTenant, loading } = usePortal();
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        if (activeTenant) {
            fetchRecentActivity();
        }
    }, [activeTenant]);

    const fetchRecentActivity = async () => {
        // Por enquanto mockado, mas pronto para ser substituído por busca real
        setRecentActivity([
            { id: 1, type: 'contract', title: 'Contrato MD Solution', status: 'visualizado', date: 'Há pouco' },
            { id: 2, type: 'report', title: 'Análise de Presença Digital', status: 'disponível', date: 'Hoje' },
        ]);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Boas-vindas */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Olá, {user?.email?.split('@')[0]}</h1>
                    <p className="text-gray-400">Aqui está o resumo comercial da **{activeTenant?.name}**.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/cliente/suporte" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                        <MessageSquare size={18} />
                        Suporte
                    </Link>
                    <Link to="/cliente/financeiro" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                        <CreditCard size={18} />
                        Faturas
                    </Link>
                </div>
            </div>

            {/* Grid de Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Aprovações Pendentes"
                    value={stats.openProposals}
                    icon={CheckSquare}
                    trend={stats.openProposals > 0 ? "Ação pendente" : "Tudo em dia"}
                    trendUp={stats.openProposals === 0}
                    to="/cliente/aprovacoes"
                />
                <StatCard
                    title="Contratos Pendentes"
                    value={stats.pendingContracts}
                    icon={FileText}
                    trend={stats.pendingContracts > 0 ? "Aguardando assinatura" : "Tudo assinado"}
                    trendUp={stats.pendingContracts === 0}
                    to="/cliente/arquivos"
                />
                <StatCard
                    title="Tickets Suporte"
                    value={stats.openTickets}
                    icon={LifeBuoy}
                    trend={stats.openTickets > 0 ? "Atendimento ativo" : "Sem pendências"}
                    trendUp={stats.openTickets === 0}
                    to="/cliente/suporte"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Atividade Recente */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
                        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center gap-1">
                            Ver tudo <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden min-h-[200px]">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, idx) => (
                                <div
                                    key={activity.id}
                                    className={`flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors ${idx !== recentActivity.length - 1 ? 'border-b border-gray-800' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${activity.type === 'contract' ? 'bg-yellow-500/10 text-yellow-500' :
                                            activity.type === 'report' ? 'bg-emerald-500/10 text-emerald-500' :
                                                'bg-purple-500/10 text-purple-500'
                                            }`}>

                                            {activity.type === 'contract' && <FileText size={20} />}
                                            {activity.type === 'report' && <TrendingUp size={20} />}
                                            {activity.type === 'file' && <Files size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium">{activity.title}</h4>
                                            <p className="text-gray-500 text-sm">{activity.status} • {activity.date}</p>
                                        </div>
                                    </div>
                                    <button
                                        title="Ver Detalhes da Atividade"
                                        aria-label={`Ver detalhes de ${activity.title}`}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                                    >
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-gray-600 gap-2">
                                <Clock size={32} strokeWidth={1} />
                                <p className="text-sm font-medium">Nenhuma atividade recente registrada.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card de Faturamento Rápido */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Sua Conta</h2>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <CreditCard size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-blue-100 text-xs font-black uppercase tracking-widest mb-1">Status de Assinatura</div>
                            <div className="text-2xl font-bold text-white mb-6">Ativa</div>
                            <div className="flex items-center gap-2 text-blue-100 text-xs mb-4 font-bold">
                                <CheckCircle2 size={14} />
                                Cobrança Centralizada
                            </div>
                            <Link to="/cliente/financeiro" className="block w-full py-2 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg text-center">
                                Detalhes Financeiros
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-blue-500" />
                            Gestor de Sucesso
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                            O time de tecnologia do **MD Solution** está monitorando seu tenant. Caso precise de ajuda urgente, utilize o chat.
                        </p>
                        <button className="w-full py-2 border border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                            WhatsApp Direto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
