import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useProjects, Project } from "@/contexts/ProjectsContext";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import { toast } from "sonner";
import {
  Upload,
  X,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  Loader2,
  Clock,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface QuickProjectFormProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function QuickProjectForm({ onComplete, onCancel }: QuickProjectFormProps) {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const { generate, isGenerating } = useAIGenerate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick fields (required)
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [resultLine, setResultLine] = useState("");
  const [newTech, setNewTech] = useState("");

  // Advanced fields (optional)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [description, setDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [solutionSummary, setSolutionSummary] = useState("");
  const [impactDescription, setImpactDescription] = useState("");
  const [resultMetrics, setResultMetrics] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && images.length < 3) {
      Array.from(files).slice(0, 3 - images.length).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages((prev) => [...prev, event.target!.result as string].slice(0, 3));
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && images.length < 3) {
      Array.from(files).slice(0, 3 - images.length).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages((prev) => [...prev, event.target!.result as string].slice(0, 3));
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }, [images.length]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies((prev) => [...prev, newTech.trim()]);
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies((prev) => prev.filter((t) => t !== tech));
  };

  const generateNarrativeWithAI = async () => {
    if (!title.trim()) {
      toast.error("Adicione um título primeiro");
      return;
    }

    const narrative = await generate("project-narrative", {
      title,
      briefing: problemStatement || `Projeto ${title}`,
      challenge: solutionSummary || "Desenvolver solução eficaz",
      execution: technologies.join(", ") || "Tecnologias diversas",
      result: resultLine || resultMetrics || "Resultados positivos",
      technologies,
    });

    if (narrative) {
      setDescription(narrative);
      toast.success("Narrativa gerada com IA!");
    }
  };

  const extractWithAI = async () => {
    if (!title.trim() && !resultLine.trim()) {
      toast.error("Adicione título ou resultado primeiro");
      return;
    }

    setExtracting(true);
    try {
      const extracted = await generate("project-extract", {
        title,
        result: resultLine,
        technologies,
        description,
      });

      if (extracted) {
        // Parse AI response and fill fields
        const lines = extracted.split("\n").filter(l => l.trim());
        
        // Try to extract structured data
        for (const line of lines) {
          if (line.toLowerCase().includes("problema:")) {
            setProblemStatement(line.split(":").slice(1).join(":").trim());
          } else if (line.toLowerCase().includes("solução:")) {
            setSolutionSummary(line.split(":").slice(1).join(":").trim());
          } else if (line.toLowerCase().includes("impacto:")) {
            setImpactDescription(line.split(":").slice(1).join(":").trim());
          } else if (line.toLowerCase().includes("métricas:") || line.toLowerCase().includes("resultados:")) {
            setResultMetrics(line.split(":").slice(1).join(":").trim());
          }
        }

        // If couldn't parse, use full text as description
        if (!problemStatement && !solutionSummary) {
          setDescription(extracted);
        }

        setShowAdvanced(true);
        toast.success("Dados extraídos com IA!");
      }
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }
    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    setSaving(true);

    try {
      const projectData: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
        title,
        description: description || resultLine,
        images,
        videoUrl,
        stages: {
          briefing: { title: "Briefing", description: problemStatement },
          challenge: { title: "Desafio", description: solutionSummary },
          execution: { title: "Execução", description: "" },
          result: { title: "Resultado", description: resultLine || resultMetrics },
        },
        technologies,
        links: [],
        status: "draft",
      };

      await addProject(projectData);
      toast.success("Projeto criado em 60 segundos!");
      
      if (onComplete) {
        onComplete();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-5 w-5 text-accent" />
          Projeto em 60s
          <span className="text-xs font-normal text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" />
            Apenas 4 campos obrigatórios
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Título do projeto <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Ex: App de Delivery para Restaurante XYZ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base"
          />
        </div>

        {/* Images - Drag & Drop */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Imagens (1-3) <span className="text-destructive">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="grid grid-cols-3 gap-3"
          >
            {images.map((img, index) => (
              <div key={index} className="relative aspect-video bg-secondary rounded-lg overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {images.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Arraste ou clique</span>
              </button>
            )}
          </div>
        </div>

        {/* Stack / Technologies */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Stack / Ferramentas <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Ex: React, Figma, Node.js..."
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
            />
            <Button variant="outline" size="icon" onClick={addTechnology}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                >
                  {tech}
                  <button onClick={() => removeTechnology(tech)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Result Line */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Resultado em 1 linha <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="Ex: Aumento de 40% nas conversões do e-commerce"
            value={resultLine}
            onChange={(e) => setResultLine(e.target.value)}
          />
        </div>

        {/* AI Extraction Button */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={extractWithAI}
            disabled={extracting || isGenerating}
            className="flex-1 gap-2"
          >
            {extracting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Extrair com IA (problema → solução → impacto)
          </Button>
        </div>

        {/* Advanced Fields - Collapsible */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              Campos avançados (opcional)
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Problem Statement */}
            <div>
              <label className="text-sm font-medium mb-2 block">Problema</label>
              <Textarea
                placeholder="Qual problema o cliente enfrentava?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={2}
              />
            </div>

            {/* Solution */}
            <div>
              <label className="text-sm font-medium mb-2 block">Solução</label>
              <Textarea
                placeholder="Como você resolveu o problema?"
                value={solutionSummary}
                onChange={(e) => setSolutionSummary(e.target.value)}
                rows={2}
              />
            </div>

            {/* Impact */}
            <div>
              <label className="text-sm font-medium mb-2 block">Impacto</label>
              <Textarea
                placeholder="Qual foi o impacto gerado?"
                value={impactDescription}
                onChange={(e) => setImpactDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Metrics */}
            <div>
              <label className="text-sm font-medium mb-2 block">Métricas / KPIs</label>
              <Textarea
                placeholder="Métricas mensuráveis (%, números, etc.)"
                value={resultMetrics}
                onChange={(e) => setResultMetrics(e.target.value)}
                rows={2}
              />
            </div>

            {/* Full Description with AI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Narrativa completa</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateNarrativeWithAI}
                  disabled={isGenerating}
                  className="gap-2 text-primary h-8"
                >
                  <Sparkles className="h-3 w-3" />
                  {isGenerating ? "Gerando..." : "Gerar com IA"}
                </Button>
              </div>
              <Textarea
                placeholder="Narrativa estratégica do projeto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="text-sm font-medium mb-2 block">Vídeo (opcional)</label>
              <Input
                placeholder="Link do YouTube ou Vimeo"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          )}
          <Button
            variant="gradient"
            onClick={handleSave}
            disabled={saving || !title.trim() || images.length === 0 || technologies.length === 0}
            className="flex-1 gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Criar Projeto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}