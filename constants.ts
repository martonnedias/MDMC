
import { PricingPlan, FaqItem, ServiceItem, ComboItem, PainPointItem } from './types';
import { Megaphone, MapPin, Share2, LineChart, Layout, Target, TrendingUp, Zap, AlertTriangle, Lightbulb, Users, ShieldCheck, Clock, MessageCircle, BarChart3, Star, Search, Smartphone, CheckCircle2, Globe, Monitor, LayoutDashboard } from 'lucide-react';

/** Mensagens de validação de formulários em português */
export const FORM_VALIDATION_MSGS = {
  required: 'Por favor, preencha este campo.',
  email: 'Por favor, informe um e-mail válido.',
  select: 'Por favor, selecione uma opção.',
  phone: 'Por favor, informe um telefone válido (10 ou 11 dígitos).',
  fixErrors: 'Por favor, corrija os erros no formulário antes de enviar.',
  fillAllRequired: 'Por favor, preencha todos os campos obrigatórios em destaque antes de prosseguir.',
  saveError: 'Erro ao salvar os dados. Tente novamente.',
  sendError: 'Ocorreu um erro ao enviar sua mensagem.',
  processError: 'Erro ao processar seu acesso. Tente novamente.',
  linkCopied: 'Link copiado para a área de transferência!',
  demoFilled: 'Preenchido com dados de demonstração estrategicamente restaurados!',
} as const;

export const CONTACT_INFO = {
  whatsapp: "86994144709",
  whatsappFormatted: "(86) 99414-4709",
  whatsappLink: "https://wa.me/5586994144709",
  email: "contato@mdsolution.com.br",
  instagram: "https://instagram.com/mdsolution",
  facebook: "https://facebook.com/mdsolution",
  youtube: "https://youtube.com/@mdsolution"
};

export const HERO_CONTENT = {
  headline: "Sua empresa merece ser vista por quem realmente importa.",
  subheadline: "Unimos estratégia de gestão e performance digital para colocar sua empresa no topo.",
  pain: "Oferecemos dois caminhos gratuitos para o seu crescimento: Um foco em Vendas Imediatas (Marketing) ou um foco em Estratégia de Negócio (SWOT). Escolha o seu momento abaixo:",
  cta: "Ver Planos de Crescimento",
  secondaryCta: "Diagnóstico de Vendas (Marketing)",
  swotCta: "Análise SWOT (Estratégia)"
};

