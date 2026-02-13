import React, { useState, useEffect } from 'react';
import {
    Settings, LayoutDashboard, FileText, Package, Users,
    LogOut, ExternalLink, Sparkles, RotateCcw, ShieldCheck, Layout
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminService, SiteConfig, BlogPost, ServiceData } from '../../services/adminService';
import { aiService } from '../../services/aiService';

// Tabs
import DashboardTab from './Tabs/DashboardTab';
import ConfigTab from './Tabs/ConfigTab';
import BlogTab from './Tabs/BlogTab';
import ServicesTab from './Tabs/ServicesTab';
import LeadsTab from './Tabs/LeadsTab';
import ServiceEditForm from './Tabs/ServiceEditForm';
import PageEditorTab from './Tabs/PageEditorTab';

interface AdminPanelProps {
    onNavigate?: (view: any, params?: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'blog' | 'services' | 'leads' | 'pages'>('dashboard');
    const [selectedPage, setSelectedPage] = useState('sites');
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [briefings, setBriefings] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Editor States
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [configData, postsData, servicesData, leadsData, briefingsData, statsData] = await Promise.all([
                adminService.getSiteConfig(),
                adminService.getBlogPosts(true),
                adminService.getServices(),
                adminService.getLeads(),
                adminService.getBriefings(),
                adminService.getDashboardStats()
            ]);
            // DEFAULTS FROM CODEBASE (Current Hardcoded Values)
            const defaultConfig: SiteConfig = {
                id: 1,
                site_name: "MD Solution Marketing & Consultoria",
                phone: "(86) 99939-2997",
                whatsapp: "5586999392997",
                instagram_url: "https://instagram.com/mdsolution_marketing",
                facebook_url: "https://facebook.com/mdsolution",
                youtube_url: "#",
                primary_color: "#0052FF",
                secondary_color: "#FF6600",
                slogan: "Estrategistas Digitais em Escala",
                logo_url: "https://tyqmdlfruglmtswswpop.supabase.co/storage/v1/object/public/assets/logo.png",
                logo_light_url: "https://tyqmdlfruglmtswswpop.supabase.co/storage/v1/object/public/assets/logo-light.png",
                logo_footer_url: "",
                logo_height_header: "h-10",
                logo_height_footer: "h-12",
                is_blog_active: true,
                is_swot_active: true,
                theme: {
                    colors: {
                        background: "#FFFFFF",
                        card_background: "#FFFFFF",
                        header_background: "#FFFFFF",
                        footer_background: "#0F172A",
                        text_primary: "#111827",
                        text_secondary: "#6B7280"
                    },
                    border_radius: "2rem",
                    typography: {
                        font_family: "Inter",
                        heading_font: "Poppins"
                    }
                },
                content: {
                    sections: {
                        hero: { is_active: true, title: "Transformamos Cliques em Clientes Reais", subtitle: "Estratégias validadas para escalar seu negócio.", button_text: "Quero Escalar", button_redirect: "diagnosis" },
                        services: { is_active: true, title: "Soluções de Impacto", subtitle: "O que entregamos de melhor." },
                        swot: { is_active: true, title: "Auditoria Estratégica", subtitle: "Descubra onde você está perdendo dinheiro." },
                        sites: { is_active: true, title: "Sites de Alta Conversão", subtitle: "Design que vende por você 24h." },
                        ads: { is_active: true, title: "Tráfego Pago (Ads)", subtitle: "Atraia clientes qualificados todos os dias." },
                        gmb: { is_active: true, title: "Dominância Local (GMB)", subtitle: "Seja encontrado primeiro no Google." },
                        social_media: { is_active: true, title: "Social Media & Branding", subtitle: "Autoridade que converte seguidores em fãs." },
                        md_converte: { is_active: true, title: "MD Converte (CRM)", subtitle: "Gestão comercial eficiente." },
                        consultancy: { is_active: true, title: "Consultoria Comercial", subtitle: "Mentoria para sua equipe de vendas." },
                        diagnosis: { is_active: true, title: "Diagnóstico Gratuito", subtitle: "Avaliação completa do seu momento digital." },
                        footer: { is_active: true, title: "Vamos escalar seu negócio?", subtitle: "Fale com um estrategista agora." }
                    }
                }
            };

            // Merge DB config with defaults (DB wins, defaults fill gaps)
            const mergedConfig = configData ? {
                ...defaultConfig,
                ...configData,
                theme: { ...defaultConfig.theme, ...configData.theme },
                content: {
                    ...defaultConfig.content,
                    ...configData.content,
                    sections: { ...defaultConfig.content?.sections, ...configData.content?.sections }
                }
            } : defaultConfig;

            setConfig(mergedConfig);
            setPosts(postsData || []);
            setServices(servicesData || []);
            setLeads(leadsData || []);
            setBriefings(briefingsData || []);
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar dados admin:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        setLoading(true);
        const success = await adminService.updateSiteConfig(config);
        if (success) {
            alert('Configurações aplicadas com sucesso em todo o ecossistema MD Solution.');
        }
        setLoading(false);
    };

