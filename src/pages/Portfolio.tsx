import { useState, useRef, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects, Project } from "@/contexts/ProjectsContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";
import { exportToPDF, copyToClipboard } from "@/utils/exportUtils";
import { CaseStudyTemplate } from "@/components/portfolio/templates/CaseStudyTemplate";
import { GalleryTemplate } from "@/components/portfolio/templates/GalleryTemplate";
import { SlidesTemplate } from "@/components/portfolio/templates/SlidesTemplate";
import { OnePageTemplate } from "@/components/portfolio/templates/OnePageTemplate";
import { toast } from "sonner";
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
  Copy,
  Check,
  Columns,
  Maximize,
} from "lucide-react";

const templates = [
  { id: "case", name: "Case Study", icon: Layers, description: "Narrativa detalhada" },
  { id: "gallery", name: "Galeria", icon: Grid3X3, description: "Foco em imagens" },
  { id: "slides", name: "Apresentação", icon: Presentation, description: "Modo slides" },
  { id: "onepage", name: "One-pager", icon: LayoutIcon, description: "Resumo compacto" },
];

const colors = [
  { value: "#8B5CF6", name: "Roxo" },
  { value: "#F97316", name: "Laranja" },
  { value: "#10B981", name: "Verde" },
  { value: "#3B82F6", name: "Azul" },
  { value: "#EC4899", name: "Rosa" },
  { value: "#EF4444", name: "Vermelho" },
];

const fonts = [
  { value: "DM Sans", label: "DM Sans" },
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair" },
];

export default function Portfolio() {
  const { projects } = useProjects();
  const { data, generatedProfile } = useOnboarding();
  const { settings, updateSettings } = usePortfolioSettings();
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("dark");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Order projects based on settings
  const orderedProjects = useMemo(() => {
    if (settings.projectOrder.length === 0) return projects;
    
    const orderMap = new Map(settings.projectOrder.map((id, index) => [id, index]));
    return [...projects].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Infinity;
      const orderB = orderMap.get(b.id) ?? Infinity;
      return orderA - orderB;
    });
  }, [projects, settings.projectOrder]);

  const profile = {
    name: data.name || "Seu Nome",
    area: data.area || "",
    niche: data.niche || "",
    bio: generatedProfile || "",
  };

  const handleExportPDF = async () => {
    if (!portfolioRef.current) return;
    
    setIsExporting(true);
    try {
      await exportToPDF("portfolio-preview", `portfolio-${data.name || "meu"}.pdf`);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/portfolio?preview=true`;
    
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      toast.success("Link copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleFullscreen = () => {
    if (!portfolioRef.current) return;
    
    if (!document.fullscreenElement) {
      portfolioRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const renderTemplate = () => {
    const templateProps = {
      projects: orderedProjects,
      profile,
      settings,
      previewMode,
    };

    switch (settings.template) {
      case "gallery":
        return <GalleryTemplate {...templateProps} />;
      case "slides":
        return <SlidesTemplate {...templateProps} />;
      case "onepage":
        return <OnePageTemplate {...templateProps} />;
      case "case":
      default:
        return <CaseStudyTemplate {...templateProps} />;
    }
  };

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
                    onClick={() => updateSettings({ template: template.id as any })}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                      settings.template === template.id
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
                {/* Preview Mode */}
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

                {/* Colors */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Cor primária</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateSettings({ primaryColor: color.value })}
                        className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                          settings.primaryColor === color.value
                            ? "border-foreground scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Type className="h-4 w-4" /> Tipografia
                  </label>
                  <select
                    value={settings.font}
                    onChange={(e) => updateSettings({ font: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm"
                  >
                    {fonts.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Columns */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Columns className="h-4 w-4" /> Colunas
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((cols) => (
                      <Button
                        key={cols}
                        variant={settings.columns === cols ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ columns: cols as 1 | 2 | 3 })}
                        className="flex-1"
                      >
                        {cols}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">Exportar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="gradient"
                  className="w-full gap-2"
                  onClick={handleShareLink}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Link copiado!
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" /> Publicar link
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? "Exportando..." : "Baixar PDF"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleFullscreen}
                >
                  <Maximize className="h-4 w-4" /> Tela cheia
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Preview do Portfólio</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {orderedProjects.length} projeto{orderedProjects.length !== 1 ? "s" : ""}
              </div>
            </div>

            <Card
              variant="glass"
              className="overflow-hidden"
              ref={portfolioRef}
            >
              <div
                id="portfolio-preview"
                className={`p-8 min-h-[600px] ${
                  previewMode === "dark"
                    ? "bg-[#0a0a0f] text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {orderedProjects.length === 0 ? (
                  <div
                    className={`text-center py-24 rounded-xl border border-dashed ${
                      previewMode === "dark"
                        ? "border-gray-700 text-gray-500"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Sem projetos ainda</p>
                    <p>Adicione projetos no Dashboard para visualizar seu portfólio</p>
                  </div>
                ) : (
                  renderTemplate()
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}