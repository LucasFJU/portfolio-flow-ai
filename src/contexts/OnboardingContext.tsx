import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

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
  syncWithSupabase: () => Promise<void>;
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
  const { user, profile, updateProfile } = useAuth();
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

  // Load data from profile when available
  useEffect(() => {
    if (profile) {
      setData(prev => ({
        name: profile.name || prev.name,
        area: profile.area || prev.area,
        niche: profile.niche || prev.niche,
        objective: profile.portfolio_objective || prev.objective,
        experience: profile.experience_level || prev.experience,
        idealClient: profile.ideal_client || prev.idealClient,
      }));
      
      // If profile has bio, consider onboarding complete
      if (profile.bio) {
        setGeneratedProfile(profile.bio);
        setIsComplete(true);
      }
    }
  }, [profile]);

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

  // Sync onboarding data with Supabase profile
  const syncWithSupabase = useCallback(async () => {
    if (!user) return;

    try {
      await updateProfile({
        name: data.name,
        area: data.area,
        niche: data.niche,
        portfolio_objective: data.objective,
        experience_level: data.experience,
        ideal_client: data.idealClient,
        bio: generatedProfile || undefined,
      });
    } catch (error) {
      console.error("Error syncing onboarding data:", error);
    }
  }, [user, data, generatedProfile, updateProfile]);

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
        syncWithSupabase,
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
