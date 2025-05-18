export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      copy_entries: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          headline: string
          copy_text: string
          copywriter: string | null
          advertiser: string | null
          year_created: number | null
          awards: string | null
          explanation: string | null
          key_visual_urls: string[]
          source: Json
          serial_number: number
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          headline: string
          copy_text: string
          copywriter?: string | null
          advertiser?: string | null
          year_created?: number | null
          awards?: string | null
          explanation?: string | null
          key_visual_urls?: string[]
          source: Json
          serial_number?: number
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          headline?: string
          copy_text?: string
          copywriter?: string | null
          advertiser?: string | null
          year_created?: number | null
          awards?: string | null
          explanation?: string | null
          key_visual_urls?: string[]
          source?: Json
          serial_number?: number
        }
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
  }
}
