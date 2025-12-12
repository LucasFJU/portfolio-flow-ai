import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code2,
  Palette,
  Megaphone,
  Pen,
  Video,
  Package,
  Briefcase,
  Sparkles,
} from "lucide-react";

export type NicheFramework = 
  | "dev" 
  | "design" 
  | "marketing" 
  | "copywriting" 
  | "video" 
  | "product" 
  | "general";

interface FrameworkOption {
  id: NicheFramework;
  label: string;
  icon: React.ReactNode;
  description: string;
  prompts: {
    briefing: string;
    challenge: string;
    execution: string;
    result: string;
  };
  proofTypes: string[];
}

const frameworks: FrameworkOption[] = [
  {
    id: "dev",
    label: "Desenvolvimento",
    icon: <Code2 className="h-5 w-5" />,
    description: "Projetos de código, apps, sistemas",
    prompts: {
      briefing: "Qual era o contexto técnico e requisitos do cliente?",
      challenge: "Quais desafios técnicos você enfrentou?",
      execution: "Qual arquitetura e tecnologias você utilizou?",
      result: "Qual foi a performance e impacto do sistema?",
    },
    proofTypes: ["Screenshots", "Métricas de performance", "Código", "Arquitetura"],
  },
  {
    id: "design",
    label: "Design",
    icon: <Palette className="h-5 w-5" />,
    description: "UI/UX, branding, visual",
    prompts: {
      briefing: "Qual era o briefing e público-alvo do projeto?",
      challenge: "Quais problemas de usabilidade ou marca você identificou?",
      execution: "Qual foi seu processo criativo e decisões de design?",
      result: "Como o design impactou a experiência do usuário?",
    },
    proofTypes: ["Antes/Depois", "User testing", "Wireframes", "Protótipos"],
  },
  {
    id: "marketing",
    label: "Marketing/Tráfego",
    icon: <Megaphone className="h-5 w-5" />,
    description: "Campanhas, ads, performance",
    prompts: {
      briefing: "Qual era o objetivo de negócio e orçamento?",
      challenge: "Qual era o custo de aquisição inicial e competição?",
      execution: "Quais canais e estratégias você utilizou?",
      result: "Qual foi o ROI e métricas de conversão?",
    },
    proofTypes: ["Dashboards", "ROI", "CPL/CPA", "Screenshots de ads"],
  },
  {
    id: "copywriting",
    label: "Copywriting",
    icon: <Pen className="h-5 w-5" />,
    description: "Textos, landing pages, emails",
    prompts: {
      briefing: "Qual era a persona e tom de voz desejado?",
      challenge: "Quais objeções e gatilhos precisavam ser abordados?",
      execution: "Qual estrutura e técnicas de copy você aplicou?",
      result: "Qual foi a taxa de conversão e engajamento?",
    },
    proofTypes: ["Antes/Depois de copy", "Taxas de conversão", "A/B tests"],
  },
  {
    id: "video",
    label: "Vídeo/Motion",
    icon: <Video className="h-5 w-5" />,
    description: "Edição, animação, produção",
    prompts: {
      briefing: "Qual era o conceito criativo e plataforma de destino?",
      challenge: "Quais restrições técnicas ou criativas existiam?",
      execution: "Qual foi o processo de produção e pós-produção?",
      result: "Qual foi o alcance e engajamento do conteúdo?",
    },
    proofTypes: ["Vídeo final", "Storyboard", "Métricas de views", "Depoimentos"],
  },
  {
    id: "product",
    label: "Produto/PM",
    icon: <Package className="h-5 w-5" />,
    description: "Product management, estratégia",
    prompts: {
      briefing: "Qual era o problema de negócio e hipótese?",
      challenge: "Quais trade-offs e priorização foram necessários?",
      execution: "Qual foi a metodologia e roadmap de entrega?",
      result: "Qual foi o impacto nas métricas de produto?",
    },
    proofTypes: ["Roadmap", "Métricas de produto", "User research", "OKRs"],
  },
  {
    id: "general",
    label: "Generalista",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Projetos diversos",
    prompts: {
      briefing: "Qual era o contexto e objetivo do projeto?",
      challenge: "Quais desafios você enfrentou?",
      execution: "Como você executou o projeto?",
      result: "Quais resultados foram alcançados?",
    },
    proofTypes: ["Screenshots", "Depoimentos", "Métricas", "Documentação"],
  },
];

interface StoryFrameworkSelectorProps {
  value: NicheFramework;
  onChange: (framework: NicheFramework) => void;
  showDescription?: boolean;
}

export function StoryFrameworkSelector({ 
  value, 
  onChange, 
  showDescription = true 
}: StoryFrameworkSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {frameworks.map((framework) => (
        <button
          key={framework.id}
          onClick={() => onChange(framework.id)}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
            value === framework.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <div className={`${value === framework.id ? "text-primary" : "text-muted-foreground"}`}>
            {framework.icon}
          </div>
          <span className={`text-sm font-medium ${value === framework.id ? "text-primary" : ""}`}>
            {framework.label}
          </span>
          {showDescription && (
            <span className="text-xs text-muted-foreground text-center line-clamp-1">
              {framework.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function getFrameworkPrompts(framework: NicheFramework) {
  return frameworks.find(f => f.id === framework)?.prompts || frameworks[6].prompts;
}

export function getFrameworkProofTypes(framework: NicheFramework) {
  return frameworks.find(f => f.id === framework)?.proofTypes || frameworks[6].proofTypes;
}

export { frameworks };