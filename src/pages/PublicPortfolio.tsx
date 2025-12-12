import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Calendar,
  Mail,
  Send,
  ExternalLink,
  Loader2,
  Moon,
  Sun,
  User,
  Briefcase,
  MapPin,
} from "lucide-react";

interface PublicProfile {
  id: string;
  user_id: string;
  name: string | null;
  bio: string | null;
  area: string | null;
  niche: string | null;
  username: string | null;
  calendly_url: string | null;
  show_contact_form: boolean | null;
}

interface PublicProject {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  technologies: string[];
  status: string;
}

export default function PublicPortfolio() {
  const { username } = useParams();
  const { theme, toggleTheme } = useTheme();
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (username) {
      fetchPortfolio();
      trackView();
    }
  }, [username]);

  const fetchPortfolio = async () => {
    try {
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData as PublicProfile);

      // Fetch user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, description, images, technologies, status")
        .eq("user_id", profileData.user_id)
        .eq("status", "complete")
        .order("display_order", { ascending: true });

      if (projectsError) throw projectsError;
      
      setProjects(projectsData || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      // Get profile to get user_id
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .maybeSingle();

      if (profileData) {
        await supabase.from("analytics_events").insert({
          user_id: profileData.user_id,
          event_type: "portfolio_view",
          resource_type: "portfolio",
          source: "public",
          metadata: { username },
        });
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadForm.name.trim() || !leadForm.email.trim()) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    if (!profile) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from("leads").insert({
        user_id: profile.user_id,
        name: leadForm.name.trim(),
        email: leadForm.email.trim(),
        message: leadForm.message.trim() || null,
        source: "portfolio",
      });

      if (error) throw error;

      toast.success("Mensagem enviada com sucesso!");
      setLeadForm({ name: "", email: "", message: "" });

      // Track lead submission
      await supabase.from("analytics_events").insert({
        user_id: profile.user_id,
        event_type: "lead_submitted",
        resource_type: "portfolio",
        source: "public",
        metadata: { username },
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <User className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Portfólio não encontrado</h1>
        <p className="text-muted-foreground">
          O usuário @{username} não existe ou não tem um portfólio público.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-card border border-border hover:bg-secondary transition-colors"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Hero Section */}
      <section className="relative py-20 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {profile?.name || username}
          </h1>
          
          {(profile?.area || profile?.niche) && (
            <div className="flex items-center justify-center gap-4 mb-6 text-muted-foreground">
              {profile?.area && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {profile.area}
                </span>
              )}
              {profile?.niche && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.niche}
                </span>
              )}
            </div>
          )}
          
          {profile?.bio && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {profile.bio}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {profile?.calendly_url && (
              <Button
                variant="gradient"
                size="lg"
                onClick={() => window.open(profile.calendly_url!, "_blank")}
                className="gap-2"
              >
                <Calendar className="h-5 w-5" />
                Agendar Chamada
              </Button>
            )}
            {profile?.show_contact_form && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="gap-2"
              >
                <Mail className="h-5 w-5" />
                Pedir Orçamento
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Projetos</h2>
          
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum projeto publicado ainda.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  variant="glass"
                  className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video bg-secondary overflow-hidden">
                    {project.images[0] ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Briefcase className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      {profile?.show_contact_form && (
        <section id="contact" className="py-16 px-4 bg-secondary/30">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Entre em Contato</h2>
            <p className="text-center text-muted-foreground mb-8">
              Envie uma mensagem e respondo em até 24h
            </p>

            <Card variant="glass">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder="Conte sobre seu projeto ou necessidade..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t">
        <p>
          Portfólio criado com{" "}
          <a
            href="/"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portfol.io
          </a>
        </p>
      </footer>
    </div>
  );
}