import { FolderPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyProjectsProps {
  onCreateProject: () => void;
}

export function EmptyProjects({ onCreateProject }: EmptyProjectsProps) {
  return (
    <Card variant="glass" className="p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
        <FolderPlus className="h-8 w-8 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Comece criando seu primeiro projeto. Adicione imagens, descreva seu processo
        e deixe a IA ajudar com a narrativa.
      </p>
      <Button variant="gradient" size="lg" onClick={onCreateProject} className="gap-2">
        <Sparkles className="h-4 w-4" /> Criar primeiro projeto
      </Button>
    </Card>
  );
}
