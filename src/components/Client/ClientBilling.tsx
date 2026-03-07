import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    ExternalLink,
    History,
    Calendar,
    CheckCircle2,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { useAuth } from '../Auth/AuthProvider';
import { clientService, Invoice } from '../../services/clientService';
import { usePortal } from './ClientPortalProvider';

export const ClientBilling: React.FC = () => {
    const { user } = useAuth();
    const { activeTenant } = usePortal();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        if (activeTenant) {
            fetchBillingData();
        }
    }, [activeTenant]);

    const fetchBillingData = async () => {
        try {
            setLoading(true);

            // Buscar Invoices
            const invoiceData = await clientService.getInvoices(activeTenant.id);
            setInvoices(invoiceData);

            // Buscar Assinatura (Simulado ou via Tabela billing_subscriptions)
            const { data: subData } = await (window as any).supabase
                .from('billing_subscriptions')
                .select('*')
                .eq('tenant_id', activeTenant.id)
                .single();

            if (subData) {
                setSubscription(subData);
            } else {
                // Fallback mock enquanto não há Stripe real
                setSubscription({
                    status: 'active',
                    plan_id: 'professional',
                    current_period_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
                });
            }
        } catch (error) {
            console.error('Erro ao buscar dados financeiros:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
                <p className="text-gray-400">Gerencie suas assinaturas, faturas e métodos de pagamento.</p>
            </div>

            {/* Plano Atual */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck size={160} className="text-blue-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${subscription?.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                }`}>
                                Assinatura {subscription?.status === 'active' ? 'Ativa' : subscription?.status}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-1">
                            {subscription?.plan_id === 'professional' ? 'MD Solution - Gestão Professional' : 'Plano Personalizado'}
                        </h2>
                        <p className="text-gray-400 mb-8 font-medium">Faturamento mensal recorrente</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                            <div>
                                <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-bold">Última Fatura</p>
                                <p className="text-3xl font-bold text-white">
                                    {invoices[0]
                                        ? `R$ ${(invoices[0].amount_due / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                        : 'R$ 0,00'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-bold">Próximo Vencimento</p>
                                <p className="text-3xl font-bold text-white">
                                    {subscription?.current_period_end
                                        ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
                                        : 'A definir'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                                <ExternalLink size={18} />
                                Gerenciar no Stripe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Método de Pagamento */}
                <div className="bg-gray-800/30 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-gray-400" />
                            Pagamento Padrão
                        </h3>
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-inner">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500 italic">CARTÃO</span>
                                </div>
                                <CheckCircle2 size={24} className="text-emerald-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">Status do Cartão</p>
                                <p className="text-white font-mono text-lg font-bold tracking-widest">Vinculado ao Stripe</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-gray-500 text-xs">
                        <Lock size={14} />
                        Seus dados são processados com segurança pelo Stripe.
                    </div>
                </div>
            </div>

            {/* Histórico de Faturas */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <History size={24} className="text-blue-500" />
                    <h2 className="text-2xl font-bold text-white">Histórico de Faturas</h2>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800/50 border-b border-gray-800">
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-xs">Data</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-xs">Descrição</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-xs">Valor</th>
                                <th className="px-6 py-4 text-gray-400 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 text-right text-gray-400 font-bold uppercase tracking-wider text-xs">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {invoices.length > 0 ? invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-5 text-white font-medium">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-gray-500" />
                                            {new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-300">Mensalidade - MD Solution</td>
                                    <td className="px-6 py-5 text-white font-bold">
                                        R$ {(invoice.amount_due / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${invoice.status === 'paid'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {invoice.status === 'paid' ? 'Pago' : invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <a
                                            href={invoice.invoice_pdf_url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all inline-flex items-center gap-2"
                                        >
                                            <Download size={18} />
                                            <span className="text-sm font-medium">PDF</span>
                                        </a>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-600">
                                        Nenhuma fatura encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
