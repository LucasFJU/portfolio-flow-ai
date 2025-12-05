import { Card, CardContent } from "@/components/ui/card";
import { Eye, MousePointerClick, Clock, FolderOpen } from "lucide-react";
import { useProjects } from "@/contexts/ProjectsContext";

const stats = [
  {
    label: "Projetos",
    icon: FolderOpen,
    getValue: (count: number) => count.toString(),
    color: "text-primary",
  },
  {
    label: "Visualizações",
    icon: Eye,
    getValue: () => "—",
    color: "text-accent",
    pro: true,
  },
  {
    label: "Cliques",
    icon: MousePointerClick,
    getValue: () => "—",
    color: "text-green-500",
    pro: true,
  },
  {
    label: "Tempo médio",
    icon: Clock,
    getValue: () => "—",
    color: "text-blue-500",
    pro: true,
  },
];

export function DashboardStats() {
  const { projects } = useProjects();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} variant="glass" className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {stat.getValue(projects.length)}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            {stat.pro && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-semibold rounded gradient-accent text-accent-foreground">
                PRO
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
