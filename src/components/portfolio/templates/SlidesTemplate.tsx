import { Project } from "@/contexts/ProjectsContext";
import { VideoEmbed } from "../VideoEmbed";
import { PortfolioSettings } from "@/contexts/PortfolioSettingsContext";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlidesTemplateProps {
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

type Slide = {
  type: "intro" | "project" | "image";
  project?: Project;
  image?: string;
};

export function SlidesTemplate({ projects, profile, settings, previewMode }: SlidesTemplateProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const textMuted = previewMode === "dark" ? "text-gray-400" : "text-gray-600";
  const textSecondary = previewMode === "dark" ? "text-gray-300" : "text-gray-700";
  const bgNav = previewMode === "dark" ? "bg-gray-800/80" : "bg-gray-200/80";

  // Build slides array
  const slides: Slide[] = [
    { type: "intro" },
    ...projects.flatMap((project) => [
      { type: "project" as const, project },
      ...project.images.slice(1).map((img) => ({ type: "image" as const, image: img, project })),
    ]),
  ];

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-full min-h-[500px] flex flex-col" style={{ fontFamily: settings.font }}>
      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {currentSlideData.type === "intro" && (
          <div className="text-center max-w-2xl animate-fade-in">
            <div
              className="w-28 h-28 mx-auto mb-8 rounded-3xl flex items-center justify-center text-5xl font-bold text-white"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {profile.name?.charAt(0) || "P"}
            </div>
            <h1 className="text-5xl font-bold mb-4">{profile.name || "Seu Nome"}</h1>
            <p className={`text-xl ${textMuted}`}>
              {profile.area} {profile.niche && `• ${profile.niche}`}
            </p>
            {profile.bio && (
              <p className={`mt-6 text-lg ${textSecondary}`}>{profile.bio}</p>
            )}
          </div>
        )}

        {currentSlideData.type === "project" && currentSlideData.project && (
          <div className="w-full max-w-4xl animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {currentSlideData.project.images[0] && (
                <img
                  src={currentSlideData.project.images[0]}
                  alt={currentSlideData.project.title}
                  className="w-full aspect-video object-cover rounded-2xl"
                />
              )}
              <div>
                <h2 className="text-3xl font-bold mb-4">{currentSlideData.project.title}</h2>
                <p className={textSecondary}>{currentSlideData.project.description}</p>
                {currentSlideData.project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {currentSlideData.project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm rounded-full"
                        style={{ 
                          backgroundColor: `${settings.primaryColor}20`,
                          color: settings.primaryColor 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {currentSlideData.project.videoUrl && (
              <div className="mt-8">
                <VideoEmbed url={currentSlideData.project.videoUrl} />
              </div>
            )}
          </div>
        )}

        {currentSlideData.type === "image" && currentSlideData.image && (
          <div className="animate-fade-in">
            <img
              src={currentSlideData.image}
              alt=""
              className="max-w-full max-h-[60vh] object-contain rounded-2xl"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
          className={`p-3 rounded-full ${bgNav} disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110`}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-6"
                  : "opacity-40 hover:opacity-70"
              }`}
              style={{ backgroundColor: settings.primaryColor }}
            />
          ))}
        </div>

        <button
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide === slides.length - 1}
          className={`p-3 rounded-full ${bgNav} disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110`}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className={`absolute bottom-4 left-4 text-sm ${textMuted}`}>
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
}