    const handleSavePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;
        setLoading(true);
        const success = await adminService.saveBlogPost(editingPost);
        if (success) {
            alert('Artigo publicado/atualizado com sucesso!');
            setEditingPost(null);
            loadData();
        }
        setLoading(false);
    };

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        setLoading(true);
        const cleaned = {
            ...editingService,
            features: editingService.features.filter(f => f.trim() !== '')
        };
        const success = await adminService.saveService(cleaned);
        if (success) {
            alert('Pacote de serviço atualizado!');
            setEditingService(null);
            loadData();
        }
        setLoading(false);
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm('Esta ação removerá permanentemente o post do site. Prosseguir?')) return;
        setLoading(true);
        const success = await adminService.deleteBlogPost(id);
        if (success) loadData();
        setLoading(false);
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Deseja realmente remover este pacote do catálogo?')) return;
        setLoading(true);
        const success = await adminService.deleteService(id);
        if (success) loadData();
        setLoading(false);
    };

    const handleNewService = (page: string = 'landing', section: string = 'general') => {
        setEditingService({
            name: '',
            category: 'sites', // Default
            page: page,
            section_id: section,
            price: '',
            description: '',
            features: [''],
            display_order: 0,
            is_active: true,
            is_highlighted: false
        });
    };

    const handleSyncDefaults = async () => {
        setLoading(true);
        if (!confirm('Deseja sincronizar todos os cards padrões de todas as páginas? Itens existentes não serão duplicados.')) {
            setLoading(false);
            return;
        }

        const defaults: ServiceData[] = [
            // --- LANDING PAGE (Geral) ---
            { name: "Essencial", subtitle: "Presença que funciona", description: "Pacote básico para quem está começando.", price: "R$ 750", category: "marketing", page: "landing", section_id: "pricing", features: ["Ads Meta/Google", "GMB", "Social Media 4 posts", "Relatórios"], is_active: true, display_order: 1, extra_info: "Verba a partir de R$ 750/mês" },
            { name: "Profissional", subtitle: "Crescimento Estruturado", description: "Nosso plano mais popular para escala.", price: "R$ 1.250", category: "marketing", page: "landing", section_id: "pricing", features: ["Ads Meta+Google", "GMB Otimizado", "8-12 posts", "Aquisição acelerada", "Reunião mensal"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "Mais Popular ⭐", extra_info: "Verba a partir de R$ 1.750/mês" },
            { name: "Premium", subtitle: "Alta Performance", description: "Para líderes de mercado.", price: "R$ 2.500", category: "marketing", page: "landing", section_id: "pricing", features: ["Funil Completo", "Vídeos/Reels", "Até 20 posts", "Análise CRO", "Atendimento VIP"], is_active: true, display_order: 3, extra_info: "Verba a partir de R$ 3.000/mês" },

            // --- SITES & LPs ---
            // Pricing
            { name: "Landing Page Essencial", subtitle: "Conversão & Leads", description: "Foco total em vendas e captura de leads.", price: "R$ 1.200", category: "sites", page: "sites", section_id: "pricing", features: ["Página Única", "Design Exclusivo", "Copywriting", "Formulário/Zap", "Analytics/Pixel"], is_active: true, display_order: 1, is_highlighted: true, badge_text: "Mais Rápido" },
            { name: "Site Institucional", subtitle: "Autoridade Profissional", description: "Sua marca com presença digital sólida.", price: "R$ 2.500", category: "sites", page: "sites", section_id: "pricing", features: ["Até 5 páginas", "Blog/Portfólio", "Painel Admin", "SSL/E-mails", "SEO/Treino"], is_active: true, display_order: 2 },
            { name: "E-commerce Start", subtitle: "Vendas Online", description: "Comece a vender online com profissionalismo.", price: "R$ 3.800", category: "sites", page: "sites", section_id: "pricing", features: ["Até 20 produtos", "Checkout VIP", "Pagamentos/Frete", "Painel Gestão", "Bônus E-mail"], is_active: true, display_order: 3 },
            { name: "E-commerce Premium", subtitle: "Escala & Automação", description: "Loja completa para alto volume de vendas.", price: "R$ 7.900", category: "sites", page: "sites", section_id: "pricing", features: ["50 itens + 2 LPs", "CRM/Automação", "Carrinho Abandon", "Insta Shopping", "Bônus Tráfego"], is_active: true, display_order: 4, badge_text: "Completo" },
            // Methodology
            { name: "Estratégia & UX", description: "Mapeamos a jornada do seu cliente para maximizar cliques.", price: "", category: "sites", page: "sites", section_id: "methodology", features: [], is_active: true, display_order: 1 },
            { name: "Design de Impacto", description: "Identidade visual premium que gera desejo e confiança.", price: "", category: "sites", page: "sites", section_id: "methodology", features: [], is_active: true, display_order: 2 },
            { name: "Engenharia de Performance", description: "Código limpo e rápido, pronto para o Google e escala.", price: "", category: "sites", page: "sites", section_id: "methodology", features: [], is_active: true, display_order: 3 },
            // Hero
            { name: "Configuração de Preço Inicial", description: "Define o valor que aparece no Hero do site.", price: "R$ 1.200", category: "sites", page: "sites", section_id: "hero", features: [], is_active: true, display_order: 0 },
            // Gallery & Testimonials (Added descriptions)
            { name: "Landing Pages de Alta Conversão", description: "Projeto MD Solution - LP Focada em conversão.", price: "", category: "sites", page: "sites", section_id: "gallery", features: [], is_active: true, display_order: 1, extra_info: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200" },
            { name: "Sites Institucionais de Elite", description: "Projeto MD Solution - Site Institucional Corporativo.", price: "", category: "sites", page: "sites", section_id: "gallery", features: [], is_active: true, display_order: 3, extra_info: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=1200" },
            { name: "Dr. Roberto Silva", subtitle: "Clínica OdontoLife", description: "Depoimento: Meu site antigo era lento...", price: "", category: "sites", page: "sites", section_id: "testimonials", features: [], is_active: true, display_order: 1, extra_info: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400" },
            // Pain Points
            { name: "Lentidão = Prejuízo", description: "53% dos usuários abandonam sites que demoram +3s", price: "", category: "sites", page: "sites", section_id: "pain-points", features: [], is_active: true, display_order: 1 },
            { name: "Mobile First", description: "Mais de 80% do tráfego vem do celular", price: "", category: "sites", page: "sites", section_id: "pain-points", features: [], is_active: true, display_order: 2 },
            { name: "Invisível no Google", description: "Sites mal estruturados são punidos pelo Google", price: "", category: "sites", page: "sites", section_id: "pain-points", features: [], is_active: true, display_order: 3 },
            // Benefits
            { name: "Design Premium & Exclusivo", description: "Identidade visual única que transmite autoridade.", price: "", category: "sites", page: "sites", section_id: "benefits", features: [], is_active: true, display_order: 1 },
            { name: "Ultra Rápido", description: "Google PageSpeed 90+", price: "", category: "sites", page: "sites", section_id: "benefits", features: [], is_active: true, display_order: 2 },
            { name: "SEO Ready", description: "Otimizado para buscas", price: "", category: "sites", page: "sites", section_id: "benefits", features: [], is_active: true, display_order: 3 },

            // --- MD CONVERTE (CRM) ---
            { name: "Starter", subtitle: "Para quem está começando a organizar.", description: "Plano inicial para organização.", price: "R$ 497", category: "md-converte", page: "md-converte", section_id: "pricing", features: ["1 Usuário", "Funil de Vendas", "Integração WhatsApp", "Dashboard Básico"], is_active: true, display_order: 1, extra_info: "/mês" },
            { name: "Business", subtitle: "Para equipes que precisam de escala.", description: "Ideal para times em crescimento.", price: "R$ 897", category: "md-converte", page: "md-converte", section_id: "pricing", features: ["Até 5 Usuários", "Automação de Mensagens", "Relatórios Avançados", "Gestão de Equipe"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "Recomendado", extra_info: "/mês" },
            { name: "Enterprise", subtitle: "Operações complexas e alto volume.", description: "Solução personalizada para grandes empresas.", price: "Sob Consulta", category: "md-converte", page: "md-converte", section_id: "pricing", features: ["Usuários Ilimitados", "API Dedicada", "Gerente de Conta", "Treinamento In-Company"], is_active: true, display_order: 3, extra_info: "Personalizado" },

            // --- SOCIAL MEDIA ---
            { name: "Start", subtitle: "Presença Essencial", description: "Manter sua rede ativa e profissional.", price: "R$ 997", category: "social_media", page: "social-media", section_id: "pricing", features: ["8 Posts/mês (Feed/Stories)", "Legendas Estratégicas", "Relatório Simples", "Design Profissional"], is_active: true, display_order: 1, extra_info: "/mês" },
            { name: "Pro", subtitle: "Crescimento & Autoridade", description: "Acelere seu crescimento com vídeo.", price: "R$ 1.897", category: "social_media", page: "social-media", section_id: "pricing", features: ["12 Posts + 4 Reels", "Gestão de Comunidade", "Stories Diários (Roteiro)", "Relatório de Performance"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "Favorito", extra_info: "/mês" },
            { name: "Authority", subtitle: "Dominação de Nicho", description: "Posicionamento de líder de mercado.", price: "R$ 3.500", category: "social_media", page: "social-media", section_id: "pricing", features: ["20 Posts + 8 Reels", "Roteiros de Vídeo", "Análise de Concorrência", "Linha Editorial Premium", "Suporte Prioritário"], is_active: true, display_order: 3, extra_info: "/mês" },

            // --- GOOGLE BUSINESS (GMB) ---
            { name: "Perfil Essencial", description: "Configuração completa para ser encontrado.", price: "R$ 450", category: "gmb", page: "gmb", section_id: "pricing", features: ["Cadastro Correto", "Otimização de Palavras-chave", "Configuração de Horários", "Upload de Fotos"], is_active: true, display_order: 1, extra_info: "Taxa Única" },
            { name: "Perfil Premium", description: "Destaque total e gestão de avaliações.", price: "R$ 850", category: "gmb", page: "gmb", section_id: "pricing", features: ["Tudo do Essencial", "Estratégia de Avaliações", "Postagens Semanais (1 mês)", "Consultoria de Rankeamento"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "Mais Completo", extra_info: "Taxa Única" },
            // Benefits GMB
            { name: "Encontrado por proximidade", description: "Ser encontrado por quem está perto e pronto para comprar.", price: "", category: "gmb", page: "gmb", section_id: "benefits", features: [], is_active: true, display_order: 1 },
            { name: "Confiança Instantânea", description: "Passar confiança com fotos e avaliações reais.", price: "", category: "gmb", page: "gmb", section_id: "benefits", features: [], is_active: true, display_order: 2 },

            // --- CONSULTORIA MAESTRO ---
            { name: "MAESTRO ESSENCIAL - Presencial", subtitle: "Excelência Local", description: "Treinamento focado em vendas presenciais.", price: "R$ 4.800", category: "consultoria", page: "consultancy", section_id: "pricing", features: ["Movimento 1 (8h)", "Manual Vol 1", "Certificado", "1 Mentoria", "Até 6 pessoas"], is_active: true, display_order: 1, extra_info: "2x de R$ 2.400" },
            { name: "MAESTRO COMPLETO", subtitle: "A Sinfonia das Vendas", description: "O treinamento mais completo do mercado.", price: "R$ 14.500", category: "consultoria", page: "consultancy", section_id: "pricing", features: ["3 Movimentos (24h)", "3 Manuais", "Implantação CRM", "3 Mentorias", "Até 8 pessoas"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "MAIS VENDIDO", extra_info: "4x de R$ 3.625" },
            { name: "TRANSFORMAÇÃO TOTAL", subtitle: "Acompanhamento Anual", description: "Acompanhamento de longo prazo.", price: "R$ 32.000", category: "consultoria", page: "consultancy", section_id: "pricing", features: ["Todos os Movimentos", "Diagnóstico 360", "Mentoria Mensal (6 meses)", "Grupo VIP"], is_active: true, display_order: 3, extra_info: "6x de R$ 5.333" },
            // Pain Points Consultoria
            { name: "Marketing sem Conversão", description: "Investimos em marketing mas conversão é baixa", price: "", category: "consultoria", page: "consultancy", section_id: "pain-points", features: [], is_active: true, display_order: 1 },
            { name: "Gargalo no WhatsApp", description: "Cliente some entre WhatsApp e loja", price: "", category: "consultoria", page: "consultancy", section_id: "pain-points", features: [], is_active: true, display_order: 2 },
            { name: "Falta de Padrão", description: "Cada vendedor atende de um jeito diferente", price: "", category: "consultoria", page: "consultancy", section_id: "pain-points", features: [], is_active: true, display_order: 3 },

            // --- ANÚNCIOS PAGOS (ADS) ---
            { name: "Gestão Inicial", subtitle: "Para quem está começando", description: "Primeiros passos no tráfego pago.", price: "R$ 1.000", category: "marketing", page: "ads", section_id: "pricing", features: ["Gestão Meta ou Google", "Setup de Conta", "Relatório Mensal"], is_active: true, display_order: 1, extra_info: "/mês + Verba" },
            { name: "Gestão Tráfego Pro", subtitle: "Escala Agressiva", description: "Para quem busca alta performance e escala.", price: "R$ 2.500", category: "marketing", page: "ads", section_id: "pricing", features: ["Meta + Google Ads", "Tracking Avançado (API)", "Dashboards em Tempo Real", "Otimização Semanal", "Consultoria de Criativos"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "Alta Performance", extra_info: "/mês + Verba" },
            // Method ADS
            { name: "Engenharia de Público", description: "Mapeamos cirurgicamente quem é o seu decisor.", price: "", category: "marketing", page: "ads", section_id: "methodology", features: [], is_active: true, display_order: 1 },
            { name: "Criativos Imã de Leads", description: "Desenvolvemos peças que falam com a dor do cliente.", price: "", category: "marketing", page: "ads", section_id: "methodology", features: [], is_active: true, display_order: 2 },

            // --- AUDITORIA SWOT ---
            { name: "Diagnóstico Express", subtitle: "Visão Geral Rápida", description: "Entenda o básico do seu cenário.", price: "R$ 97", category: "swot", page: "swot", section_id: "pricing", features: ["Análise Online", "Relatório Automático", "Pontuação Geral"], is_active: true, display_order: 1, extra_info: "Taxa Única" },
            { name: "Análise Profunda", subtitle: "Mergulho no Negócio", description: "Diagnóstico detalhado com especialista.", price: "R$ 497", category: "swot", page: "swot", section_id: "pricing", features: ["Reunião 1h", "Matriz SWOT Detalhada", "Plano de Ação (3 itens)", "Gravação da Call"], is_active: true, display_order: 2, is_highlighted: true, badge_text: "Custo-Benefício", extra_info: "Taxa Única" },
            { name: "Planejamento Estratégico", subtitle: "Direcionamento Anual", description: "Mapa completo para o ano.", price: "R$ 1.497", category: "swot", page: "swot", section_id: "pricing", features: ["3 Reuniões", "SWOT + PESTEL", "Roadmap de 12 meses", "KPIs Definidos", "Acompanhamento 30 dias"], is_active: true, display_order: 3, extra_info: "Taxa Única" },
            // SWOT Benefits
            { name: "Forças (Strengths)", description: "Vantagens internas: o que você faz melhor.", price: "", category: "swot", page: "swot", section_id: "benefits", features: [], is_active: true, display_order: 1, badge_text: "S" },
            { name: "Fraquezas (Weaknesses)", description: "Gargalos internos que impedem o lucro.", price: "", category: "swot", page: "swot", section_id: "benefits", features: [], is_active: true, display_order: 2, badge_text: "W" },
            // --- SOBRE NÓS (ABOUT) ---
            { name: "Missão", description: "Democratizar a alta performance digital para negócios locais.", price: "", category: "institucional", page: "about", section_id: "values", features: [], is_active: true, display_order: 1 },
            { name: "Visão", description: "Ser a maior aceleradora de negócios do Nordeste até 2026.", price: "", category: "institucional", page: "about", section_id: "values", features: [], is_active: true, display_order: 2 },
            { name: "Valores", description: "Transparência, Resultado, Velocidade e Excelência.", price: "", category: "institucional", page: "about", section_id: "values", features: [], is_active: true, display_order: 3 },
            // About Team
            { name: "Especialistas Certificados", description: "Time homologado Meta e Google Partners.", price: "", category: "institucional", page: "about", section_id: "team", features: [], is_active: true, display_order: 1 },
            { name: "Suporte Humanizado", description: "Nada de robôs. Gente cuidando de gente.", price: "", category: "institucional", page: "about", section_id: "team", features: [], is_active: true, display_order: 2 },

            // --- DIAGNÓSTICO (DIAGNOSIS) ---
            // Steps
            { name: "Análise de Presença", subtitle: "Passo 1", description: "Avaliamos como você aparece no Google e Redes.", price: "", category: "ferramentas", page: "diagnosis", section_id: "steps", features: [], is_active: true, display_order: 1 },
            { name: "Cliente Oculto", subtitle: "Passo 2", description: "Testamos seu atendimento comercial.", price: "", category: "ferramentas", page: "diagnosis", section_id: "steps", features: [], is_active: true, display_order: 2 },
            { name: "Plano Tático", subtitle: "Passo 3", description: "Entregamos o mapa do tesouro.", price: "", category: "ferramentas", page: "diagnosis", section_id: "steps", features: [], is_active: true, display_order: 3 },
        ];


        const success = await adminService.syncDefaultServices(defaults);
        if (success) {
            alert('Todos os cards estratégicos foram sincronizados com sucesso!');
            loadData();
        } else {
            alert('Houve um erro na sincronização. Tente novamente.');
        }
        setLoading(false);
    };


    const handleGenerateAI = async () => {
        const topic = prompt("Sobre qual tema você quer que a IA escreva?");
        if (!topic) return;
        setLoading(true);
        const generated = await aiService.generateBlogPost(topic, editingPost?.category || 'Estratégia');
        if (generated) {
            setEditingPost(prev => prev ? ({
                ...prev,
                title: generated.title,
                slug: generated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                excerpt: generated.excerpt,
                content: generated.content
            }) : null);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        if (onNavigate) onNavigate('landing');
    };

    return (
        <div className="min-h-screen bg-white flex font-sans">
            {/* Sidebar High-End */}
            <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen z-50">
                <div className="p-10 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-tight">MD <span className="text-brand-blue">Admin</span></h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Servidor Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="p-6 space-y-2 flex-grow">
                    <button
                        onClick={() => { setActiveTab('dashboard'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'dashboard' ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button
                        onClick={() => { setActiveTab('config'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'config' ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Settings size={18} /> Configurações
                    </button>
                    <button
                        onClick={() => { setActiveTab('pages'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'pages' ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Layout size={18} /> Páginas (Sites)
                    </button>
                    <button
                        onClick={() => { setActiveTab('blog'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all justify-between ${activeTab === 'blog' ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-3"><FileText size={18} /> Editorial (Blog)</div>
                        {stats?.totalPosts > 0 && <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'blog' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>{stats.totalPosts}</span>}
                    </button>
                    <button
                        onClick={() => { setActiveTab('services'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'services' ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Package size={18} /> Serviços e Preços
                    </button>
                    <button
                        onClick={() => { setActiveTab('leads'); setEditingPost(null); setEditingService(null); }}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all justify-between ${activeTab === 'leads' ? 'bg-brand-blue text-white shadow-2xl shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-3"><Users size={18} /> Leads e CRM</div>
                        {stats && (stats.totalLeads + stats.totalBriefings) > 0 && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'leads' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                {stats.totalLeads + stats.totalBriefings}
                            </span>
                        )}
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-800 space-y-2">
                    <button
                        onClick={() => onNavigate && onNavigate('landing')}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
                    >
                        <ExternalLink size={16} /> Ver Site Ao Vivo
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={16} /> Encerrar Sessão
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow bg-slate-50/50 min-h-screen relative">
                {/* Global Loading Overlay */}
                {loading && !editingPost && !editingService && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-[100] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <RotateCcw size={40} className="animate-spin text-brand-blue" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Sincronizando Ecossistema...</p>
                        </div>
                    </div>
                )}

                <div className="p-10 lg:p-14 max-w-[1600px] mx-auto">
                    {/* Global Editor Overlay */}
                    {editingService ? (
                        <div className="animate-fade-in">
                            <button
                                onClick={() => setEditingService(null)}
                                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors text-xs font-black uppercase tracking-widest"
                            >
                                <RotateCcw size={14} className="rotate-90" /> Voltar para o Painel
                            </button>
                            <ServiceEditForm
                                service={editingService}
                                setService={setEditingService}
                                onSave={handleSaveService}
                                onCancel={() => setEditingService(null)}
                                loading={loading}
                            />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && <DashboardTab stats={stats} leads={leads} briefings={briefings} onTabChange={setActiveTab} />}

                            {activeTab === 'config' && config && (
                                <ConfigTab
                                    config={config}
                                    setConfig={setConfig}
                                    onSave={handleSaveConfig}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'pages' && config && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Editando Página:</span>
                                        <select
                                            value={selectedPage}
                                            onChange={(e) => setSelectedPage(e.target.value)}
                                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full md:w-64 p-2.5 outline-none"
                                        >
                                            <option value="landing">Página Inicial (Landing)</option>
                                            <option value="sites">Sites & Landing Pages</option>
                                            <option value="ads">Tráfego Pago (Ads)</option>
                                            <option value="consultancy">Consultoria</option>
                                            <option value="swot">Análise SWOT</option>
                                            <option value="social-media">Social Media</option>
                                            <option value="gmb">Google Meu Negócio</option>
                                            <option value="md-converte">MD Converte (CRM)</option>
                                            <option value="about">Sobre a Empresa</option>
                                        </select>
                                    </div>

                                    <PageEditorTab
                                        key={selectedPage} // Force re-mount on change
                                        pageId={selectedPage}
                                        pageName={
                                            selectedPage === 'landing' ? 'Página Inicial (Landing)' :
                                                selectedPage === 'sites' ? 'Sites & Landing Pages' :
                                                    selectedPage === 'ads' ? 'Tráfego Pago (Ads)' :
                                                        selectedPage === 'consultancy' ? 'Consultoria' :
                                                            selectedPage === 'swot' ? 'Análise SWOT' :
                                                                selectedPage === 'social-media' ? 'Social Media' :
                                                                    selectedPage === 'gmb' ? 'Google Meu Negócio' :
                                                                        selectedPage === 'md-converte' ? 'MD Converte (CRM)' :
                                                                            'Sobre a Empresa'
                                        }
                                        config={config}
                                        setConfig={setConfig}
                                        onSave={handleSaveConfig}
                                        services={services}
                                        onEditService={setEditingService}
                                        onDeleteService={handleDeleteService}
                                        onNewService={handleNewService}
                                        loading={loading}
                                    />
                                </div>
                            )}

                            {activeTab === 'blog' && (
                                <BlogTab
                                    posts={posts}
                                    editingPost={editingPost}
                                    setEditingPost={setEditingPost}
                                    onSavePost={handleSavePost}
                                    onDeletePost={handleDeletePost}
                                    onGenerateAI={handleGenerateAI}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'services' && (
                                <ServicesTab
                                    services={services}
                                    onEdit={setEditingService}
                                    onDelete={handleDeleteService}
                                    onSync={handleSyncDefaults}
                                    onNew={() => handleNewService('landing', 'pricing')}
                                />
                            )}

                            {activeTab === 'leads' && <LeadsTab leads={leads} briefings={briefings} />}
                        </>
                    )}
                </div>
            </main>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bounceIn { 
                    0% { opacity: 0; transform: scale(0.3) translateY(20px); }
                    60% { opacity: 1; transform: scale(1.05) translateY(-5px); }
                    100% { transform: scale(1) translateY(0); }
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
};
