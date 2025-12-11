import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    niche: "",
    bio: "",
    experience_level: "",
    ideal_client: "",
    portfolio_objective: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        area: profile.area || "",
        niche: profile.niche || "",
        bio: profile.bio || "",
        experience_level: profile.experience_level || "",
        ideal_client: profile.ideal_client || "",
        portfolio_objective: profile.portfolio_objective || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl gradient-primary">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Área de Atuação</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                  placeholder="Ex: Design, Desenvolvimento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Nicho</Label>
                <Input
                  id="niche"
                  value={formData.niche}
                  onChange={(e) => handleChange("niche", e.target.value)}
                  placeholder="Ex: UX/UI, Branding"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_level">Nível de Experiência</Label>
              <Input
                id="experience_level"
                value={formData.experience_level}
                onChange={(e) => handleChange("experience_level", e.target.value)}
                placeholder="Ex: Júnior, Pleno, Sênior"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideal_client">Cliente Ideal</Label>
              <Input
                id="ideal_client"
                value={formData.ideal_client}
                onChange={(e) => handleChange("ideal_client", e.target.value)}
                placeholder="Descreva seu cliente ideal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio_objective">Objetivo do Portfólio</Label>
              <Input
                id="portfolio_objective"
                value={formData.portfolio_objective}
                onChange={(e) => handleChange("portfolio_objective", e.target.value)}
                placeholder="Ex: Atrair clientes, Conseguir emprego"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="gradient"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="mt-6">
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
            <CardDescription>Informações sobre seu plano</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">{profile?.plan || "free"}</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.plan === "pro" 
                    ? "Acesso ilimitado a todas as funcionalidades" 
                    : `${profile?.proposal_count || 0}/5 propostas utilizadas`}
                </p>
              </div>
              {profile?.plan !== "pro" && (
                <Button variant="outline">
                  Fazer Upgrade
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