export const GMB_CONTENT = {
  hero: {
    title: "Coloque sua empresa no mapa com o Google Meu Negócio.",
    subtitle: "Apareça nas buscas do Google e no Maps para quem está procurando exatamente o que você faz, na sua região.",
    pain: "Sabe quando o cliente fala 'achei vocês no Google'? Se a sua empresa não aparece no Maps com informações certas e boas fotos, você está entregando faturamento de bandeja para o seu concorrente.",
    cta: "Quero aparecer no Google e no Maps"
  },
  importance: {
    title: "Por que o Google Meu Negócio é essencial para o seu negócio local?",
    description: "A maioria das pessoas procura no Google antes de ligar ou ir até um lugar. Sem o perfil, sua empresa praticamente 'não existe' nas buscas locais.",
    benefits: [
      { title: "Ser encontrado por quem está perto", icon: MapPin },
      { title: "Passar confiança com fotos e avaliações", icon: Star },
      { title: "Aumentar ligações, mensagens e visitas", icon: MessageCircle },
      { title: "Aparecer à frente de concorrentes", icon: TrendingUp },
      { title: "Melhorar o SEO local organicamente", icon: Search }
    ]
  },
  infoList: {
    title: "O que cuidamos no seu perfil",
    intro: "A MDigital se responsabiliza por coletar, organizar e preencher todas as informações de forma profissional, do zero ao resultado:",
    items: [
      "Nome da empresa exatamente como no mundo real",
      "Endereço completo ou área de atendimento estratégica",
      "Telefone e WhatsApp para contato imediato",
      "Horário de funcionamento (feriados e horários especiais)",
      "Categorias certas (foco em SEO Local)",
      "Descrição profissional (O que faz, diferenciais e palavras-chave)",
      "Fotos de alta qualidade: Fachada, interior, equipe e produtos",
      "Link do site e botões de ações rápidas (Rotas, Ligar, Mensagem)"
    ]
  },
  process: {
    title: "Como funciona o nosso serviço",
    steps: [
      { title: "Diagnóstico Rápido", text: "Entendemos se você já tem um perfil e o que falta para ele performar de verdade." },
      { title: "Coleta de Dados", text: "Organizamos suas informações, fotos, horários e diferenciais competitivos." },
      { title: "Otimização Estratégica", text: "Configuramos tudo dentro das diretrizes de SEO local do Google." },
      { title: "Verificação Oficial", text: "Acompanhamos o processo de verificação até o perfil ficar 'Ao Vivo' e seguro." },
      { title: "Publicação e Ajustes", text: "Revisão final, melhoria de fotos/textos e ativação dos botões de ação." }
    ]
  },
  results: {
    title: "O que esperar de um perfil bem feito",
    items: [
      "Mais pessoas encontrando sua empresa no Google e Maps",
      "Aumento real de ligações, mensagens e pedidos de rota",
      "Clientes chegando dizendo: 'te achei no Google'",
      "Mais confiança com fotos profissionais e avaliações reais",
      "Diferenciação clara frente a concorrentes desorganizados"
    ],
    case: "Barbearia local aumentou em 35% o número de ligações em 60 dias apenas com o perfil otimizado e fotos atualizadas."
  },
  packages: [
    {
      name: "Setup Inicial",
      description: "Ideal para quem quer 'arrumar a casa' e começar a ser encontrado corretamente.",
      features: [
        "Criação ou Reivindicação do perfil",
        "Otimização completa de SEO local",
        "Configuração de todas as informações",
        "Curadoria de 1 rodada de fotos",
        "Configuração de serviços/produtos"
      ],
      price: "Sob Consulta",
      cta: "Contratar Setup"
    },
    {
      name: "Gestão Mensal",
      description: "Ideal para dominar a região e manter o perfil sempre como autoridade máxima.",
      features: [
        "Tudo do pacote Setup Inicial",
        "Posts semanais estratégicos no Perfil",
        "Resposta profissional a avaliações",
        "Relatório mensal de desempenho real",
        "Atualização constante de infos e promoções"
      ],
      highlight: true,
      price: "Sob Consulta",
      cta: "Contratar Gestão"
    }
  ],
  comparison: {
    title: "Amador vs. Profissional",
    subtitle: "A diferença entre apenas estar no mapa e dominar sua região.",
    headers: ["Recurso", "Perfil Comum", "Estratégia MDigital"],
    rows: [
      ["SEO Local", "Nenhum ou básico", "Configuração técnica avançada"],
      ["Qualidade Visual", "Fotos de celular/amadoras", "Curadoria premium e estratégica"],
      ["Engajamento", "Ignora avaliações", "Respostas profissionais e posts"],
      ["Atendimento", "Apenas telefone", "Botões de WhatsApp e sites ativos"],
      ["Visibilidade", "Depende da sorte", "Rankings monitorados e otimizados"]
    ]
  },
  faqs: [
    {
      question: "Já tenho Google Meu Negócio, vocês podem arrumar?",
      answer: "Com certeza! Fazemos a reivindicação de propriedade (se necessário) e a otimização completa de perfis desatualizados."
    },
    {
      question: "Quanto tempo leva pra começar a aparecer?",
      answer: "O impacto na relevância das buscas locais costuma ser percebido entre 15 a 30 dias após a otimização completa."
    },
    {
      question: "Preciso ter site para usar Google Meu Negócio?",
      answer: "Não é obrigatório, mas ajuda muito. O perfil funciona como um 'mini site' de alta conversão para buscas locais."
    },
    {
      question: "O que acontece se eu mudar de endereço?",
      answer: "Nós realizamos a atualização técnica necessária para que você mantenha sua autoridade, fotos e avaliações no novo local."
    }
  ]
};

export const SWOT_SECTION_CONTENT = {
  title: "Escolha o nível de profundidade do seu diagnóstico SWOT",
  subtitle: "Você decide até onde quer ir: desde um relatório estratégico pronto para usar até uma experiência completa com explicação personalizada.",
  description: "Muitos empresários confundem marketing com gestão. Aqui na MD Solution, ajudamos você nas duas frentes com clareza absoluta.",
  definitions: [
    {
      letter: "S",
      title: "Forças (Strengths)",
      text: "Vantagens internas: o que você faz melhor que todos os seus concorrentes.",
      icon: Zap,
      color: "text-green-500 bg-green-50"
    },
    {
      letter: "W",
      title: "Fraquezas (Weaknesses)",
      text: "Gargalos internos: processos lentos ou falhas que impedem o lucro real.",
      icon: AlertTriangle,
      color: "text-red-500 bg-red-50"
    },
    {
      letter: "O",
      title: "Oportunidades (Opportunities)",
      text: "Fatores externos: tendências e novos canais que você ainda não explorou.",
      icon: Lightbulb,
      color: "text-blue-500 bg-blue-50"
    },
    {
      letter: "T",
      title: "Ameaças (Threats)",
      text: "Riscos externos: mudanças no mercado ou concorrência agressiva.",
      icon: TrendingUp,
      color: "text-orange-500 bg-orange-50"
    }
  ],
  howItWorks: [
    "Você responde perguntas sobre a estrutura e visão do negócio.",
    "Nossa inteligência audita seus diferenciais e riscos de mercado.",
    "Você recebe um Relatório Estratégico para organizar sua gestão."
  ],
  benefits: [
    "Clareza total sobre o 'motor' da sua empresa;",
    "Identificação de falhas de gestão que geram prejuízo;",
    "Plano de ação para os próximos 12 meses;",
    "Diferente do marketing, aqui olhamos para a SAÚDE do negócio.",
    "Ideal para quem quer 'arrumar a casa' antes de escalar."
  ],
  target: "A Análise SWOT é para o empresário que quer clareza estratégica. O Diagnóstico de Marketing é para quem precisa de leads no WhatsApp amanhã.",
  cta: "Escolher meu Plano SWOT",
  ctaSecondary: "Diagnóstico de Vendas (Marketing)",
  ctaNote: "O diagnóstico básico é o ponto de partida para qualquer decisão séria."
};

