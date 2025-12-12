import { useState, useCallback } from "react";
import { toast } from "sonner";

type AIGenerationType = 
  | "profile" 
  | "portfolio-structure" 
  | "project-narrative" 
  | "project-extract"
  | "proposal-intro" 
  | "proposal-justification" 
  | "proposal-closing"
  | "proposal-exclusions"
  | "proposal-terms"
  | "proposal-timeline"
  | "proposal-deliverables";

interface UseAIGenerateOptions {
  onComplete?: (text: string) => void;
}

export function useAIGenerate(options?: UseAIGenerateOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (
    type: AIGenerationType,
    context: Record<string, unknown>
  ) => {
    setIsGenerating(true);
    setGeneratedText("");
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ type, context }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Limite de requisições excedido. Tente novamente em alguns segundos.");
        }
        if (response.status === 402) {
          throw new Error("Créditos de IA esgotados. Adicione mais créditos na sua conta.");
        }
        throw new Error("Erro ao gerar conteúdo");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullText = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setGeneratedText(fullText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      options?.onComplete?.(fullText);
      return fullText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  return {
    generate,
    isGenerating,
    generatedText,
    error,
    setGeneratedText,
  };
}
