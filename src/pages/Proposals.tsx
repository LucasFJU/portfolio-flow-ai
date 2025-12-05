import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/contexts/ProjectsContext";
import {
  Plus,
  FileText,
  Download,
  ExternalLink,
  Clock,
  Check,
  Crown,
  Sparkles,
} from "lucide-react";

export default function Proposals() {
  const { projects } = useProjects();
  const [isPro] = useState(false);

  if (!isPro) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Pro Feature Banner */}
            <Card variant="gradient" className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent">
                  <Crown className="h-8 w-8 text-accent-foreground" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Gerador de Propostas</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Crie propostas profissionais e orçamentos a partir dos seus projetos.
                  Disponível exclusivamente no plano Pro.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
                  {[
                    "Selecione projetos para anexar",
                    "IA gera textos profissionais",
                    "Modelos de orçamento editáveis",
                    "Exportação em PDF ou link",
                    "Histórico de propostas",
                    "Personalização completa",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="gradient-accent" size="xl" className="gap-2">
                  <Sparkles className="h-5 w-5" /> Fazer upgrade para Pro
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  A partir de R$ 29/mês • Cancele quando quiser
                </p>
              </div>
            </Card>

            {/* Preview of what Pro offers */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Preview do recurso</h2>
              <Card variant="glass" className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Proposta - Cliente XYZ</p>
                        <p className="text-sm text-muted-foreground">Criada há 2 dias</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" disabled>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Rascunho
                    </span>
                    <span>3 projetos anexados</span>
                    <span>R$ 15.000,00</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Propostas</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie suas propostas comerciais
            </p>
          </div>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" /> Nova proposta
          </Button>
        </div>

        <Card variant="glass" className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma proposta ainda</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Crie sua primeira proposta selecionando projetos do seu portfólio
          </p>
          <Button variant="gradient" className="gap-2">
            <Sparkles className="h-4 w-4" /> Criar primeira proposta
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
