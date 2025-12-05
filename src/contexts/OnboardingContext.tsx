import React, { createContext, useContext, useState, ReactNode } from "react";

export interface OnboardingData {
  name: string;
  area: string;
  niche: string;
  objective: string;
  experience: string;
  idealClient: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  generatedProfile: string | null;
  setGeneratedProfile: (profile: string | null) => void;
}

const defaultData: OnboardingData = {
  name: "",
  area: "",
  niche: "",
  objective: "",
  experience: "",
  idealClient: "",
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(() => {
    const stored = localStorage.getItem("portfol-onboarding");
    return stored ? JSON.parse(stored) : defaultData;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(() => {
    return localStorage.getItem("portfol-onboarding-complete") === "true";
  });
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(() => {
    return localStorage.getItem("portfol-profile");
  });

  const updateData = (field: keyof OnboardingData, value: string) => {
    setData((prev) => {
      const newData = { ...prev, [field]: value };
      localStorage.setItem("portfol-onboarding", JSON.stringify(newData));
      return newData;
    });
  };

  const handleSetComplete = (complete: boolean) => {
    setIsComplete(complete);
    localStorage.setItem("portfol-onboarding-complete", String(complete));
  };

  const handleSetProfile = (profile: string | null) => {
    setGeneratedProfile(profile);
    if (profile) {
      localStorage.setItem("portfol-profile", profile);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        isComplete,
        setIsComplete: handleSetComplete,
        generatedProfile,
        setGeneratedProfile: handleSetProfile,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
