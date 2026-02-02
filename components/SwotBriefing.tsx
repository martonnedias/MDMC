import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Button from './Button';
import { FORM_VALIDATION_MSGS } from '../constants';
import {
  Zap, AlertTriangle, Lightbulb, TrendingUp, PackageSearch,
  Target, Gauge, Rocket, User, Lock, Wand2, CheckCircle2,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { leadService } from '../services/leadService';
import { useAuth } from './Auth/AuthProvider';

const swotSteps = [
  { title: 'Cadastro', icon: User },
  { title: 'Empresa', icon: PackageSearch },
  { title: 'Forças', icon: Zap },
  { title: 'Fraquezas', icon: AlertTriangle },
  { title: 'Oportunidades', icon: Lightbulb },
  { title: 'Ameaças', icon: TrendingUp },
  { title: 'Visão', icon: Target },
  { title: 'Disposição', icon: Gauge },
  { title: 'Final', icon: Rocket },
];

const ProgressIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.children[currentStep] as HTMLElement;
      if (activeElement) {
        const scrollLeft = activeElement.offsetLeft - (scrollRef.current.offsetWidth / 2) + (activeElement.offsetWidth / 2);
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  return (
    <div className="mb-10 relative">
      <div ref={scrollRef} className="flex items-center gap-0 overflow-x-auto pb-6 hide-scrollbar px-4">
        {swotSteps.map((section, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const Icon = section.icon;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-[100px]">
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 
                    ${isCompleted ? 'bg-brand-blue border-brand-blue text-white' :
                    isActive ? 'bg-white border-brand-orange text-brand-orange scale-110 shadow-lg' :
                      'bg-white border-gray-100 text-gray-300'}`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  {isActive && <div className="absolute -inset-1 rounded-full border-2 border-brand-orange animate-ping opacity-20"></div>}
                </div>
                <p className={`text-[10px] mt-3 font-bold uppercase tracking-tighter whitespace-nowrap 
                  ${isActive ? 'text-brand-orange' : isCompleted ? 'text-brand-blue' : 'text-gray-400'}`}>
                  {section.title}
                </p>
              </div>
              {index < swotSteps.length - 1 && (
                <div className="flex-1 min-w-[40px] h-[4px] -mt-8 relative">
                  <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 bg-brand-blue rounded-full transition-all duration-700" style={{ width: isCompleted ? '100%' : '0%' }}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const SwotBriefing: React.FC<{ selectedPlan?: string | null }> = ({ selectedPlan }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(user ? 1 : 0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    name: '', email: '', phone: '', whatsapp: '',
    companyName: '', segment: '', businessTime: '', teamSize: '',
    differential: '', qualityRating: '5', clientRelationship: 'Excelente', mainStrength: '', keyProcess: '', executionAbility: 3,
    dailyChallenge: '', financialOrg: 'Médio', processOrg: 'Médio', mainWeakness: '', delegationAbility: 2, specificBottleneck: '',
    expansionDemand: '', biggestOpportunity: '', techUsage: 'Sim', customerClarity: 'Sim', mainGoal6m: '', projectIdea: '',
    marketConcern: '', competitionRating: '3', mainThreat: '', adaptationAbility: 3, dependencyLevel: 'Alta', financialHealth: 'Saudável', currentWorry: '',
    mainGoal12m: '', directionClarity: 3, firstImprovement: '', longTermDream: '',
    changeDisposition: 4, biggestObstacle: '', recommendationOpenness: 'Total',
    plan: selectedPlan || 'essencial'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string | null => {
    // Email validation
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return FORM_VALIDATION_MSGS.email;
    }

    // Phone and WhatsApp validation (Brazilian format)
    if ((name === 'phone' || name === 'whatsapp') && value) {
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        return FORM_VALIDATION_MSGS.phone;
      }
    }

    // Required field validation for text inputs
    const requiredFields = ['name', 'email', 'phone', 'companyName', 'segment', 'businessTime', 'teamSize'];
    if (requiredFields.includes(name) && !value) {
      return FORM_VALIDATION_MSGS.required;
    }

    return null;
  };

  useLayoutEffect(() => {
    if (success) return;
    const container = sliderContainerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    const updateHeight = () => {
      const currentStepElement = slider.children[currentStep] as HTMLElement;
      if (currentStepElement) container.style.height = `${currentStepElement.offsetHeight}px`;
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(() => updateHeight());
    const currentStepElement = slider.children[currentStep];
    if (currentStepElement) resizeObserver.observe(currentStepElement);

    return () => resizeObserver.disconnect();
  }, [currentStep, formData]); // disable showReport dependency

  const handleAutoFill = () => {
    setFormData({
      ...formData,
      name: 'Carlos Oliveira', email: 'carlos@construtoraxyz.com.br', phone: '11977775555',
      companyName: 'Construtora XYZ', segment: 'Construção Civil', businessTime: '5 anos', teamSize: '12 pessoas',
      differential: 'Entrega com zero atrasos e garantia estendida de 5 anos.', qualityRating: '4', clientRelationship: 'Boa', mainStrength: 'Engenharia de ponta.', keyProcess: 'Gestão via APP.', executionAbility: 4,
      dailyChallenge: 'Dificuldade em gerenciar fornecedores.', financialOrg: 'Médio', processOrg: 'Médio', mainWeakness: 'Comercial ainda imaturo.', delegationAbility: 3, specificBottleneck: 'Orçamentação lenta.',
      expansionDemand: 'Alta procura corporativa.', biggestOpportunity: 'Novas tecnologias de construção sustentável.', techUsage: 'Parcial', customerClarity: 'Sim', mainGoal6m: 'Dobrar contratos.', projectIdea: 'Showroom digital.',
      marketConcern: 'Alta dos juros.', competitionRating: '4', mainThreat: 'Entrada de grandes players nacionais.', adaptationAbility: 3, dependencyLevel: 'Média', financialHealth: 'Saudável', currentWorry: 'Custo de mão de obra.',
      mainGoal12m: 'Ser referência regional.', directionClarity: 4, firstImprovement: 'Contratar comercial.', longTermDream: 'Expansão para 3 estados.',
      changeDisposition: 5, biggestObstacle: 'Verba de investimento imediato.', recommendationOpenness: 'Total'
    });
    alert(FORM_VALIDATION_MSGS.demoFilled);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));

    // Validate field on change
    const error = validateField(field, value);
    setValidationErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const { [field]: removed, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields before submission
    const errors: Record<string, string> = {};
    const requiredFields = ['name', 'email', 'phone', 'companyName', 'segment', 'businessTime', 'teamSize'];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      alert(FORM_VALIDATION_MSGS.fixErrors);
      return;
    }

    setLoading(true);
    const result = await leadService.saveBriefingLead({ ...formData, type: 'SWOT_ANALYSIS' });
    if (result) setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div className="pt-32 pb-32 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-green-100">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Dados Recebidos com Sucesso!</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Obrigado, <strong>{formData.name.split(' ')[0]}</strong>. <br />
            Nossa equipe de estratégia recebeu suas respostas. Um consultor sênior irá analisar seu perfil e gerar seu <strong>Plano Tático SWOT</strong> personalizado.
          </p>
          <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
            <p className="text-brand-darkBlue font-medium flex items-center justify-center gap-2">
              <Rocket size={20} className="text-brand-orange" />
              O relatório será enviado em até 24h para:
            </p>
            <p className="text-xl font-bold text-gray-800 mt-2">{formData.email}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="primary" className="py-4 px-8 text-lg">
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );

  const stepContentClass = "p-6 md:p-10 w-full flex-shrink-0 flex flex-col h-fit";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";
  const inputClass = "w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-blue outline-none text-sm";
  const selectClass = "w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-brand-blue outline-none text-sm";

  return (
    <div className="pt-24 pb-24 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold text-brand-darkBlue leading-tight">Auditoria Estratégica SWOT</h1>
            <p className="text-gray-500 text-sm">Mapeamento completo de Forças, Fraquezas e Riscos.</p>
          </div>
          <button onClick={handleAutoFill} className="flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-orange hover:text-white transition-all shadow-sm">
            <Wand2 size={18} /> Preenchimento Rápido (Demo)
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={currentStep} />

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div ref={sliderContainerRef} className="relative transition-[height] duration-500 overflow-hidden ease-in-out">
              <div ref={sliderRef} className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentStep * 100}%)` }}>

                {/* 0. Cadastro */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><User size={24} /> Cadastro do Gestor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Nome Completo *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={e => updateField('name', e.target.value)}
                        className={`${inputClass} ${validationErrors.name ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>E-mail Corporativo *</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => updateField('email', e.target.value)}
                        className={`${inputClass} ${validationErrors.email ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Telefone com DDD *</label>
                      <input
                        required
                        value={formData.phone}
                        onChange={e => updateField('phone', e.target.value)}
                        placeholder="(11) 98765-4321"
                        className={`${inputClass} ${validationErrors.phone ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>WhatsApp (opcional)</label>
                      <input
                        value={formData.whatsapp}
                        onChange={e => updateField('whatsapp', e.target.value)}
                        placeholder="(11) 98765-4321"
                        className={`${inputClass} ${validationErrors.whatsapp ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.whatsapp && <p className="text-red-500 text-xs mt-1">{validationErrors.whatsapp}</p>}
                    </div>
                  </div>
                </div>

                {/* 1. Empresa */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><PackageSearch size={24} /> Dados da Empresa</h3>
                  <div className="space-y-4">
                    <div><label className={labelClass}>Nome da Empresa *</label><input required value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} className={inputClass} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Segmento Principal *</label><input required value={formData.segment} onChange={e => updateField('segment', e.target.value)} className={inputClass} /></div>
                      <div><label className={labelClass}>Tempo de Mercado</label><input value={formData.businessTime} onChange={e => updateField('businessTime', e.target.value)} className={inputClass} /></div>
                    </div>
                    <div><label className={labelClass}>Nº de Colaboradores</label><input value={formData.teamSize} onChange={e => updateField('teamSize', e.target.value)} className={inputClass} /></div>
                  </div>
                </div>

                {/* 2. Forças */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-green-600"><Zap size={24} /> Forças (Interno)</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Principal Diferencial Competitivo *</label><textarea required value={formData.differential} onChange={e => updateField('differential', e.target.value)} className={inputClass} rows={2} /></div>
                    <div><label className={labelClass}>O que sua empresa faz melhor que todos? *</label><textarea required value={formData.mainStrength} onChange={e => updateField('mainStrength', e.target.value)} className={inputClass} rows={2} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Relacionamento com Clientes</label><select value={formData.clientRelationship} onChange={e => updateField('clientRelationship', e.target.value)} className={selectClass}><option value="Excelente">Excelente</option><option value="Boa">Boa</option><option value="Regular">Regular</option></select></div>
                      <div>
                        <label className={labelClass}>Habilidade de Execução (1-5)</label>
                        <input type="range" min="1" max="5" value={formData.executionAbility} onChange={e => updateField('executionAbility', parseInt(e.target.value))} className="w-full accent-green-500" />
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1 uppercase"><span>Baixa</span><span>Alta</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Fraquezas */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-red-600"><AlertTriangle size={24} /> Fraquezas (Interno)</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Maior desafio operacional diário? *</label><textarea required value={formData.dailyChallenge} onChange={e => updateField('dailyChallenge', e.target.value)} className={inputClass} rows={2} /></div>
                    <div><label className={labelClass}>Principal gargalo que impede lucro? *</label><textarea required value={formData.mainWeakness} onChange={e => updateField('mainWeakness', e.target.value)} className={inputClass} rows={2} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Organização Financeira</label><select value={formData.financialOrg} onChange={e => updateField('financialOrg', e.target.value)} className={selectClass}><option value="Alto">Alta</option><option value="Médio">Média</option><option value="Baixo">Baixa</option></select></div>
                      <div><label className={labelClass}>Organização de Processos</label><select value={formData.processOrg} onChange={e => updateField('processOrg', e.target.value)} className={selectClass}><option value="Alto">Alta</option><option value="Médio">Média</option><option value="Baixo">Baixa</option></select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Nível de Delegação (1-5)</label>
                        <input type="range" min="1" max="5" value={formData.delegationAbility} onChange={e => updateField('delegationAbility', parseInt(e.target.value))} className="w-full accent-red-500" />
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1 uppercase"><span>Centralizado</span><span>Delegado</span></div>
                      </div>
                      <div><label className={labelClass}>Qual o seu gargalo mais específico hoje?</label><input value={formData.specificBottleneck} onChange={e => updateField('specificBottleneck', e.target.value)} className={inputClass} placeholder="Ex: Orçamentação demorada" /></div>
                    </div>
                  </div>
                </div>

                {/* 4. Oportunidades */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-blue-600"><Lightbulb size={24} /> Oportunidades (Externo)</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Novos públicos ou demandas não atendidas? *</label><textarea required value={formData.expansionDemand} onChange={e => updateField('expansionDemand', e.target.value)} className={inputClass} rows={2} /></div>
                    <div><label className={labelClass}>Qual a maior oportunidade de mercado hoje? *</label><textarea required value={formData.biggestOpportunity} onChange={e => updateField('biggestOpportunity', e.target.value)} className={inputClass} rows={2} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Uso de Tecnologia</label><select value={formData.techUsage} onChange={e => updateField('techUsage', e.target.value)} className={selectClass}><option value="Sim">Avançado</option><option value="Parcial">Parcial</option><option value="Não">Inexistente</option></select></div>
                      <div><label className={labelClass}>Clareza do Perfil do Cliente</label><select value={formData.customerClarity} onChange={e => updateField('customerClarity', e.target.value)} className={selectClass}><option value="Sim">Claro</option><option value="Não">Confuso</option></select></div>
                    </div>
                  </div>
                </div>

                {/* 5. Ameaças */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-orange-600"><TrendingUp size={24} /> Ameaças (Externo)</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>O que mais preocupa você no mercado hoje? *</label><textarea required value={formData.marketConcern} onChange={e => updateField('marketConcern', e.target.value)} className={inputClass} rows={2} /></div>
                    <div><label className={labelClass}>Qual a principal ameaça da concorrência? *</label><textarea required value={formData.mainThreat} onChange={e => updateField('mainThreat', e.target.value)} className={inputClass} rows={2} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={labelClass}>Saúde Financeira</label><select value={formData.financialHealth} onChange={e => updateField('financialHealth', e.target.value)} className={selectClass}><option value="Saudável">Saudável</option><option value="Equilibrada">No Limite</option><option value="Preocupante">Preocupante</option></select></div>
                      <div><label className={labelClass}>Dependência de poucos clientes?</label><select value={formData.dependencyLevel} onChange={e => updateField('dependencyLevel', e.target.value)} className={selectClass}><option value="Baixa">Baixa</option><option value="Média">Média</option><option value="Alta">Alta</option></select></div>
                    </div>
                  </div>
                </div>

                {/* 6. Visão */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Target size={24} /> Visão Estratégica</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Meta principal para 12 meses? *</label><input required value={formData.mainGoal12m} onChange={e => updateField('mainGoal12m', e.target.value)} className={inputClass} placeholder="Ex: R$ 500k de faturamento adicional" /></div>
                    <div><label className={labelClass}>Onde quer chegar a longo prazo? *</label><textarea required value={formData.longTermDream} onChange={e => updateField('longTermDream', e.target.value)} className={inputClass} rows={3} placeholder="Sonho grande ou legado" /></div>
                    <div>
                      <label className={labelClass}>Clareza de Direcionamento (1-5)</label>
                      <input type="range" min="1" max="5" value={formData.directionClarity} onChange={e => updateField('directionClarity', parseInt(e.target.value))} className="w-full accent-brand-blue" />
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1 uppercase"><span>Perdido</span><span>Focado</span></div>
                    </div>
                  </div>
                </div>

                {/* 7. Disposição */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Gauge size={24} /> Disposição p/ Mudança</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Abertura p/ recomendações *</label><select value={formData.recommendationOpenness} onChange={e => updateField('recommendationOpenness', e.target.value)} className={selectClass}><option value="Total">Total</option><option value="Parcial">Depende do Custo</option><option value="Baixa">Baixa</option></select></div>
                    <div><label className={labelClass}>Maior obstáculo p/ a mudança hoje? *</label><textarea required value={formData.biggestObstacle} onChange={e => updateField('biggestObstacle', e.target.value)} className={inputClass} rows={2} placeholder="Falta de tempo, verba, resistência do time?" /></div>
                    <div>
                      <label className={labelClass}>Disposição p/ investir em novos processos (1-5)</label>
                      <input type="range" min="1" max="5" value={formData.changeDisposition} onChange={e => updateField('changeDisposition', parseInt(e.target.value))} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                </div>

                {/* 8. Finalizar */}
                <div className={stepContentClass}>
                  <div className="text-center py-16">
                    <Rocket size={80} className="text-brand-orange mx-auto mb-6 animate-bounce" />
                    <h3 className="text-3xl font-heading font-bold mb-4">Auditoria Estratégica Concluída!</h3>
                    <p className="text-gray-500 mb-10 max-w-md mx-auto">Tudo pronto. Nossa IA vai cruzar as forças e fraquezas para gerar seu plano de ação.</p>
                    <Button type="submit" loading={loading} fullWidth withIcon className="py-5 text-xl shadow-2xl">Gerar Relatório SWOT</Button>
                    <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest"><Lock size={12} className="inline mr-1" /> Dados sob sigilo absoluto</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-10 pb-10 flex items-center justify-between border-t border-gray-100 pt-10 bg-gray-50/20">
              <Button type="button" variant="secondary" onClick={() => { setCurrentStep(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={currentStep === 0} className={currentStep === 0 ? 'opacity-0' : 'py-3 px-8 text-sm font-bold'}><ChevronLeft size={18} className="mr-2" /> Voltar</Button>
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-black text-gray-300 uppercase mb-1 tracking-widest">Passo</div>
                <div className="text-sm font-bold text-brand-blue">{currentStep + 1} de {swotSteps.length}</div>
              </div>
              {currentStep < swotSteps.length - 1 ? (
                <Button type="button" onClick={() => { setCurrentStep(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="py-3 px-8 text-sm font-bold">Próximo <ChevronRight size={18} className="ml-2" /></Button>
              ) : <div className="w-[120px]"></div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwotBriefing;