import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Copy, Trash2, Image } from "lucide-react";
import { Project } from "@/contexts/ProjectsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDuplicate, onDelete }: ProjectCardProps) {
  const completionPercentage = calculateCompletion(project);

  return (
    <Card
      variant="glass"
      className="group cursor-pointer overflow-hidden hover:shadow-glow transition-all duration-300"
      onClick={() => onEdit(project.id)}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-secondary relative overflow-hidden">
        {project.images.length > 0 ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Image className="h-12 w-12 opacity-50" />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              project.status === "complete"
                ? "bg-green-500/20 text-green-500"
                : "bg-accent/20 text-accent"
            }`}
          >
            {project.status === "complete" ? "Completo" : "Rascunho"}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="glass" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project.id); }}>
                <Edit className="h-4 w-4 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(project.id); }}>
                <Copy className="h-4 w-4 mr-2" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{project.title || "Sem título"}</h3>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {project.description || "Sem descrição"}
        </p>

        {/* Completion bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-secondary rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-secondary rounded-full text-muted-foreground">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function calculateCompletion(project: Project): number {
  const checks = [
    project.title.length > 0,
    project.description.length > 0,
    project.images.length > 0,
    project.stages.briefing.description.length > 0,
    project.stages.challenge.description.length > 0,
    project.stages.execution.description.length > 0,
    project.stages.result.description.length > 0,
    project.technologies.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
