import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Ban,
  FileText,
  Calendar,
  Clock,
  ListTodo,
} from "lucide-react";

interface AdvancedProposalFieldsProps {
  exclusions: string;
  setExclusions: (value: string) => void;
  terms: string;
  setTerms: (value: string) => void;
  validityDays: number;
  setValidityDays: (value: number) => void;
  timeline: string;
  setTimeline: (value: string) => void;
  deliverables: string;
  setDeliverables: (value: string) => void;
  clientName?: string;
  projectTitles?: string;
  totalValue?: number;
}

export default function AdvancedProposalFields({
  exclusions,
  setExclusions,
  terms,
  setTerms,
  validityDays,
  setValidityDays,
  timeline,
  setTimeline,
  deliverables,
  setDeliverables,
  clientName,
  projectTitles,
  totalValue,
}: AdvancedProposalFieldsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { generate, isGenerating } = useAIGenerate();
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  const generateExclusions = async () => {
    setGeneratingField("exclusions");
    try {
      const result = await generate("proposal-exclusions", {
        clientName: clientName || "Cliente",
        projects: projectTitles || "Projeto",
        totalValue: totalValue || 0,
      });
      if (result) {
        setExclusions(result);
      }
    } finally {
      setGeneratingField(null);
    }
  };

  const generateTerms = async () => {
    setGeneratingField("terms");
    try {
      const result = await generate("proposal-terms", {
        clientName: clientName || "Cliente",
        totalValue: totalValue || 0,
        validityDays,
      });
      if (result) {
        setTerms(result);
      }
    } finally {
      setGeneratingField(null);
    }
  };

  const generateTimeline = async () => {
    setGeneratingField("timeline");
    try {
      const result = await generate("proposal-timeline", {
        projects: projectTitles || "Projeto",
        totalValue: totalValue || 0,
      });
      if (result) {
        setTimeline(result);
      }
    } finally {
      setGeneratingField(null);
    }
  };

  const generateDeliverables = async () => {
    setGeneratingField("deliverables");
    try {
      const result = await generate("proposal-deliverables", {
        projects: projectTitles || "Projeto",
      });
      if (result) {
        setDeliverables(result);
      }
    } finally {
      setGeneratingField(null);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card variant="glass">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-lg">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Campos Avançados
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-normal text-muted-foreground">
                  Exclusões, termos, cronograma
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Exclusions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-destructive" />
                  O que NÃO está incluso
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateExclusions}
                  disabled={isGenerating || generatingField !== null}
                  className="h-8 gap-2 text-primary"
                >
                  {generatingField === "exclusions" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Gerar com IA
                </Button>
              </div>
              <Textarea
                value={exclusions}
                onChange={(e) => setExclusions(e.target.value)}
                placeholder="• Alterações de escopo não previstas&#10;• Hospedagem e domínio&#10;• Manutenção contínua após entrega&#10;• Conteúdo (textos e imagens)"
                rows={4}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Defina claramente o que não faz parte do projeto para evitar retrabalho
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-primary" />
                  Entregáveis
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateDeliverables}
                  disabled={isGenerating || generatingField !== null}
                  className="h-8 gap-2 text-primary"
                >
                  {generatingField === "deliverables" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Gerar com IA
                </Button>
              </div>
              <Textarea
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder="• Design completo em Figma&#10;• Código-fonte no GitHub&#10;• Documentação técnica&#10;• 1 mês de suporte pós-entrega"
                rows={4}
                className="text-sm"
              />
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  Cronograma / Marcos
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateTimeline}
                  disabled={isGenerating || generatingField !== null}
                  className="h-8 gap-2 text-primary"
                >
                  {generatingField === "timeline" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Gerar com IA
                </Button>
              </div>
              <Textarea
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="• Semana 1-2: Discovery e wireframes&#10;• Semana 3-4: Design de interface&#10;• Semana 5-6: Desenvolvimento&#10;• Semana 7: Testes e ajustes&#10;• Semana 8: Entrega final"
                rows={4}
                className="text-sm"
              />
            </div>

            {/* Validity & Terms */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validityDays" className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  Validade da proposta
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="validityDays"
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    min={1}
                    max={90}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">dias</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Termos e Condições
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateTerms}
                  disabled={isGenerating || generatingField !== null}
                  className="h-8 gap-2 text-primary"
                >
                  {generatingField === "terms" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Gerar com IA
                </Button>
              </div>
              <Textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="• Pagamento: 50% na aprovação, 50% na entrega&#10;• Revisões: até 2 rodadas incluídas&#10;• Prazo adicional: sob consulta&#10;• Cancelamento: mediante aviso prévio de 7 dias"
                rows={4}
                className="text-sm"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}