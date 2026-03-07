import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { AlertCircle, CheckCircle, FileText, User, CreditCard } from 'lucide-react';
import Button from '@/src/components/Button';
import { formatCPFCNPJ, validateCPFCNPJ } from '@/src/lib/formatters';

interface ProposalDetails {
    id: string;
    title: string;
    status: string;
    version_id: string;
    html: string;
}

const ProposalView: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [proposal, setProposal] = useState<ProposalDetails | null>(null);
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

        const fetchProposal = async () => {
            try {
                const { data, error: funcError } = await supabase.functions.invoke('get-proposal-by-token', {
                    method: 'POST',
                    body: { token }
                });

                if (funcError) {
                    throw new Error('Falha ao se conectar com os servidores de proposta.');
                }

                if (data.error) {
                    setError(data.error);
                } else {
                    setProposal(data as ProposalDetails);
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro desconhecido ao carregar proposta.');
            }
            setLoading(false);
        };

        fetchProposal();
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
            const { data, error } = await supabase.functions.invoke('accept-proposal', {
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
                if (proposal) {
                    setProposal({ ...proposal, status: 'approved' });
                }
                alert('Proposta aceita com sucesso!');
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
                <div className="animate-pulse text-brand-blue font-bold">Carregando Proposta...</div>
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

    if (!proposal) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 print:bg-white print:py-0">
            <div className="max-w-4xl mx-auto print:max-w-full">
                <div className="flex items-center gap-3 mb-8 print:hidden">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <FileText className="text-brand-blue" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{proposal.title}</h1>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            {proposal.status === 'approved' ? (
                                <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> APROVADA / ASSINADA</span>
                            ) : (
                                <span className="text-slate-500 font-medium">Aguardando Avaliação</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100 p-8 mb-8 print:shadow-none print:border-none print:p-0">
                    <div dangerouslySetInnerHTML={{ __html: proposal.html }} className="prose prose-slate max-w-none prose-headings:text-brand-darkBlue prose-a:text-brand-blue" />
                </div>

                {proposal.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 print:hidden animate-fade-in fade-in">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-green-200/50 shrink-0">
                            <CheckCircle className="text-green-500 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-green-900 tracking-tight mb-2">Acordo Firmado com Sucesso!</h3>
                            <p className="text-green-800/80 font-medium leading-relaxed">
                                Sua assinatura digital criptografada foi registrada nos nossos servidores com sucesso.
                            </p>
                            <p className="text-green-800/80 font-bold mt-2">
                                🤝 Um de nossos Executivos C-Level entrará em contato com você via WhatsApp em breve para alinhar o Onboarding do Projeto e disponibilizar a sua fatura exclusiva de Checkout.
                            </p>
                        </div>
                    </div>
                )}

                {proposal.status !== 'approved' && (
                    <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 border border-slate-100 print:hidden">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Assinatura Eletrônica</h3>
                        <form onSubmit={handleAcceptance} className="space-y-4 max-w-lg">
                            <div>
                                <label htmlFor="sign-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome Completo / Razão Social</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="sign-name"
                                        required
                                        type="text"
                                        title="Nome Completo para Assinatura"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                                        value={acceptanceForm.fullName}
                                        onChange={e => setAcceptanceForm({ ...acceptanceForm, fullName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="sign-doc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CPF / CNPJ</label>
                                <div className="relative">
                                    <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="sign-doc"
                                        required
                                        type="text"
                                        title="Documento (CPF ou CNPJ)"
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
                                        Declaro que li e concordo com todos os termos e serviços descritos nesta proposta, reconhecendo esta ação como uma assinatura válida e legal.
                                    </span>
                                </label>
                            </div>
                            <Button fullWidth variant="primary" type="submit" loading={accepting} disabled={!acceptanceForm.terms}>
                                Aceitar Proposta e Assinar
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

export default ProposalView;
