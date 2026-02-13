import React from 'react';
import {
    UserCheck, Briefcase, BarChart3, Target, Heart, Users, Globe,
    Headphones, TrendingUp, Wallet, History, Rocket,
    PackageSearch
} from 'lucide-react';

const sections = [
    { title: 'Empresa', icon: UserCheck },
    { title: 'Momento', icon: Briefcase },
    { title: 'Produto', icon: PackageSearch },
    { title: 'Negócio', icon: BarChart3 },
    { title: 'Objetivos', icon: Target },
    { title: 'Essência', icon: Heart },
    { title: 'Público', icon: Users },
    { title: 'Digital', icon: Globe },
    { title: 'Vendas', icon: Headphones },
    { title: 'Concorrência', icon: TrendingUp },
    { title: 'Investimento', icon: Wallet },
    { title: 'Histórico', icon: History },
    { title: 'Finalizar', icon: Rocket },
];

interface ProgressIndicatorProps {
    currentStep: number;
    onStepClick?: (step: number) => void;
    sectionsCompleted?: boolean[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, onStepClick, sectionsCompleted = [] }) => {
    const progress = ((currentStep + 1) / sections.length) * 100;
    const currentSection = sections[currentStep];
    const Icon = currentSection.icon;

    return (
        <div className="mb-12 space-y-8">
            {/* Progress Bar Container */}
            <div className="relative pt-6 pb-2">
                {/* Background Track */}
                <div className="h-2 bg-gray-100 rounded-full shadow-inner relative">
                    {/* Fill Gradient */}
                    <div
                        className="h-full bg-gradient-to-r from-brand-blue to-brand-orange transition-all duration-700 ease-out rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>

                    {/* Step Points Overlay */}
                    <div className="absolute inset-0 flex justify-between items-center px-0 pointer-events-none min-w-[280px]">
                        {sections.map((_, idx) => {
                            const isPast = idx < currentStep;
                            const isCurrent = idx === currentStep;
                            const isSelectable = onStepClick && (isPast || sectionsCompleted[idx]);

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={!isSelectable}
                                    onClick={() => isSelectable && onStepClick(idx)}
                                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300 pointer-events-auto group relative -mt-0
                                    ${isPast ? 'bg-brand-blue border-brand-blue scale-100' :
                                            isCurrent ? 'bg-white border-brand-orange scale-125 shadow-md z-10' :
                                                'bg-white border-gray-200'}
                                    ${isSelectable ? 'cursor-pointer hover:border-brand-orange hover:scale-150' : 'cursor-default'}
                                `}
                                >
                                    {/* Tooltip */}
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-darkBlue text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20">
                                        {sections[idx].title}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-darkBlue rotate-45"></div>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Percentage Badge */}
                <div
                    className="absolute top-0 bg-brand-orange text-white px-2 py-0.5 rounded-full text-[9px] font-black shadow-lg transition-all duration-700 ease-out z-20"
                    style={{ left: `calc(${progress}% - 14px)` }}
                >
                    {Math.round(progress)}%
                </div>
            </div>

            {/* Current Step Info */}
            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                        <Icon className="text-white" size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Etapa Atual</p>
                        </div>
                        <h3 className="text-xl font-heading font-black text-brand-darkBlue">{currentSection.title}</h3>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Progresso</p>
                    <p className="text-2xl font-black text-brand-blue flex items-baseline justify-end">
                        {currentStep + 1}
                        <span className="text-gray-200 text-sm mx-1.5">/</span>
                        <span className="text-gray-300 text-lg">{sections.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { ProgressIndicator };