export const SWOT_PLANS = [
  {
    id: 'essencial',
    name: "Plano Essencial",
    subtitle: "Diagnóstico SWOT Express",
    price: "R$ 247",
    description: "Para quem quer clareza rápida em um formato direto, sem reuniões. Um raio-x estratégico para ler no seu tempo.",
    features: [
      "Acesso ao questionário completo MD Solution",
      "Relatório SWOT Personalizado (PDF)",
      "Análise Detalhada dos 4 quadrantes",
      "Resumo Executivo Estratégico",
      "Sugestões iniciais de ações práticas",
      "Ideal para: Sair da 'escuridão' e ter clareza"
    ],
    cta: "Escolher Essencial",
    highlight: false,
    badge: ""
  },
  {
    id: 'estrategico',
    name: "Plano Estratégico",
    subtitle: "SWOT + Devolutiva Online",
    price: "R$ 547",
    description: "Para quem quer clareza, direcionamento e alguém ao lado explicando o que cada dado significa na prática.",
    features: [
      "Tudo do Plano Essencial",
      "Reunião Online Individual (45-60 min)",
      "Explicação detalhada ponto a ponto",
      "Priorização de ações (O que fazer 1º, 2º e 3º)",
      "Interpretação assistida por consultor",
      "Ideal para: Decidir com segurança e foco"
    ],
    cta: "Escolher Estratégico",
    highlight: true,
    badge: "Mais Procurado"
  },
  {
    id: 'avancado',
    name: "Plano Avançado",
    subtitle: "SWOT + Acompanhamento",
    price: "R$ 797",
    description: "Para quem quer acompanhamento mais próximo na hora de colocar a mão na massa e implementar as mudanças.",
    features: [
      "Tudo do Plano Estratégico",
      "Reunião de Acompanhamento (30 dias depois)",
      "Revisão do que foi implementado",
      "Ajustes finos no Plano de Ação",
      "Suporte prioritário via WhatsApp (30 dias)",
      "Ideal para: Garantir a execução e o resultado"
    ],
    cta: "Escolher Avançado",
    highlight: false,
    badge: ""
  }
];

export const PAIN_CONTENT = {
  title: "A gente sabe como é…",
  items: [
    {
      title: "Anúncios que não vendem",
      text: "Você gasta dinheiro impulsionando posts, mas o telefone continua mudo."
    },
    {
      title: "Redes sociais abandonadas",
      text: "Sua página parece um deserto e você não tem tempo para criar conteúdo."
    },
    {
      title: "Invisibilidade no Google",
      text: "Quem precisa do seu serviço hoje encontra o seu concorrente antes de você."
    },
    {
      title: "Site lento ou inexistente",
      text: "Sua empresa não passa credibilidade ou nem sequer tem uma casa digital."
    },
    {
      title: "Atendimento que falha",
      text: "Muitos leads chegam, mas poucos fecham porque o processo de vendas é confuso."
    },
    {
      title: "Ansiedade constante",
      text: "A incerteza de não saber se amanhã terá novos clientes batendo à porta."
    }
  ] as PainPointItem[],
  transition: "A MD Solution nasceu para transformar essa dor de cabeça em uma Operação de Performance Digital previsível."
};

export const CHECKLIST_ITEMS = [
  "Não apareço no Google quando buscam pelo meu serviço.",
  "Meu site (se tenho) é lento e não funciona no celular.",
  "Posto nas redes sociais mas não recebo contatos qualificados.",
  "Sinto que estou rasgando dinheiro com anúncios que não dão retorno.",
  "Meus concorrentes parecem muito mais profissionais no digital.",
  "O atendimento demora para responder ou não sabe fechar a venda."
];

export const SERVICES_CONTENT = {
  title: "Nossa Jornada de <span class='text-brand-orange'>Escala Digital</span>",
  intro: "Um caminho testado e aprovado para levar sua empresa do diagnóstico estratégico ao faturamento recorrente:",
  note: "Foco total em resultado: Construímos as fundações antes de acelerar, garantindo que cada real investido retorne em novos clientes.",
  items: [
    {
      title: "Auditoria SWOT (Estratégia)",
      description: "Diagnóstico profundo da saúde do seu negócio para alinhar a visão de crescimento.",
      icon: Target,
      color: "bg-orange-100 text-brand-orange",
      icon_bg: "bg-orange-500 text-white"
    },
    {
      title: "Diagnóstico de Marketing",
      description: "Análise dos canais de aquisição para identificar gargalos e oportunidades imediatas.",
      icon: BarChart3,
      color: "bg-green-100 text-green-600",
      icon_bg: "bg-green-600 text-white"
    },
    {
      title: "Google Meu Negócio",
      description: "Colocamos sua empresa no topo das buscas locais e do Google Maps.",
      icon: MapPin,
      color: "bg-blue-50 text-blue-600",
      icon_bg: "bg-blue-600 text-white"
    },
    {
      title: "Sites & Landing Pages",
      description: "Páginas profissionais focadas em converter visitantes em contatos qualificados.",
      icon: Layout,
      color: "bg-indigo-50 text-indigo-600",
      icon_bg: "bg-indigo-600 text-white"
    },
    {
      title: "Tráfego de Performance",
      description: "Anúncios no Meta Ads e Google Ads para atrair clientes prontos para comprar.",
      icon: Megaphone,
      color: "bg-slate-100 text-slate-800",
      icon_bg: "bg-slate-800 text-white"
    },
    {
      title: "Branding & Social Media",
      description: "Construção de autoridade e desejo pela sua marca em todos os canais sociais.",
      icon: Share2,
      color: "bg-brand-orangeLight text-brand-orange",
      icon_bg: "bg-brand-orange text-white"
    },
    {
      title: "Gestão de CRM",
      description: "Organização e automação dos seus leads para que nenhum contato seja perdido.",
      icon: Users,
      color: "bg-blue-100 text-brand-blue",
      icon_bg: "bg-brand-blue text-white"
    },
    {
      title: "Consultoria de Vendas",
      description: "Treinamento comercial para converter cada lead em faturamento real e lucro.",
      icon: LineChart,
      color: "bg-purple-100 text-purple-600",
      icon_bg: "bg-purple-600 text-white"
    }
  ] as ServiceItem[]
};

