import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuickProjectForm from "@/components/project/QuickProjectForm";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Zap, FileEdit, Upload } from "lucide-react";

export default function QuickProject() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("quick");

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Criar Projeto</h1>
            <p className="text-sm text-muted-foreground">
              Escolha como adicionar seu projeto ao portfólio
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="quick" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Em 60s</span>
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Importar</span>
            </TabsTrigger>
            <TabsTrigger value="full" className="gap-2">
              <FileEdit className="h-4 w-4" />
              <span className="hidden sm:inline">Completo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="animate-fade-in">
            <QuickProjectForm
              onComplete={() => navigate("/dashboard")}
              onCancel={() => navigate("/dashboard")}
            />
          </TabsContent>

          <TabsContent value="import" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* GitHub */}
                <button
                  onClick={() => navigate("/projects/import/github")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">GitHub</h3>
                    <p className="text-xs text-muted-foreground">Importar repositórios</p>
                  </div>
                </button>

                {/* Notion */}
                <button
                  onClick={() => navigate("/projects/import/notion")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.043c-.42-.326-.98-.7-2.055-.607L3.01 2.71c-.466.046-.56.28-.374.466l1.823 1.032zm.793 2.897v13.59c0 .745.373 1.026 1.212.98l14.523-.84c.84-.046.933-.56.933-1.165V6.058c0-.606-.233-.933-.746-.886l-15.176.886c-.56.047-.746.327-.746.886zm14.337.653c.093.42 0 .84-.42.886l-.7.14v10.066c-.606.327-1.166.514-1.633.514-.746 0-.933-.234-1.493-.934l-4.572-7.186v6.952l1.446.327s0 .84-1.166.84l-3.222.187c-.093-.187 0-.653.326-.746l.84-.233V8.858l-1.166-.093c-.093-.42.14-1.026.793-1.073l3.456-.233 4.759 7.28V8.25l-1.213-.14c-.093-.514.28-.886.746-.933l3.219-.187z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">Notion</h3>
                    <p className="text-xs text-muted-foreground">Importar páginas</p>
                  </div>
                </button>

                {/* PDF */}
                <button
                  onClick={() => navigate("/projects/import/pdf")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">PDF</h3>
                    <p className="text-xs text-muted-foreground">Importar portfólio</p>
                  </div>
                </button>

                {/* Behance - Coming Soon */}
                <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card/50 opacity-60 cursor-not-allowed">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">Behance</h3>
                    <p className="text-xs text-muted-foreground">Em breve</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                A IA extrai automaticamente título, descrição, imagens e tecnologias dos seus projetos.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="full" className="animate-fade-in">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-muted-foreground mb-4">
                Use o editor completo para projetos complexos com todas as opções de customização.
              </p>
              <Button variant="gradient" onClick={() => navigate("/projects/new")}>
                <FileEdit className="h-4 w-4 mr-2" />
                Abrir Editor Completo
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}