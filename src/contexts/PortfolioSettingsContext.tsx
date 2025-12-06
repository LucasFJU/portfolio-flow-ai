import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  const [settings, setSettings] = useState<PortfolioSettings>(() => {
    const stored = localStorage.getItem("portfol-settings");
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("portfol-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<PortfolioSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const reorderProjects = (newOrder: string[]) => {
    setSettings((prev) => ({ ...prev, projectOrder: newOrder }));
  };

  return (
    <PortfolioSettingsContext.Provider value={{ settings, updateSettings, reorderProjects }}>
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
