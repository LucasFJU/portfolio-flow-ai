import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useProjects, Project, ProjectStage } from "@/contexts/ProjectsContext";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Sparkles,
  Link as LinkIcon,
  Video,
  GripVertical,
} from "lucide-react";

const defaultStage: ProjectStage = { title: "", description: "" };

const defaultProject: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  images: [],
  videoUrl: "",
  stages: {
    briefing: { ...defaultStage },
    challenge: { ...defaultStage },
    execution: { ...defaultStage },
    result: { ...defaultStage },
  },
  technologies: [],
  links: [],
  status: "draft",
};

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, addProject, updateProject, getProject } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingProject = id && id !== "new" ? getProject(id) : null;
  const [project, setProject] = useState<Omit<Project, "id" | "createdAt" | "updatedAt">>(
    existingProject || defaultProject
  );
  const [newTech, setNewTech] = useState("");
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setProject((prev) => ({
                ...prev,
                images: [...prev.images, event.target!.result as string],
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setProject((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTechnology = () => {
    if (newTech.trim() && !project.technologies.includes(newTech.trim())) {
      setProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const addLink = () => {
    if (newLink.label.trim() && newLink.url.trim()) {
      setProject((prev) => ({
        ...prev,
        links: [...prev.links, { ...newLink }],
      }));
      setNewLink({ label: "", url: "" });
    }
  };

  const removeLink = (index: number) => {
    setProject((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateStage = (
    stage: keyof typeof project.stages,
    field: keyof ProjectStage,
    value: string
  ) => {
    setProject((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stage]: { ...prev.stages[stage], [field]: value },
      },
    }));
  };

  const generateNarrative = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulated AI narrative generation
    const narrative = `Este projeto representa uma jornada criativa única, desde o briefing inicial até resultados mensuráveis. A abordagem focou em resolver os desafios principais mantendo a essência do cliente em cada decisão de design.`;
    
    setProject((prev) => ({
      ...prev,
      description: narrative,
    }));
    setIsGenerating(false);
    toast.success("Narrativa gerada com IA!");
  };

  const handleSave = () => {
    if (!project.title.trim()) {
      toast.error("Adicione um título ao projeto");
      return;
    }
    if (project.images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    const status = calculateCompletionStatus(project);

    if (existingProject) {
      updateProject(existingProject.id, { ...project, status });
      toast.success("Projeto atualizado!");
    } else {
      addProject({ ...project, status });
      toast.success("Projeto criado!");
    }
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <Button variant="gradient" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Salvar projeto
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Informações básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Título do projeto</label>
                <Input
                  placeholder="Ex: Redesign do App Fintech XYZ"
                  value={project.title}
                  onChange={(e) => setProject((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateNarrative}
                    disabled={isGenerating}
                    className="gap-2 text-primary"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGenerating ? "Gerando..." : "Gerar com IA"}
                  </Button>
                </div>
                <Textarea
                  placeholder="Descreva seu projeto, objetivos e resultados alcançados..."
                  value={project.description}
                  onChange={(e) => setProject((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Imagens do projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-video bg-secondary rounded-lg overflow-hidden group"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="cursor-grab">
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Adicionar imagem</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Video */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" /> Vídeo (opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Cole o link do YouTube ou Vimeo"
                value={project.videoUrl}
                onChange={(e) => setProject((prev) => ({ ...prev, videoUrl: e.target.value }))}
              />
            </CardContent>
          </Card>

          {/* Stages */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Etapas do projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(["briefing", "challenge", "execution", "result"] as const).map((stage) => (
                <div key={stage} className="space-y-2">
                  <label className="text-sm font-medium capitalize">
                    {stage === "briefing" && "Briefing"}
                    {stage === "challenge" && "Desafio"}
                    {stage === "execution" && "Execução"}
                    {stage === "result" && "Resultado"}
                  </label>
                  <Textarea
                    placeholder={`Descreva ${
                      stage === "briefing"
                        ? "o contexto inicial e objetivos"
                        : stage === "challenge"
                        ? "os principais desafios enfrentados"
                        : stage === "execution"
                        ? "como você executou o projeto"
                        : "os resultados alcançados"
                    }...`}
                    value={project.stages[stage].description}
                    onChange={(e) => updateStage(stage, "description", e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Tecnologias & Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Ex: Figma, React, Branding..."
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                />
                <Button variant="outline" onClick={addTechnology}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-secondary rounded-full text-sm flex items-center gap-2"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" /> Links externos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Nome do link"
                  value={newLink.label}
                  onChange={(e) => setNewLink((prev) => ({ ...prev, label: e.target.value }))}
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
                />
                <Button variant="outline" onClick={addLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {project.links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{link.label}</span>
                      <span className="text-sm text-muted-foreground ml-2">{link.url}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeLink(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function calculateCompletionStatus(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
): "draft" | "complete" {
  const checks = [
    project.title.length > 0,
    project.description.length > 0,
    project.images.length > 0,
    project.stages.briefing.description.length > 0,
    project.stages.result.description.length > 0,
  ];
  return checks.every(Boolean) ? "complete" : "draft";
}
