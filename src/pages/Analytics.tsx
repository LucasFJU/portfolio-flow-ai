import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, Eye, Clock, MousePointerClick, TrendingUp, Users, Loader2 } from "lucide-react";

export default function Analytics() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Métricas & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o desempenho do seu portfólio e propostas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Visualizações", value: "0", icon: Eye, trend: "+0%" },
            { label: "Tempo médio", value: "0:00", icon: Clock, trend: "+0%" },
            { label: "Cliques", value: "0", icon: MousePointerClick, trend: "+0%" },
            { label: "Visitantes", value: "0", icon: Users, trend: "+0%" },
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

        {/* Chart */}
        <Card variant="glass">
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

        <p className="text-center text-sm text-muted-foreground mt-8">
          Os dados serão atualizados conforme seu portfólio e propostas recebem visitas.
        </p>
      </div>
    </Layout>
  );
}
