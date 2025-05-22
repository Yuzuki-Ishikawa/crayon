export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      copy_entries: {
        Row: {
          advertiser: string | null
          awards: string | null
          category_tags: string[] | null
          copy_text: string
          copywriter: string | null
          created_at: string | null
          explanation: string | null
          headline: string
          id: string
          industry_tags: string[] | null
          key_visual_urls: string[] | null
          publish_at: string | null
          serial_number: number
          source: Json | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
          year_created: number | null
          youtube_url: string | null
        }
        Insert: {
          advertiser?: string | null
          awards?: string | null
          category_tags?: string[] | null
          copy_text: string
          copywriter?: string | null
          created_at?: string | null
          explanation?: string | null
          headline: string
          id?: string
          industry_tags?: string[] | null
          key_visual_urls?: string[] | null
          publish_at?: string | null
          serial_number?: number
          source?: Json | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          year_created?: number | null
          youtube_url?: string | null
        }
        Update: {
          advertiser?: string | null
          awards?: string | null
          category_tags?: string[] | null
          copy_text?: string
          copywriter?: string | null
          created_at?: string | null
          explanation?: string | null
          headline?: string
          id?: string
          industry_tags?: string[] | null
          key_visual_urls?: string[] | null
          publish_at?: string | null
          serial_number?: number
          source?: Json | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          year_created?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          delivery_freq: string | null
          delivery_time: string | null
          id: string
          is_admin: boolean | null
          line_user_id: string | null
          next_scheduled_at: string | null
          time_zone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_freq?: string | null
          delivery_time?: string | null
          id?: string
          is_admin?: boolean | null
          line_user_id?: string | null
          next_scheduled_at?: string | null
          time_zone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_freq?: string | null
          delivery_time?: string | null
          id?: string
          is_admin?: boolean | null
          line_user_id?: string | null
          next_scheduled_at?: string | null
          time_zone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staging_copies: {
        Row: {
          author_name: string | null
          copy_text: string | null
          created_at: string | null
          explanation: string | null
          headline: string | null
          id: string
          key_visual_url: string | null
          problem_body: string | null
          raw_url: string | null
          source: string | null
          status: string | null
          tags: Json | null
        }
        Insert: {
          author_name?: string | null
          copy_text?: string | null
          created_at?: string | null
          explanation?: string | null
          headline?: string | null
          id?: string
          key_visual_url?: string | null
          problem_body?: string | null
          raw_url?: string | null
          source?: string | null
          status?: string | null
          tags?: Json | null
        }
        Update: {
          author_name?: string | null
          copy_text?: string | null
          created_at?: string | null
          explanation?: string | null
          headline?: string | null
          id?: string
          key_visual_url?: string | null
          problem_body?: string | null
          raw_url?: string | null
          source?: string | null
          status?: string | null
          tags?: Json | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
