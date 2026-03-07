import React, { useState } from 'react';
import { CreditCard, TrendingUp, DollarSign, Activity, Users, ArrowUpRight, ArrowDownRight, Search, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const BillingTab: React.FC = () => {
    const [period, setPeriod] = useState('30d');

    const metrics = {
        mrr: 'R$ 14.500',
        mrrGrowth: '+12.5%',
        isMrrUp: true,
        ltv: 'R$ 3.200',
        ltvGrowth: '+5.2%',
        isLtvUp: true,
        activeSubscriptions: 24,
        subsGrowth: '+3',
        isSubsUp: true,
        churnRate: '2.1%',
        churnGrowth: '-0.5%',
        isChurnDown: true
    };

    const recentInvoices = [
        { id: 'INV-2026-001', client: 'Acme Corp', amount: 'R$ 1.500,00', status: 'paid', date: '05/03/2026' },
        { id: 'INV-2026-002', client: 'Tech Solutions', amount: 'R$ 800,00', status: 'pending', date: '04/03/2026' },
        { id: 'INV-2026-003', client: 'Global Retail', amount: 'R$ 2.100,00', status: 'paid', date: '01/03/2026' },
        { id: 'INV-2026-004', client: 'Smart Delivery', amount: 'R$ 1.500,00', status: 'failed', date: '28/02/2026' },
        { id: 'INV-2026-005', client: 'Web Store', amount: 'R$ 950,00', status: 'paid', date: '25/02/2026' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financeiro & Billing</h2>
                    <p className="text-slate-500 font-medium mt-1">Métricas de receita recorrente e gestão de faturas (Simulação Stripe)</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setPeriod('7d')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === '7d' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>7D</button>
                    <button onClick={() => setPeriod('30d')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === '30d' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>30D</button>
                    <button onClick={() => setPeriod('12m')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === '12m' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>12M</button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-blue/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-2xl flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metrics.isMrrUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {metrics.isMrrUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {metrics.mrrGrowth}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">MRR (Recorrência)</h3>
                        <p className="text-3xl font-black text-slate-900">{metrics.mrr}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-blue/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <DollarSign size={24} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metrics.isLtvUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {metrics.isLtvUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {metrics.ltvGrowth}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">LTV (Life Time Value)</h3>
                        <p className="text-3xl font-black text-slate-900">{metrics.ltv}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-blue/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metrics.isSubsUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {metrics.isSubsUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {metrics.subsGrowth}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Assinaturas Ativas</h3>
                        <p className="text-3xl font-black text-slate-900">{metrics.activeSubscriptions}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-blue/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metrics.isChurnDown ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {metrics.isChurnDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {metrics.churnGrowth}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Taxa de Churn</h3>
                        <p className="text-3xl font-black text-slate-900">{metrics.churnRate}</p>
                    </div>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Faturas Recentes</h2>
                            <p className="text-sm font-medium text-slate-500">Histórico de cobranças e pagamentos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar fatura..."
                                className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:border-brand-blue outline-none transition-all w-full sm:w-64"
                            />
                        </div>
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                            Nova Fatura
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-black uppercase tracking-widest text-slate-400">
                                <th className="px-8 py-4">Fatura</th>
                                <th className="px-8 py-4">Cliente</th>
                                <th className="px-8 py-4">Data</th>
                                <th className="px-8 py-4">Valor</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-slate-700">{invoice.id}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-slate-900">{invoice.client}</span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500 font-medium">
                                        {invoice.date}
                                    </td>
                                    <td className="px-8 py-5 font-black text-slate-900">
                                        {invoice.amount}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'}`}>
                                            {invoice.status === 'paid' ? <CheckCircle2 size={14} /> :
                                                invoice.status === 'pending' ? <Clock size={14} /> :
                                                    <AlertCircle size={14} />}
                                            {invoice.status === 'paid' ? 'Pago' :
                                                invoice.status === 'pending' ? 'Pendente' :
                                                    'Falhou'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-brand-blue font-bold text-sm tracking-wide hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        Ver todo o histórico no Stripe ↗
                    </button>
                </div>
            </div>

            {/* Banner Marketing / CRM */}
            <div className="bg-gradient-to-r from-brand-blue to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black mb-2">Acesso ao Módulo CRM Financeiro</h3>
                        <p className="text-blue-100 font-medium max-w-xl">
                            O módulo de faturamento avançado com integração a CRMs externos (HubSpot/Pipedrive) e conciliação bancária completa
                            estará totalmente funcional na próxima versão.
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white text-brand-blue rounded-2xl font-black tracking-widest text-sm uppercase shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0">
                        Ativar Integração
                    </button>
                </div>
            </div>
        </div>
    );
};
