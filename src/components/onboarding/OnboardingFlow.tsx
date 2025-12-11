import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, SkipForward, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import { toast } from "sonner";

const areas = [
  "UX/UI Design",
  "Branding & Identidade Visual",
  "Ilustração",
  "Motion Design",
  "Fotografia",
  "Desenvolvimento Web",
  "Marketing Digital",
  "Outro",
];

const experiences = [
  "Iniciante (0-2 anos)",
  "Intermediário (2-5 anos)",
  "Experiente (5-10 anos)",
  "Sênior (10+ anos)",
];

const objectives = [
  "Conseguir mais clientes",
  "Mostrar meu trabalho",
  "Conseguir emprego",
  "Aumentar minha visibilidade",
  "Gerar propostas profissionais",
];

interface StepProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

function OnboardingStep({ children, title, subtitle }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-base">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export function OnboardingFlow() {
  const { data, updateData, setIsComplete, setGeneratedProfile, syncWithSupabase } = useOnboarding();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { generate, isGenerating } = useAIGenerate();

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    setIsComplete(true);
    navigate("/dashboard");
  };

  const handleComplete = async () => {
    try {
      const profile = await generate("profile", {
        name: data.name,
        area: data.area,
        niche: data.niche,
        objective: data.objective,
        experience: data.experience,
        idealClient: data.idealClient,
      });
      
      if (profile) {
        setGeneratedProfile(profile);
      }
      
      await syncWithSupabase();
      setIsComplete(true);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erro ao gerar perfil. Tente novamente.");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.name.length > 0;
      case 1:
        return data.area.length > 0;
      case 2:
        return data.niche.length > 0;
      case 3:
        return data.objective.length > 0;
      case 4:
        return data.experience.length > 0;
      case 5:
        return data.idealClient.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl text-foreground">
            Portfol<span className="text-gradient">.io</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSkip} className="gap-1">
            Pular <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="px-4 py-2">
        <Progress value={progress} variant="gradient" className="h-1.5" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Etapa {step + 1} de {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <OnboardingStep
              key="name"
              title="Bem-vindo ao Portfol.io!"
              subtitle="Vamos criar seu portfólio perfeito. Qual é o seu nome?"
            >
              <Input
                placeholder="Seu nome completo"
                value={data.name}
                onChange={(e) => updateData("name", e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
            </OnboardingStep>
          )}

          {step === 1 && (
            <OnboardingStep
              key="area"
              title={`Prazer, ${data.name}!`}
              subtitle="Em qual área você atua?"
            >
              <div className="grid grid-cols-2 gap-3">
                {areas.map((area) => (
                  <Card
                    key={area}
                    variant={data.area === area ? "gradient" : "default"}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      data.area === area
                        ? "ring-2 ring-primary shadow-glow"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateData("area", area)}
                  >
                    <span className="font-medium text-sm text-foreground">{area}</span>
                  </Card>
                ))}
              </div>
            </OnboardingStep>
          )}

          {step === 2 && (
            <OnboardingStep
              key="niche"
              title="Qual é o seu nicho?"
              subtitle="Descreva sua especialização ou estilo"
            >
              <Input
                placeholder="Ex: Apps mobile, E-commerce, Startups..."
                value={data.niche}
                onChange={(e) => updateData("niche", e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-3">
                Seja específico para atrair os clientes certos
              </p>
            </OnboardingStep>
          )}

          {step === 3 && (
            <OnboardingStep
              key="objective"
              title="Qual seu objetivo?"
              subtitle="O que você quer alcançar com seu portfólio?"
            >
              <div className="flex flex-col gap-3">
                {objectives.map((obj) => (
                  <Card
                    key={obj}
                    variant={data.objective === obj ? "gradient" : "default"}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      data.objective === obj
                        ? "ring-2 ring-primary shadow-glow"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateData("objective", obj)}
                  >
                    <span className="font-medium text-foreground">{obj}</span>
                  </Card>
                ))}
              </div>
            </OnboardingStep>
          )}

          {step === 4 && (
            <OnboardingStep
              key="experience"
              title="Qual sua experiência?"
              subtitle="Isso nos ajuda a adequar seu portfólio"
            >
              <div className="flex flex-col gap-3">
                {experiences.map((exp) => (
                  <Card
                    key={exp}
                    variant={data.experience === exp ? "gradient" : "default"}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      data.experience === exp
                        ? "ring-2 ring-primary shadow-glow"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => updateData("experience", exp)}
                  >
                    <span className="font-medium text-foreground">{exp}</span>
                  </Card>
                ))}
              </div>
            </OnboardingStep>
          )}

          {step === 5 && (
            <OnboardingStep
              key="idealClient"
              title="Quem é seu cliente ideal?"
              subtitle="Descreva o tipo de cliente que você quer atrair"
            >
              <Input
                placeholder="Ex: Startups de tecnologia, Agências de publicidade..."
                value={data.idealClient}
                onChange={(e) => updateData("idealClient", e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-3">
                Pense em quem mais se beneficiaria do seu trabalho
              </p>
            </OnboardingStep>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 flex justify-between items-center relative z-10">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        {step < totalSteps - 1 ? (
          <Button
            variant="gradient"
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Continuar <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="gradient"
            onClick={handleComplete}
            disabled={!canProceed() || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                Gerando perfil...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Criar meu portfólio
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
