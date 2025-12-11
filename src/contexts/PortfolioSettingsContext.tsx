import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface PortfolioSettings {
  template: "case" | "gallery" | "slides" | "onepage";
  primaryColor: string;
  font: string;
  columns: 1 | 2 | 3;
  projectOrder: string[];
}

interface PortfolioSettingsContextType {
  settings: PortfolioSettings;
  updateSettings: (updates: Partial<PortfolioSettings>) => void;
  reorderProjects: (newOrder: string[]) => void;
  isLoading: boolean;
}

const defaultSettings: PortfolioSettings = {
  template: "case",
  primaryColor: "#8B5CF6",
  font: "DM Sans",
  columns: 2,
  projectOrder: [],
};

const PortfolioSettingsContext = createContext<PortfolioSettingsContextType | undefined>(undefined);

export function PortfolioSettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PortfolioSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("portfolio_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching portfolio settings:", error);
        }

        if (data) {
          setSettings({
            template: data.template as PortfolioSettings["template"],
            primaryColor: data.primary_color,
            font: data.font,
            columns: data.columns as PortfolioSettings["columns"],
            projectOrder: data.project_order || [],
          });
        }
      } catch (err) {
        console.error("Error fetching portfolio settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  // Save settings to Supabase
  const saveToSupabase = useCallback(async (newSettings: PortfolioSettings) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("portfolio_settings")
        .upsert({
          user_id: user.id,
          template: newSettings.template,
          primary_color: newSettings.primaryColor,
          font: newSettings.font,
          columns: newSettings.columns,
          project_order: newSettings.projectOrder,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        });

      if (error) {
        console.error("Error saving portfolio settings:", error);
      }
    } catch (err) {
      console.error("Error saving portfolio settings:", err);
    }
  }, [user]);

  const updateSettings = useCallback((updates: Partial<PortfolioSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      saveToSupabase(newSettings);
      return newSettings;
    });
  }, [saveToSupabase]);

  const reorderProjects = useCallback((newOrder: string[]) => {
    setSettings((prev) => {
      const newSettings = { ...prev, projectOrder: newOrder };
      saveToSupabase(newSettings);
      return newSettings;
    });
  }, [saveToSupabase]);

  return (
    <PortfolioSettingsContext.Provider value={{ settings, updateSettings, reorderProjects, isLoading }}>
      {children}
    </PortfolioSettingsContext.Provider>
  );
}

export function usePortfolioSettings() {
  const context = useContext(PortfolioSettingsContext);
  if (context === undefined) {
    throw new Error("usePortfolioSettings must be used within a PortfolioSettingsProvider");
  }
  return context;
}
