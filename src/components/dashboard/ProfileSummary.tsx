import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Edit } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

export function ProfileSummary() {
  const { data, generatedProfile } = useOnboarding();

  if (!generatedProfile) return null;

  return (
    <Card variant="gradient" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">Seu Posicionamento</h3>
              <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                IA
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              {generatedProfile}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 text-xs bg-secondary rounded-full">
                {data.area}
              </span>
              <span className="px-3 py-1 text-xs bg-secondary rounded-full">
                {data.niche}
              </span>
              <span className="px-3 py-1 text-xs bg-secondary rounded-full">
                {data.experience}
              </span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