export const PLANS: PricingPlan[] = [
  {
    name: "Essencial",
    subtitle: "Presença que funciona",
    description: "Ideal para pequenas empresas que precisam começar a atrair clientes qualificados.",
    price: "R$ 750",
    adBudget: "Verba sugerida a partir de R$ 750/mês para anúncios.",
    ctaText: "Quero o Essencial",
    features: [
      "Estratégias de Anúncios Pagos (Meta ou Google)",
      "Gestão de Google Meu Negócio",
      "Social Media: 4 posts estratégicos/mês",
      "Relatórios de resultados simples",
      "Configuração de rastreamento básico"
    ],
    badge: ""
  },
  {
    name: "Profissional",
    subtitle: "Crescimento Estruturado",
    description: "A aceleração que seu negócio precisa para dominar o mercado local.",
    price: "R$ 1.250",
    adBudget: "Verba sugerida a partir de R$ 1.750/mês para anúncios.",
    highlight: true,
    badge: "Mais Popular ⭐",
    ctaText: "Quero o Profissional",
    features: [
      "Operação de Performance (Meta + Google)",
      "Otimização avançada de Google Meu Negócio",
      "Social Media: 8 a 12 posts estratégicos",
      "Aquisição de Clientes Online acelerada",
      "Relatório detalhado + Reunião mensal"
    ]
  },
  {
    name: "Premium",
    subtitle: "Alta Performance",
    description: "Operação completa para empresas que buscam liderança absoluta e escala.",
    price: "R$ 2.500",
    adBudget: "Verba sugerida a partir de R$ 3.000/mês para anúncios.",
    ctaText: "Quero o Premium",
    features: [
      "Funil de Vendas completo e agressivo",
      "Criação de anúncios em vídeo (Reels/Roteiros)",
      "Social Media: Gestão total (até 20 posts)",
      "Análise de CRO (melhoria de conversão)",
      "Atendimento prioritário e estratégico"
    ],
    badge: ""
  }
];

export const MD_CONVERTE_PLANS = [
  {
    name: "Starter",
    subtitle: "Autônomos e Pequenos Negócios",
    price: "Consultar",
    features: [
      "1 a 2 Funis de Venda",
      "Até 3 Usuários",
      "Integração WhatsApp Básica"
    ],
    ctaText: "Falar com Consultor",
    highlight: false,
    badge: ""
  },
  {
    name: "Combo MD",
    subtitle: "Ecossistema Completo",
    price: "Personalizado",
    features: [
      "CRM CONVERTE Sim. Completo",
      "Gestão de Tráfego Pago",
      "Consultoria de Estratégia",
      "Relatórios de BI Avançados"
    ],
    ctaText: "Quero o Combo Completo",
    highlight: true,
    badge: "Recomendado"
  },
  {
    name: "Business",
    subtitle: "Médias Empresas",
    price: "Consultar",
    features: [
      "Funis Ilimitados",
      "Usuários Ilimitados",
      "Integração Completa + IA"
    ],
    ctaText: "Falar com Consultor",
    highlight: false,
    badge: ""
  }
];

