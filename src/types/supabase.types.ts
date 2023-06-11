export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_994768a692ff5858cf7761cdc09"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          id: number
          name: string
          timestamp: number
        }
        Insert: {
          id?: number
          name: string
          timestamp: number
        }
        Update: {
          id?: number
          name?: string
          timestamp?: number
        }
        Relationships: []
      }
      organizations: {
        Row: {
          active: boolean
          co_creators: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          on_chain: boolean
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          active?: boolean
          co_creators?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          on_chain?: boolean
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          active?: boolean
          co_creators?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          on_chain?: boolean
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "FK_245468c5a2914202a3081b1494e"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      poap_claims: {
        Row: {
          claim_method: string | null
          created_at: string | null
          event_drop_id: string | null
          id: string
          nft_address: string | null
          owner: string | null
          staus: string | null
        }
        Insert: {
          claim_method?: string | null
          created_at?: string | null
          event_drop_id?: string | null
          id?: string
          nft_address?: string | null
          owner?: string | null
          staus?: string | null
        }
        Update: {
          claim_method?: string | null
          created_at?: string | null
          event_drop_id?: string | null
          id?: string
          nft_address?: string | null
          owner?: string | null
          staus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poap_claims_event_drop_id_fkey"
            columns: ["event_drop_id"]
            referencedRelation: "poap_event_drops"
            referencedColumns: ["id"]
          }
        ]
      }
      poap_event_drops: {
        Row: {
          amount: number | null
          created_at: string | null
          end_date: string | null
          event_id: string | null
          id: string
          start_date: string | null
          status: string | null
          tree_address: string | null
          tree_owner: string | null
          use_email: boolean | null
          use_mint_link: boolean | null
          use_solana_pay: boolean | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          event_id?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          tree_address?: string | null
          tree_owner?: string | null
          use_email?: boolean | null
          use_mint_link?: boolean | null
          use_solana_pay?: boolean | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          event_id?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          tree_address?: string | null
          tree_owner?: string | null
          use_email?: boolean | null
          use_mint_link?: boolean | null
          use_solana_pay?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "poap_event_drops_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "poap_events"
            referencedColumns: ["id"]
          }
        ]
      }
      poap_events: {
        Row: {
          created_at: string | null
          creator: string | null
          description: string | null
          end_date: string | null
          event_type: string | null
          id: string
          location: string | null
          logo: string | null
          name: string | null
          start_date: string | null
          virtual_event_url: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string | null
          start_date?: string | null
          virtual_event_url?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          name?: string | null
          start_date?: string | null
          virtual_event_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      poap_nfts: {
        Row: {
          created_at: string | null
          event_drop_id: string | null
          id: string
          image: string | null
          is_mutable: boolean | null
          nft_per_wallet: number | null
          transferable: boolean | null
          uri: string | null
        }
        Insert: {
          created_at?: string | null
          event_drop_id?: string | null
          id?: string
          image?: string | null
          is_mutable?: boolean | null
          nft_per_wallet?: number | null
          transferable?: boolean | null
          uri?: string | null
        }
        Update: {
          created_at?: string | null
          event_drop_id?: string | null
          id?: string
          image?: string | null
          is_mutable?: boolean | null
          nft_per_wallet?: number | null
          transferable?: boolean | null
          uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poap_nfts_event_drop_id_fkey"
            columns: ["event_drop_id"]
            referencedRelation: "poap_event_drops"
            referencedColumns: ["id"]
          }
        ]
      }
      poap_trees: {
        Row: {
          address: string | null
          canopy_depth: number | null
          created_at: string | null
          creator: string | null
          event_drop_id: string | null
          id: string
          max_buffer_size: number | null
          max_depth: number | null
        }
        Insert: {
          address?: string | null
          canopy_depth?: number | null
          created_at?: string | null
          creator?: string | null
          event_drop_id?: string | null
          id?: string
          max_buffer_size?: number | null
          max_depth?: number | null
        }
        Update: {
          address?: string | null
          canopy_depth?: number | null
          created_at?: string | null
          creator?: string | null
          event_drop_id?: string | null
          id?: string
          max_buffer_size?: number | null
          max_depth?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poap_trees_event_drop_id_fkey"
            columns: ["event_drop_id"]
            referencedRelation: "poap_event_drops"
            referencedColumns: ["id"]
          }
        ]
      }
      post_translations: {
        Row: {
          created_at: string
          description: string
          id: string
          language_code: Database["public"]["Enums"]["post_translations_language_code_enum"]
          post_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          language_code: Database["public"]["Enums"]["post_translations_language_code_enum"]
          post_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          language_code?: Database["public"]["Enums"]["post_translations_language_code_enum"]
          post_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_11f143c8b50a9ff60340edca475"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_c4f9a7bd77b489e711277ee5986"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          is_email_verified: boolean
          is_phone_verified: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_email_verified?: boolean
          is_phone_verified?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_email_verified?: boolean
          is_phone_verified?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_4ed056b9344e6f7d8d46ec4b302"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          password: string | null
          phone: string | null
          role: Database["public"]["Enums"]["users_role_enum"]
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          password?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["users_role_enum"]
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          password?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["users_role_enum"]
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
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
      post_translations_language_code_enum: "en_US" | "ru_RU"
      users_role_enum: "USER" | "ADMIN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
