import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AIRequest {
  type: string;
  context: Record<string, unknown>;
}

const systemPrompts: Record<string, string> = {
  profile: `Você é um especialista em posicionamento profissional para criativos e designers. 
Gere um perfil de posicionamento profissional conciso e impactante em português brasileiro.
O perfil deve ter entre 2-3 parágrafos, destacando:
- A proposta de valor única do profissional
- A experiência e especialização
- O diferencial competitivo
Use linguagem profissional mas acessível.`,

  "portfolio-structure": `Você é um consultor de portfólios para profissionais criativos.
Com base nas informações fornecidas, sugira uma estrutura ideal para o portfólio em português brasileiro.
Inclua:
- Ordem recomendada de seções
- Tipos de projetos para destacar
- Dicas de apresentação
Seja específico e prático.`,

  "project-narrative": `Você é um copywriter especializado em case studies de design e projetos criativos.
Crie uma narrativa envolvente para o projeto em português brasileiro.
A narrativa deve:
- Conectar as etapas do projeto de forma fluida
- Destacar desafios e soluções
- Evidenciar resultados e impacto
- Ter entre 2-4 parágrafos
Use linguagem profissional e persuasiva.`,

  "project-extract": `Você é um especialista em estruturar projetos para portfólios profissionais.
Com base nas informações fornecidas, extraia e estruture os seguintes elementos em português brasileiro:
- Problema: O problema que o cliente enfrentava
- Solução: Como o problema foi resolvido
- Impacto: O impacto gerado pelo projeto
- Métricas: Números e resultados mensuráveis

Formate a resposta EXATAMENTE assim:
Problema: [descrição do problema]
Solução: [descrição da solução]
Impacto: [descrição do impacto]
Métricas: [métricas e resultados]

Seja conciso e focado em resultados.`,

  "proposal-intro": `Você é um especialista em propostas comerciais para serviços criativos.
Escreva uma introdução profissional e personalizada para uma proposta comercial em português brasileiro.
A introdução deve:
- Reconhecer as necessidades do cliente
- Apresentar brevemente o profissional/empresa
- Criar conexão e confiança
- Ter entre 1-2 parágrafos
Seja cordial mas profissional.`,

  "proposal-justification": `Você é um especialista em propostas comerciais para serviços criativos.
Escreva uma justificativa clara e convincente para os valores apresentados na proposta em português brasileiro.
A justificativa deve:
- Explicar o valor agregado dos serviços
- Destacar a experiência e qualidade
- Justificar o investimento
- Ter entre 1-2 parágrafos
Seja persuasivo mas honesto.`,

  "proposal-closing": `Você é um especialista em propostas comerciais para serviços criativos.
Escreva um fechamento profissional e motivador para uma proposta comercial em português brasileiro.
O fechamento deve:
- Resumir os benefícios principais
- Criar senso de oportunidade
- Incluir call-to-action claro
- Ter entre 1-2 parágrafos
Seja entusiasmado mas profissional.`,

  "proposal-exclusions": `Você é um especialista em propostas comerciais para serviços criativos.
Gere uma lista clara do que NÃO está incluso na proposta em português brasileiro.
A lista deve:
- Usar bullet points
- Ser clara e objetiva
- Prevenir mal-entendidos futuros
- Incluir itens comuns que geram retrabalho
Foque em proteger o profissional sem ser negativo.`,

  "proposal-terms": `Você é um especialista em propostas comerciais para serviços criativos.
Gere termos e condições profissionais para a proposta em português brasileiro.
Os termos devem incluir:
- Condições de pagamento
- Número de revisões incluídas
- Prazo de entrega
- Condições de cancelamento
Use bullet points e seja claro.`,

  "proposal-timeline": `Você é um especialista em gestão de projetos criativos.
Gere um cronograma de projeto com marcos claros em português brasileiro.
O cronograma deve:
- Dividir o projeto em fases
- Incluir marcos de entrega
- Ser realista e profissional
- Usar formato de semanas
Use bullet points e seja específico.`,

  "proposal-deliverables": `Você é um especialista em propostas comerciais para serviços criativos.
Gere uma lista de entregáveis do projeto em português brasileiro.
A lista deve:
- Usar bullet points
- Ser específica e tangível
- Incluir formatos de entrega
- Mostrar valor agregado
Foque em clareza e profissionalismo.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context }: AIRequest = await req.json();
    
    console.log("AI Generate request:", { type, context });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = systemPrompts[type];
    if (!systemPrompt) {
      throw new Error(`Unknown generation type: ${type}`);
    }

    let userPrompt = "";
    
    switch (type) {
      case "profile":
        userPrompt = `Gere um perfil de posicionamento profissional para:
Nome: ${context.name || "Profissional"}
Área: ${context.area || "Design"}
Nicho: ${context.niche || "Generalista"}
Nível de experiência: ${context.experienceLevel || "Intermediário"}
Cliente ideal: ${context.idealClient || "Empresas e startups"}
Objetivo do portfólio: ${context.portfolioObjective || "Atrair novos clientes"}`;
        break;
        
      case "portfolio-structure":
        userPrompt = `Sugira uma estrutura de portfólio para:
Nome: ${context.name || "Profissional"}
Área: ${context.area || "Design"}
Nicho: ${context.niche || "Generalista"}
Número de projetos: ${context.projectCount || 0}
Objetivo: ${context.portfolioObjective || "Atrair novos clientes"}`;
        break;
        
      case "project-narrative":
        userPrompt = `Crie uma narrativa para o projeto:
Título: ${context.title || "Projeto"}
Briefing: ${context.briefing || "Não informado"}
Desafio: ${context.challenge || "Não informado"}
Execução: ${context.execution || "Não informado"}
Resultado: ${context.result || "Não informado"}
Tecnologias: ${Array.isArray(context.technologies) ? context.technologies.join(", ") : "Não informado"}`;
        break;

      case "project-extract":
        userPrompt = `Extraia problema, solução, impacto e métricas do projeto:
Título: ${context.title || "Projeto"}
Resultado mencionado: ${context.result || "Não informado"}
Tecnologias: ${Array.isArray(context.technologies) ? context.technologies.join(", ") : "Não informado"}
Descrição: ${context.description || "Não informado"}`;
        break;
        
      case "proposal-intro":
        userPrompt = `Escreva uma introdução para proposta:
Nome do cliente: ${context.clientName || "Cliente"}
Nome do profissional: ${context.professionalName || "Profissional"}
Área de atuação: ${context.area || "Design"}
Projetos incluídos: ${context.projects || "1 projeto"}`;
        break;
        
      case "proposal-justification":
        userPrompt = `Escreva uma justificativa para proposta:
Valor total: R$ ${context.totalValue || "0,00"}
Tipo de orçamento: ${context.budgetType || "fixo"}
Serviços incluídos: ${context.services || "Design e desenvolvimento"}
Prazo estimado: ${context.deadline || "A combinar"}`;
        break;
        
      case "proposal-closing":
        userPrompt = `Escreva um fechamento para proposta:
Nome do cliente: ${context.clientName || "Cliente"}
Nome do profissional: ${context.professionalName || "Profissional"}
Próximos passos sugeridos: ${context.nextSteps || "Reunião de alinhamento"}`;
        break;

      case "proposal-exclusions":
        userPrompt = `Gere uma lista do que NÃO está incluso:
Nome do cliente: ${context.clientName || "Cliente"}
Projetos: ${context.projects || "Projeto geral"}
Valor total: R$ ${context.totalValue || "0"}`;
        break;

      case "proposal-terms":
        userPrompt = `Gere termos e condições:
Nome do cliente: ${context.clientName || "Cliente"}
Valor total: R$ ${context.totalValue || "0"}
Validade: ${context.validityDays || 15} dias`;
        break;

      case "proposal-timeline":
        userPrompt = `Gere um cronograma de projeto:
Projetos: ${context.projects || "Projeto geral"}
Valor total: R$ ${context.totalValue || "0"}`;
        break;

      case "proposal-deliverables":
        userPrompt = `Gere uma lista de entregáveis:
Projetos: ${context.projects || "Projeto geral"}`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      
      if (status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados. Adicione mais créditos na sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar conteúdo com IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("AI Generate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});