
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Button from './Button';
import { FORM_VALIDATION_MSGS } from '../constants';
import MarketingReport from './MarketingReport';
import {
  UserCheck, Briefcase, BarChart3, Target, Heart, Users, Globe,
  Headphones, TrendingUp, Wallet, History, Rocket,
  CheckCircle2, PackageSearch, Lock, Wand2, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { leadService } from '../services/leadService';
import { useAuth } from './Auth/AuthProvider';

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
      <div
        ref={scrollRef}
        className="flex items-center gap-0 overflow-x-auto pb-6 hide-scrollbar px-4"
      >
        {sections.map((section, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const Icon = section.icon;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-[100px] group">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 
                    ${isCompleted ? 'bg-brand-blue border-brand-blue text-white' :
                      isActive ? 'bg-white border-brand-orange text-brand-orange scale-110 shadow-lg shadow-orange-200' :
                        'bg-white border-gray-100 text-gray-300'}`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  {isActive && (
                    <div className="absolute -inset-1 rounded-full border-2 border-brand-orange animate-ping opacity-20"></div>
                  )}
                </div>
                <p className={`text-[10px] mt-3 font-bold uppercase tracking-tighter transition-colors whitespace-nowrap 
                  ${isActive ? 'text-brand-orange' : isCompleted ? 'text-brand-blue' : 'text-gray-400'}`}
                >
                  {section.title}
                </p>
              </div>

              {index < sections.length - 1 && (
                <div className="flex-1 min-w-[40px] h-[4px] -mt-8 mx-0 relative">
                  <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                  <div
                    className="absolute inset-0 bg-brand-blue rounded-full transition-all duration-700 ease-in-out"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Briefing: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    companyName: '', responsibleName: '', role: '', email: '', phone: '',
    website: '', instagram: '', facebook: '', location: '',
    segment: '', businessDescription: '', businessAge: '', teamSize: '', serviceType: '', businessMoment: '',
    productName: '', priceRange: '', qualityLevel: '', paymentMethods: [], maxInstallments: '',
    deliveryTime: '', needsBooking: '', hasWarranty: 'sim', warrantyDetails: '', uniqueDifferential: '',
    revenue: '', mainChallenge: '',
    goals: [], numericalMeta: '', agencyExpectation: '',
    mission: '', vision: '', values: '',
    idealCustomer: '', targetRegions: '', incomeLevel: '', leadSources: '', bestLeadChannel: '',
    postFrequency: '', socialCaretaker: '', hasAds: '', adsExperience: '', hasGMB: '',
    contactChannels: [], serviceRating: 10, ratingReason: '', improvementArea: '', lostSalesChannel: '', lossScenario: '', hasSalesTraining: 'Não', wouldTrainingHelp: 'Sim', biggestWeakness: '',
    topCompetitors: '', competitorAdvantages: '', ownAdvantages: '', competitorAdSpend: '',
    investmentBudget: '', startTime: '', previousExperience: '', whatNotToDo: '', extraInfo: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        responsibleName: user.user_metadata?.full_name || prev.responsibleName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  useLayoutEffect(() => {
    if (showReport) return;
    const container = sliderContainerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    const updateHeight = () => {
      const currentStepElement = slider.children[currentStep] as HTMLDivElement;
      if (currentStepElement) {
        container.style.height = `${currentStepElement.offsetHeight}px`;
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(() => updateHeight());
    const currentStepElement = slider.children[currentStep];
    if (currentStepElement) resizeObserver.observe(currentStepElement);

    return () => resizeObserver.disconnect();
  }, [currentStep, showReport, formData]);

  const handleAutoFill = () => {
    setFormData({
      ...formData,
      companyName: 'Mecânica do Futuro', responsibleName: 'Ricardo Almeida', role: 'Dono', email: 'contato@mecanicafuturo.com.br', phone: '11977778888',
      website: 'www.mecanicafuturo.com.br', instagram: '@mecanicafuturo', facebook: 'fb.com/mecanicafuturo', location: 'Curitiba - PR',
      segment: 'Automotivo / Oficinas', businessDescription: 'Oficina especializada em carros híbridos e elétricos de luxo.', businessAge: '2 anos', teamSize: '8 pessoas', serviceType: 'Ambos', businessMoment: 'Crescimento',
      productName: 'Manutenção Preventiva de Baterias Híbridas', priceRange: 'R$ 1.500–5.000', qualityLevel: 'alta/premium', paymentMethods: ['Cartão de Crédito', 'Pix'], maxInstallments: 'até 10x',
      deliveryTime: '1–3 dias', needsBooking: 'sim', hasWarranty: 'sim', warrantyDetails: '12 meses para peças e 6 meses para mão de obra.', uniqueDifferential: 'Única oficina com scanner original Tesla e Porsche na região sul.',
      revenue: 'R$ 80.000 a R$ 150.000', mainChallenge: 'Dificuldade em explicar o valor técnico e justificar o preço premium no WhatsApp.',
      goals: ['Vender mais', 'Gerar leads qualificados', 'Automatizar vendas'], numericalMeta: 'Dobrar o número de agendamentos mensais (de 15 para 30).', agencyExpectation: 'Uma parceria que entenda de tráfego pago.',
      mission: 'Garantir a mobilidade sustentável.', vision: 'Ser a oficina nº 1 em tecnologia elétrica.', values: 'Inovação, Precisão, Transparência.',
      idealCustomer: 'Público classe A, donos de veículos premium.', targetRegions: 'Curitiba e Região Metropolitana', incomeLevel: 'Alta Renda', leadSources: 'Indicação e Instagram', bestLeadChannel: 'Indicação traz os mais qualificados.',
      postFrequency: '3x por semana', socialCaretaker: 'Eu mesmo faço', hasAds: 'Sim, mas parou', adsExperience: 'Tentei impulsionar botões mas só veio gente perguntando preço básico.', hasGMB: 'Sim',
      contactChannels: ['WhatsApp', 'Telefone'], serviceRating: 8, ratingReason: 'Demora em responder orçamentos complexos.', improvementArea: 'Agilidade na resposta e follow-up.', lostSalesChannel: 'WhatsApp', lossScenario: 'Cliente pergunta o preço, passamos o valor técnico e ele para de responder.', hasSalesTraining: 'Não', wouldTrainingHelp: 'Sim', biggestWeakness: 'Não temos um script para contornar objeções de preço.',
      topCompetitors: 'Oficina do Alemão', competitorAdvantages: 'Infraestrutura de recepção luxuosa.', ownAdvantages: 'Mão de obra técnica superior.', competitorAdSpend: 'Igual',
      investmentBudget: 'R$ 3.000 a R$ 5.000', startTime: 'Imediato', previousExperience: 'Freelancers que faziam artes bonitas mas sem resultado.', whatNotToDo: 'Gastar dinheiro apenas com branding sem foco em leads.', extraInfo: 'Disponibilidade para reuniões apenas terças de manhã.'
    });
    setErrors({});
    setFormError(null);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
    setFormError(null);
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData((prev: any) => {
      const current = prev[field] || [];
      const next = current.includes(item) ? current.filter((i: string) => i !== item) : [...current, item];
      return { ...prev, [field]: next };
    });
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateStep = (step: number) => {
    const requiredFieldsByStep: Record<number, string[]> = {
      0: ['companyName', 'responsibleName', 'role', 'email', 'phone', 'location'],
      1: ['segment', 'businessDescription', 'serviceType', 'businessMoment'],
      2: ['productName', 'priceRange', 'qualityLevel', 'paymentMethods', 'deliveryTime', 'needsBooking', 'uniqueDifferential'],
      3: ['revenue', 'mainChallenge'],
      4: ['goals', 'numericalMeta', 'agencyExpectation'],
      5: ['mission', 'vision', 'values'],
      6: ['idealCustomer', 'targetRegions', 'incomeLevel', 'bestLeadChannel'],
      7: ['hasAds', 'hasGMB'],
      8: ['contactChannels', 'serviceRating', 'ratingReason', 'improvementArea', 'lostSalesChannel', 'biggestWeakness', 'lossScenario'],
      9: ['topCompetitors', 'ownAdvantages', 'competitorAdSpend'],
      10: ['investmentBudget', 'startTime'],
      11: ['whatNotToDo']
    };

    const stepFields = requiredFieldsByStep[step] || [];
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    stepFields.forEach(field => {
      const val = formData[field];
      if (Array.isArray(val)) {
        if (val.length === 0) {
          newErrors[field] = true;
          isValid = false;
        }
      } else if (!val || (typeof val === 'string' && val.trim() === '')) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    if (!isValid) {
      setFormError("Por favor, preencha todos os campos obrigatórios em destaque antes de prosseguir.");
    } else {
      setFormError(null);
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    const success = await leadService.saveBriefingLead({ ...formData, type: 'MARKETING_DIAGNOSIS' });
    if (success) {
      setShowReport(true);
    } else {
      setFormError(FORM_VALIDATION_MSGS.saveError);
    }
    setLoading(false);
  };

  if (showReport) return <MarketingReport formData={formData} onBack={() => window.location.reload()} />;

  const stepContentClass = "p-6 md:p-10 w-full flex-shrink-0 flex flex-col h-fit";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  const getInputClass = (field: string) => {
    const base = "w-full p-4 bg-gray-50 rounded-xl border outline-none transition-all text-sm";
    const errorState = errors[field] ? "border-red-500 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-brand-blue";
    return `${base} ${errorState}`;
  };

  const getSelectClass = (field: string) => {
    const base = "w-full p-4 bg-gray-50 rounded-xl border outline-none text-sm cursor-pointer hover:bg-gray-100 transition-colors";
    const errorState = errors[field] ? "border-red-500 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-brand-blue";
    return `${base} ${errorState}`;
  };

  return (
    <div className="pt-16 lg:pt-24 pb-12 lg:pb-24 bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold text-brand-darkBlue leading-tight">Diagnóstico Estratégico MD Solution</h1>
            <p className="text-gray-500 text-sm">Entenda os gargalos que impedem sua empresa de faturar mais.</p>
          </div>
          <button type="button" onClick={handleAutoFill} className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-blue hover:text-white transition-all shadow-sm">
            <Wand2 size={18} /> Preenchimento Mágico (Demo)
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep={currentStep} />

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div ref={sliderContainerRef} className="relative transition-[height] duration-500 overflow-hidden ease-in-out">
              <div ref={sliderRef} className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentStep * 100}%)` }}>

                {/* 1. Empresa */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><UserCheck /> Dados da Empresa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2"><label className={labelClass}>Nome da Empresa *</label><input required value={formData.companyName} onChange={e => updateField('companyName', e.target.value)} className={getInputClass('companyName')} placeholder="Ex: MD Solution Consultoria" /></div>
                    <div><label className={labelClass}>Seu Nome *</label><input required value={formData.responsibleName} onChange={e => updateField('responsibleName', e.target.value)} className={getInputClass('responsibleName')} placeholder="Como devemos te chamar?" /></div>
                    <div><label className={labelClass}>Cargo *</label><input required value={formData.role} onChange={e => updateField('role', e.target.value)} className={getInputClass('role')} placeholder="Ex: Sócio-Fundador" /></div>
                    <div><label className={labelClass}>E-mail Profissional *</label><input required type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className={getInputClass('email')} placeholder="empresa@exemplo.com.br" /></div>
                    <div><label className={labelClass}>WhatsApp com DDD *</label><input required value={formData.phone} onChange={e => updateField('phone', e.target.value)} className={getInputClass('phone')} placeholder="(11) 99999-9999" /></div>
                    <div><label className={labelClass}>Site</label><input value={formData.website} onChange={e => updateField('website', e.target.value)} className={getInputClass('website')} placeholder="www.suaempresa.com.br" /></div>
                    <div><label className={labelClass}>Instagram @</label><input value={formData.instagram} onChange={e => updateField('instagram', e.target.value)} className={getInputClass('instagram')} placeholder="@suaempresa" /></div>
                    <div className="md:col-span-2"><label className={labelClass}>Cidade/Estado *</label><input required value={formData.location} onChange={e => updateField('location', e.target.value)} className={getInputClass('location')} placeholder="Onde sua empresa está fisicamente?" /></div>
                  </div>
                </div>

                {/* 2. Negócio e Momento */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Briefcase /> Negócio e Momento Atual</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Segmento de Atuação *</label><input required value={formData.segment} onChange={e => updateField('segment', e.target.value)} className={getInputClass('segment')} placeholder="Ex: Estética Automotiva, Advocacia, E-commerce" /></div>
                    <div><label className={labelClass}>O que você faz e para quem? *</label><textarea required value={formData.businessDescription} onChange={e => updateField('businessDescription', e.target.value)} className={getInputClass('businessDescription')} rows={2} placeholder="Descreva brevemente sua proposta de valor"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Tempo de Mercado</label><input value={formData.businessAge} onChange={e => updateField('businessAge', e.target.value)} className={getInputClass('businessAge')} placeholder="Ex: 3 anos" /></div>
                      <div><label className={labelClass}>Nº de pessoas na equipe</label><input value={formData.teamSize} onChange={e => updateField('teamSize', e.target.value)} className={getInputClass('teamSize')} placeholder="Ex: 5 colaboradores" /></div>
                      <div><label className={labelClass}>Tipo de Atendimento *</label><select required value={formData.serviceType} onChange={e => updateField('serviceType', e.target.value)} className={getSelectClass('serviceType')}><option value="">Selecione...</option><option value="Presencial">Presencial</option><option value="Online">Online</option><option value="Ambos">Ambos</option></select></div>
                      <div><label className={labelClass}>Momento atual? *</label><select required value={formData.businessMoment} onChange={e => updateField('businessMoment', e.target.value)} className={getSelectClass('businessMoment')}><option value="">Selecione...</option><option value="Lancamento">Lançamento / Início</option><option value="Crescimento">Crescimento Acelerado</option><option value="Estavel">Estável / Manutenção</option><option value="Queda">Em queda de faturamento</option></select></div>
                    </div>
                  </div>
                </div>

                {/* 3. Produto */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-2 flex items-center gap-3 text-brand-blue"><PackageSearch /> Sobre o Produto/Serviço</h3>
                  <p className="text-gray-500 text-sm mb-8 italic">Dados técnicos essenciais para o posicionamento estratégico.</p>

                  <div className="space-y-6">
                    <div><label className={labelClass}>Principal produto ou serviço: *</label><textarea required value={formData.productName} onChange={e => updateField('productName', e.target.value)} className={getInputClass('productName')} rows={2} placeholder="Ex: Manutenção de Baterias Híbridas"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Faixa de preço média? *</label><select required value={formData.priceRange} onChange={e => updateField('priceRange', e.target.value)} className={getSelectClass('priceRange')}><option value="">Selecione...</option><option value="até R$ 50">Até R$ 50</option><option value="R$ 50–150">R$ 50–150</option><option value="R$ 150–500">R$ 150–500</option><option value="R$ 500–1.500">R$ 500–1.500</option><option value="R$ 1.500–5.000">R$ 1.500–5.000</option><option value="acima de R$ 5.000">Acima de R$ 5.000</option></select></div>
                      <div><label className={labelClass}>Qualidade percebida? *</label><select required value={formData.qualityLevel} onChange={e => updateField('qualityLevel', e.target.value)} className={getSelectClass('qualityLevel')}><option value="">Selecione...</option><option value="básica/acessível">Básica</option><option value="boa/intermediária">Boa / Intermediária</option><option value="alta/premium">Alta / Premium</option><option value="luxo/exclusiva">Luxo / Exclusiva</option></select></div>
                    </div>
                    <div>
                      <label className={labelClass}>Métodos de pagamento aceitos: *</label>
                      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 rounded-2xl border transition-all ${errors.paymentMethods ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                        {['Dinheiro', 'Pix', 'Cartão de Débito', 'Cartão de Crédito', 'Boleto', 'Parcelamento'].map(opt => (
                          <div key={opt} onClick={() => toggleArrayItem('paymentMethods', opt)} className={`p-3 rounded-xl border text-center cursor-pointer transition-all text-xs font-bold ${formData.paymentMethods.includes(opt) ? 'bg-brand-blue text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}>{opt}</div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Parcelamento máximo?</label><select value={formData.maxInstallments} onChange={e => updateField('maxInstallments', e.target.value)} className={getSelectClass('maxInstallments')}><option value="não parcelo">Não parcelo</option><option value="até 3x">Até 3x</option><option value="até 10x">Até 10x</option><option value="mais de 12x">Mais de 12x</option></select></div>
                      <div><label className={labelClass}>Prazo de entrega/execução? *</label><select required value={formData.deliveryTime} onChange={e => updateField('deliveryTime', e.target.value)} className={getSelectClass('deliveryTime')}><option value="">Selecione...</option><option value="imediato">Imediato</option><option value="1–3 dias">1–3 dias</option><option value="1 semana">1 semana</option><option value="mais de 1 mês">Mais de 1 mês</option></select></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Precisa de agendamento? *</label><select required value={formData.needsBooking} onChange={e => updateField('needsBooking', e.target.value)} className={getSelectClass('needsBooking')}><option value="">Selecione...</option><option value="sim">Sim, sempre</option><option value="preferencial">Preferencialmente</option><option value="não">Não precisa</option></select></div>
                      <div><label className={labelClass}>Oferece Garantia? *</label><select required value={formData.hasWarranty} onChange={e => updateField('hasWarranty', e.target.value)} className={getSelectClass('hasWarranty')}><option value="sim">Sim</option><option value="não">Não</option></select></div>
                    </div>
                    {formData.hasWarranty === 'sim' && (
                      <div><label className={labelClass}>Detalhes da Garantia:</label><input value={formData.warrantyDetails} onChange={e => updateField('warrantyDetails', e.target.value)} className={getInputClass('warrantyDetails')} placeholder="Ex: 12 meses para motor e câmbio" /></div>
                    )}
                    <div><label className={labelClass}>Diferencial Único (Sua força real) *</label><textarea required value={formData.uniqueDifferential} onChange={e => updateField('uniqueDifferential', e.target.value)} className={getInputClass('uniqueDifferential')} rows={2} placeholder="Por que eu deveria comprar de você e não do concorrente?"></textarea></div>
                  </div>
                </div>

                {/* 4. Saúde do Negócio */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><BarChart3 /> Saúde do Negócio</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Faixa de Faturamento Mensal Médio *</label><select required value={formData.revenue} onChange={e => updateField('revenue', e.target.value)} className={getSelectClass('revenue')}><option value="">Selecione...</option><option value="até R$ 10k">Até R$ 10.000</option><option value="R$ 10k - 30k">R$ 10.000 a R$ 30.000</option><option value="R$ 30k - 100k">R$ 30.000 a R$ 100.000</option><option value="acima de R$ 100k">Acima de R$ 100.000</option></select></div>
                    <div><label className={labelClass}>Seu maior desafio de vendas hoje? *</label><textarea required value={formData.mainChallenge} onChange={e => updateField('mainChallenge', e.target.value)} className={getInputClass('mainChallenge')} rows={3} placeholder="O que te tira o sono em relação às vendas?"></textarea></div>
                  </div>
                </div>

                {/* 5. Objetivos */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Target /> Objetivos Estratégicos</h3>
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>O que quer conquistar em 3–6 meses? *</label>
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 rounded-2xl border transition-all ${errors.goals ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                        {['Vender mais', 'Melhorar marca', 'Aumentar seguidores', 'Gerar leads qualificados', 'Automatizar vendas'].map(opt => (
                          <div key={opt} onClick={() => toggleArrayItem('goals', opt)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm ${formData.goals.includes(opt) ? 'bg-brand-blue border-brand-blue text-white shadow-md' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{opt}</div>
                        ))}
                      </div>
                    </div>
                    <div><label className={labelClass}>Meta numérica específica (leads/faturamento)? *</label><input required value={formData.numericalMeta} onChange={e => updateField('numericalMeta', e.target.value)} className={getInputClass('numericalMeta')} placeholder="Ex: 50 leads por dia" /></div>
                    <div><label className={labelClass}>O que você espera de uma agência ideal? *</label><textarea required value={formData.agencyExpectation} onChange={e => updateField('agencyExpectation', e.target.value)} className={getInputClass('agencyExpectation')} rows={2} placeholder="Parceria, apenas anúncios, gestão total?"></textarea></div>
                  </div>
                </div>

                {/* 6. Essência */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Heart /> Missão, Visão e Valores</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Missão (Sua razão de existir) *</label><textarea required value={formData.mission} onChange={e => updateField('mission', e.target.value)} className={getInputClass('mission')} rows={2} placeholder="O que você entrega de valor real?"></textarea></div>
                    <div><label className={labelClass}>Visão (Onde quer estar em 2 anos?) *</label><textarea required value={formData.vision} onChange={e => updateField('vision', e.target.value)} className={getInputClass('vision')} rows={2} placeholder="Seu objetivo de longo prazo"></textarea></div>
                    <div><label className={labelClass}>Valores (Até 5 palavras-chave) *</label><input required value={formData.values} onChange={e => updateField('values', e.target.value)} className={getInputClass('values')} placeholder="Ex: Honestidade, Agilidade, Tecnologia" /></div>
                  </div>
                </div>

                {/* 7. Público */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Users /> Público Alvo</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Descrição do Cliente Ideal (Persona) *</label><textarea required value={formData.idealCustomer} onChange={e => updateField('idealCustomer', e.target.value)} className={getInputClass('idealCustomer')} rows={3} placeholder="Dores, desejos e perfil socioeconômico"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Regiões de Atendimento *</label><input required value={formData.targetRegions} onChange={e => updateField('targetRegions', e.target.value)} className={getInputClass('targetRegions')} placeholder="Ex: São Paulo e Grande ABC" /></div>
                      <div><label className={labelClass}>Poder aquisitivo médio? *</label><select required value={formData.incomeLevel} onChange={e => updateField('incomeLevel', e.target.value)} className={getSelectClass('incomeLevel')}><option value="">Selecione...</option><option value="Popular">Popular / Acessível</option><option value="Classe Média">Classe Média</option><option value="Alta Renda">Alta Renda / Luxo</option></select></div>
                    </div>
                    <div><label className={labelClass}>Como as pessoas mais chegam hoje? (Indicação, Insta, Google...)</label><input value={formData.leadSources} onChange={e => updateField('leadSources', e.target.value)} className={getInputClass('leadSources')} /></div>
                    <div><label className={labelClass}>Qual canal traz os MELHORES clientes hoje e por que? *</label><textarea required value={formData.bestLeadChannel} onChange={e => updateField('bestLeadChannel', e.target.value)} className={getInputClass('bestLeadChannel')} rows={2} placeholder="Ex: Indicação, pois já chegam confiando no serviço." /></div>
                  </div>
                </div>

                {/* 8. Digital */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Globe /> Presença Digital</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Frequência de postagem?</label><input value={formData.postFrequency} onChange={e => updateField('postFrequency', e.target.value)} className={getInputClass('postFrequency')} placeholder="Ex: 3x por semana" /></div>
                      <div><label className={labelClass}>Quem cuida das redes?</label><input value={formData.socialCaretaker} onChange={e => updateField('socialCaretaker', e.target.value)} className={getInputClass('socialCaretaker')} placeholder="Agência, Eu mesmo?" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Já investe em anúncios? *</label><select required value={formData.hasAds} onChange={e => updateField('hasAds', e.target.value)} className={getSelectClass('hasAds')}><option value="">Selecione...</option><option value="Sim">Sim</option><option value="Sim, mas parou">Parei de investir</option><option value="Não">Nunca investi</option></select></div>
                      <div><label className={labelClass}>Tem Google Meu Negócio? *</label><select required value={formData.hasGMB} onChange={e => updateField('hasGMB', e.target.value)} className={getSelectClass('hasGMB')}><option value="">Selecione...</option><option value="Sim">Sim</option><option value="Não">Não</option></select></div>
                    </div>
                    <div><label className={labelClass}>Experiência anterior com anúncios</label><textarea value={formData.adsExperience} onChange={e => updateField('adsExperience', e.target.value)} className={getInputClass('adsExperience')} rows={2} placeholder="Foi bom? Ruim? O que deu certo?"></textarea></div>
                  </div>
                </div>

                {/* 9. Vendas */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-2 flex items-center gap-3 text-brand-blue"><Headphones /> Atendimento e Vendas</h3>
                  <p className="text-gray-500 text-xs mb-8 italic">Seja 100% sincero. A IA usará isso para detectar onde você perde dinheiro.</p>

                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Canais de Atendimento Principais: *</label>
                      <div className={`flex flex-wrap gap-2 p-1 rounded-2xl border transition-all ${errors.contactChannels ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                        {['WhatsApp', 'Instagram DM', 'Telefone', 'E-mail', 'Presencial', 'Site (Form)'].map(opt => (
                          <div key={opt} onClick={() => toggleArrayItem('contactChannels', opt)} className={`px-4 py-2 rounded-full border text-xs font-bold cursor-pointer transition-all ${formData.contactChannels.includes(opt) ? 'bg-brand-blue text-white shadow-sm' : 'bg-gray-50 text-gray-400'}`}>{opt}</div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Nota 0–10 p/ o seu Atendimento atual *</label><input type="number" min="0" max="10" required value={formData.serviceRating} onChange={e => updateField('serviceRating', e.target.value)} className={getInputClass('serviceRating')} /></div>
                      <div><label className={labelClass}>Por que deu essa nota? *</label><input required value={formData.ratingReason} onChange={e => updateField('ratingReason', e.target.value)} className={getInputClass('ratingReason')} placeholder="Justifique sua avaliação" /></div>
                    </div>
                    <div><label className={labelClass}>Onde o atendimento mais precisa melhorar? *</label><textarea required value={formData.improvementArea} onChange={e => updateField('improvementArea', e.target.value)} className={getInputClass('improvementArea')} rows={2} placeholder="Ex: Velocidade, Script de vendas, Follow-up"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Em qual canal você mais perde vendas hoje? *</label><input required value={formData.lostSalesChannel} onChange={e => updateField('lostSalesChannel', e.target.value)} className={getInputClass('lostSalesChannel')} placeholder="Ex: WhatsApp ou Instagram DM" /></div>
                      <div><label className={labelClass}>Qual o seu maior ponto fraco no atendimento? *</label><input required value={formData.biggestWeakness} onChange={e => updateField('biggestWeakness', e.target.value)} className={getInputClass('biggestWeakness')} placeholder="Ex: Demora na resposta" /></div>
                    </div>
                    <div><label className={labelClass}>Descreva uma situação em que perdeu uma venda recentemente: *</label><textarea required value={formData.lossScenario} onChange={e => updateField('lossScenario', e.target.value)} className={getInputClass('lossScenario')} rows={2} placeholder="O que aconteceu? O cliente não fechou por causa de preço? Sumiu?"></textarea></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClass}>Seu time já fez treinamento de vendas? *</label><select required value={formData.hasSalesTraining} onChange={e => updateField('hasSalesTraining', e.target.value)} className={getSelectClass('hasSalesTraining')}><option value="Sim">Sim</option><option value="Não">Não</option></select></div>
                      <div><label className={labelClass}>Sente que um treinamento ajudaria? *</label><select required value={formData.wouldTrainingHelp} onChange={e => updateField('wouldTrainingHelp', e.target.value)} className={getSelectClass('wouldTrainingHelp')}><option value="Sim">Sim, com certeza</option><option value="Não">Não, meu time já é ótimo</option></select></div>
                    </div>
                  </div>
                </div>

                {/* 10. Concorrência */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><TrendingUp /> Mercado e Concorrência</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Quem são seus 3 principais concorrentes? *</label><textarea required value={formData.topCompetitors} onChange={e => updateField('topCompetitors', e.target.value)} className={getInputClass('topCompetitors')} rows={2} placeholder="Nomes ou perfis de Instagram"></textarea></div>
                    <div><label className={labelClass}>O que eles fazem melhor que você?</label><textarea value={formData.competitorAdvantages} onChange={e => updateField('competitorAdvantages', e.target.value)} className={getInputClass('competitorAdvantages')} rows={2} placeholder="Seja honesto(a) para superá-los"></textarea></div>
                    <div><label className={labelClass}>Em que você é melhor que eles? *</label><textarea required value={formData.ownAdvantages} onChange={e => updateField('ownAdvantages', e.target.value)} className={getInputClass('ownAdvantages')} rows={2} placeholder="Sua força real no mercado"></textarea></div>
                    <div><label className={labelClass}>Investimento deles em marketing? *</label><select required value={formData.competitorAdSpend} onChange={e => updateField('competitorAdSpend', e.target.value)} className={getSelectClass('competitorAdSpend')}><option value="">Selecione...</option><option value="Mais que eu">Eles investem mais</option><option value="Igual">Investimento igual</option><option value="Menos">Investem menos</option><option value="Nada">Não investem nada</option></select></div>
                  </div>
                </div>

                {/* 11. Investimento */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><Wallet /> Investimento e Urgência</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Quanto pode investir/mês em anúncios? *</label><input required value={formData.investmentBudget} onChange={e => updateField('investmentBudget', e.target.value)} className={getInputClass('investmentBudget')} placeholder="Ex: R$ 3.000,00" /></div>
                    <div><label className={labelClass}>Quando pretende iniciar? *</label><select required value={formData.startTime} onChange={e => updateField('startTime', e.target.value)} className={getSelectClass('startTime')}><option value="">Selecione...</option><option value="Imediato">Imediato</option><option value="15 dias">Em 15 dias</option><option value="30 dias">Próximo mês</option></select></div>
                  </div>
                </div>

                {/* 12. Histórico */}
                <div className={stepContentClass}>
                  <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-brand-blue"><History /> Histórico de Marketing</h3>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Já trabalhou com agências ou freelancers anteriormente?</label><textarea value={formData.previousExperience} onChange={e => updateField('previousExperience', e.target.value)} className={getInputClass('previousExperience')} rows={2} placeholder="Como foi a experiência? O que faltou?"></textarea></div>
                    <div><label className={labelClass}>O que você NÃO quer mais em marketing? *</label><textarea required value={formData.whatNotToDo} onChange={e => updateField('whatNotToDo', e.target.value)} className={getInputClass('whatNotToDo')} rows={2} placeholder="Traumas ou experiências ruins anteriores"></textarea></div>
                    <div><label className={labelClass}>Algo importante que não perguntamos?</label><textarea value={formData.extraInfo} onChange={e => updateField('extraInfo', e.target.value)} className={getInputClass('extraInfo')} rows={2}></textarea></div>
                  </div>
                </div>

                {/* 13. Finalizar */}
                <div className={stepContentClass}>
                  <div className="text-center py-16">
                    <div className="relative inline-block mb-10">
                      <div className="absolute inset-0 bg-brand-orange/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                      <Rocket size={80} className="text-brand-orange relative z-10 animate-bounce" />
                    </div>
                    <h3 className="text-3xl font-heading font-bold text-gray-900 mb-6">Diagnóstico Completo!</h3>
                    <p className="text-lg text-gray-600 mb-12 max-w-lg mx-auto">Nossa IA está pronta para processar seus dados e gerar seu relatório estratégico.</p>

                    {formError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-fade-in">
                        <AlertCircle size={20} /> {formError}
                      </div>
                    )}

                    <div className="max-w-md mx-auto space-y-6">
                      <Button type="submit" variant="primary" loading={loading} className="w-full py-6 text-xl shadow-2xl" withIcon>
                        Enviar diagnóstico e receber relatório
                      </Button>
                      <p className="flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase pt-4 tracking-widest">
                        <Lock size={14} /> Dados criptografados e em sigilo
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Navegação */}
            <div className="px-6 md:px-10 pb-10 flex items-center justify-between border-t border-gray-100 pt-10 bg-gray-50/20">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCurrentStep(prev => Math.max(0, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setFormError(null);
                }}
                disabled={currentStep === 0}
                className={`py-3 px-8 text-sm font-bold ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                <ChevronLeft size={18} className="mr-2" /> Voltar
              </Button>

              <div className="flex flex-col items-center">
                <div className="text-[10px] font-black text-gray-300 uppercase mb-1 tracking-widest">Passo atual</div>
                <div className="text-sm font-bold text-brand-blue">{currentStep + 1} de {sections.length}</div>
              </div>

              {currentStep < sections.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="py-3 px-8 text-sm font-bold"
                >
                  Próximo <ChevronRight size={18} className="ml-2" />
                </Button>
              ) : (
                <div className="w-[120px]"></div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Briefing;
