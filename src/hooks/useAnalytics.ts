import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

type EventType = "portfolio_view" | "proposal_view" | "project_click" | "proposal_share";
type ResourceType = "portfolio" | "proposal" | "project";

interface AnalyticsEvent {
  event_type: EventType;
  resource_type: ResourceType;
  resource_id?: string;
  metadata?: Json;
  source?: string;
}

export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    if (!user) return;

    try {
      const eventData = {
        user_id: user.id,
        event_type: event.event_type,
        resource_type: event.resource_type,
        resource_id: event.resource_id || null,
        metadata: event.metadata || {},
        source: event.source || null,
        user_agent: navigator.userAgent,
      };

      const { error } = await supabase.from("analytics_events").insert([eventData]);

      if (error) {
        console.error("Error tracking event:", error);
      }
    } catch (err) {
      console.error("Error tracking event:", err);
    }
  }, [user]);

  const trackPortfolioView = useCallback((portfolioUserId?: string) => {
    trackEvent({
      event_type: "portfolio_view",
      resource_type: "portfolio",
      resource_id: portfolioUserId,
      source: document.referrer || "direct",
    });
  }, [trackEvent]);

  const trackProposalView = useCallback((proposalId: string) => {
    trackEvent({
      event_type: "proposal_view",
      resource_type: "proposal",
      resource_id: proposalId,
    });
  }, [trackEvent]);

  const trackProjectClick = useCallback((projectId: string) => {
    trackEvent({
      event_type: "project_click",
      resource_type: "project",
      resource_id: projectId,
    });
  }, [trackEvent]);

  const trackProposalShare = useCallback((proposalId: string) => {
    trackEvent({
      event_type: "proposal_share",
      resource_type: "proposal",
      resource_id: proposalId,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPortfolioView,
    trackProposalView,
    trackProjectClick,
    trackProposalShare,
  };
}

// Hook for fetching analytics data
export function useAnalyticsData() {
  const { user } = useAuth();

  const getAnalyticsSummary = useCallback(async () => {
    if (!user) return null;

    try {
      // Get total views
      const { data: viewsData, error: viewsError } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .in("event_type", ["portfolio_view", "proposal_view"]);

      if (viewsError) throw viewsError;

      // Get project clicks
      const { data: clicksData, error: clicksError } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .eq("event_type", "project_click");

      if (clicksError) throw clicksError;

      // Get unique visitors (approximate by unique user_agent)
      const { data: visitorsData, error: visitorsError } = await supabase
        .from("analytics_events")
        .select("user_agent")
        .eq("user_id", user.id)
        .in("event_type", ["portfolio_view", "proposal_view"]);

      if (visitorsError) throw visitorsError;

      const uniqueVisitors = new Set(visitorsData?.map(v => v.user_agent)).size;

      // Get views over time (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: timeSeriesData, error: timeSeriesError } = await supabase
        .from("analytics_events")
        .select("created_at, event_type")
        .eq("user_id", user.id)
        .in("event_type", ["portfolio_view", "proposal_view"])
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (timeSeriesError) throw timeSeriesError;

      // Group by day
      const viewsByDay: Record<string, number> = {};
      const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      
      // Initialize last 7 days with 0
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        viewsByDay[dayName] = 0;
      }

      // Count events per day
      timeSeriesData?.forEach(event => {
        const date = new Date(event.created_at);
        const dayName = days[date.getDay()];
        viewsByDay[dayName] = (viewsByDay[dayName] || 0) + 1;
      });

      const chartData = Object.entries(viewsByDay).map(([name, views]) => ({
        name,
        views,
      }));

      return {
        totalViews: viewsData?.length || 0,
        totalClicks: clicksData?.length || 0,
        uniqueVisitors,
        avgTime: "2m 30s", // This would require more complex tracking
        chartData,
      };
    } catch (err) {
      console.error("Error fetching analytics:", err);
      return null;
    }
  }, [user]);

  return { getAnalyticsSummary };
}
