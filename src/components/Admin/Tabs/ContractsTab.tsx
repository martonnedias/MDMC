import React, { useState, useEffect } from 'react';
import { Plus, Edit2, FileSignature, CheckCircle, Clock, Link as LinkIcon, Save, ChevronLeft } from 'lucide-react';
import { contractService, Contract, ContractTemplate } from '../../../services/contractService';
import { proposalService, Tenant } from '../../../services/proposalService';
import Button from '../../Button';
import RichTextEditor from '../RichTextEditor';

const ContractsTab: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [templates, setTemplates] = useState<ContractTemplate[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);

    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [generatingLink, setGeneratingLink] = useState(false);

    // Form
    const [newTitle, setNewTitle] = useState('');
    const [selectedTenant, setSelectedTenant] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [renderedHtml, setRenderedHtml] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [cData, tplData, tnData] = await Promise.all([
            contractService.getContracts(),
            contractService.getTemplates(),
            proposalService.getTenants()
        ]);
        setContracts(cData);
        setTemplates(tplData);
        setTenants(tnData);
        if (tnData.length > 0) setSelectedTenant(tnData[0].id);
        if (tplData.length > 0) setSelectedTemplate(tplData[0].id);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const nc = await contractService.createContract(newTitle, selectedTemplate, selectedTenant);
        if (nc) {
            setContracts([nc, ...contracts]);
            setIsCreating(false);
            setNewTitle('');
            handleEdit(nc);
        }
        setLoading(false);
    };

    const handleEdit = async (c: Contract) => {
        setLoading(true);
        setEditingContract(c);
        if (c.current_version_id) {
            const v = await contractService.getContractVersion(c.current_version_id);
            setRenderedHtml(v ? v.rendered_html : '');
        } else {
            setRenderedHtml('');
        }
        setLoading(false);
    };

    const handleSaveVersion = async () => {
        if (!editingContract) return;
        setLoading(true);
        const v = await contractService.saveContractVersion(editingContract.id, {}, renderedHtml);
        if (v) {
            alert('Versão do contrato salva!');
            loadData();
        } else {
            alert('Erro ao salvar contrato.');
        }
        setLoading(false);
    };

    const handleGenerateLink = async () => {
        if (!editingContract) return;
        setGeneratingLink(true);
        const token = await contractService.createPublicLink(editingContract.id);
        if (token) {
            const link = `${window.location.origin}/c/${token}`;
            navigator.clipboard.writeText(link);
            alert(`Link do contrato copiado!\n${link}`);
            loadData();
        }
        setGeneratingLink(false);
    };

    if (loading && !editingContract && !isCreating) {
        return <div className="py-10 text-center text-slate-500">Carregando Contratos...</div>;
    }

    if (editingContract) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditingContract(null)} className="text-slate-400 hover:text-brand-blue" title="Voltar">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{editingContract.title}</h2>
                            <p className="text-sm text-slate-500">Status: {editingContract.status}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleGenerateLink} loading={generatingLink} disabled={!editingContract.current_version_id}>
                            <LinkIcon size={16} className="mr-2" /> Gerar Link P/ Assinatura
                        </Button>
                        <Button variant="primary" onClick={handleSaveVersion} loading={loading}>
                            <Save size={16} className="mr-2" /> Salvar Edições
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Edição / Revisão do Contrato</label>
                    <div className="min-h-[600px] border border-slate-200 rounded-xl overflow-hidden">
                        <RichTextEditor value={renderedHtml} onChange={setRenderedHtml} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FileSignature className="text-brand-blue" /> Contratos
                </h2>
                <Button variant="primary" onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancelar' : <><Plus size={16} className="mr-2" /> Gerar Contrato</>}
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="contracts-title-ref" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Título / Ref</label>
                        <input
                            id="contracts-title-ref"
                            required type="text"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-brand-blue"
                            value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cliente (Tenant)</label>
                        <select
                            required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-brand-blue"
                            value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)} title="Cliente"
                        >
                            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Template</label>
                        <select
                            required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-brand-blue"
                            value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} title="Template"
                        >
                            {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <Button type="submit" variant="primary" loading={loading}><CheckCircle size={16} className="mr-2" /> Iniciar Preenchimento</Button>
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
                        {contracts.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 group">
                                <td className="py-4 px-6 font-medium text-slate-900">{c.title}</td>
                                <td className="py-4 px-6"><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{c.status.toUpperCase()}</span></td>
                                <td className="py-4 px-6 text-sm text-slate-500">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                                <td className="py-4 px-6 text-right">
                                    <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-brand-blue" title="Editar">
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
}

export default ContractsTab;
