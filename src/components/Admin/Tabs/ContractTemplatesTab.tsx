import React, { useState, useEffect } from 'react';
import { Plus, Edit2, FileCode, CheckCircle, Save, ChevronLeft } from 'lucide-react';
import { contractService, ContractTemplate } from '../../../services/contractService';
import Button from '../../Button';

const ContractTemplatesTab: React.FC = () => {
    const [templates, setTemplates] = useState<ContractTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Partial<ContractTemplate> | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await contractService.getTemplates();
        setTemplates(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        setLoading(true);
        const saved = await contractService.saveTemplate({
            ...editing,
            schema_json: typeof editing.schema_json === 'string' ? JSON.parse(editing.schema_json) : editing.schema_json
        });
        if (saved) {
            alert('Template salvo com sucesso!');
            setEditing(null);
            loadData();
        } else {
            alert('Erro ao salvar template.');
        }
        setLoading(false);
    };

    if (loading && !editing) return <div className="p-6 text-slate-500">Caregando templates...</div>;

    if (editing) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => setEditing(null)}
                        className="text-slate-400 hover:text-brand-blue"
                        title="Voltar para a Lista"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editing.id ? 'Editar Template' : 'Novo Template'}
                    </h2>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="template-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Título do Template</label>
                        <input
                            id="template-title"
                            required
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                            value={editing.title || ''}
                            onChange={e => setEditing({ ...editing, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="template-category" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
                        <input
                            id="template-category"
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue outline-none"
                            value={editing.category || ''}
                            onChange={e => setEditing({ ...editing, category: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="template-structure" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estrutura (JSON Schema)</label>
                        <textarea
                            id="template-structure"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue outline-none font-mono text-sm h-64"
                            value={typeof editing.schema_json === 'string' ? editing.schema_json : JSON.stringify(editing.schema_json || [], null, 2)}
                            onChange={e => setEditing({ ...editing, schema_json: e.target.value })}
                            placeholder="[{ name: 'bloco_1', label: 'Escopo Base' }]"
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="primary" type="submit" loading={loading}><Save size={16} className="mr-2" /> Salvar Template</Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FileCode className="text-brand-blue" /> Templates de Contrato
                </h2>
                <Button variant="primary" onClick={() => setEditing({ title: '', category: '', schema_json: [], is_active: true })}>
                    <Plus size={16} className="mr-2" /> Novo Template
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Título</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Categoria</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {templates.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-900">{t.title}</td>
                                <td className="py-4 px-6 text-sm text-slate-500">{t.category}</td>
                                <td className="py-4 px-6">
                                    <button onClick={() => setEditing(t)} className="p-2 text-slate-400 hover:text-brand-blue" title="Editar">
                                        <Edit2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {templates.length === 0 && (
                            <tr><td colSpan={3} className="py-10 text-center text-slate-500">Nenhum template encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractTemplatesTab;
