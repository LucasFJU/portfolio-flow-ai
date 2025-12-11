import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Grid3X3, List, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyProjects } from "@/components/dashboard/EmptyProjects";
import { useProjects } from "@/contexts/ProjectsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Projects() {
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading, deleteProject, addProject } = useProjects();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projetos</h1>
            <p className="text-muted-foreground mt-1">
              {projects.length} {projects.length === 1 ? "projeto" : "projetos"} cadastrados
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="gradient" onClick={handleCreateProject} className="gap-2">
              <Plus className="h-4 w-4" /> Novo projeto
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <EmptyProjects onCreateProject={handleCreateProject} />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
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
    </Layout>
  );
}
