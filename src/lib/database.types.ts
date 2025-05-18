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
          created_at: string
          updated_at: string
          title: string
          content: string
          source: Json
          serial_number: number
          key_visual_urls: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          source: Json
          serial_number?: number
          key_visual_urls?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          source?: Json
          serial_number?: number
          key_visual_urls?: string[]
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
