import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Check, X, Calendar, DollarSign } from "lucide-react";
import { BudgetItem } from "@/contexts/ProposalsContext";

interface PublicProposalData {
  id: string;
  title: string;
  client_name: string | null;
  introduction: string | null;
  justification: string | null;
  closing: string | null;
  project_ids: string[];
  budget_items: BudgetItem[];
  budget_type: string;
  total_value: number;
  logo_url: string | null;
  primary_color: string;
  cover_image_url: string | null;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  images: string[];
}

export default function PublicProposal() {
  const { token } = useParams();
  const [proposal, setProposal] = useState<PublicProposalData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!token) {
        setError("Token inválido");
        setLoading(false);
        return;
      }

      try {
        // Fetch proposal by share_token
        const { data: proposalData, error: proposalError } = await supabase
          .from("proposals")
          .select("*")
          .eq("share_token", token)
          .single();

        if (proposalError || !proposalData) {
          setError("Proposta não encontrada");
          setLoading(false);
          return;
        }

        const formattedProposal: PublicProposalData = {
          ...proposalData,
          budget_items: (proposalData.budget_items as unknown as BudgetItem[]) || [],
        };

        setProposal(formattedProposal);

        // Mark as viewed if not already
        if (proposalData.status === "sent") {
          await supabase
            .from("proposals")
            .update({ status: "viewed", viewed_at: new Date().toISOString() })
            .eq("id", proposalData.id);
        }

        // Fetch related projects
        if (proposalData.project_ids && proposalData.project_ids.length > 0) {
          const { data: projectsData } = await supabase
            .from("projects")
            .select("id, title, description, images")
            .in("id", proposalData.project_ids);

          if (projectsData) {
            setProjects(projectsData);
          }
        }
      } catch (err) {
        console.error("Error fetching proposal:", err);
        setError("Erro ao carregar proposta");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold mb-2">Proposta não encontrada</h1>
            <p className="text-muted-foreground">
              O link pode estar expirado ou a proposta foi removida.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryColor = proposal.primary_color || "#8B5CF6";

  return (
    <div className="min-h-screen bg-background">
      {/* Cover */}
      {proposal.cover_image_url && (
        <div className="h-64 relative">
          <img
            src={proposal.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          {proposal.logo_url && (
            <img
              src={proposal.logo_url}
              alt="Logo"
              className="h-16 mx-auto mb-6"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{proposal.title}</h1>
          {proposal.client_name && (
            <p className="text-lg text-muted-foreground">
              Preparado para: <span className="font-medium text-foreground">{proposal.client_name}</span>
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(proposal.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Introduction */}
        {proposal.introduction && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Introdução</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{proposal.introduction}</p>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Projetos de Referência</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.images[0] && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" style={{ color: primaryColor }} />
              Investimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Descrição</th>
                    <th className="pb-3 font-medium text-center">Qtd</th>
                    <th className="pb-3 font-medium text-right">Valor Unit.</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.budget_items.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-border/50">
                      <td className="py-3">{item.description || "-"}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">
                        R$ {item.unitPrice.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 text-right font-medium">
                        R$ {item.total.toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-4 text-right font-semibold">
                      Total:
                    </td>
                    <td
                      className="pt-4 text-right text-2xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      R$ {proposal.total_value.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Justification */}
        {proposal.justification && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Por que este valor?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{proposal.justification}</p>
            </CardContent>
          </Card>
        )}

        {/* Closing */}
        {proposal.closing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed">{proposal.closing}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center py-8">
          <Button
            size="lg"
            className="gap-2"
            style={{ backgroundColor: primaryColor }}
            onClick={() => {
              // Could trigger an accept action
              alert("Funcionalidade de aceitar proposta em desenvolvimento.");
            }}
          >
            <Check className="h-5 w-5" /> Aceitar Proposta
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (proposal.client_name) {
                window.location.href = `mailto:?subject=Dúvida sobre proposta: ${proposal.title}`;
              }
            }}
          >
            Tenho dúvidas
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>Proposta gerada com Portfol.io</p>
        </div>
      </div>
    </div>
  );
}
