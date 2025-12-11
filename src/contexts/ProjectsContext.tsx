import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface ProjectStage {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;
  stages: {
    briefing: ProjectStage;
    challenge: ProjectStage;
    execution: ProjectStage;
    result: ProjectStage;
  };
  technologies: string[];
  links: { label: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "complete";
}

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      const formattedProjects: Project[] = (data || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        images: p.images || [],
        videoUrl: p.video_url || undefined,
        stages: {
          briefing: { title: "Briefing", description: p.briefing_description || "" },
          challenge: { title: "Desafio", description: p.challenge_description || "" },
          execution: { title: "Execução", description: p.execution_description || "" },
          result: { title: "Resultado", description: p.result_description || "" },
        },
        technologies: p.technologies || [],
        links: (p.links as { label: string; url: string }[]) || [],
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
        status: p.status as "draft" | "complete",
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const addProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: project.title,
          description: project.description,
          images: project.images,
          video_url: project.videoUrl || null,
          briefing_description: project.stages.briefing.description,
          challenge_description: project.stages.challenge.description,
          execution_description: project.stages.execution.description,
          result_description: project.stages.result.description,
          technologies: project.technologies,
          links: JSON.parse(JSON.stringify(project.links)),
          status: project.status,
        })
        .select()
        .single();

      if (error) throw error;

      const newProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        images: data.images || [],
        videoUrl: data.video_url || undefined,
        stages: {
          briefing: { title: "Briefing", description: data.briefing_description || "" },
          challenge: { title: "Desafio", description: data.challenge_description || "" },
          execution: { title: "Execução", description: data.execution_description || "" },
          result: { title: "Resultado", description: data.result_description || "" },
        },
        technologies: data.technologies || [],
        links: (data.links as { label: string; url: string }[]) || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        status: data.status as "draft" | "complete",
      };

      setProjects((prev) => [newProject, ...prev]);
      toast.success("Projeto criado!");
      return newProject;
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Erro ao criar projeto");
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.videoUrl !== undefined) updateData.video_url = updates.videoUrl;
      if (updates.stages?.briefing !== undefined) updateData.briefing_description = updates.stages.briefing.description;
      if (updates.stages?.challenge !== undefined) updateData.challenge_description = updates.stages.challenge.description;
      if (updates.stages?.execution !== undefined) updateData.execution_description = updates.stages.execution.description;
      if (updates.stages?.result !== undefined) updateData.result_description = updates.stages.result.description;
      if (updates.technologies !== undefined) updateData.technologies = updates.technologies;
      if (updates.links !== undefined) updateData.links = JSON.parse(JSON.stringify(updates.links));
      if (updates.status !== undefined) updateData.status = updates.status;

      const { error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
      );
      toast.success("Projeto atualizado!");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Erro ao atualizar projeto");
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Projeto excluído!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Erro ao excluir projeto");
    }
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const refreshProjects = async () => {
    await fetchProjects();
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, loading, addProject, updateProject, deleteProject, getProject, refreshProjects }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
