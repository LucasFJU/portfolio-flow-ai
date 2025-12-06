import { Project } from "@/contexts/ProjectsContext";
import { VideoEmbed } from "../VideoEmbed";
import { PortfolioSettings } from "@/contexts/PortfolioSettingsContext";
import { useState } from "react";
import { X } from "lucide-react";

interface GalleryTemplateProps {
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

export function GalleryTemplate({ projects, profile, settings, previewMode }: GalleryTemplateProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textMuted = previewMode === "dark" ? "text-gray-400" : "text-gray-600";
  const bgOverlay = previewMode === "dark" ? "bg-black/90" : "bg-white/95";

  const allImages = projects.flatMap((project) =>
    project.images.map((img) => ({ img, project }))
  );

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div style={{ fontFamily: settings.font }}>
      {/* Minimal Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">{profile.name || "Seu Nome"}</h1>
        <p className={textMuted}>
          {profile.area} {profile.niche && `• ${profile.niche}`}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className={`grid ${gridCols[settings.columns]} gap-4`}>
        {allImages.map(({ img, project }, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold">{project.title}</h3>
                {project.technologies.length > 0 && (
                  <p className="text-white/70 text-sm mt-1">
                    {project.technologies.slice(0, 3).join(" • ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Section */}
      {projects.some(p => p.videoUrl) && (
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold">Vídeos</h2>
          <div className={`grid ${gridCols[Math.min(settings.columns, 2) as 1 | 2]} gap-6`}>
            {projects
              .filter((p) => p.videoUrl)
              .map((project) => (
                <div key={project.id}>
                  <VideoEmbed url={project.videoUrl!} showThumbnail />
                  <p className="mt-2 font-medium">{project.title}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${bgOverlay}`}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
