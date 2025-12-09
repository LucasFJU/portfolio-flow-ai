import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProposals } from "@/contexts/ProposalsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Plus,
  FileText,
  Download,
  ExternalLink,
  Clock,
  Check,
  Crown,
  Sparkles,
  Copy,
  Trash2,
  Eye,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Proposals() {
  const navigate = useNavigate();
  const { user, isPro } = useAuth();
  const { proposals, loading, canCreateProposal, remainingProposals, deleteProposal, duplicateProposal, publishProposal } = useProposals();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);

  const handleNewProposal = () => {
    if (!canCreateProposal) {
      toast.error("Limite de propostas atingido. Atualize para o plano Pro!");
      return;
    }
    navigate("/proposals/new");
  };

  const handleDuplicate = async (id: string) => {
    const duplicated = await duplicateProposal(id);
    if (duplicated) {
      toast.success("Proposta duplicada!");
      navigate(`/proposals/${duplicated.id}`);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProposal(deleteId);
      setDeleteId(null);
    }
  };

  const handlePublish = async (id: string) => {
    setPublishing(id);
    const shareToken = await publishProposal(id);
    if (shareToken) {
      const shareUrl = `${window.location.origin}/p/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado para a área de transferência!");
    }
    setPublishing(null);
  };

  const copyShareLink = (shareToken: string) => {
    const shareUrl = `${window.location.origin}/p/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copiado!");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      draft: { label: "Rascunho", className: "bg-muted text-muted-foreground" },
      sent: { label: "Enviada", className: "bg-blue-500/10 text-blue-500" },
      viewed: { label: "Visualizada", className: "bg-amber-500/10 text-amber-500" },
      accepted: { label: "Aceita", className: "bg-green-500/10 text-green-500" },
      rejected: { label: "Recusada", className: "bg-destructive/10 text-destructive" },
    };
    const { label, className } = statusMap[status] || statusMap.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Faça login para acessar suas propostas.</p>
          <Button onClick={() => navigate("/auth")}>Fazer Login</Button>
        </div>
      </Layout>
    );
  }

  if (!isPro) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Pro Feature Banner */}
            <Card variant="gradient" className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                  <Crown className="h-8 w-8 text-accent-foreground" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Gerador de Propostas</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Crie propostas profissionais e orçamentos a partir dos seus projetos.
                  Disponível exclusivamente no plano Pro.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
                  {[
                    "Selecione projetos para anexar",
                    "IA gera textos profissionais",
                    "Modelos de orçamento editáveis",
                    "Exportação em PDF ou link",
                    "Histórico de propostas",
                    "Personalização completa",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="gradient-accent" size="xl" className="gap-2">
                  <Sparkles className="h-5 w-5" /> Fazer upgrade para Pro
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  A partir de R$ 29/mês • Cancele quando quiser
                </p>
              </div>
            </Card>

            {/* Preview of what Pro offers */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Preview do recurso</h2>
              <Card variant="glass" className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Proposta - Cliente XYZ</p>
                        <p className="text-sm text-muted-foreground">Criada há 2 dias</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" disabled>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Rascunho
                    </span>
                    <span>3 projetos anexados</span>
                    <span>R$ 15.000,00</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Propostas</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie suas propostas comerciais
              {!isPro && remainingProposals < Infinity && (
                <span className="ml-2 text-sm">
                  ({remainingProposals} restantes)
                </span>
              )}
            </p>
          </div>
          <Button variant="gradient" className="gap-2" onClick={handleNewProposal}>
            <Plus className="h-4 w-4" /> Nova proposta
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : proposals.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma proposta ainda</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Crie sua primeira proposta selecionando projetos do seu portfólio
            </p>
            <Button variant="gradient" className="gap-2" onClick={handleNewProposal}>
              <Sparkles className="h-4 w-4" /> Criar primeira proposta
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} variant="glass" className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-4 cursor-pointer flex-1"
                      onClick={() => navigate(`/proposals/${proposal.id}`)}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${proposal.primary_color}20` }}
                      >
                        <FileText className="h-6 w-6" style={{ color: proposal.primary_color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {proposal.client_name || "Sem cliente definido"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold text-primary">
                          R$ {proposal.total_value.toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {proposal.project_ids.length} projeto(s)
                        </p>
                      </div>

                      {getStatusBadge(proposal.status)}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/proposals/${proposal.id}`)}>
                            <FileText className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          {proposal.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => handlePublish(proposal.id)}
                              disabled={publishing === proposal.id}
                            >
                              {publishing === proposal.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <ExternalLink className="h-4 w-4 mr-2" />
                              )}
                              Publicar
                            </DropdownMenuItem>
                          )}
                          {proposal.share_token && (
                            <>
                              <DropdownMenuItem
                                onClick={() => window.open(`/p/${proposal.share_token}`, "_blank")}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Ver página
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyShareLink(proposal.share_token!)}>
                                <Copy className="h-4 w-4 mr-2" /> Copiar link
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleDuplicate(proposal.id)}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(proposal.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir proposta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A proposta será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