export const SOCIAL_MEDIA_PLANS = [
  {
    name: "Essencial",
    subtitle: "Início Estratégico",
    description: "Ideal para pequenos negócios iniciando presença digital.",
    price: "R$ 997",
    adBudget: "Foco 100% em Orgânico (Design + Legendas)",
    ctaText: "Escolher Essencial",
    features: [
      "12 posts por mês (3 por semana)",
      "2 redes sociais (Instagram + Facebook)",
      "Design de posts profissional",
      "Legendas otimizadas com hashtags",
      "Agendamento automático",
      "Relatório mensal básico"
    ],
    badge: ""
  },
  {
    name: "Performance",
    subtitle: "Crescimento Consistente",
    description: "Ideal para empresas buscando crescimento constante nas redes.",
    price: "R$ 1.997",
    adBudget: "Mais Popular ⭐",
    highlight: true,
    ctaText: "Escolher Performance",
    features: [
      "20 posts por mês (5 por semana)",
      "3 redes sociais (Insta + Face + TikTok/LinkedIn)",
      "Stories 3x por semana (12 ao mês)",
      "Criação de 2 Reels/TikToks por mês",
      "Copy estratégica com gatilhos mentais",
      "Monitoramento de comentários e DMs",
      "Relatório completo com insights",
      "1 reunião estratégica mensal"
    ],
    badge: "Mais Popular ⭐"
  },
  {
    name: "Autoridade",
    subtitle: "Domínio de Mercado",
    description: "Ideal para marcas que querem dominar o mercado digital.",
    price: "R$ 3.497",
    adBudget: "Gestão VIP + Atendimento Prioritário",
    ctaText: "Escolher Autoridade",
    features: [
      "25 posts premium por mês",
      "4 redes sociais completas",
      "Stories diários (7 por semana)",
      "4 Reels/TikToks editados profissionalmente",
      "Planejamento estratégico trimestral",
      "Gestão completa de comunidade",
      "Análise de concorrência mensal",
      "Relatório executivo detalhado",
      "2 reuniões estratégicas mensais"
    ],
    badge: ""
  }
];

export const SOCIAL_MEDIA_CONTENT = {
  hero: {
    title: "Sua marca com <span class='text-brand-orange italic'>Alma e Estratégia</span>",
    subtitle: "Não fazemos apenas 'postinhos'. Construímos autoridade e desejo para tornar sua empresa a escolha número 1 do seu cliente.",
    cta: "Ver Planos de Social Media"
  },
  mechanism: {
    title: "O Nosso Método 360º",
    subtitle: "Transformamos seguidores em advogados da sua marca.",
    steps: [
      { num: "01", title: "Imersão de Marca", text: "Não somos apenas designers. Estudamos seu público, sua concorrência e seu tom de voz para que cada post fale a língua do seu lucro." },
      { num: "02", title: "Arquitetura de Valor", text: "Criamos designs premium e roteiros cinematográficos que param o scroll e geram desejo imediato pelo seu produto ou serviço." },
      { num: "03", title: "Escala e Performance", text: "Analisamos cada métrica para entender o que vende. Ajustamos a rota em tempo real para transformar curtidas em faturamento real." }
    ]
  },
  benefits: [
    { title: "Autoridade Instantânea", text: "Um perfil amador afasta clientes. Um perfil MD Solution te posiciona como o líder do seu mercado no primeiro olhar." },
    { title: "Liberdade de Tempo", text: "Você foca em gerir sua empresa enquanto nossa equipe cuida de toda a linha de produção: do roteiro à postagem." },
    { title: "Vendas no Automático", text: "Transformamos suas redes em um funil de aquisição que trabalha 24h por dia, atraindo leads qualificados todos os dias." }
  ],
  proof: {
    metrics: [
      { label: "Crescimento Médio", value: "+140%", detail: "em alcance orgânico nos primeiros 90 dias." },
      { label: "Retenção", value: "95%", detail: "dos seguidores permanecem engajados com a marca." },
      { label: "ROI", value: "3.5x", detail: "Retorno médio sobre o investimento em social media." }
    ],
    testimonials: [
      { name: "Juliana Mendes", role: "CEO da JM Estética", text: "Minhas redes eram paradas. Hoje, 70% dos meus agendamentos vêm do Instagram. O posicionamento mudou tudo." },
      { name: "Marcos Oliveira", role: "Sócio de Advocacia", text: "A MD Solution trouxe o luxo e a seriedade que nossa banca precisava. Passamos de 'mais um' para referência na cidade." }
    ]
  },
  cab: {
    title: "Por que escolher a MD Solution?",
    characteristics: [
      { title: "Design UI/UX", text: "Posts pensados na experiência do usuário e na jornada de consumo de conteúdo." },
      { title: "Psychological Copy", text: "Legendas que utilizam gatilhos mentais de escassez, prova social e autoridade." },
      { title: "Roteirização", text: "Scripts profissionais para Reels e TikTok focados em retenção (watch-time)." }
    ],
    advantages: [
      { title: "Equipe Multidisciplinar", text: "Você não contrata um freelancer, mas um squad com Designer, Copywriter e Estrategista." },
      { title: "Tecnologia", text: "Dashboards em tempo real e agendamento profissional para garantir consistência 365 dias por ano." }
    ],
    benefits: [
      { title: "Lucratividade", text: "Transformamos o 'custo' de social media em um motor de faturamento previsível." },
      { title: "Paz de Espírito", text: "Saiba que sua vitrine digital está sendo cuidada pelos melhores, sem você precisar cobrar nada." }
    ]
  }
};

export const CONSULTANCY_CONTENT = {
  title: "Não adianta só trazer clientes. Você também precisa vender bem.",
  description: "Se o cliente chama no WhatsApp e demora a ser respondido, ou se você não sabe contornar a frase 'tá caro', você está rasgando dinheiro. Nossa consultoria arruma o seu atendimento do 'oi' ao fechamento.",
  details: [
    "Diagnóstico de Vendas completo",
    "Criação de scripts de WhatsApp e Telefone",
    "Treinamento para contornar objeções",
    "Implementação de CRM e processos",
    "Estratégias de Upsell (vender mais para o mesmo cliente)"
  ],
  pricing: "R$ 1.800/mês (3 meses) ou Pacote Único R$ 4.900"
};

