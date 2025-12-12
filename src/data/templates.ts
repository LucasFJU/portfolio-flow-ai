export type TemplateCategory = 
  | "design" 
  | "dev" 
  | "marketing" 
  | "copywriting" 
  | "video" 
  | "product" 
  | "branding" 
  | "consultoria" 
  | "saas" 
  | "ecommerce" 
  | "freelancer" 
  | "agency" 
  | "education";

export interface PortfolioTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  layout: "case-study" | "gallery" | "one-page" | "slides";
  colors: {
    primary: string;
    accent: string;
  };
  font: string;
  sections: string[];
  proofTypes: string[];
  ctaText: string;
  recommended: boolean;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  budgetType: "fixed" | "hourly" | "package";
  sections: {
    introduction: string;
    justification: string;
    closing: string;
    exclusions: string;
    terms: string;
  };
  deliverables: string[];
  timeline: string;
  recommended: boolean;
}

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: "design-minimal",
    name: "Design Minimalista",
    category: "design",
    description: "Foco visual em imagens de alta qualidade e descrições concisas",
    layout: "gallery",
    colors: { primary: "#000000", accent: "#F97316" },
    font: "DM Sans",
    sections: ["hero", "projects", "about", "contact"],
    proofTypes: ["Antes/Depois", "User Testing", "Wireframes"],
    ctaText: "Ver Projeto Completo",
    recommended: true,
  },
  {
    id: "design-case-heavy",
    name: "Case Study Detalhado",
    category: "design",
    description: "Narrativa completa com processo, desafios e resultados",
    layout: "case-study",
    colors: { primary: "#8B5CF6", accent: "#F97316" },
    font: "DM Sans",
    sections: ["hero", "challenge", "process", "solution", "results", "testimonials"],
    proofTypes: ["Protótipos", "Métricas UX", "Depoimentos"],
    ctaText: "Entenda o Processo",
    recommended: false,
  },
  {
    id: "dev-technical",
    name: "Dev Técnico",
    category: "dev",
    description: "Destaque para arquitetura, stack e performance",
    layout: "case-study",
    colors: { primary: "#10B981", accent: "#3B82F6" },
    font: "JetBrains Mono",
    sections: ["hero", "tech-stack", "architecture", "challenges", "performance", "code-samples"],
    proofTypes: ["Screenshots", "Métricas de Performance", "Código", "Arquitetura"],
    ctaText: "Ver Código",
    recommended: true,
  },
  {
    id: "dev-startup",
    name: "Dev para Startups",
    category: "dev",
    description: "Foco em MVPs, velocidade e resultados de negócio",
    layout: "one-page",
    colors: { primary: "#6366F1", accent: "#EC4899" },
    font: "Inter",
    sections: ["hero", "problem", "solution", "tech", "metrics", "timeline"],
    proofTypes: ["Demo", "Métricas de Produto", "ROI"],
    ctaText: "Agendar Conversa",
    recommended: false,
  },
  {
    id: "marketing-roi",
    name: "Marketing ROI Focus",
    category: "marketing",
    description: "Dashboards, métricas e resultados mensuráveis",
    layout: "slides",
    colors: { primary: "#EF4444", accent: "#F59E0B" },
    font: "Poppins",
    sections: ["hero", "challenge", "strategy", "execution", "results", "roi"],
    proofTypes: ["Dashboards", "ROI", "CPL/CPA", "Screenshots de Ads"],
    ctaText: "Ver Resultados Completos",
    recommended: true,
  },
  {
    id: "copywriting-conversion",
    name: "Copy que Converte",
    category: "copywriting",
    description: "Antes/depois de textos com métricas de conversão",
    layout: "case-study",
    colors: { primary: "#7C3AED", accent: "#FBBF24" },
    font: "Merriweather",
    sections: ["hero", "persona", "before-after", "techniques", "results"],
    proofTypes: ["Antes/Depois de Copy", "Taxas de Conversão", "A/B Tests"],
    ctaText: "Ler Case Completo",
    recommended: true,
  },
  {
    id: "video-showreel",
    name: "Showreel Dinâmico",
    category: "video",
    description: "Vídeos em destaque com thumbnails impactantes",
    layout: "gallery",
    colors: { primary: "#DC2626", accent: "#FBBF24" },
    font: "Bebas Neue",
    sections: ["showreel", "projects", "equipment", "process", "contact"],
    proofTypes: ["Vídeo Final", "Storyboard", "Métricas de Views"],
    ctaText: "Assistir Showreel",
    recommended: true,
  },
  {
    id: "product-strategy",
    name: "Product Strategy",
    category: "product",
    description: "Roadmaps, métricas de produto e decisões estratégicas",
    layout: "case-study",
    colors: { primary: "#2563EB", accent: "#10B981" },
    font: "Inter",
    sections: ["hero", "hypothesis", "research", "roadmap", "execution", "metrics"],
    proofTypes: ["Roadmap", "Métricas de Produto", "User Research", "OKRs"],
    ctaText: "Ver Estratégia",
    recommended: true,
  },
  {
    id: "branding-identity",
    name: "Brand Identity",
    category: "branding",
    description: "Sistema visual completo com aplicações",
    layout: "slides",
    colors: { primary: "#1F2937", accent: "#F59E0B" },
    font: "Playfair Display",
    sections: ["hero", "concept", "logo", "colors", "typography", "applications"],
    proofTypes: ["Manual de Marca", "Mockups", "Aplicações"],
    ctaText: "Ver Brand Book",
    recommended: true,
  },
  {
    id: "freelancer-versatile",
    name: "Freelancer Versátil",
    category: "freelancer",
    description: "Portfólio compacto mostrando diversidade de skills",
    layout: "one-page",
    colors: { primary: "#8B5CF6", accent: "#F97316" },
    font: "DM Sans",
    sections: ["hero", "services", "projects", "testimonials", "contact"],
    proofTypes: ["Screenshots", "Depoimentos", "Métricas"],
    ctaText: "Vamos Conversar",
    recommended: true,
  },
  {
    id: "agency-enterprise",
    name: "Agência Enterprise",
    category: "agency",
    description: "Múltiplos cases com foco em grandes clientes",
    layout: "case-study",
    colors: { primary: "#1E293B", accent: "#3B82F6" },
    font: "Outfit",
    sections: ["hero", "clients", "cases", "team", "process", "contact"],
    proofTypes: ["Logos de Clientes", "Cases Detalhados", "Prêmios"],
    ctaText: "Fale com Nosso Time",
    recommended: false,
  },
  {
    id: "saas-product",
    name: "SaaS Product",
    category: "saas",
    description: "Focado em features, integrações e resultados",
    layout: "one-page",
    colors: { primary: "#7C3AED", accent: "#06B6D4" },
    font: "Inter",
    sections: ["hero", "features", "integrations", "testimonials", "pricing", "demo"],
    proofTypes: ["Product Screenshots", "Métricas de Uso", "Integrações"],
    ctaText: "Solicitar Demo",
    recommended: true,
  },
  {
    id: "ecommerce-conversion",
    name: "E-commerce Conversion",
    category: "ecommerce",
    description: "Foco em UX de compra e aumento de conversão",
    layout: "case-study",
    colors: { primary: "#059669", accent: "#F97316" },
    font: "DM Sans",
    sections: ["hero", "challenge", "ux-research", "design", "development", "results"],
    proofTypes: ["Funil de Conversão", "Heatmaps", "A/B Tests", "ROI"],
    ctaText: "Ver Aumento de Conversão",
    recommended: true,
  },
];

