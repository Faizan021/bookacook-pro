import { Database as GeneratedDatabase } from "./types";

/**
 * OVERRIDE GOVERNANCE RULE:
 * This is a typed compatibility wrapper to bridge the gap between our active schema
 * and the last `supabase gen types` execution. 
 * Every override here MUST map to a real Supabase migration. Do not invent "fantasy types".
 */
export type Database = Omit<GeneratedDatabase, "public"> & {
  public: {
    Tables: Omit<GeneratedDatabase["public"]["Tables"], "restaurants" | "planners" | "caterers"> & {
      restaurants: Omit<GeneratedDatabase["public"]["Tables"]["restaurants"], "Row" | "Insert" | "Update"> & {
        Row: GeneratedDatabase["public"]["Tables"]["restaurants"]["Row"] & {
          seo_dietary_options: string[] | null;
          seo_local_intro: string | null;
          seo_nearby_landmarks: string[] | null;
          show_in_marketplace: boolean | null;
        };
        Insert: GeneratedDatabase["public"]["Tables"]["restaurants"]["Insert"] & {
          seo_dietary_options?: string[] | null;
          seo_local_intro?: string | null;
          seo_nearby_landmarks?: string[] | null;
          show_in_marketplace?: boolean | null;
        };
        Update: GeneratedDatabase["public"]["Tables"]["restaurants"]["Update"] & {
          seo_dietary_options?: string[] | null;
          seo_local_intro?: string | null;
          seo_nearby_landmarks?: string[] | null;
          show_in_marketplace?: boolean | null;
        };
      };
      caterers: Omit<GeneratedDatabase["public"]["Tables"]["caterers"], "Row" | "Insert" | "Update"> & {
        Row: GeneratedDatabase["public"]["Tables"]["caterers"]["Row"] & {
          seo_dietary_options: string[] | null;
          seo_local_intro: string | null;
          seo_nearby_landmarks: string[] | null;
        };
        Insert: GeneratedDatabase["public"]["Tables"]["caterers"]["Insert"] & {
          seo_dietary_options?: string[] | null;
          seo_local_intro?: string | null;
          seo_nearby_landmarks?: string[] | null;
        };
        Update: GeneratedDatabase["public"]["Tables"]["caterers"]["Update"] & {
          seo_dietary_options?: string[] | null;
          seo_local_intro?: string | null;
          seo_nearby_landmarks?: string[] | null;
        };
      };
      planners: Omit<GeneratedDatabase["public"]["Tables"]["planners"], "Row" | "Insert" | "Update"> & {
        Row: GeneratedDatabase["public"]["Tables"]["planners"]["Row"] & {
          seo_dietary_options: string[] | null;
          seo_local_intro: string | null;
          seo_nearby_landmarks: string[] | null;
        };
        Insert: GeneratedDatabase["public"]["Tables"]["planners"]["Insert"] & {
          seo_dietary_options?: string[] | null;
          seo_local_intro?: string | null;
          seo_nearby_landmarks?: string[] | null;
        };
        Update: GeneratedDatabase["public"]["Tables"]["planners"]["Update"] & {
          seo_dietary_options?: string[] | null;
          seo_local_intro?: string | null;
          seo_nearby_landmarks?: string[] | null;
        };
      };
      discovery_pages: {
        Row: {
          canonical_path: string | null;
          city_slug: string;
          created_at: string;
          curated_content: string | null;
          entity_count: number | null;
          faq_md: string | null;
          id: string;
          is_active: boolean | null;
          meta_description: string | null;
          meta_title: string | null;
          popular_venues: string[] | null;
          search_volume: string | null;
          type_slug: string;
          updated_at: string;
        };
        Insert: {
          canonical_path?: string | null;
          city_slug: string;
          created_at?: string;
          curated_content?: string | null;
          entity_count?: number | null;
          faq_md?: string | null;
          id?: string;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          popular_venues?: string[] | null;
          search_volume?: string | null;
          type_slug: string;
          updated_at?: string;
        };
        Update: {
          canonical_path?: string | null;
          city_slug?: string;
          created_at?: string;
          curated_content?: string | null;
          entity_count?: number | null;
          faq_md?: string | null;
          id?: string;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          popular_venues?: string[] | null;
          search_volume?: string | null;
          type_slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      restaurant_printers: {
        Row: {
          created_at: string;
          id: string;
          paper_width: number;
          printer_mac: string;
          restaurant_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          paper_width?: number;
          printer_mac: string;
          restaurant_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          paper_width?: number;
          printer_mac?: string;
          restaurant_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_printers_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      restaurant_print_jobs: {
        Row: {
          created_at: string;
          error_message: string | null;
          id: string;
          order_id: string;
          printed_at: string | null;
          printer_id: string | null;
          restaurant_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          order_id: string;
          printed_at?: string | null;
          printer_id?: string | null;
          restaurant_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          order_id?: string;
          printed_at?: string | null;
          printer_id?: string | null;
          restaurant_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_print_jobs_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "restaurant_orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "restaurant_print_jobs_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      service_leads: {
        Row: {
          budget_range: string | null;
          city: string;
          created_at: string;
          customer_id: string | null;
          email: string;
          event_date: string;
          event_type: string;
          guest_count: number | null;
          id: string;
          lead_visibility_status: string | null;
          name: string;
          notes: string | null;
          phone: string | null;
          source_channel: string | null;
          source_route: string | null;
          status: string | null;
          unlocked_by_partner_id: string | null;
          updated_at: string;
          venue_address: string | null;
        };
        Insert: {
          budget_range?: string | null;
          city: string;
          created_at?: string;
          customer_id?: string | null;
          email: string;
          event_date: string;
          event_type: string;
          guest_count?: number | null;
          id?: string;
          lead_visibility_status?: string | null;
          name: string;
          notes?: string | null;
          phone?: string | null;
          source_channel?: string | null;
          source_route?: string | null;
          status?: string | null;
          unlocked_by_partner_id?: string | null;
          updated_at?: string;
          venue_address?: string | null;
        };
        Update: {
          budget_range?: string | null;
          city?: string;
          created_at?: string;
          customer_id?: string | null;
          email?: string;
          event_date?: string;
          event_type?: string;
          guest_count?: number | null;
          id?: string;
          lead_visibility_status?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          source_channel?: string | null;
          source_route?: string | null;
          status?: string | null;
          unlocked_by_partner_id?: string | null;
          updated_at?: string;
          venue_address?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "service_leads_unlocked_by_partner_id_fkey";
            columns: ["unlocked_by_partner_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: GeneratedDatabase["public"]["Views"];
    Functions: GeneratedDatabase["public"]["Functions"];
    Enums: GeneratedDatabase["public"]["Enums"];
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"];
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