export const COMBOS_CONTENT: ComboItem[] = [
  {
    name: "Aceleração de Vendas",
    includes: "Plano Profissional + Consultoria",
    advantage: "A melhor relação custo-benefício"
  },
  {
    name: "Performance Total",
    includes: "Plano Premium + Consultoria",
    advantage: "Escala agressiva e lucro real"
  },
  {
    name: "Presença & Conversão",
    includes: "Site + Plano Essencial",
    advantage: "Tudo o que você precisa para começar"
  }
];

export const TRUST_CONTENT = {
  title: "Somos novos, mas somos sérios.",
  text1: "Na MD Solution você não é apenas um número. Aqui, somos movidos pelo resultado do seu faturamento. Ser uma agência nova significa que temos fome de entrega e um atendimento humano que as grandes agências esqueceram.",
  text2: "Valorizamos a transparência e a linguagem simples. Sem enrolação, sem promessas milagrosas: apenas trabalho duro e estratégia.",
  points: [
    { title: "Linguagem Simples", text: "Explicamos tudo sem termos técnicos complicados." },
    { title: "Foco em Vendas", text: "Não focamos em curtidas, focamos em dinheiro no caixa." },
    { title: "Parceria Próxima", text: "Pegamos na sua mão e fazemos o negócio crescer juntos." }
  ],
  manifesto: "\"Marketing digital não é sobre arte, é sobre vendas. A gente cuida da tecnologia e você cuida do seu sucesso.\""
};

export const MAESTRO_PACKAGES = [
  {
    name: "MAESTRO ESSENCIAL - Presencial",
    price: "R$ 4.800",
    installments: "ou 2x de R$ 2.400 sem juros",
    features: [
      "Movimento 1: Excelência Presencial (8h)",
      "Manual do Maestro Vol. 1",
      "Partitura de Vendas Presenciais",
      "Certificado de Maestria",
      "1 mentoria pós (2h)",
      "Grupo de suporte (60 dias)",
      "Até 6 participantes"
    ],
    cta: "INICIAR JORNADA DE MAESTRIA",
    highlight: false,
    badge: ""
  },
  {
    name: "MAESTRO ESSENCIAL - Digital",
    price: "R$ 4.800",
    installments: "ou 2x de R$ 2.400 sem juros",
    features: [
      "Movimento 2: Maestria Digital (8h)",
      "Manual do Maestro Vol. 2",
      "50+ Templates do Maestro",
      "Certificado de Maestria",
      "1 mentoria pós (2h)",
      "Grupo de suporte (60 dias)",
      "Até 6 participantes"
    ],
    cta: "INICIAR JORNADA DE MAESTRIA",
    highlight: false,
    badge: ""
  },
  {
    name: "MAESTRO COMPLETO",
    price: "R$ 14.500",
    installments: "ou 4x de R$ 3.625 sem juros",
    badge: "MAIS VENDIDO",
    features: [
      "3 Movimentos completos (24h)",
      "Manuais do Maestro (3 volumes)",
      "Implementação de CRM",
      "Certificado Premium de Maestria",
      "3 mentorias pós-treinamento",
      "Grupo de suporte (180 dias)",
      "Partitura Completa de Vendas",
      "Até 8 participantes"
    ],
    cta: "TORNAR-SE MAESTRO COMPLETO",
    highlight: true
  },
  {
    name: "TRANSFORMAÇÃO TOTAL",
    price: "R$ 32.000",
    installments: "ou 6x de R$ 5.333 sem juros",
    features: [
      "Todos os Movimentos + Gestão (28h)",
      "Diagnóstico 360º pré-treinamento",
      "Partitura personalizada exclusiva",
      "Implementação completa de CRM",
      "6 meses de mentoria mensal",
      "Consultoria trimestral estratégica",
      "Grupo VIP de maestros",
      "Participantes ilimitados (In- Company)"
    ],
    cta: "FALAR COM ESTRATEGISTA",
    highlight: false,
    badge: ""
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "A verba de anúncios está inclusa nos planos?",
    answer: "Não. O valor pago à MD Solution é pela nossa gestão e inteligência. A verba dos anúncios (Google/Facebook) é paga diretamente para as plataformas pelo seu cartão de crédito ou boleto."
  },
  {
    question: "Quanto tempo para ver os primeiros resultados?",
    answer: "Campanhas de captação costumam gerar contatos já na primeira semana. Resultados sólidos e previsíveis geralmente acontecem entre 3 e 6 meses de otimização."
  },
  {
    question: "Atendem qualquer tipo de negócio?",
    answer: "Focamos em PMEs, comércios locais e prestadores de serviço que tenham um bom produto e queiram vender mais através do digital."
  },
  {
    question: "Tem contrato de fidelidade?",
    answer: "Para marketing, sugerimos ciclos de 3 a 6 meses para que a estratégia mature, mas prezamos pela parceria e satisfação real."
  },
  {
    question: "Qual a diferença entre os dois diagnósticos gratuitos?",
    answer: "O Diagnóstico de Marketing foca em VENDAS (como atrair leads no WhatsApp e Google). A Análise SWOT foca em GESTÃO (auditoria interna de forças, fraquezas e riscos do seu negócio como um todo)."
  },
  {
    question: "Posso contratar apenas o Site ou a Consultoria?",
    answer: "Sim! Você pode contratar sites, landing pages ou a consultoria de vendas de forma avulsa conforme a sua necessidade."
  }
];

