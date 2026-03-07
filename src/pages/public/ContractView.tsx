import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { AlertCircle, CheckCircle, FileSignature, User, CreditCard } from 'lucide-react';
import Button from '@/src/components/Button';
import { formatCPFCNPJ, validateCPFCNPJ } from '@/src/lib/formatters';

interface ContractDetails {
    id: string;
    title: string;
    status: string;
    version_id: string;
    html: string;
}

const ContractView: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [contract, setContract] = useState<ContractDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [accepting, setAccepting] = useState(false);
    const [acceptanceForm, setAcceptanceForm] = useState({ fullName: '', document: '', terms: false });

    useEffect(() => {
        if (!token) {
            setError('Token não fornecido.');
            setLoading(false);
            return;
        }

        const fetchContract = async () => {
            try {
                const { data, error: funcError } = await supabase.functions.invoke('get-contract-by-token', {
                    method: 'POST',
                    body: { token }
                });

                if (funcError) {
                    throw new Error('Falha ao se conectar com os servidores de contrato.');
                }

                if (data.error) {
                    setError(data.error);
                } else {
                    setContract(data as ContractDetails);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro desconhecido ao carregar contrato.');
            }
            setLoading(false);
        };

        fetchContract();
    }, [token]);

    const handleAcceptance = async (e: React.FormEvent) => {
        e.preventDefault();
        setAccepting(true);

        if (!validateCPFCNPJ(acceptanceForm.document)) {
            alert('Por favor, informe um CPF ou CNPJ válido.');
            setAccepting(false);
            return;
        }

        try {
            const { data, error } = await supabase.functions.invoke('accept-contract', {
                method: 'POST',
                body: {
                    token,
                    accepted_full_name: acceptanceForm.fullName,
                    accepted_document: acceptanceForm.document
                }
            });

            if (error || data?.error) {
                alert(data?.error || 'Erro ao processar assinatura.');
                setAccepting(false);
                return;
            }

            if (data.success) {
                // Pre-update locally
                if (contract) {
                    setContract({ ...contract, status: 'accepted' });
                }
                alert('Contrato assinado com sucesso!');
            }
        } catch (err) {
            console.error(err);
            alert('Falha na comunicação com o servidor.');
        }

        setAccepting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-brand-blue font-bold">Carregando Contrato Seguro...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!contract) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 print:bg-white print:py-0">
            <div className="max-w-4xl mx-auto print:max-w-full">
                <div className="flex items-center gap-3 mb-8 print:hidden">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <FileSignature className="text-brand-blue" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{contract.title}</h1>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            {contract.status === 'accepted' ? (
                                <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> ASSINADO ELETRONICAMENTE</span>
                            ) : (
                                <span className="text-slate-500 font-medium">Aguardando Assinatura</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100 p-8 mb-8 print:shadow-none print:border-none print:p-0">
                    <div dangerouslySetInnerHTML={{ __html: contract.html }} className="prose prose-slate max-w-none prose-headings:text-brand-darkBlue prose-a:text-brand-blue" />
                </div>

                {contract.status !== 'accepted' && (
                    <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 border border-slate-100 print:hidden">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Assinatura Eletrônica do Contrato</h3>
                        <p className="text-sm text-slate-500 mb-6">Este documento possui validade jurídica. Preencha seus dados reais para confirmar a assinatura.</p>

                        <form onSubmit={handleAcceptance} className="space-y-4 max-w-lg">
                            <div>
                                <label htmlFor="contract-sign-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo / Razão Social</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="contract-sign-name"
                                        required
                                        type="text"
                                        title="Nome Completo para Assinatura do Contrato"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                                        value={acceptanceForm.fullName}
                                        onChange={e => setAcceptanceForm({ ...acceptanceForm, fullName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="contract-sign-doc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CPF / CNPJ</label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="contract-sign-doc"
                                        required
                                        type="text"
                                        title="Documento (CPF ou CNPJ) para Assinatura do Contrato"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                                        value={acceptanceForm.document}
                                        onChange={e => setAcceptanceForm({ ...acceptanceForm, document: formatCPFCNPJ(e.target.value) })}
                                        maxLength={18}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 pb-4">
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 w-4 h-4 text-brand-blue rounded border-slate-300"
                                        checked={acceptanceForm.terms}
                                        onChange={e => setAcceptanceForm({ ...acceptanceForm, terms: e.target.checked })}
                                    />
                                    <span className="text-sm border-slate-500 text-slate-600">
                                        Declaro que li e compreendi o teor deste contrato e concordo integralmente com todas as suas cláusulas e condições, reconhecendo esta ação como assinatura válida.
                                    </span>
                                </label>
                            </div>
                            <Button fullWidth variant="primary" type="submit" loading={accepting} disabled={!acceptanceForm.terms}>
                                Assinar Contrato
                            </Button>
                        </form>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { background-color: white !important; }
                    nav, footer { display: none !important; }
                    .print\\:hidden { display: none !important; }
                }
                `
            }} />
        </div>
    );
};

export default ContractView;
