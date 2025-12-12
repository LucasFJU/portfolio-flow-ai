import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  Copy,
  ExternalLink,
  ArrowLeft,
  FileText,
  Loader2,
  Edit,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BriefingQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "file" | "date";
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface BriefingModel {
  id: string;
  title: string;
  description: string | null;
  questions: BriefingQuestion[];
  is_public: boolean;
  share_token: string | null;
  created_at: string;
}

function SortableQuestion({
  question,
  onUpdate,
  onRemove,
}: {
  question: BriefingQuestion;
  onUpdate: (updates: Partial<BriefingQuestion>) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-4 rounded-lg border bg-card"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1 space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            placeholder="Pergunta"
            value={question.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
          />
          <Select
            value={question.type}
            onValueChange={(v) => onUpdate({ type: v as BriefingQuestion["type"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto curto</SelectItem>
              <SelectItem value="textarea">Texto longo</SelectItem>
              <SelectItem value="select">Múltipla escolha</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="file">Upload de arquivo</SelectItem>
              <SelectItem value="date">Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {question.type === "select" && (
          <Input
            placeholder="Opções separadas por vírgula"
            value={question.options?.join(", ") || ""}
            onChange={(e) =>
              onUpdate({
                options: e.target.value.split(",").map((o) => o.trim()),
              })
            }
          />
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`required-${question.id}`}
              checked={question.required}
              onCheckedChange={(checked) => onUpdate({ required: !!checked })}
            />
            <Label htmlFor={`required-${question.id}`} className="text-sm">
              Obrigatório
            </Label>
          </div>
          <Input
            placeholder="Placeholder (opcional)"
            value={question.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <Button variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

export default function BriefingModels() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [models, setModels] = useState<BriefingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BriefingModel | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<BriefingQuestion[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchModels();
    }
  }, [user, authLoading, navigate]);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from("briefing_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Parse questions JSON for each model
      const parsedModels = (data || []).map(model => ({
        ...model,
        questions: Array.isArray(model.questions) 
          ? (model.questions as unknown as BriefingQuestion[])
          : []
      }));
      
      setModels(parsedModels as BriefingModel[]);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Erro ao carregar modelos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setQuestions([]);
    setIsPublic(false);
    setEditing(null);
  };

  const startEditing = (model: BriefingModel) => {
    setEditing(model);
    setTitle(model.title);
    setDescription(model.description || "");
    setQuestions(model.questions);
    setIsPublic(model.is_public);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        label: "",
        type: "text",
        required: false,
      },
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<BriefingQuestion>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (questions.length < 3) {
      toast.error("Adicione pelo menos 3 perguntas");
      return;
    }

    const emptyQuestions = questions.filter((q) => !q.label.trim());
    if (emptyQuestions.length > 0) {
      toast.error("Todas as perguntas precisam ter um texto");
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from("briefing_models")
          .update({
            title: title.trim(),
            description: description.trim() || null,
            questions: questions as unknown as any,
            is_public: isPublic,
          })
          .eq("id", editing.id);

        if (error) throw error;
        toast.success("Modelo atualizado!");
      } else {
        const { error } = await supabase.from("briefing_models").insert({
          user_id: user!.id,
          title: title.trim(),
          description: description.trim() || null,
          questions: questions as unknown as any,
          is_public: isPublic,
          share_token: crypto.randomUUID(),
        });

        if (error) throw error;
        toast.success("Modelo criado!");
      }

      resetForm();
      fetchModels();
    } catch (error) {
      console.error("Error saving model:", error);
      toast.error("Erro ao salvar modelo");
    } finally {
      setSaving(false);
    }
  };

  const duplicateModel = async (model: BriefingModel) => {
    try {
      const { error } = await supabase.from("briefing_models").insert({
        user_id: user!.id,
        title: `${model.title} (cópia)`,
        description: model.description,
        questions: model.questions as unknown as any,
        is_public: false,
        share_token: crypto.randomUUID(),
      });

      if (error) throw error;
      toast.success("Modelo duplicado!");
      fetchModels();
    } catch (error) {
      console.error("Error duplicating model:", error);
      toast.error("Erro ao duplicar modelo");
    }
  };

  const deleteModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from("briefing_models")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Modelo excluído!");
      fetchModels();
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("Erro ao excluir modelo");
    }
  };

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/briefing/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Modelos de Briefing</h1>
              <p className="text-sm text-muted-foreground">
                Crie formulários personalizados para coletar informações dos clientes
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editing ? "Editar Modelo" : "Novo Modelo"}</span>
                  {editing && (
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="h-4 w-4 mr-1" /> Cancelar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Modelo *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Briefing para Projeto de Design"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instruções ou contexto para o cliente..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isPublic"
                    checked={isPublic}
                    onCheckedChange={(checked) => setIsPublic(!!checked)}
                  />
                  <Label htmlFor="isPublic" className="text-sm">
                    Tornar público (qualquer um com o link pode responder)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Perguntas ({questions.length})</span>
                  <Button variant="outline" size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Adicione pelo menos 3 perguntas ao seu modelo de briefing
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={questions.map((q) => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {questions.map((question) => (
                          <SortableQuestion
                            key={question.id}
                            question={question}
                            onUpdate={(updates) => updateQuestion(question.id, updates)}
                            onRemove={() => removeQuestion(question.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="gradient"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editing ? "Atualizar Modelo" : "Criar Modelo"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Models */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Meus Modelos</h3>
            
            {models.length === 0 ? (
              <Card variant="glass">
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum modelo criado ainda
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {models.map((model) => (
                  <Card key={model.id} variant="glass">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{model.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {model.questions.length} perguntas
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEditing(model)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => duplicateModel(model)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {model.share_token && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyShareLink(model.share_token!)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteModel(model.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}