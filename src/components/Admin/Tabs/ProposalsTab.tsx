import React, { useState, useEffect } from 'react';
import { Plus, Edit2, FileText, CheckCircle, Clock, Link as LinkIcon, Save, ChevronLeft } from 'lucide-react';
import { proposalService, Proposal, ProposalVersion, Tenant } from '../../../services/proposalService';
import Button from '../../Button';
import RichTextEditor from '../RichTextEditor';

const ProposalsTab: React.FC = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedTenant, setSelectedTenant] = useState('');

    // Editor state
    const [contentHtml, setContentHtml] = useState('');
    const [generatingLink, setGeneratingLink] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [propsData, tenantsData] = await Promise.all([
            proposalService.getProposals(),
            proposalService.getTenants()
        ]);
        setProposals(propsData);
        setTenants(tenantsData);
        if (tenantsData.length > 0) setSelectedTenant(tenantsData[0].id);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const newProp = await proposalService.createProposal(newTitle, selectedTenant);
        if (newProp) {
            setProposals([newProp, ...proposals]);
            setIsCreating(false);
            setNewTitle('');
            handleEdit(newProp);
        }
        setLoading(false);
    };

    const handleEdit = async (proposal: Proposal) => {
        setLoading(true);
        setEditingProposal(proposal);
        if (proposal.current_version_id) {
            const version = await proposalService.getProposalVersion(proposal.current_version_id);
            if (version) {
                setContentHtml(version.rendered_html);
            } else {
                setContentHtml('');
            }
        } else {
            setContentHtml('');
        }
        setLoading(false);
    };

    const handleSaveVersion = async () => {
        if (!editingProposal) return;
        setLoading(true);
        const payload = { blocks: [] }; // Basic payload for future blocks implementation
        const version = await proposalService.saveProposalVersion(editingProposal.id, payload, contentHtml);
        if (version) {
            alert('Nova versão salva com sucesso!');
            loadData();
        } else {
            alert('Erro ao salvar versão.');
        }
        setLoading(false);
    };

    const handleGenerateLink = async () => {
        if (!editingProposal) return;
        setGeneratingLink(true);
        const token = await proposalService.createPublicLink(editingProposal.id);
        if (token) {
            const link = `${window.location.origin}/p/${token}`;
            navigator.clipboard.writeText(link);
            alert('Link gerado e copiado para área de transferência!\n' + link);
            loadData();
        } else {
            alert('Erro ao gerar link.');
        }
        setGeneratingLink(false);
    };

    if (loading && !editingProposal && !isCreating) {
        return <div className="text-center py-10 text-slate-500">Carregando propostas...</div>;
    }

    if (editingProposal) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditingProposal(null)} className="text-slate-400 hover:text-brand-blue" title="Voltar">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{editingProposal.title}</h2>
                            <p className="text-sm text-slate-500">Status: {editingProposal.status}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleGenerateLink} loading={generatingLink} disabled={!editingProposal.current_version_id} title="Necessita pelo menos 1 versão salva">
                            <LinkIcon size={16} className="mr-2" /> Gerar Link
                        </Button>
                        <Button variant="primary" onClick={handleSaveVersion} loading={loading}>
                            <Save size={16} className="mr-2" /> Salvar Versão
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Conteúdo da Proposta</label>
                    <div className="min-h-[500px] border border-slate-200 rounded-xl overflow-hidden">
                        <RichTextEditor
                            value={contentHtml}
                            onChange={setContentHtml}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="text-brand-blue" /> Gestão de Propostas
                </h2>
                <Button variant="primary" onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancelar' : <><Plus size={16} className="mr-2" /> Nova Proposta</>}
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Título da Proposta</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                placeholder="Ex: Proposta de Marketing Digital"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cliente (Tenant)</label>
                            <select
                                required
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                                value={selectedTenant}
                                onChange={e => setSelectedTenant(e.target.value)}
                                title="Selecione o Cliente"
                            >
                                {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="primary" loading={loading}>Criar e Editar</Button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Título</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Data</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {proposals.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-slate-500">Nenhuma proposta encontrada.</td>
                            </tr>
                        ) : proposals.map((prop) => (
                            <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="py-4 px-6 font-medium text-slate-900">{prop.title}</td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${prop.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        prop.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                        {prop.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {prop.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-slate-500">
                                    {new Date(prop.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button
                                        onClick={() => handleEdit(prop)}
                                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar Proposta"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProposalsTab;
