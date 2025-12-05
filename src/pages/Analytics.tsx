import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Sparkles, Check, BarChart3, Eye, Clock, MousePointerClick, TrendingUp, Users } from "lucide-react";

export default function Analytics() {
  const isPro = false;

  if (!isPro) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card variant="gradient" className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Métricas & Analytics</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Acompanhe o desempenho do seu portfólio e entenda seu público.
                  Disponível exclusivamente no plano Pro.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
                  {[
                    "Visualizações por portfólio",
                    "Tempo médio de visita",
                    "Cliques por projeto",
                    "Origem de tráfego",
                    "Histórico de acessos",
                    "Clusters de interesse",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="gradient" size="xl" className="gap-2">
                  <Sparkles className="h-5 w-5" /> Fazer upgrade para Pro
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  A partir de R$ 29/mês • Cancele quando quiser
                </p>
              </div>
            </Card>

            {/* Preview Dashboard */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-6">Preview do recurso</h2>
              <div className="grid grid-cols-2 gap-4 opacity-60">
                {[
                  { label: "Visualizações", value: "1,234", icon: Eye, trend: "+12%" },
                  { label: "Tempo médio", value: "2:45", icon: Clock, trend: "+8%" },
                  { label: "Cliques", value: "456", icon: MousePointerClick, trend: "+23%" },
                  { label: "Visitantes", value: "789", icon: Users, trend: "+5%" },
                ].map((stat) => (
                  <Card key={stat.label} variant="glass">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3" /> {stat.trend}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary">
                          <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card variant="glass" className="mt-4 opacity-60">
                <CardHeader>
                  <CardTitle className="text-base">Visualizações ao longo do tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2 px-4">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 gradient-primary rounded-t opacity-60"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between px-4 mt-2 text-xs text-muted-foreground">
                    <span>Jan</span>
                    <span>Fev</span>
                    <span>Mar</span>
                    <span>Abr</span>
                    <span>Mai</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Ago</span>
                    <span>Set</span>
                    <span>Out</span>
                    <span>Nov</span>
                    <span>Dez</span>
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
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        {/* Full analytics dashboard would go here */}
      </div>
    </Layout>
  );
}
