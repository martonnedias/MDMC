import React, { useState } from 'react';
import {
    MessageSquare,
    Users,
    Zap,
    BarChart3,
    CheckCircle2,
    TrendingUp,
    Clock,
    Target,
    Instagram,
    Facebook,
    Mail,
    Phone,
    Scissors,
    Stethoscope,
    ShoppingBag,
    Wrench,
    GraduationCap,
    ArrowRight,
    ChevronDown,
    Layout,
    Tag,
    Calendar,
    MessageCircle,
    FileText,
    Send,
    Filter,
    PieChart
} from 'lucide-react';
import Button from './Button';

interface MDConverteServicePageProps { }

const MDConverteServicePage: React.FC<MDConverteServicePageProps> = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessType: ''
    });

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Redireciona para WhatsApp com os dados
        const message = `Olá! Quero conhecer o MD Converte%0A%0ANome: ${formData.name}%0AEmail: ${formData.email}%0ATelefone: ${formData.phone}%0ATipo de Negócio: ${formData.businessType}`;
        window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-white">

            {/* HERO SECTION */}
            <section className="relative pt-8 lg:pt-12 pb-20 lg:pb-32 px-4 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF7A2F] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0C3452] rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div className="space-y-8">
                            <div className="inline-block">
                                <span className="bg-gradient-to-r from-[#FF7A2F] to-[#FF9A5A] text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide shadow-lg">
                                    🚀 Atendimento + CRM + Automação
                                </span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold text-[#0C3452] leading-tight">
                                MD Converte: centralize seus atendimentos e
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A2F] to-[#FF9A5A]"> converta mais vendas</span>, todo dia
                            </h1>

                            <p className="text-xl text-[#2B2B2B] leading-relaxed">
                                Uma plataforma completa de atendimento, CRM e automação que organiza o caos de conversas, acompanha seus leads e mostra exatamente onde você está perdendo ou ganhando dinheiro.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-4">
                                {[
                                    'Todos os canais em um só lugar: WhatsApp, Instagram, Facebook e mais',
                                    'CRM simples para acompanhar cada cliente, do primeiro contato ao pós-venda',
                                    'Automação de mensagens, lembretes e follow-ups',
                                    'Relatórios claros de vendas, atendimento e conversão'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3 group">
                                        <CheckCircle2 className="w-6 h-6 text-[#FF7A2F] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                        <p className="text-[#2B2B2B] text-lg">{benefit}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a href="#contact-form" className="inline-block">
                                    <Button
                                        variant="primary"
                                        size="large"
                                        className="w-full sm:w-auto bg-gradient-to-r from-[#FF7A2F] to-[#FF9A5A] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                    >
                                        Quero conhecer o MD Converte
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </a>
                                <a href="#how-it-works" className="inline-block">
                                    <Button
                                        variant="outline"
                                        size="large"
                                        className="w-full sm:w-auto border-2 border-[#0C3452] text-[#0C3452] hover:bg-[#0C3452] hover:text-white transition-all duration-300"
                                    >
                                        Ver o sistema funcionando
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Right - Mockup/Visual */}
                        <div className="relative">
                            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src="/images/md-converte/md_converte_dashboard.png"
                                    alt="Painel MD Converte"
                                    className="rounded-2xl shadow-2xl border-4 border-white/10"
                                />
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl animate-bounce z-20">
                                <MessageSquare className="w-8 h-8 text-[#FF7A2F]" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl animate-pulse z-20">
                                <TrendingUp className="w-8 h-8 text-[#0C3452]" />
                            </div>

                            {/* Decorative Blur */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A2F]/20 to-[#0C3452]/20 blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM SECTION */}
            <section className="py-20 lg:py-24 px-4 bg-gradient-to-b from-white to-[#F5F7FA]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#0C3452] mb-6">
                            Você está perdendo vendas porque seu atendimento está espalhado?
                        </h2>
                        <p className="text-xl text-[#2B2B2B] max-w-4xl mx-auto leading-relaxed">
                            Hoje o cliente fala no WhatsApp, inbox, e-mail, comentário… e você não consegue acompanhar tudo. Atendimento se perde, ninguém sabe quem respondeu o quê, não existe histórico, nem controle de follow-up. No fim, não é falta de lead: é falta de organização e processo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: MessageCircle,
                                title: 'Conversas espalhadas',
                                description: 'Vários números, celulares e canais diferentes sem controle'
                            },
                            {
                                icon: Users,
                                title: 'Falta de responsável',
                                description: 'Ninguém sabe quem está cuidando de cada cliente'
                            },
                            {
                                icon: FileText,
                                title: 'Sem histórico',
                                description: 'Não lembra o que prometeu para o cliente'
                            },
                            {
                                icon: BarChart3,
                                title: 'Vendas invisíveis',
                                description: 'Não sabe quantos atendimentos viram venda de verdade'
                            }
                        ].map((pain, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-[#FF7A2F]"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF7A2F]/10 to-[#FF9A5A]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <pain.icon className="w-8 h-8 text-[#FF7A2F]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0C3452] mb-3">{pain.title}</h3>
                                <p className="text-[#2B2B2B]">{pain.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOLUTION SECTION */}
            <section className="py-20 lg:py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#0C3452] mb-6">
                            MD Converte: a central de atendimento, vendas e automação do seu negócio
                        </h2>
                        <p className="text-xl text-[#2B2B2B] max-w-4xl mx-auto leading-relaxed">
                            O MD Converte conecta seus canais de atendimento, organiza seus leads em um CRM fácil de usar e automatiza o que você não precisa fazer na mão. Assim, você e seu time atendem melhor, mais rápido e com muito mais chance de converter.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: MessageSquare,
                                title: 'Atendimento centralizado',
                                color: 'from-[#FF7A2F] to-[#FF9A5A]',
                                features: [
                                    'Todos os contatos em um só painel: WhatsApp, Instagram, Facebook',
                                    'Distribuição de atendimentos por atendente',
                                    'Histórico completo de conversas'
                                ]
                            },
                            {
                                icon: Target,
                                title: 'CRM simples e poderoso',
                                color: 'from-[#0C3452] to-[#1a5a8a]',
                                features: [
                                    'Cadastro de leads e clientes com informações importantes',
                                    'Funis de vendas personalizáveis por etapa',
                                    'Tarefas, lembretes, observações e tags'
                                ]
                            },
                            {
                                icon: Zap,
                                title: 'Automação inteligente',
                                color: 'from-[#FF7A2F] to-[#FF9A5A]',
                                features: [
                                    'Mensagens automáticas de boas-vindas, lembrete e follow-up',
                                    'Gatilhos baseados em etapa do funil e ações do cliente',
                                    'Redução de trabalho manual sem perder o toque humano'
                                ]
                            },
                            {
                                icon: BarChart3,
                                title: 'Relatórios de desempenho',
                                color: 'from-[#0C3452] to-[#1a5a8a]',
                                features: [
                                    'Visão clara de quantos leads entram, quantos avançam e quantos fecham',
                                    'Métricas por atendente, por canal e por período',
                                    'Foco em tomar decisões com dados, não só no "achismo"'
                                ]
                            }
                        ].map((pillar, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white to-[#F5F7FA] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <pillar.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0C3452] mb-4">{pillar.title}</h3>
                                <ul className="space-y-3">
                                    {pillar.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-[#FF7A2F] flex-shrink-0 mt-1" />
                                            <span className="text-[#2B2B2B]">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES IN DETAIL */}
            <section className="py-20 lg:py-24 px-4 bg-gradient-to-b from-[#F5F7FA] to-white">
                <div className="max-w-7xl mx-auto space-y-24">

                    {/* Feature 1: Omnichannel */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-gradient-to-br from-[#0C3452] to-[#1a5a8a] rounded-2xl p-8 shadow-2xl">
                                <div className="bg-white rounded-xl p-6 space-y-4">
                                    <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                                        <div className="flex gap-2">
                                            <Instagram className="w-6 h-6 text-pink-500" />
                                            <Facebook className="w-6 h-6 text-blue-500" />
                                            <MessageSquare className="w-6 h-6 text-green-500" />
                                        </div>
                                        <span className="text-sm font-semibold text-[#0C3452]">Caixa Unificada</span>
                                    </div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF7A2F] to-[#FF9A5A] rounded-full"></div>
                                            <div className="flex-grow">
                                                <div className="h-2 bg-gray-300 rounded w-2/3 mb-2"></div>
                                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 order-1 lg:order-2">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#0C3452]">
                                Atenda todos os canais em uma única tela
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Caixa de entrada unificada',
                                    'Organização por fila, setor ou atendente',
                                    'Transferência de conversas entre usuários',
                                    'Templates e respostas rápidas'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-[#FF7A2F] flex-shrink-0 mt-1" />
                                        <span className="text-lg text-[#2B2B2B]">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2: CRM & Funnels */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#0C3452]">
                                Acompanhe cada lead do primeiro contato ao fechamento
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Funis por tipo de serviço, produto ou campanha',
                                    'Arrasta e solta (drag and drop) nas etapas do funil',
                                    'Cadastro de valor de oportunidade para ver o potencial de receita',
                                    'Registro de atividades (ligações, mensagens, reuniões)'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-[#FF7A2F] flex-shrink-0 mt-1" />
                                        <span className="text-lg text-[#2B2B2B]">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="bg-gradient-to-br from-[#FF7A2F] to-[#FF9A5A] rounded-2xl p-8 shadow-2xl">
                                <div className="bg-white rounded-xl p-6">
                                    <h4 className="font-bold text-[#0C3452] mb-4">Funil de Vendas</h4>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Novos Leads', count: 24, color: 'bg-blue-500' },
                                            { name: 'Em Negociação', count: 12, color: 'bg-yellow-500' },
                                            { name: 'Proposta Enviada', count: 8, color: 'bg-orange-500' },
                                            { name: 'Fechados', count: 15, color: 'bg-green-500' }
                                        ].map((stage, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                                                    <span className="font-medium text-[#0C3452]">{stage.name}</span>
                                                </div>
                                                <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-[#0C3452]">
                                                    {stage.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Automation */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src="/images/md-converte/md_converte_automation.png"
                                    alt="Automação MD Converte"
                                    className="rounded-2xl shadow-2xl"
                                />
                                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-pulse">
                                    <Zap className="w-8 h-8 text-[#FF7A2F]" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 order-1 lg:order-2">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#0C3452]">
                                Automação que trabalha por você, mesmo quando você não está online
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Sequências automáticas de mensagens baseada em gatilhos',
                                    'Automação de tarefas internas (atribuir lead, mudar estágio, criar lembrete)',
                                    'Regras de horário de atendimento e mensagens fora do expediente'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-[#FF7A2F] flex-shrink-0 mt-1" />
                                        <span className="text-lg text-[#2B2B2B]">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 4: Reports */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#0C3452]">
                                Veja o que dá resultado e onde você está perdendo dinheiro
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Taxas de conversão por funil e etapa',
                                    'Desempenho por atendente',
                                    'Tempo médio de resposta e de fechamento'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-[#FF7A2F] flex-shrink-0 mt-1" />
                                        <span className="text-lg text-[#2B2B2B]">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative transform hover:scale-105 transition-transform duration-500">
                            <img
                                src="/images/md-converte/md_converte_reports.png"
                                alt="Relatórios MD Converte"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-bounce">
                                <BarChart3 className="w-8 h-8 text-[#0C3452]" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* WHO IS IT FOR */}
            <section className="py-20 lg:py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#0C3452] mb-6">
                            Feito para negócios que querem vender mais com organização
                        </h2>
                        <p className="text-xl text-[#2B2B2B] max-w-3xl mx-auto">
                            O MD Converte se adapta a diferentes modelos, sem complicação técnica.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[
                            { icon: Scissors, name: 'Barbearias, salões e clínicas de estética', color: 'from-purple-500 to-pink-500' },
                            { icon: Stethoscope, name: 'Clínicas médicas, odontológicas e de exames', color: 'from-blue-500 to-cyan-500' },
                            { icon: ShoppingBag, name: 'Lojas físicas e e-commerces', color: 'from-orange-500 to-red-500' },
                            { icon: Wrench, name: 'Prestadores de serviços em geral', color: 'from-green-500 to-teal-500' },
                            { icon: GraduationCap, name: 'Infoprodutores e afiliados', color: 'from-indigo-500 to-purple-500' }
                        ].map((niche, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-b from-white to-[#F5F7FA] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center group border border-gray-100 hover:border-[#FF7A2F]"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${niche.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <niche.icon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-sm font-medium text-[#2B2B2B]">{niche.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-20 lg:py-24 px-4 bg-gradient-to-b from-[#F5F7FA] to-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#0C3452] mb-6">
                            Como o MD Converte entra na rotina do seu negócio
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Conectamos os canais e organizamos o funil',
                                description: 'Configuramos os canais de atendimento e montamos um funil simples, adaptado à sua realidade.',
                                icon: Layout,
                                color: 'from-[#FF7A2F] to-[#FF9A5A]'
                            },
                            {
                                step: '02',
                                title: 'Seu time começa a atender dentro do MD Converte',
                                description: 'Tudo passa a entrar por um lugar só, com cada pessoa sabendo o que precisa fazer.',
                                icon: Users,
                                color: 'from-[#0C3452] to-[#1a5a8a]'
                            },
                            {
                                step: '03',
                                title: 'Você acompanha os resultados e ajusta com base em dados',
                                description: 'Em poucos dias, você já enxerga o que está funcionando e onde está vazando oportunidade.',
                                icon: TrendingUp,
                                color: 'from-[#FF7A2F] to-[#FF9A5A]'
                            }
                        ].map((step, index) => (
                            <div
                                key={index}
                                className="relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                            >
                                {/* Step Number Badge */}
                                <div className="absolute -top-6 left-8">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                                        <span className="text-2xl font-bold text-white">{step.step}</span>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center mb-6 opacity-20`}>
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0C3452] mb-4">{step.title}</h3>
                                    <p className="text-[#2B2B2B] leading-relaxed">{step.description}</p>
                                </div>

                                {/* Connector Line (except last) */}
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-0 -right-4 w-8 h-1 bg-gradient-to-r from-[#FF7A2F] to-transparent mt-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section className="py-20 lg:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-[#0C3452] to-[#1a5a8a] rounded-2xl p-12 shadow-2xl">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Mais do que uma ferramenta: acompanhamento de quem vive marketing e vendas todo dia
                        </h2>
                        <p className="text-xl text-white/90 leading-relaxed mb-8">
                            O MD Converte é implementado e acompanhado pela <strong>MD Solution</strong>, que usa na prática estratégias de geração de leads, atendimento e vendas. Você não fica sozinho com uma ferramenta: tem alguém olhando para o seu processo junto com você.
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 mt-8">
                            {[
                                { icon: CheckCircle2, text: 'Implementação Completa' },
                                { icon: Users, text: 'Treinamento da Equipe' },
                                { icon: Target, text: 'Acompanhamento Contínuo' }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                                    <item.icon className="w-5 h-5 text-[#FF7A2F]" />
                                    <span className="text-white font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING / COMMERCIAL */}
            <section className="py-20 lg:py-24 px-4 bg-gradient-to-b from-[#F5F7FA] to-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#0C3452] mb-6">
                            Como começar com o MD Converte
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                title: 'Implantação + Treinamento',
                                icon: Layout,
                                features: [
                                    'Configuração inicial da ferramenta',
                                    'Criação de funis, etiquetas e usuários',
                                    'Treinamento com sua equipe',
                                    'Acompanhamento nos primeiros dias'
                                ],
                                highlight: false
                            },
                            {
                                title: 'Mensalidade da Plataforma',
                                icon: TrendingUp,
                                features: [
                                    'Acesso ao MD Converte',
                                    'Suporte básico',
                                    'Atualizações e melhorias',
                                    'Escalável conforme sua necessidade'
                                ],
                                highlight: true
                            }
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group ${plan.highlight ? 'border-2 border-[#FF7A2F] relative' : 'border border-gray-100'
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-[#FF7A2F] to-[#FF9A5A] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                            ⭐ Recorrente
                                        </span>
                                    </div>
                                )}

                                <div className={`w-16 h-16 bg-gradient-to-br ${plan.highlight ? 'from-[#FF7A2F] to-[#FF9A5A]' : 'from-[#0C3452] to-[#1a5a8a]'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <plan.icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-[#0C3452] mb-6">{plan.title}</h3>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-[#FF7A2F] flex-shrink-0 mt-1" />
                                            <span className="text-[#2B2B2B]">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a href="#contact-form">
                            <Button
                                variant="primary"
                                size="large"
                                className="bg-gradient-to-r from-[#FF7A2F] to-[#FF9A5A] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                Quero um diagnóstico gratuito
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 lg:py-24 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#0C3452] mb-6">
                            Perguntas Frequentes
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: 'Preciso ter equipe grande para usar o MD Converte?',
                                answer: 'Não. O sistema funciona tanto para quem atende sozinho quanto para times com vários atendentes.'
                            },
                            {
                                question: 'O MD Converte substitui meu WhatsApp normal?',
                                answer: 'Não. Ele organiza e centraliza conversas a partir de integrações, mas você continua usando sua conta/canal normalmente, só que de forma profissional.'
                            },
                            {
                                question: 'É muito complicado de usar?',
                                answer: 'Não. Ele foi pensado para donos de negócio, não para quem é técnico. Você recebe implantação e treinamento.'
                            },
                            {
                                question: 'Posso usar em mais de um negócio?',
                                answer: 'Sim, você pode ter múltiplas contas ou workspaces (conforme plano).'
                            },
                            {
                                question: 'Consigo ver relatórios de quantas vendas estou fechando?',
                                answer: 'Sim, com funis, estágios e valores, você consegue acompanhar quanto está entrando, avançando e fechando em vendas.'
                            }
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white to-[#F5F7FA] rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-[#FF7A2F] transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-[#E2ECF7] transition-colors"
                                >
                                    <span className="text-lg font-semibold text-[#0C3452] pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-6 h-6 text-[#FF7A2F] flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`px-8 overflow-hidden transition-all duration-300 ${openFaq === index ? 'py-6 max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <p className="text-[#2B2B2B] leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section id="contact-form" className="py-20 lg:py-32 px-4 bg-gradient-to-br from-[#0C3452] via-[#1a5a8a] to-[#0C3452] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A2F] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF7A2F] rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                            Organize hoje o que está fazendo você perder vendas todo dia
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Deixe o MD Converte cuidar da organização, para você focar em atender bem e vender mais.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-[#0C3452] mb-2">
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7A2F] focus:outline-none transition-colors"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-[#0C3452] mb-2">
                                        E-mail *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7A2F] focus:outline-none transition-colors"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-[#0C3452] mb-2">
                                        Telefone/WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7A2F] focus:outline-none transition-colors"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="businessType" className="block text-sm font-semibold text-[#0C3452] mb-2">
                                        Tipo de Negócio *
                                    </label>
                                    <select
                                        id="businessType"
                                        name="businessType"
                                        required
                                        value={formData.businessType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7A2F] focus:outline-none transition-colors"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="barbearia">Barbearia/Salão</option>
                                        <option value="clinica">Clínica/Consultório</option>
                                        <option value="loja">Loja/E-commerce</option>
                                        <option value="servicos">Prestador de Serviços</option>
                                        <option value="infoprodutos">Infoprodutos/Afiliados</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="large"
                                    className="w-full bg-gradient-to-r from-[#FF7A2F] to-[#FF9A5A] hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    Agendar Reunião Estratégica
                                    <Send className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            <p className="text-sm text-center text-[#9CA3AF] mt-4">
                                Ao enviar, você concorda com nossos <a href="#termos" className="text-[#FF7A2F] hover:underline">Termos de Uso</a> e <a href="#privacidade" className="text-[#FF7A2F] hover:underline">Política de Privacidade</a>.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default MDConverteServicePage;
