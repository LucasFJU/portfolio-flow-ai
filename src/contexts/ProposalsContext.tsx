import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Proposal {
  id: string;
  user_id: string;
  title: string;
  client_name: string | null;
  client_email: string | null;
  introduction: string | null;
  justification: string | null;
  closing: string | null;
  project_ids: string[];
  budget_items: BudgetItem[];
  budget_type: "hourly" | "fixed" | "package";
  total_value: number;
  logo_url: string | null;
  primary_color: string;
  cover_image_url: string | null;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected";
  share_token: string | null;
  viewed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ProposalsContextType {
  proposals: Proposal[];
  loading: boolean;
  canCreateProposal: boolean;
  remainingProposals: number;
  addProposal: (proposal: Omit<Proposal, "id" | "user_id" | "created_at" | "updated_at" | "share_token">) => Promise<Proposal | null>;
  updateProposal: (id: string, updates: Partial<Proposal>) => Promise<void>;
  deleteProposal: (id: string) => Promise<void>;
  duplicateProposal: (id: string) => Promise<Proposal | null>;
  getProposal: (id: string) => Proposal | undefined;
  publishProposal: (id: string) => Promise<string | null>;
  refreshProposals: () => Promise<void>;
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(undefined);

const FREE_PROPOSAL_LIMIT = 5;

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const { user, isPro, profile } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    if (!user) {
      setProposals([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching proposals:", error);
        return;
      }

      const formattedProposals: Proposal[] = (data || []).map((p) => ({
        ...p,
        budget_items: (p.budget_items as unknown as BudgetItem[]) || [],
        budget_type: p.budget_type as "hourly" | "fixed" | "package",
        status: p.status as Proposal["status"],
      }));

      setProposals(formattedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const canCreateProposal = isPro || (profile?.proposal_count || 0) < FREE_PROPOSAL_LIMIT;
  const remainingProposals = isPro ? Infinity : Math.max(0, FREE_PROPOSAL_LIMIT - (profile?.proposal_count || 0));

  const addProposal = async (proposal: Omit<Proposal, "id" | "user_id" | "created_at" | "updated_at" | "share_token">) => {
    if (!user) return null;

    if (!canCreateProposal) {
      toast.error("Limite de propostas atingido. Atualize para o plano Pro!");
      return null;
    }

    try {
      const insertData = {
        title: proposal.title,
        client_name: proposal.client_name,
        client_email: proposal.client_email,
        introduction: proposal.introduction,
        justification: proposal.justification,
        closing: proposal.closing,
        project_ids: proposal.project_ids,
        budget_items: proposal.budget_items as unknown as Record<string, unknown>[],
        budget_type: proposal.budget_type,
        total_value: proposal.total_value,
        logo_url: proposal.logo_url,
        primary_color: proposal.primary_color,
        cover_image_url: proposal.cover_image_url,
        status: proposal.status,
        viewed_at: proposal.viewed_at,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("proposals")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Update proposal count
      await supabase
        .from("profiles")
        .update({ proposal_count: (profile?.proposal_count || 0) + 1 })
        .eq("user_id", user.id);

      const newProposal: Proposal = {
        ...data,
        budget_items: (data.budget_items as unknown as BudgetItem[]) || [],
        budget_type: data.budget_type as "hourly" | "fixed" | "package",
        status: data.status as Proposal["status"],
      };

      setProposals((prev) => [newProposal, ...prev]);
      return newProposal;
    } catch (error) {
      console.error("Error adding proposal:", error);
      toast.error("Erro ao criar proposta");
      return null;
    }
  };

  const updateProposal = async (id: string, updates: Partial<Proposal>) => {
    if (!user) return;

    try {
      const updateData = { ...updates } as Record<string, unknown>;
      if (updates.budget_items) {
        updateData.budget_items = updates.budget_items as unknown as Record<string, unknown>[];
      }
      
      const { error } = await supabase
        .from("proposals")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Erro ao atualizar proposta");
    }
  };

  const deleteProposal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setProposals((prev) => prev.filter((p) => p.id !== id));
      toast.success("Proposta excluída");
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error("Erro ao excluir proposta");
    }
  };

  const duplicateProposal = async (id: string) => {
    const original = proposals.find((p) => p.id === id);
    if (!original || !user) return null;

    const duplicate = {
      title: `${original.title} (cópia)`,
      client_name: original.client_name,
      client_email: original.client_email,
      introduction: original.introduction,
      justification: original.justification,
      closing: original.closing,
      project_ids: original.project_ids,
      budget_items: original.budget_items,
      budget_type: original.budget_type,
      total_value: original.total_value,
      logo_url: original.logo_url,
      primary_color: original.primary_color,
      cover_image_url: original.cover_image_url,
      status: "draft" as const,
      viewed_at: null,
    };

    return addProposal(duplicate);
  };

  const getProposal = (id: string) => proposals.find((p) => p.id === id);

  const publishProposal = async (id: string) => {
    if (!user) return null;

    const shareToken = crypto.randomUUID();

    try {
      const { error } = await supabase
        .from("proposals")
        .update({ 
          share_token: shareToken,
          status: "sent" 
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, share_token: shareToken, status: "sent" } : p))
      );

      return shareToken;
    } catch (error) {
      console.error("Error publishing proposal:", error);
      toast.error("Erro ao publicar proposta");
      return null;
    }
  };

  const refreshProposals = async () => {
    await fetchProposals();
  };

  return (
    <ProposalsContext.Provider
      value={{
        proposals,
        loading,
        canCreateProposal,
        remainingProposals,
        addProposal,
        updateProposal,
        deleteProposal,
        duplicateProposal,
        getProposal,
        publishProposal,
        refreshProposals,
      }}
    >
      {children}
    </ProposalsContext.Provider>
  );
}

export function useProposals() {
  const context = useContext(ProposalsContext);
  if (context === undefined) {
    throw new Error("useProposals must be used within a ProposalsProvider");
  }
  return context;
}
