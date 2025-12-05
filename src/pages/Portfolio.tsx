import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/contexts/ProjectsContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import {
  ExternalLink,
  Download,
  Palette,
  Layout as LayoutIcon,
  Type,
  Eye,
  Grid3X3,
  Layers,
  Presentation,
} from "lucide-react";

const templates = [
  { id: "case", name: "Case Study", icon: Layers, description: "Narrativa detalhada" },
  { id: "gallery", name: "Galeria", icon: Grid3X3, description: "Foco em imagens" },
  { id: "slides", name: "Apresentação", icon: Presentation, description: "Modo slides" },
  { id: "onepage", name: "One-pager", icon: LayoutIcon, description: "Resumo compacto" },
];

export default function Portfolio() {
  const { projects } = useProjects();
  const { data, generatedProfile } = useOnboarding();
  const [selectedTemplate, setSelectedTemplate] = useState("case");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("dark");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Editor Controls */}
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            {/* Templates */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LayoutIcon className="h-4 w-4" /> Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                      selectedTemplate === template.id
                        ? "bg-primary/10 border border-primary/50 text-primary"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    <template.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Customization */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Personalização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Modo de preview</label>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("light")}
                      className="flex-1"
                    >
                      Light
                    </Button>
                    <Button
                      variant={previewMode === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("dark")}
                      className="flex-1"
                    >
                      Dark
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Cores</label>
                  <div className="flex gap-2">
                    {["#8B5CF6", "#F97316", "#10B981", "#3B82F6", "#EC4899"].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-lg border-2 border-border hover:border-primary transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Type className="h-4 w-4" /> Tipografia
                  </label>
                  <select className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm">
                    <option>DM Sans</option>
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Playfair Display</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Export */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">Exportar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="gradient" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" /> Publicar link
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" /> Baixar PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Preview do Portfólio</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <Eye className="h-4 w-4" /> Tela cheia
              </Button>
            </div>

            <Card
              variant="glass"
              className={`overflow-hidden ${
                previewMode === "dark" ? "bg-[#0a0a0f]" : "bg-white"
              }`}
            >
              <div
                className={`p-8 min-h-[600px] ${
                  previewMode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {/* Portfolio Preview Content */}
                <div className="max-w-3xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center text-3xl font-bold text-white">
                      {data.name?.charAt(0) || "P"}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{data.name || "Seu Nome"}</h1>
                    <p className={previewMode === "dark" ? "text-gray-400" : "text-gray-600"}>
                      {data.area} • {data.niche}
                    </p>
                  </div>

                  {/* About */}
                  {generatedProfile && (
                    <div className="mb-12">
                      <h2 className="text-xl font-semibold mb-4">Sobre</h2>
                      <p className={previewMode === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {generatedProfile}
                      </p>
                    </div>
                  )}

                  {/* Projects */}
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Projetos</h2>
                    {projects.length === 0 ? (
                      <div
                        className={`text-center py-12 rounded-xl border border-dashed ${
                          previewMode === "dark"
                            ? "border-gray-700 text-gray-500"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        <p>Adicione projetos no Dashboard</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {projects.map((project) => (
                          <div
                            key={project.id}
                            className={`rounded-xl overflow-hidden border ${
                              previewMode === "dark"
                                ? "border-gray-800 bg-gray-900/50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            {project.images[0] && (
                              <img
                                src={project.images[0]}
                                alt={project.title}
                                className="w-full aspect-video object-cover"
                              />
                            )}
                            <div className="p-6">
                              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                              <p
                                className={
                                  previewMode === "dark" ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {project.description}
                              </p>
                              {project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {project.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        previewMode === "dark"
                                          ? "bg-gray-800 text-gray-300"
                                          : "bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
