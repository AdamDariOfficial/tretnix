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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          device_type: string | null
          event_type: string
          id: number
          path: string | null
          project_slug: string | null
          referrer_host: string | null
          viewport_width: number | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: number
          path?: string | null
          project_slug?: string | null
          referrer_host?: string | null
          viewport_width?: number | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: number
          path?: string | null
          project_slug?: string | null
          referrer_host?: string | null
          viewport_width?: number | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          business_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          needs: string[]
          phone: string | null
          privacy_accepted: boolean
          source_path: string | null
          starting_point: string | null
          status: string
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          needs?: string[]
          phone?: string | null
          privacy_accepted?: boolean
          source_path?: string | null
          starting_point?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          needs?: string[]
          phone?: string | null
          privacy_accepted?: boolean
          source_path?: string | null
          starting_point?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          project_id: string
          sort_order: number
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          project_id: string
          sort_order?: number
          type: string
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          project_id?: string
          sort_order?: number
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          audience: string
          badge: string | null
          category: string
          created_at: string
          customizations: string[]
          features: string[]
          gradient: string
          id: string
          image_url: string | null
          impact_points: string[]
          is_concept: boolean
          is_featured: boolean
          is_visible: boolean
          modules: string[]
          overview: string
          problem: string
          short_description: string
          slug: string
          solution: string
          sort_order: number
          tech_stack: string[]
          title: string
          updated_at: string
          workflow_steps: string[]
        }
        Insert: {
          audience?: string
          badge?: string | null
          category?: string
          created_at?: string
          customizations?: string[]
          features?: string[]
          gradient?: string
          id?: string
          image_url?: string | null
          impact_points?: string[]
          is_concept?: boolean
          is_featured?: boolean
          is_visible?: boolean
          modules?: string[]
          overview?: string
          problem?: string
          short_description?: string
          slug: string
          solution?: string
          sort_order?: number
          tech_stack?: string[]
          title: string
          updated_at?: string
          workflow_steps?: string[]
        }
        Update: {
          audience?: string
          badge?: string | null
          category?: string
          created_at?: string
          customizations?: string[]
          features?: string[]
          gradient?: string
          id?: string
          image_url?: string | null
          impact_points?: string[]
          is_concept?: boolean
          is_featured?: boolean
          is_visible?: boolean
          modules?: string[]
          overview?: string
          problem?: string
          short_description?: string
          slug?: string
          solution?: string
          sort_order?: number
          tech_stack?: string[]
          title?: string
          updated_at?: string
          workflow_steps?: string[]
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string
          contact_phone: string
          cta_email_subject: string
          id: number
          location: string
          updated_at: string
        }
        Insert: {
          contact_email?: string
          contact_phone?: string
          cta_email_subject?: string
          id?: number
          location?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string
          contact_phone?: string
          cta_email_subject?: string
          id?: number
          location?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