export const TESTIMONIAL_CONTENT = {
  text: "O pessoal da MD Solution organizou minha casa. Eu recebia curiosos e agora recebo clientes. Meu faturamento subiu 30% em 3 meses com as campanhas de captação que eles montaram.",
  author: "Ricardo Souza",
  role: "Proprietário da RS Odontologia"
};

export const FOOTER_CTA = {
  title: "Pronto para fazer sua empresa crescer?",
  text: "Escolha o caminho: fale conosco agora ou comece por um de nossos diagnósticos gratuitos para entendermos o seu momento."
};

export const SITES_PLANS = [
  {
    name: "Landing Page Essencial",
    subtitle: "Conversão & Leads",
    description: "Ideal para campanhas de vendas e lançamentos. Foco total em transformar cliques em clientes.",
    price: "R$ 1.200",
    features: [
      "Página Única (até 5 seções)",
      "Design Exclusivo",
      "Copywriting Persuasivo",
      "Integração Formulário/WhatsApp",
      "Google Analytics & Pixels",
      "Entrega em 7 dias úteis"
    ],
    highlight: true,
    badge: "Mais Rápido"
  },
  {
    name: "Site Institucional",
    subtitle: "Autoridade Profissional",
    description: "Para empresas que buscam uma presença digital robusta, confiável e completa.",
    price: "R$ 2.500",
    features: [
      "Até 5 páginas completas",
      "Blog ou Portfólio",
      "Painel Administrativo",
      "WhatsApp & Redes Sociais",
      "Otimização SEO Básica",
      "Treinamento de Gestão"
    ],
    highlight: false
  },
  {
    name: "E-commerce Start",
    subtitle: "Vendas Online",
    description: "Estrutura enxuta para quem quer começar a vender produtos físicos ou digitais.",
    price: "R$ 3.800",
    features: [
      "Loja com até 20 produtos",
      "Checkout Otimizado",
      "Meios de Pagamento & Frete",
      "Plataforma Flexível",
      "Treinamento em Vídeo",
      "Bônus: E-mail Boas-vindas"
    ],
    highlight: false
  },
  {
    name: "E-commerce Premium",
    subtitle: "Escala & Automação",
    description: "A solução definitiva para grandes lojistas com integração total e automação.",
    price: "R$ 7.900",
    features: [
      "Até 50 produtos + 2 LPs",
      "Integração CRM & E-mail",
      "Recuperação de Carrinho",
      "Funil de Vendas Simples",
      "Insta Shopping & Google Merchant",
      "Bônus: Campanha de Tráfego"
    ],
    highlight: false,
    badge: "Completo"
  }
];

export const SITES_FAQ = [
  {
    question: "Quanto tempo demora para meu site ficar pronto?",
    answer: "Uma Landing Page leva em média 10 a 12 dias. Sites institucionais levam de 15 a 20 dias, dependendo da complexidade do conteúdo."
  },
  {
    question: "O site será meu ou precisarei pagar mensalidade?",
    answer: "O site é 100% seu. Após a entrega, você não tem mensalidades com a MD Solution, apenas as taxas anuais de domínio e hospedagem."
  },
  {
    question: "Vou conseguir alterar os textos sozinho?",
    answer: "Sim! Entregamos todos os sites com um painel administrativo intuitivo para que você possa alterar textos e imagens sem depender de programador."
  },
  {
    question: "O site já vem pronto para o Google?",
    answer: "Sim, entregamos com SEO básico configurado (títulos, meta-descrições e otimização de imagens) para facilitar sua indexação."
  }
];

export const SITES_TESTIMONIALS = [
  {
    name: "Dr. Roberto Silva",
    role: "Clínica OdontoLife",
    text: "Meu site antigo era lento e não recebia contatos. O novo site feito pela MD Solution mudou o jogo: recebo leads qualificados todos os dias pelo WhatsApp.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Ana Claudia",
    role: "CEO da Loja Fashion",
    text: "A transição para o novo e-commerce foi impecável. A velocidade de carregamento e facilidade de compra aumentaram nossa taxa de conversão em 45%.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Marcos Vinícius",
    role: "Sócio Diretor - MV Advogados",
    text: "Precisávamos de um posicionamento sério e luxuoso. O site institucional superou as expectativas, transmitindo a autoridade que nosso escritório exige.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
  }
];

