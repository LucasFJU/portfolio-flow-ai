import { Project } from "@/contexts/ProjectsContext";
import { VideoEmbed } from "../VideoEmbed";
import { PortfolioSettings } from "@/contexts/PortfolioSettingsContext";
import { ExternalLink, Mail } from "lucide-react";

interface OnePageTemplateProps {
  projects: Project[];
  profile: {
    name: string;
    area: string;
    niche: string;
    bio: string;
  };
  settings: PortfolioSettings;
  previewMode: "light" | "dark";
}

export function OnePageTemplate({ projects, profile, settings, previewMode }: OnePageTemplateProps) {
  const textMuted = previewMode === "dark" ? "text-gray-400" : "text-gray-600";
  const textSecondary = previewMode === "dark" ? "text-gray-300" : "text-gray-700";
  const bgCard = previewMode === "dark" ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-200";
  const borderColor = previewMode === "dark" ? "border-gray-800" : "border-gray-200";

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  // Get all unique technologies
  const allTechnologies = [...new Set(projects.flatMap((p) => p.technologies))];

  return (
    <div className="max-w-4xl mx-auto" style={{ fontFamily: settings.font }}>
      {/* Compact Header */}
      <header className={`flex items-center gap-6 pb-8 mb-8 border-b ${borderColor}`}>
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {profile.name?.charAt(0) || "P"}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.name || "Seu Nome"}</h1>
          <p className={textMuted}>
            {profile.area} {profile.niche && `• ${profile.niche}`}
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Mail className="h-4 w-4" />
          Contato
        </button>
      </header>

      {/* Bio */}
      {profile.bio && (
        <p className={`text-lg mb-8 ${textSecondary}`}>{profile.bio}</p>
      )}

      {/* Skills Highlight */}
      {allTechnologies.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {allTechnologies.slice(0, 10).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full"
                style={{
                  backgroundColor: `${settings.primaryColor}15`,
                  color: settings.primaryColor,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <section>
        <h2 className="text-xl font-bold mb-6">Projetos em Destaque</h2>
        <div className={`grid ${gridCols[settings.columns]} gap-6`}>
          {projects.map((project) => (
            <div key={project.id} className={`rounded-xl border overflow-hidden ${bgCard}`}>
              {project.images[0] && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-1">{project.title}</h3>
                <p className={`text-sm line-clamp-2 ${textMuted}`}>
                  {project.description}
                </p>
                {project.links.length > 0 && (
                  <a
                    href={project.links[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm mt-3 hover:underline"
                    style={{ color: settings.primaryColor }}
                  >
                    Ver projeto <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      {projects.some((p) => p.videoUrl) && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Vídeos</h2>
          <div className="space-y-6">
            {projects
              .filter((p) => p.videoUrl)
              .map((project) => (
                <div key={project.id}>
                  <VideoEmbed url={project.videoUrl!} />
                  <p className="mt-2 font-medium">{project.title}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`mt-12 pt-8 border-t text-center ${borderColor}`}>
        <p className={textMuted}>
          © {new Date().getFullYear()} {profile.name}. Portfólio criado com Portfol.io
        </p>
      </footer>
    </div>
  );
}
