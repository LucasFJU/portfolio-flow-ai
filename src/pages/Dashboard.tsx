import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyProjects } from "@/components/dashboard/EmptyProjects";
import { ProfileSummary } from "@/components/dashboard/ProfileSummary";
import { useProjects } from "@/contexts/ProjectsContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading: authLoading, profile } = useAuth();
  const { projects, loading: projectsLoading, deleteProject, addProject } = useProjects();
  const { data } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || projectsLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  const handleEditProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleDuplicateProject = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      const { id: _, createdAt, updatedAt, ...rest } = project;
      await addProject({ ...rest, title: `${rest.title} (cópia)` });
    }
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  const displayName = profile?.name || data.name || "Criativo";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Olá, <span className="text-gradient">{displayName}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus projetos e construa seu portfólio
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" /> Ver portfólio
            </Button>
            <Button variant="gradient" onClick={handleCreateProject} className="gap-2">
              <Plus className="h-4 w-4" /> Novo projeto
            </Button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mb-8">
          <ProfileSummary />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats />
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Seus Projetos</h2>
            {projects.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" /> Sugerir narrativa com IA
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <EmptyProjects onCreateProject={handleCreateProject} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDuplicate={handleDuplicateProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
