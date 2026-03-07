import React, { useState, useEffect } from 'react';
import {
    Files,
    FileText,
    ShieldCheck,
    Download,
    ExternalLink,
    Clock,
    Search,
    ChevronRight,
    HelpCircle,
    CheckCircle2,
    FileSignature
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';
import { usePortal } from './ClientPortalProvider';

export const ClientDocuments: React.FC = () => {
    const { user } = useAuth();
    const { activeTenant } = usePortal();
    const [loading, setLoading] = useState(true);
    const [contracts, setContracts] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);

    useEffect(() => {
        if (activeTenant) {
            fetchDocuments();
        }
    }, [activeTenant]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);

            // Buscar Contratos + Links Públicos
            const { data: contractData, error: contractError } = await supabase
                .from('contracts')
                .select(`
                    id,
                    title,
                    status,
                    created_at,
                    contract_public_links (
                        token
                    )
                `)
                .eq('tenant_id', activeTenant.id)
                .order('created_at', { ascending: false });

            if (contractError) throw contractError;

            // Buscar Anexos Gerais (podem ser de contratos ou soltos se houver suporte a tenant_id neles)
            // Por enquanto focando nos anexos de contratos do tenant
            const { data: attachData } = await supabase
                .from('contract_attachments')
                .select('*')
                .in('contract_id', (contractData || []).map(c => c.id));

            setContracts((contractData || []).map(c => ({
                ...c,
                token: (c.contract_public_links as any)?.[0]?.token
            })));

            setAttachments(attachData || []);

        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Seus Documentos</h1>
                    <p className="text-gray-400">Contratos, anexos e arquivos importantes do seu projeto.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar arquivo..."
                        className="bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-blue-600 outline-none transition-all w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lado Esquerdo: Contratos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileSignature size={24} className="text-blue-500" />
                        <h2 className="text-2xl font-bold text-white">Contratos</h2>
                    </div>

                    <div className="space-y-4 min-h-[100px]">
                        {contracts.length > 0 ? contracts.map((contract) => (
                            <div key={contract.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-xl ${contract.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-1">{contract.title}</h3>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-gray-500">{new Date(contract.created_at).toLocaleDateString('pt-BR')}</span>
                                            <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                            <span className={`font-bold flex items-center gap-1 ${contract.status === 'accepted' ? 'text-emerald-500' : 'text-yellow-500'
                                                }`}>
                                                {contract.status === 'accepted' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                {contract.status === 'accepted' ? 'Assinado' : 'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={contract.token ? `/c/${contract.token}` : '#'}
                                        title={`Ver Contrato: ${contract.title}`}
                                        aria-label={`Ver Contrato: ${contract.title}`}
                                        className="p-3 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-xl transition-all shadow-lg"
                                    >
                                        <ExternalLink size={20} />
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-600 bg-gray-900/20 border border-dashed border-gray-800 rounded-2xl">
                                Nenhum contrato emitido ainda.
                            </div>
                        )}
                    </div>

                    {/* Dica de Segurança */}
                    <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 flex gap-4">
                        <ShieldCheck size={24} className="text-blue-500 shrink-0" />
                        <div>
                            <h4 className="text-blue-200 font-bold mb-1">Assinatura Eletrônica Segura</h4>
                            <p className="text-blue-100/60 text-sm leading-relaxed">
                                Seus contratos são protegidos por criptografia e possuem validade jurídica total conforme a legislação brasileira de documentos digitais.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Arquivos Gerais */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Files size={24} className="text-purple-500" />
                        <h2 className="text-2xl font-bold text-white">Anexos</h2>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden divide-y divide-gray-800">
                        {attachments.length > 0 ? attachments.map((file) => (
                            <div key={file.id} className="p-4 hover:bg-gray-800/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                                        <Files size={18} />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium leading-tight mb-0.5">{file.file_name}</p>
                                        <p className="text-gray-500 text-xs">{(file.file_size / 1024).toFixed(0)} KB • {new Date(file.uploaded_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    className="p-2 text-gray-500 hover:text-white transition-colors"
                                    title={`Baixar ${file.file_name}`}
                                    aria-label={`Baixar ${file.file_name}`}
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-600">
                                <p className="text-xs">Nenhum anexo disponível.</p>
                            </div>
                        )}

                        <div className="p-6 text-center">
                            <p className="text-gray-500 text-xs mb-4">Deseja enviar um arquivo para nós?</p>
                            <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-xl transition-all">
                                Falar com Gestor
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl text-center">
                        <HelpCircle size={32} className="text-gray-700 mx-auto mb-3" />
                        <h4 className="text-gray-400 font-bold text-sm mb-1">Dúvidas sobre os arquivos?</h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                            Todos os arquivos são armazenados com segurança. Se não encontrar o que precisa, entre em contato via ticket.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
