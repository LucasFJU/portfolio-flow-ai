import React, { createContext, useContext, useState, ReactNode } from "react";

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
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("portfol-projects");
    return stored ? JSON.parse(stored) : [];
  });

  const saveProjects = (newProjects: Project[]) => {
    localStorage.setItem("portfol-projects", JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const addProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    saveProjects(
      projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      )
    );
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{ projects, addProject, updateProject, deleteProject, getProject }}
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
