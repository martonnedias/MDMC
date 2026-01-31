
import { PricingPlan, FaqItem, ServiceItem, ComboItem, PainPointItem } from './types';
import { Megaphone, MapPin, Share2, LineChart, Layout, Target, TrendingUp, Zap, AlertTriangle, Lightbulb, Users, ShieldCheck, Clock, MessageCircle, BarChart3, Star, Search, Smartphone, CheckCircle2 } from 'lucide-react';

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
    intro: "A MD Solution se responsabiliza por coletar, organizar e preencher essas informações de forma profissional, seguindo as diretrizes do Google:",
    items: [
      "Nome da empresa exatamente como no mundo real",
      "Endereço completo (CEP, bairro, cidade) ou área de atendimento",
      "Telefone e WhatsApp para contato imediato",
      "Horário de funcionamento (feriados e horários especiais)",
      "Categorias certas (Barbearia, Clínica, Restaurante, etc.)",
      "Descrição profissional (O que faz, para quem e diferenciais)",
      "Fotos: Fachada, interior, equipe, produtos e logo",
      "Link do site e botões de ações rápidas (Rotas, Ligar, Mensagem)"
    ]
  },
  process: {
    title: "Como funciona o nosso serviço",
    steps: [
      { title: "Diagnóstico Rápido", text: "Entendemos se você já tem um perfil e o que falta para ele performar." },
      { title: "Coleta de Informações", text: "Organizamos seus dados, fotos, horários e diferenciais de venda." },
      { title: "Otimização Completa", text: "Configuramos tudo dentro das diretrizes de SEO local do Google." },
      { title: "Verificação", text: "Acompanhamos o processo de verificação até o perfil ficar 'Ao Vivo'." },
      { title: "Publicação e Gestão", text: "Revisão final e, se contratado, gestão de posts e avaliações." }
    ]
  },
  results: {
    title: "O que esperar de um perfil bem feito",
    items: [
      "Mais pessoas encontrando sua empresa no Google e Maps",
      "Aumento real de ligações e pedidos de rota",
      "Clientes chegando dizendo: 'te achei no Google'",
      "Mais confiança com fotos profissionais e avaliações",
      "Diferenciação clara de concorrentes desorganizados"
    ],
    case: "Barbearia em bairro X aumentou em 35% o número de ligações em 60 dias só com perfil bem configurado e fotos atualizadas."
  },
  packages: [
    {
      name: "Setup Inicial",
      description: "Ideal para quem quer 'arrumar a casa' e começar a aparecer corretamente.",
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
      description: "Ideal para dominar a região e manter o perfil sempre aquecido.",
      features: [
        "Tudo do pacote Setup",
        "Posts semanais no Perfil",
        "Resposta profissional a avaliações",
        "Relatório mensal de desempenho",
        "Atualização constante de infos"
      ],
      highlight: true,
      price: "Sob Consulta",
      cta: "Contratar Gestão"
    }
  ],
  faqs: [
    {
      question: "Já tenho Google Meu Negócio, vocês podem arrumar?",
      answer: "Sim! Fazemos a reivindicação de propriedade e a otimização completa de perfis já existentes."
    },
    {
      question: "Quanto tempo leva pra começar a aparecer?",
      answer: "O Google costuma validar em poucos dias, mas o impacto na relevância das buscas aparece em 15 a 30 dias."
    },
    {
      question: "Preciso ter site para usar Google Meu Negócio?",
      answer: "Não é obrigatório, mas ajuda. O perfil funciona como um 'mini site' eficiente para quem não tem um site próprio."
    },
    {
      question: "O que acontece se eu mudar de endereço?",
      answer: "Nós fazemos a atualização técnica para que você não perca suas avaliações e relevância no novo local."
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
    highlight: false
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
    highlight: false
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
  title: "A gente transforma sua presença digital em clientes reais.",
  intro: "Não vendemos apenas posts. Entregamos uma estrutura completa de Aquisição de Clientes Online e estratégia de vendas:",
  note: "Foco total em resultado: Traduzimos o 'internetês' para a língua do seu negócio: faturamento e novos clientes.",
  items: [
    {
      title: "Campanhas de Captação",
      description: "Operação de Performance Digital no Meta Ads e Google Ads para atrair quem quer comprar agora.",
      icon: Megaphone,
      color: "bg-brand-blueLight text-brand-blue"
    },
    {
      title: "Sites & Landing Pages",
      description: "Criação de páginas profissionais, rápidas e focadas em conversão a partir de R$ 800.",
      icon: Layout,
      color: "bg-green-100 text-brand-green"
    },
    {
      title: "Redes Sociais & Google",
      description: "Conteúdo profissional e gestão de Google Meu Negócio para passar credibilidade total.",
      icon: Share2,
      color: "bg-brand-orangeLight text-brand-orange"
    },
    {
      title: "Consultoria de Vendas",
      description: "Ajudamos você a melhorar o atendimento no WhatsApp e presencial para não perder nenhum lead.",
      icon: LineChart,
      color: "bg-purple-100 text-purple-600"
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
      "Campanhas de Captação (Meta ou Google)",
      "Gestão de Google Meu Negócio",
      "Social Media: 4 posts estratégicos/mês",
      "Relatórios de resultados simples",
      "Configuração de rastreamento básico"
    ]
  },
  {
    name: "Profissional",
    subtitle: "Crescimento Estruturado",
    description: "A aceleração que seu negócio precisa para dominar o mercado local.",
    price: "R$ 1.250",
    adBudget: "Verba sugerida a partir de R$ 1.750/mês para anúncios.",
    highlight: true,
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
    ]
  }
];

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
