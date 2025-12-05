import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const Index = () => {
  const { isComplete } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (isComplete) {
      navigate("/dashboard");
    }
  }, [isComplete, navigate]);

  return <OnboardingFlow />;
};

export default Index;
