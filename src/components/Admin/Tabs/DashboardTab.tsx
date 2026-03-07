import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Users, FileText, Package, Layout, Loader2 } from 'lucide-react';
import { adminService, DashboardStats, LeadData, SwotBriefingData } from '@/src/services/adminService';

interface DashboardTabProps {
    onTabChange: (tab: 'dashboard' | 'config' | 'blog' | 'services' | 'leads' | 'pages' | 'proposals' | 'contracts' | 'contract-templates' | 'support' | 'billing') => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ onTabChange }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentLeads, setRecentLeads] = useState<LeadData[]>([]);
    const [recentBriefings, setRecentBriefings] = useState<SwotBriefingData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchDashboardData = async () => {
            const [statsData, allLeads, allBriefings] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getLeads(), // Pode ser otimizado futuramente por limit
                adminService.getBriefings()
            ]);

            if (mounted) {
                setStats(statsData);
                setRecentLeads(allLeads.slice(0, 5));
                setRecentBriefings(allBriefings.slice(0, 5));
                setLoading(false);
            }
        };
        fetchDashboardData();
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Painel de Controle</h1>
                <p className="text-gray-500 font-medium">Gestão estratégica da MD Solution.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Users size={12} /> Total de Leads</p>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.totalLeads || 0}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Layout size={12} /> Briefings SWOT</p>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.totalBriefings || 0}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText size={12} /> Posts no Blog</p>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.totalPosts || 0}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Package size={12} /> Serviços Ativos</p>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats?.activeServices || 0}</h3>
                </div>
            </div>

            {/* Recent Activity Mini Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h4 className="font-black text-lg mb-6 flex items-center justify-between">
                        <span>Últimos Leads</span>
                        <button onClick={() => onTabChange('leads')} className="text-xs text-blue-600 hover:underline" title="Ver todos os leads" aria-label="Ver todos os leads">Ver todos</button>
                    </h4>
                    <div className="space-y-4">
                        {recentLeads.slice(0, 5).map(lead => (
                            <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{lead.data?.name || lead.data?.company_name || 'Lead sem nome'}</p>
                                    <p className="text-xs text-gray-500">{lead.data?.email || '-'}</p>
                                </div>
                                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full uppercase">{lead.type}</span>
                            </div>
                        ))}
                        {recentLeads.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum lead encontrado.</p>}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h4 className="font-black text-lg mb-6 flex items-center justify-between">
                        <span>Últimos Briefings</span>
                        <button onClick={() => onTabChange('leads')} className="text-xs text-blue-600 hover:underline" title="Ver todos os briefings" aria-label="Ver todos os briefings">Ver todos</button>
                    </h4>
                    <div className="space-y-4">
                        {recentBriefings.slice(0, 5).map(briefing => (
                            <div key={briefing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{briefing.data?.companyName || briefing.data?.company_name || 'Empresa'}</p>
                                    <p className="text-xs text-gray-500">{briefing.data?.responsibleName || briefing.data?.name || '-'}</p>
                                </div>
                                <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full uppercase">{briefing.plan || 'SWOT'}</span>
                            </div>
                        ))}
                        {recentBriefings.length === 0 && <p className="text-gray-400 text-center py-4">Nenhum briefing encontrado.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;
