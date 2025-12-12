import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProposals, BudgetItem, Proposal } from "@/contexts/ProposalsContext";
import { useProjects } from "@/contexts/ProjectsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import AdvancedProposalFields from "@/components/proposal/AdvancedProposalFields";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function ProposalEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProposal, addProposal, updateProposal, publishProposal, canCreateProposal } = useProposals();
  const { projects } = useProjects();
  const { generate, isGenerating } = useAIGenerate();

  const isNew = id === "new";
  const existingProposal = !isNew ? getProposal(id!) : undefined;

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [justification, setJustification] = useState("");
  const [closing, setClosing] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [budgetType, setBudgetType] = useState<"hourly" | "fixed" | "package">("fixed");
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  
  // Advanced fields
  const [exclusions, setExclusions] = useState("");
  const [terms, setTerms] = useState("");
  const [validityDays, setValidityDays] = useState(15);
  const [timeline, setTimeline] = useState("");
  const [deliverables, setDeliverables] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  useEffect(() => {
    if (isNew && !canCreateProposal) {
      toast.error("Limite de 5 propostas gratuitas atingido");
      navigate("/proposals");
      return;
    }

    if (existingProposal) {
      setTitle(existingProposal.title);
      setClientName(existingProposal.client_name || "");
      setClientEmail(existingProposal.client_email || "");
      setIntroduction(existingProposal.introduction || "");
      setJustification(existingProposal.justification || "");
      setClosing(existingProposal.closing || "");
      setSelectedProjects(existingProposal.project_ids);
      setBudgetType(existingProposal.budget_type);
      setBudgetItems(existingProposal.budget_items.length > 0 ? existingProposal.budget_items : [
        { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 },
      ]);
      setPrimaryColor(existingProposal.primary_color);
      setLogoUrl(existingProposal.logo_url || "");
      setCoverImageUrl(existingProposal.cover_image_url || "");
      // Advanced fields from DB
      setExclusions((existingProposal as any).exclusions || "");
      setTerms((existingProposal as any).terms || "");
      setValidityDays((existingProposal as any).validity_days || 15);
      setTimeline((existingProposal as any).timeline || "");
      setDeliverables((existingProposal as any).deliverables || "");
    }
  }, [existingProposal, isNew, navigate, canCreateProposal]);

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const addBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeBudgetItem = (id: string) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter((item) => item.id !== id));
    }
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetItems(
      budgetItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const totalValue = budgetItems.reduce((sum, item) => sum + item.total, 0);
  const projectTitles = projects.filter((p) => selectedProjects.includes(p.id)).map((p) => p.title).join(", ");

  const generateAIText = async (field: "introduction" | "justification" | "closing") => {
    setGeneratingField(field);

    let type: "proposal-intro" | "proposal-justification" | "proposal-closing" = "proposal-intro";
    let context: Record<string, unknown> = {};

    if (field === "introduction") {
      type = "proposal-intro";
      context = {
        clientName: clientName || "Cliente",
        projects: projectTitles || "Projetos selecionados",
        totalValue: totalValue,
      };
    } else if (field === "justification") {
      type = "proposal-justification";
      context = {
        clientName: clientName || "Cliente",
        projects: projectTitles || "Projetos selecionados",
        budgetType,
        totalValue,
      };
    } else {
      type = "proposal-closing";
      context = {
        clientName: clientName || "Cliente",
        totalValue,
      };
    }

    try {
      const text = await generate(type, context);
      if (text) {
        if (field === "introduction") setIntroduction(text);
        else if (field === "justification") setJustification(text);
        else setClosing(text);
      }
    } catch {
      toast.error("Erro ao gerar texto");
    } finally {
      setGeneratingField(null);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    setSaving(true);

    try {
      const proposalData: any = {
        title,
        client_name: clientName || null,
        client_email: clientEmail || null,
        introduction: introduction || null,
        justification: justification || null,
        closing: closing || null,
        project_ids: selectedProjects,
        budget_items: budgetItems,
        budget_type: budgetType,
        total_value: totalValue,
        logo_url: logoUrl || null,
        primary_color: primaryColor,
        cover_image_url: coverImageUrl || null,
        status: "draft",
        viewed_at: null,
        // Advanced fields
        exclusions: exclusions || null,
        terms: terms || null,
        validity_days: validityDays,
        timeline: timeline || null,
        deliverables: deliverables || null,
      };

      if (isNew) {
        const newProposal = await addProposal(proposalData);
        if (newProposal) {
          toast.success("Proposta criada!");
          navigate(`/proposals/${newProposal.id}`);
        }
      } else {
        await updateProposal(id!, proposalData);
        toast.success("Proposta atualizada!");
      }
    } catch {
      toast.error("Erro ao salvar proposta");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!id || isNew) return;

    const shareToken = await publishProposal(id);
    if (shareToken) {
      const shareUrl = `${window.location.origin}/p/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Proposta publicada! Link copiado.");
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Faça login para acessar o editor de propostas.</p>
          <Button onClick={() => navigate("/auth")} className="mt-4">
            Fazer Login
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNew ? "Nova Proposta" : "Editar Proposta"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isNew ? "Crie uma nova proposta comercial" : `Editando: ${title}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isNew && existingProposal?.status === "draft" && (
              <Button variant="outline" onClick={handlePublish}>
                <ExternalLink className="h-4 w-4 mr-2" /> Publicar
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving} variant="gradient">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Proposta *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Proposta de Redesign - Cliente XYZ"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nome do Cliente</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nome da empresa ou pessoa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email do Cliente</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Introduction */}
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Introdução</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIText("introduction")}
                  disabled={isGenerating || generatingField !== null}
                >
                  {generatingField === "introduction" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar com IA
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Apresentação pessoal e contextualização do projeto..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Projects Selection */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Projetos Anexados</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhum projeto disponível. Crie projetos primeiro.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedProjects.includes(project.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleProject(project.id)}
                      >
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => toggleProject(project.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {project.description}
                          </p>
                        </div>
                        {project.images[0] && (
                          <div className="w-12 h-12 rounded bg-secondary overflow-hidden flex-shrink-0">
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget */}
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Orçamento</CardTitle>
                <Select value={budgetType} onValueChange={(v) => setBudgetType(v as typeof budgetType)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Valor Fechado</SelectItem>
                    <SelectItem value="hourly">Por Hora</SelectItem>
                    <SelectItem value="package">Pacotes</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {budgetItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <Input
                          placeholder="Descrição do item"
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qtd"
                          value={item.quantity}
                          onChange={(e) => updateBudgetItem(item.id, "quantity", Number(e.target.value))}
                          min={1}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Valor"
                          value={item.unitPrice}
                          onChange={(e) => updateBudgetItem(item.id, "unitPrice", Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        R$ {item.total.toLocaleString("pt-BR")}
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBudgetItem(item.id)}
                          disabled={budgetItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" onClick={addBudgetItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                </Button>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {totalValue.toLocaleString("pt-BR")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Justification */}
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Justificativa</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIText("justification")}
                  disabled={isGenerating || generatingField !== null}
                >
                  {generatingField === "justification" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar com IA
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Justificativa do valor e benefícios..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Closing */}
            <Card variant="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Fechamento</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateAIText("closing")}
                  disabled={isGenerating || generatingField !== null}
                >
                  {generatingField === "closing" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Gerar com IA
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={closing}
                  onChange={(e) => setClosing(e.target.value)}
                  placeholder="Mensagem de fechamento e próximos passos..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Advanced Fields */}
            <AdvancedProposalFields
              exclusions={exclusions}
              setExclusions={setExclusions}
              terms={terms}
              setTerms={setTerms}
              validityDays={validityDays}
              setValidityDays={setValidityDays}
              timeline={timeline}
              setTimeline={setTimeline}
              deliverables={deliverables}
              setDeliverables={setDeliverables}
              clientName={clientName}
              projectTitles={projectTitles}
              totalValue={totalValue}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visual Settings */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Personalização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Cor Principal</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="coverImageUrl">URL da Capa</Label>
                  <Input
                    id="coverImageUrl"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projetos</span>
                  <span className="font-medium">{selectedProjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Itens no orçamento</span>
                  <span className="font-medium">{budgetItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validade</span>
                  <span className="font-medium">{validityDays} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor total</span>
                  <span className="font-semibold text-primary">
                    R$ {totalValue.toLocaleString("pt-BR")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}