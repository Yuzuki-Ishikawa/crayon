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
          title: string
          content: string
          source: Json
          serial_number: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          source: Json
          serial_number?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
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
