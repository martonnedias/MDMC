import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ServiceData } from '../../../../services/adminService';
import Button from '../../../Button';

interface ServiceModuleEditorProps {
    sectionId: string;
    title: string;
    icon: React.ElementType;
    preview: React.ReactNode;
    services: ServiceData[];
    onNewService: (page: string, section: string) => void;
    onEditService: (service: ServiceData) => void;
    onDeleteService: (id: string) => void;
}

export const ServiceModuleEditor: React.FC<ServiceModuleEditorProps> = ({
    sectionId, title, icon: Icon, pageId, services,
    onNewService, onEditService, onDeleteService
}) => {
    const sectionServices = services
        .filter(s => {
            const matchPage = s.page === pageId || (!s.page && (
                (pageId === 'consultancy' && s.category === 'consultoria') ||
                (pageId === 'ads' && s.category === 'marketing') ||
                (s.category === pageId)
            ));
            const matchSection = s.section_id === sectionId || (!s.section_id && sectionId === 'pricing');
            return matchPage && matchSection;
        })
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return (
        <div className="mt-6 border rounded-2xl overflow-hidden border-slate-200 dark:border-white/5 bg-card shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-neutral/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-card border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-blue shadow-sm">
                        <Icon size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-title  tracking-tight text-xs">{title}</h4>
                        <p className="text-[9px] font-bold text-subtitle  ">{sectionServices.length} {(sectionServices.length === 1) ? 'Item' : 'Itens'}</p>
                    </div>
                </div>
                <Button
                    onClick={() => onNewService(pageId, sectionId)}
                    variant="outline-dark"
                    className="h-8 px-3 text-[9px] font-bold   flex items-center gap-2 hover:bg-brand-blue hover:text-white transition-all border-slate-200 dark:border-slate-700"
                    title={`Adicionar novo item em ${title}`}
                >
                    <Plus size={12} /> Adicionar
                </Button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sectionServices.map(service => (
                    <div key={service.id} className="group relative bg-neutral border border-slate-200 dark:border-white/5 rounded-xl p-4 hover:border-brand-blue/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-xs text-title line-clamp-1">{service.name}</h5>
                            <span className="text-[9px] font-bold bg-card text-subtitle px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-white/5">{service.price || 'Free'}</span>
                        </div>
                        <p className="text-[10px] text-subtitle line-clamp-2 h-7">{service.description}</p>
                        <div className="flex gap-2 border-t border-slate-100 dark:border-white/5 mt-3 pt-3">
                            <button
                                type="button"
                                onClick={() => onEditService(service)}
                                className="flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-lg bg-card text-subtitle hover:bg-brand-blue hover:text-white text-[9px] font-bold   transition-all border border-slate-100 dark:border-white/5"
                                title={`Editar ${service.name}`}
                            >
                                <Edit2 size={10} /> Editar
                            </button>
                            <button
                                type="button"
                                onClick={() => service.id && onDeleteService(service.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all dark:bg-red-900/10"
                                title={`Excluir ${service.name}`}
                                aria-label={`Excluir ${service.name}`}
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
                {sectionServices.length === 0 && (
                    <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl">
                        <p className="text-subtitle text-xs font-bold italic">Nenhum item nesta seção.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
