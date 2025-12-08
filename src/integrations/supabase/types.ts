export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json
          resource_id: string | null
          resource_type: string
          source: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          resource_id?: string | null
          resource_type: string
          source?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          resource_id?: string | null
          resource_type?: string
          source?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_settings: {
        Row: {
          columns: number
          created_at: string
          font: string
          id: string
          primary_color: string
          project_order: string[]
          template: string
          updated_at: string
          user_id: string
        }
        Insert: {
          columns?: number
          created_at?: string
          font?: string
          id?: string
          primary_color?: string
          project_order?: string[]
          template?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          columns?: number
          created_at?: string
          font?: string
          id?: string
          primary_color?: string
          project_order?: string[]
          template?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area: string | null
          bio: string | null
          created_at: string
          experience_level: string | null
          id: string
          ideal_client: string | null
          name: string | null
          niche: string | null
          plan: Database["public"]["Enums"]["user_plan"]
          portfolio_objective: string | null
          proposal_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          area?: string | null
          bio?: string | null
          created_at?: string
          experience_level?: string | null
          id?: string
          ideal_client?: string | null
          name?: string | null
          niche?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          portfolio_objective?: string | null
          proposal_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: string | null
          bio?: string | null
          created_at?: string
          experience_level?: string | null
          id?: string
          ideal_client?: string | null
          name?: string | null
          niche?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          portfolio_objective?: string | null
          proposal_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          briefing_description: string | null
          challenge_description: string | null
          created_at: string
          description: string | null
          display_order: number
          execution_description: string | null
          id: string
          images: string[]
          links: Json
          result_description: string | null
          status: string
          technologies: string[]
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          briefing_description?: string | null
          challenge_description?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          execution_description?: string | null
          id?: string
          images?: string[]
          links?: Json
          result_description?: string | null
          status?: string
          technologies?: string[]
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          briefing_description?: string | null
          challenge_description?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          execution_description?: string | null
          id?: string
          images?: string[]
          links?: Json
          result_description?: string | null
          status?: string
          technologies?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          budget_items: Json
          budget_type: string
          client_email: string | null
          client_name: string | null
          closing: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          introduction: string | null
          justification: string | null
          logo_url: string | null
          primary_color: string
          project_ids: string[]
          share_token: string | null
          status: Database["public"]["Enums"]["proposal_status"]
          title: string
          total_value: number
          updated_at: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          budget_items?: Json
          budget_type?: string
          client_email?: string | null
          client_name?: string | null
          closing?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          introduction?: string | null
          justification?: string | null
          logo_url?: string | null
          primary_color?: string
          project_ids?: string[]
          share_token?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          title: string
          total_value?: number
          updated_at?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          budget_items?: Json
          budget_type?: string
          client_email?: string | null
          client_name?: string | null
          closing?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          introduction?: string | null
          justification?: string | null
          logo_url?: string | null
          primary_color?: string
          project_ids?: string[]
          share_token?: string | null
          status?: Database["public"]["Enums"]["proposal_status"]
          title?: string
          total_value?: number
          updated_at?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      proposal_status: "draft" | "sent" | "viewed" | "accepted" | "rejected"
      user_plan: "free" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      proposal_status: ["draft", "sent", "viewed", "accepted", "rejected"],
      user_plan: ["free", "pro"],
    },
  },
} as const
