import { Project } from "@/contexts/ProjectsContext";
import { VideoEmbed } from "../VideoEmbed";
import { PortfolioSettings } from "@/contexts/PortfolioSettingsContext";
import { ExternalLink } from "lucide-react";

interface CaseStudyTemplateProps {
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

export function CaseStudyTemplate({ projects, profile, settings, previewMode }: CaseStudyTemplateProps) {
  const textMuted = previewMode === "dark" ? "text-gray-400" : "text-gray-600";
  const textSecondary = previewMode === "dark" ? "text-gray-300" : "text-gray-700";
  const bgCard = previewMode === "dark" ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-200";
  const bgTag = previewMode === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700";

  return (
    <div className="max-w-4xl mx-auto" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <div className="text-center mb-16">
        <div 
          className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl font-bold text-white"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {profile.name?.charAt(0) || "P"}
        </div>
        <h1 className="text-4xl font-bold mb-3">{profile.name || "Seu Nome"}</h1>
        <p className={textMuted}>
          {profile.area} {profile.niche && `• ${profile.niche}`}
        </p>
      </div>

      {/* About */}
      {profile.bio && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Sobre</h2>
          <p className={`text-lg leading-relaxed ${textSecondary}`}>{profile.bio}</p>
        </section>
      )}

      {/* Projects as Case Studies */}
      <section>
        <h2 className="text-2xl font-bold mb-8">Projetos</h2>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <article key={project.id} className={`rounded-2xl border overflow-hidden ${bgCard}`}>
              {/* Hero Image */}
              {project.images[0] && (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                />
              )}

              <div className="p-8 space-y-8">
                {/* Title & Description */}
                <div>
                  <span className={`text-sm ${textMuted}`}>Projeto {String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-2xl font-bold mt-1 mb-3">{project.title}</h3>
                  <p className={textSecondary}>{project.description}</p>
                </div>

                {/* Stages */}
                <div className="grid md:grid-cols-2 gap-6">
                  {project.stages.briefing.description && (
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: settings.primaryColor }}>Briefing</h4>
                      <p className={`text-sm ${textSecondary}`}>{project.stages.briefing.description}</p>
                    </div>
                  )}
                  {project.stages.challenge.description && (
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: settings.primaryColor }}>Desafio</h4>
                      <p className={`text-sm ${textSecondary}`}>{project.stages.challenge.description}</p>
                    </div>
                  )}
                  {project.stages.execution.description && (
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: settings.primaryColor }}>Execução</h4>
                      <p className={`text-sm ${textSecondary}`}>{project.stages.execution.description}</p>
                    </div>
                  )}
                  {project.stages.result.description && (
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: settings.primaryColor }}>Resultado</h4>
                      <p className={`text-sm ${textSecondary}`}>{project.stages.result.description}</p>
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                {project.images.length > 1 && (
                  <div className={`grid grid-cols-${Math.min(settings.columns, project.images.length - 1)} gap-4`}>
                    {project.images.slice(1).map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="" 
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Video */}
                {project.videoUrl && (
                  <VideoEmbed url={project.videoUrl} className="mt-6" />
                )}

                {/* Technologies */}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className={`px-3 py-1 text-sm rounded-full ${bgTag}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {project.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm hover:underline"
                        style={{ color: settings.primaryColor }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