export const proposalTemplates: ProposalTemplate[] = [
  {
    id: "design-fixed",
    name: "Projeto de Design - Valor Fechado",
    category: "design",
    description: "Ideal para projetos com escopo bem definido",
    budgetType: "fixed",
    sections: {
      introduction: "Obrigado pela oportunidade de apresentar esta proposta. Após analisar suas necessidades, desenvolvi uma solução que combina estratégia e estética para alcançar seus objetivos.",
      justification: "O investimento proposto reflete não apenas as horas de trabalho, mas também a expertise em design estratégico, garantindo uma solução que gera resultados mensuráveis para seu negócio.",
      closing: "Estou animado(a) com a possibilidade de transformar sua visão em realidade. O próximo passo é uma reunião de alinhamento para validarmos os detalhes e iniciarmos o projeto.",
      exclusions: "• Alterações de escopo além do briefing aprovado\n• Hospedagem e domínio\n• Conteúdo (textos e imagens)\n• Manutenção contínua após entrega\n• Versões para redes sociais não especificadas",
      terms: "• Pagamento: 50% na aprovação, 50% na entrega\n• Revisões: até 2 rodadas incluídas\n• Prazo adicional: sob consulta\n• Arquivos fonte: entregues após quitação completa",
    },
    deliverables: ["Design completo em Figma", "Assets exportados", "Guia de estilo básico", "1 rodada de revisões"],
    timeline: "2-4 semanas",
    recommended: true,
  },
  {
    id: "dev-hourly",
    name: "Desenvolvimento - Por Hora",
    category: "dev",
    description: "Flexibilidade para projetos com escopo evolutivo",
    budgetType: "hourly",
    sections: {
      introduction: "Esta proposta apresenta uma estrutura de trabalho flexível, ideal para projetos que evoluem conforme as descobertas técnicas e de produto.",
      justification: "O modelo por hora permite máxima flexibilidade e transparência, com reports semanais de progresso e ajustes contínuos de prioridade.",
      closing: "Sugiro começarmos com um sprint de discovery de 1 semana para mapear a arquitetura e definir o roadmap técnico. Posso agendar uma call para alinharmos os próximos passos?",
      exclusions: "• Infraestrutura e hospedagem\n• Licenças de software terceiros\n• Integrações não especificadas\n• Manutenção após período acordado",
      terms: "• Pagamento semanal contra relatório de horas\n• Mínimo de 10h semanais\n• Cancelamento: aviso prévio de 1 semana\n• Código fonte: entregue continuamente via Git",
    },
    deliverables: ["Código fonte no GitHub", "Documentação técnica", "Deploy em ambiente de staging", "Reports semanais"],
    timeline: "Contínuo",
    recommended: true,
  },
  {
    id: "marketing-package",
    name: "Marketing Digital - Pacotes",
    category: "marketing",
    description: "Opções escaláveis para diferentes orçamentos",
    budgetType: "package",
    sections: {
      introduction: "Desenvolvi pacotes personalizados para atender diferentes estágios de maturidade digital, garantindo que você invista de forma estratégica em cada fase.",
      justification: "Cada pacote foi desenhado para maximizar ROI em sua faixa de investimento, com métricas claras de sucesso e relatórios mensais de performance.",
      closing: "Recomendo começarmos pelo pacote [X] e avaliarmos os resultados após 60 dias para ajustes e possível upgrade. Podemos agendar uma call para definir o melhor caminho?",
      exclusions: "• Verba de mídia (ads)\n• Produção de conteúdo visual\n• Landing pages customizadas (exceto pacote Premium)\n• Gestão de redes sociais orgânicas",
      terms: "• Contrato mínimo: 3 meses\n• Pagamento: mensal antecipado\n• Relatórios: semanais/mensais conforme pacote\n• Rescisão: aviso de 30 dias",
    },
    deliverables: ["Setup de campanhas", "Dashboards de acompanhamento", "Relatórios de performance", "Otimizações contínuas"],
    timeline: "Mensal/Trimestral",
    recommended: true,
  },
  {
    id: "copywriting-fixed",
    name: "Copywriting - Projeto Fechado",
    category: "copywriting",
    description: "Textos estratégicos com foco em conversão",
    budgetType: "fixed",
    sections: {
      introduction: "Palavras certas no lugar certo geram ação. Esta proposta detalha como transformar sua comunicação em uma ferramenta de vendas eficaz.",
      justification: "O investimento em copywriting profissional se paga rapidamente através do aumento nas taxas de conversão. Cada texto é criado com base em pesquisa de persona e técnicas comprovadas de persuasão.",
      closing: "O próximo passo é uma sessão de briefing aprofundado onde vou entender seu público, tom de voz e objetivos. Quando podemos agendar?",
      exclusions: "• Design e diagramação\n• Tradução para outros idiomas\n• Revisões além das 2 rodadas incluídas\n• Textos para formatos não especificados",
      terms: "• Pagamento: 50% antecipado\n• Briefing: sessão de 1h inclusa\n• Revisões: 2 rodadas\n• Entrega: formatos editáveis",
    },
    deliverables: ["Headlines e subheadlines", "Corpo de texto", "CTAs testados", "Variações A/B"],
    timeline: "1-2 semanas",
    recommended: true,
  },
  {
    id: "consultoria-hourly",
    name: "Consultoria - Por Hora",
    category: "consultoria",
    description: "Aconselhamento estratégico flexível",
    budgetType: "hourly",
    sections: {
      introduction: "Esta proposta oferece acesso à minha expertise de forma flexível, permitindo que você utilize meu conhecimento conforme a demanda do seu projeto.",
      justification: "A consultoria por hora é ideal para quem precisa de direcionamento estratégico sem comprometer-se com um projeto completo. Cada hora é investida em gerar valor direto para seu negócio.",
      closing: "Sugiro começarmos com uma sessão de diagnóstico de 2h para mapear seus principais desafios. A partir daí, definimos um plano de ação personalizado.",
      exclusions: "• Execução de tarefas operacionais\n• Produção de materiais\n• Gestão de equipe ou projetos\n• Suporte fora do horário comercial",
      terms: "• Agendamento: mínimo 24h de antecedência\n• Cancelamento: reembolso se avisado com 12h\n• Formato: videochamada ou presencial\n• Registro: gravação e resumo inclusos",
    },
    deliverables: ["Sessões de consultoria", "Gravações das sessões", "Resumos executivos", "Plano de ação"],
    timeline: "Conforme demanda",
    recommended: true,
  },
];

export function getTemplatesByCategory(category: TemplateCategory, type: "portfolio" | "proposal") {
  if (type === "portfolio") {
    return portfolioTemplates.filter(t => t.category === category);
  }
  return proposalTemplates.filter(t => t.category === category);
}

export function getRecommendedTemplates(type: "portfolio" | "proposal") {
  if (type === "portfolio") {
    return portfolioTemplates.filter(t => t.recommended);
  }
  return proposalTemplates.filter(t => t.recommended);
}

export function getTemplateById(id: string, type: "portfolio" | "proposal") {
  if (type === "portfolio") {
    return portfolioTemplates.find(t => t.id === id);
  }
  return proposalTemplates.find(t => t.id === id);
}