export const SITES_CONTENT = {
  hero: {
    title: 'Sua empresa merece uma <span class="text-brand-blue italic">Casa Digital</span> que vende.',
    subtitle: 'Sites rápidos, modernos e focados em converter visitantes em clientes. Não tenha apenas um cartão de visitas, tenha uma ferramenta estratégica.',
    investment: 'R$ 1.200',
    buttonText: 'Solicitar Orçamento de Site'
  },
  problems: [
    { title: "Lentidão = Prejuízo", text: "53% dos usuários abandonam sites que demoram mais de 3 segundos.", icon: Clock, color: "text-red-600 bg-red-100" },
    { title: "Mobile First", text: "Mais de 80% do tráfego vem do celular. Seu site precisa ser perfeito nele.", icon: Smartphone, color: "text-brand-orange bg-orange-100" },
    { title: "Invisível no Google", text: "Sites mal estruturados são punidos e nunca aparecem na primeira página.", icon: Search, color: "text-brand-blue bg-blue-100" }
  ],
  features: [
    { title: "Design Premium", desc: "Nada de templates genéricos. Identidade visual única e autoridade.", icon: Monitor, size: "large" },
    { title: "Ultra Rápido", desc: "Google PageSpeed 90+", icon: Zap },
    { title: "SEO Ready", desc: "Otimizado para buscas", icon: Search },
    { title: "Focado em Vendas", desc: "Gatilhos mentais e conversão", icon: Target, size: "wide" },
    { title: "Painel Admin", desc: "Gestão fácil de conteúdos", icon: LayoutDashboard }
  ],
  fullPackage: [
    "Domínio (.com.br) - 1 Ano",
    "E-mails Profissionais",
    "Certificado SSL (Segurança)",
    "Botão WhatsApp Flutuante",
    "Integração Redes Sociais",
    "Gestão de Conteúdo (CMS)",
    "Hospedagem de Alta Performance",
    "Google Analytics Configurado"
  ],
  gallery: [
    { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200", title: "Landing Page Imobiliária" },
    { img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200", title: "Dashboard SaaS Moderno" },
    { img: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?q=80&w=1200", title: "Site Institucional Law" },
    { img: "https://images.unsplash.com/photo-1504868584819-f8e905b6570c?q=80&w=1200", title: "Site Médico de Elite" },
    { img: "https://images.unsplash.com/photo-1517245327032-96a1f43fbf50?q=80&w=1200", title: "E-commerce de Decoração" },
    { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200", title: "Landing Page Educacional" }
  ]
};

export const ADS_FAQ = [
  {
    question: "Qual a verba mínima para começar a anunciar?",
    answer: "Recomendamos um investimento mínimo de R$ 1.000 a R$ 1.500 mensais em verba direta para as plataformas (Google/Meta) para que possamos ter dados suficientes para otimização e tração inicial."
  },
  {
    question: "Em quanto tempo verei os primeiros resultados?",
    answer: "Diferente do orgânico, os anúncios pagos geram tráfego imediato. Os primeiros leads qualificados costumam chegar entre as primeiras 48h e 72h após a ativação das campanhas."
  },
  {
    question: "Eu preciso ter um site para anunciar?",
    answer: "Embora possamos anunciar para o WhatsApp direto, ter uma Landing Page de alta conversão triplica suas chances de fechamento. Se você não tem, nós também desenvolvemos estruturas completas de venda."
  },
  {
    question: "Vocês garantem um número X de vendas?",
    answer: "Garantimos levar o público mais qualificado possível até o seu comercial. O fechamento da venda depende da qualidade do seu produto, oferta e agilidade do seu time de atendimento."
  },
  {
    question: "O acompanhamento é feito em quais plataformas?",
    answer: "Trabalhamos com o ecossistema completo: Meta Ads (Instagram e Facebook), Google Ads (Busca, YouTube e Display) e LinkedIn Ads (para B2B estratégico)."
  }
];

export const ADS_TESTIMONIALS = [
  {
    name: "Pedro Ramos",
    role: "Diretor da Ramos Imobiliária",
    text: "Investíamos R$ 2k/mês sem saber o retorno. Com a MDigital, dobramos os leads e hoje sabemos exatamente o custo por cada venda realizada.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Carla Dias",
    role: "Fundadora da Dias E-commerce",
    text: "As campanhas de Google Ads salvaram meu estoque parado. Tivemos um ROAS de 6.5x no primeiro mês de operação com a agência.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
  }
];

export const ADS_CONTENT = {
  comparison: {
    title: "Amador vs. <span class='text-brand-orange italic pr-1'>Profissional</span>",
    subtitle: "Por que impulsionar posts é o jeito mais rápido de perder dinheiro.",
    rows: [
      ["Público Alvo", "Interesses genéricos e amplos", "Públicos personalizados e Lookalike"],
      ["Intenção", "Pessoas navegando por lazer", "Pessoas buscando resolver uma dor agora"],
      ["Criativos", "Fotos simples sem estratégia", "Peças focadas em retenção e conversão"],
      ["Rastreamento", "Olha apenas para curtidas", "Mede custo por lead e ROI real"],
      ["Otimização", "Postado e esquecido", "Ajustes diários baseados em dados"]
    ]
  },
  results: {
    title: "O que você pode esperar",
    items: [
      "Fim do 'achismo': decisões baseadas em dados reais.",
      "Escalabilidade: saiba quanto investir para vender mais.",
      "Previsibilidade: leads chegando todos os dias no seu funil.",
      "Autoridade: apareça para quem realmente importa.",
      "Agilidade: resultados muito mais rápidos que o orgânico."
    ]
  }
};



