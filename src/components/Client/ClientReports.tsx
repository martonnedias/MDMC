import React, { useState, useEffect } from 'react';
import {
    FileBarChart,
    Search,
    Filter,
    Download,
    ExternalLink,
    Clock,
    TrendingUp,
    ChevronRight,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';
import { usePortal } from './ClientPortalProvider';

export const ClientReports: React.FC = () => {
    const { user } = useAuth();
    const { activeTenant } = usePortal();
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        if (activeTenant) {
            fetchReports();
        }
    }, [activeTenant]);

    const fetchReports = async () => {
        try {
            setLoading(true);

            // Join with public links to get the token directly
            const { data, error } = await supabase
                .from('reports')
                .select(`
                    id,
                    created_at,
                    report_type,
                    summary_json,
                    report_public_links (
                        token
                    )
                `)
                .eq('tenant_id', activeTenant.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedReports = (data || []).map(r => ({
                id: r.id,
                title: (r.summary_json as any)?.title || `Relatório ${r.report_type === 'swot' ? 'SWOT' : 'de Diagnóstico'}`,
                type: r.report_type,
                date: r.created_at,
                token: (r.report_public_links as any)?.[0]?.token
            }));

            setReports(formattedReports);
        } catch (error) {
            console.error('Erro ao buscar relatórios:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    const latestReport = reports[0];

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Relatórios e Análises</h1>
                    <p className="text-gray-400">Acesse seus dados de performance e diagnósticos estratégicos.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar relatório..."
                            className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-blue-600 outline-none transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Destaque de Último Relatório */}
            {latestReport ? (
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={240} className="text-blue-400" />
                    </div>

                    <div className="flex items-center gap-6 relative z-10 text-center md:text-left">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                            <FileBarChart size={32} className="text-white" />
                        </div>
                        <div>
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 block">Mais Recente</span>
                            <h2 className="text-2xl font-bold text-white mb-1">{latestReport.title}</h2>
                            <p className="text-indigo-200/60 font-medium">Publicado em {new Date(latestReport.date).toLocaleDateString('pt-BR')} • Pronto para leitura</p>
                        </div>
                    </div>

                    <Link
                        to={latestReport.token ? `/r/${latestReport.token}` : '#'}
                        className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:translate-y-[-2px] active:scale-95 flex items-center gap-3 relative z-10"
                    >
                        Ver Relatório Completo
                        <ArrowRight size={20} />
                    </Link>
                </div>
            ) : (
                <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-3xl p-12 text-center text-gray-500">
                    <FileBarChart size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Nenhum relatório disponível no momento.</p>
                </div>
            )}

            {/* Lista de Relatórios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(reports.length > 1 ? reports.slice(1) : (reports.length === 1 ? reports : [])).map((report) => (
                    <div key={report.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl ${report.type === 'performance' ? 'bg-emerald-500/10 text-emerald-500' :
                                report.type === 'swot' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-purple-500/10 text-purple-500'
                                }`}>
                                <FileBarChart size={24} />
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                <Calendar size={14} />
                                {new Date(report.date).toLocaleDateString('pt-BR')}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{report.title}</h3>
                        <p className="text-gray-500 text-sm mb-6">Relatório detalhado para consulta de métricas e evolução comercial.</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                            <Link
                                to={report.token ? `/r/${report.token}` : '#'}
                                className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                            >
                                Abrir Agora
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
