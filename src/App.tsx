import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { PortfolioSettingsProvider } from "@/contexts/PortfolioSettingsContext";
import { ProposalsProvider } from "@/contexts/ProposalsContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectEditor from "./pages/ProjectEditor";
import QuickProject from "./pages/QuickProject";
import Portfolio from "./pages/Portfolio";
import Proposals from "./pages/Proposals";
import ProposalEditor from "./pages/ProposalEditor";
import PublicProposal from "./pages/PublicProposal";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <OnboardingProvider>
          <ProjectsProvider>
            <PortfolioSettingsProvider>
              <ProposalsProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectEditor />} />
                      <Route path="/projects/quick" element={<QuickProject />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/proposals" element={<Proposals />} />
                      <Route path="/proposals/:id" element={<ProposalEditor />} />
                      <Route path="/p/:token" element={<PublicProposal />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </ProposalsProvider>
            </PortfolioSettingsProvider>
          </ProjectsProvider>
        </OnboardingProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
