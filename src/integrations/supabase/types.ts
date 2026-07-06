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
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _archive_availability: {
        Row: {
          _archived_at: string | null
          available_date: string | null
          caterer_id: string | null
          created_at: string | null
          id: string | null
          is_available: boolean | null
          note: string | null
          updated_at: string | null
        }
        Insert: {
          _archived_at?: string | null
          available_date?: string | null
          caterer_id?: string | null
          created_at?: string | null
          id?: string | null
          is_available?: boolean | null
          note?: string | null
          updated_at?: string | null
        }
        Update: {
          _archived_at?: string | null
          available_date?: string | null
          caterer_id?: string | null
          created_at?: string | null
          id?: string | null
          is_available?: boolean | null
          note?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      _archive_event_request_matches: {
        Row: {
          _archived_at: string | null
          caterer_id: string | null
          created_at: string | null
          event_request_id: string | null
          id: string | null
          match_reasons: Json | null
          match_score: number | null
        }
        Insert: {
          _archived_at?: string | null
          caterer_id?: string | null
          created_at?: string | null
          event_request_id?: string | null
          id?: string | null
          match_reasons?: Json | null
          match_score?: number | null
        }
        Update: {
          _archived_at?: string | null
          caterer_id?: string | null
          created_at?: string | null
          event_request_id?: string | null
          id?: string | null
          match_reasons?: Json | null
          match_score?: number | null
        }
        Relationships: []
      }
      _archive_event_requests: {
        Row: {
          _archived_at: string | null
          ai_query: string | null
          budget_per_person: number | null
          budget_total: number | null
          catering_type: string | null
          city: string | null
          created_at: string | null
          cuisine_preferences: string[] | null
          customer_id: string | null
          dietary_requirements: string[] | null
          event_date: string | null
          event_type: string | null
          extra_services: string[] | null
          guest_count: number | null
          id: string | null
          lat: number | null
          lng: number | null
          planning_stage: string | null
          postal_code: string | null
          preferred_caterer_id: string | null
          service_style: string | null
          source: string | null
          special_requests: string | null
          status: string | null
          storefront_slug: string | null
          updated_at: string | null
          venue_type: string | null
        }
        Insert: {
          _archived_at?: string | null
          ai_query?: string | null
          budget_per_person?: number | null
          budget_total?: number | null
          catering_type?: string | null
          city?: string | null
          created_at?: string | null
          cuisine_preferences?: string[] | null
          customer_id?: string | null
          dietary_requirements?: string[] | null
          event_date?: string | null
          event_type?: string | null
          extra_services?: string[] | null
          guest_count?: number | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          planning_stage?: string | null
          postal_code?: string | null
          preferred_caterer_id?: string | null
          service_style?: string | null
          source?: string | null
          special_requests?: string | null
          status?: string | null
          storefront_slug?: string | null
          updated_at?: string | null
          venue_type?: string | null
        }
        Update: {
          _archived_at?: string | null
          ai_query?: string | null
          budget_per_person?: number | null
          budget_total?: number | null
          catering_type?: string | null
          city?: string | null
          created_at?: string | null
          cuisine_preferences?: string[] | null
          customer_id?: string | null
          dietary_requirements?: string[] | null
          event_date?: string | null
          event_type?: string | null
          extra_services?: string[] | null
          guest_count?: number | null
          id?: string | null
          lat?: number | null
          lng?: number | null
          planning_stage?: string | null
          postal_code?: string | null
          preferred_caterer_id?: string | null
          service_style?: string | null
          source?: string | null
          special_requests?: string | null
          status?: string | null
          storefront_slug?: string | null
          updated_at?: string | null
          venue_type?: string | null
        }
        Relationships: []
      }
      _archive_order_items: {
        Row: {
          _archived_at: string | null
          created_at: string | null
          id: string | null
          modifiers: Json | null
          notes: string | null
          order_id: string | null
          product_id: string | null
          product_name: string | null
          quantity: number | null
          total_price: number | null
          unit_price: number | null
        }
        Insert: {
          _archived_at?: string | null
          created_at?: string | null
          id?: string | null
          modifiers?: Json | null
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number | null
          total_price?: number | null
          unit_price?: number | null
        }
        Update: {
          _archived_at?: string | null
          created_at?: string | null
          id?: string | null
          modifiers?: Json | null
          notes?: string | null
          order_id?: string | null
          product_id?: string | null
          product_name?: string | null
          quantity?: number | null
          total_price?: number | null
          unit_price?: number | null
        }
        Relationships: []
      }
      _archive_orders: {
        Row: {
          _archived_at: string | null
          caterer_id: string | null
          created_at: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_city: string | null
          delivery_fee: number | null
          delivery_postal_code: string | null
          fulfillment_type: string | null
          id: string | null
          notes: string | null
          order_type: string | null
          payment_status: string | null
          platform_fee_amount: number | null
          platform_fee_rate: number | null
          requested_time: string | null
          source: string | null
          status: string | null
          subtotal: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          _archived_at?: string | null
          caterer_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_fee?: number | null
          delivery_postal_code?: string | null
          fulfillment_type?: string | null
          id?: string | null
          notes?: string | null
          order_type?: string | null
          payment_status?: string | null
          platform_fee_amount?: number | null
          platform_fee_rate?: number | null
          requested_time?: string | null
          source?: string | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          _archived_at?: string | null
          caterer_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_fee?: number | null
          delivery_postal_code?: string | null
          fulfillment_type?: string | null
          id?: string | null
          notes?: string | null
          order_type?: string | null
          payment_status?: string | null
          platform_fee_amount?: number | null
          platform_fee_rate?: number | null
          requested_time?: string | null
          source?: string | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      _archive_packages: {
        Row: {
          _archived_at: string | null
          add_ons: string[] | null
          booking_notice_days: number | null
          cancellation_policy: string | null
          category: string | null
          caterer_id: string | null
          cleanup_time_minutes: number | null
          cover_image_url: string | null
          created_at: string | null
          cuisine_type: string | null
          currency: string | null
          deposit_percentage: number | null
          description: string | null
          dietary_options: string[] | null
          duration_hours: number | null
          event_type: string | null
          event_types: string[] | null
          featured: boolean | null
          gallery_images: string[] | null
          id: string | null
          image_url: string | null
          images: string[] | null
          included_items: string[] | null
          includes: string[] | null
          is_active: boolean | null
          is_published: boolean | null
          keywords: string[] | null
          location: string | null
          max_bookings_per_day: number | null
          max_guests: number | null
          min_guests: number | null
          price_amount: number | null
          price_type: string | null
          service_area: string[] | null
          setup_time_hours: number | null
          setup_time_minutes: number | null
          short_summary: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          _archived_at?: string | null
          add_ons?: string[] | null
          booking_notice_days?: number | null
          cancellation_policy?: string | null
          category?: string | null
          caterer_id?: string | null
          cleanup_time_minutes?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          cuisine_type?: string | null
          currency?: string | null
          deposit_percentage?: number | null
          description?: string | null
          dietary_options?: string[] | null
          duration_hours?: number | null
          event_type?: string | null
          event_types?: string[] | null
          featured?: boolean | null
          gallery_images?: string[] | null
          id?: string | null
          image_url?: string | null
          images?: string[] | null
          included_items?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          is_published?: boolean | null
          keywords?: string[] | null
          location?: string | null
          max_bookings_per_day?: number | null
          max_guests?: number | null
          min_guests?: number | null
          price_amount?: number | null
          price_type?: string | null
          service_area?: string[] | null
          setup_time_hours?: number | null
          setup_time_minutes?: number | null
          short_summary?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          _archived_at?: string | null
          add_ons?: string[] | null
          booking_notice_days?: number | null
          cancellation_policy?: string | null
          category?: string | null
          caterer_id?: string | null
          cleanup_time_minutes?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          cuisine_type?: string | null
          currency?: string | null
          deposit_percentage?: number | null
          description?: string | null
          dietary_options?: string[] | null
          duration_hours?: number | null
          event_type?: string | null
          event_types?: string[] | null
          featured?: boolean | null
          gallery_images?: string[] | null
          id?: string | null
          image_url?: string | null
          images?: string[] | null
          included_items?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          is_published?: boolean | null
          keywords?: string[] | null
          location?: string | null
          max_bookings_per_day?: number | null
          max_guests?: number | null
          min_guests?: number | null
          price_amount?: number | null
          price_type?: string | null
          service_area?: string[] | null
          setup_time_hours?: number | null
          setup_time_minutes?: number | null
          short_summary?: string | null
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      brief_messages: {
        Row: {
          brief_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          brief_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          brief_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brief_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      caterer_menu_items: {
        Row: {
          category: string
          caterer_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          price_cents: number
          serves: number
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          caterer_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          price_cents?: number
          serves?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          caterer_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          price_cents?: number
          serves?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "caterer_menu_items_caterer_id_fkey"
            columns: ["caterer_id"]
            isOneToOne: false
            referencedRelation: "caterers"
            referencedColumns: ["id"]
          },
        ]
      }
      caterer_reviews: {
        Row: {
          booking_id: string | null
          caterer_id: string
          comment: string
          communication_rating: number
          created_at: string | null
          customer_id: string | null
          food_rating: number
          id: string
          overall_rating: number
          reliability_rating: number
          status: Database["public"]["Enums"]["review_status"]
          value_rating: number
          vendor_reply: string | null
        }
        Insert: {
          booking_id?: string | null
          caterer_id: string
          comment: string
          communication_rating: number
          created_at?: string | null
          customer_id?: string | null
          food_rating: number
          id?: string
          overall_rating: number
          reliability_rating: number
          status?: Database["public"]["Enums"]["review_status"]
          value_rating: number
          vendor_reply?: string | null
        }
        Update: {
          booking_id?: string | null
          caterer_id?: string
          comment?: string
          communication_rating?: number
          created_at?: string | null
          customer_id?: string | null
          food_rating?: number
          id?: string
          overall_rating?: number
          reliability_rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          value_rating?: number
          vendor_reply?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caterer_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "catering_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caterer_reviews_caterer_id_fkey"
            columns: ["caterer_id"]
            isOneToOne: false
            referencedRelation: "caterers"
            referencedColumns: ["id"]
          },
        ]
      }
      caterers: {
        Row: {
          announcement_active: boolean
          announcement_bg_color: string | null
          announcement_text: string | null
          banner_image_url: string | null
          business_address: string | null
          certifications: string | null
          city: string | null
          created_at: string
          custom_domain: string | null
          delivery_fee_cents: number | null
          description: string | null
          id: string
          logo_url: string | null
          max_delivery_distance_km: number | null
          min_delivery_cents: number | null
          name: string
          owner_id: string
          phone: string | null
          postal_code: string | null
          service_areas: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          banner_image_url?: string | null
          business_address?: string | null
          certifications?: string | null
          city?: string | null
          created_at?: string
          custom_domain?: string | null
          delivery_fee_cents?: number | null
          description?: string | null
          id?: string
          logo_url?: string | null
          max_delivery_distance_km?: number | null
          min_delivery_cents?: number | null
          name: string
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          service_areas?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          banner_image_url?: string | null
          business_address?: string | null
          certifications?: string | null
          city?: string | null
          created_at?: string
          custom_domain?: string | null
          delivery_fee_cents?: number | null
          description?: string | null
          id?: string
          logo_url?: string | null
          max_delivery_distance_km?: number | null
          min_delivery_cents?: number | null
          name?: string
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          service_areas?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      catering_bookings: {
        Row: {
          booking_status: string
          brief_id: string | null
          cancellation_by: string | null
          cancellation_reason: string | null
          caterer_id: string
          created_at: string
          currency: string
          customer_id: string
          deposit_amount: number
          deposit_paid_at: string | null
          deposit_refunded_at: string | null
          event_date: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          location: string | null
          quoted_amount: number
          updated_at: string
        }
        Insert: {
          booking_status?: string
          brief_id?: string | null
          cancellation_by?: string | null
          cancellation_reason?: string | null
          caterer_id: string
          created_at?: string
          currency?: string
          customer_id: string
          deposit_amount: number
          deposit_paid_at?: string | null
          deposit_refunded_at?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          location?: string | null
          quoted_amount: number
          updated_at?: string
        }
        Update: {
          booking_status?: string
          brief_id?: string | null
          cancellation_by?: string | null
          cancellation_reason?: string | null
          caterer_id?: string
          created_at?: string
          currency?: string
          customer_id?: string
          deposit_amount?: number
          deposit_paid_at?: string | null
          deposit_refunded_at?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          location?: string | null
          quoted_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catering_bookings_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "catering_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catering_bookings_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "planner_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catering_bookings_caterer_id_fkey"
            columns: ["caterer_id"]
            isOneToOne: false
            referencedRelation: "caterers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catering_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      catering_briefs: {
        Row: {
          budget_cents: number | null
          caterer_slug: string | null
          company_name: string | null
          contract_end_date: string | null
          contract_length_months: number | null
          created_at: string
          customer_id: string
          deposit_cents: number | null
          event_date: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          is_b2b: boolean | null
          is_recurring: boolean | null
          location: string | null
          milestones: Json | null
          notes: string | null
          planner_slug: string | null
          preferred_caterer_id: string | null
          preferred_planner_id: string | null
          proposal_cents: number | null
          proposal_notes: string | null
          recurrence_pattern: string | null
          recurring_schedule: string | null
          status: Database["public"]["Enums"]["brief_status"]
          updated_at: string
        }
        Insert: {
          budget_cents?: number | null
          caterer_slug?: string | null
          company_name?: string | null
          contract_end_date?: string | null
          contract_length_months?: number | null
          created_at?: string
          customer_id: string
          deposit_cents?: number | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          is_b2b?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          milestones?: Json | null
          notes?: string | null
          planner_slug?: string | null
          preferred_caterer_id?: string | null
          preferred_planner_id?: string | null
          proposal_cents?: number | null
          proposal_notes?: string | null
          recurrence_pattern?: string | null
          recurring_schedule?: string | null
          status?: Database["public"]["Enums"]["brief_status"]
          updated_at?: string
        }
        Update: {
          budget_cents?: number | null
          caterer_slug?: string | null
          company_name?: string | null
          contract_end_date?: string | null
          contract_length_months?: number | null
          created_at?: string
          customer_id?: string
          deposit_cents?: number | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          is_b2b?: boolean | null
          is_recurring?: boolean | null
          location?: string | null
          milestones?: Json | null
          notes?: string | null
          planner_slug?: string | null
          preferred_caterer_id?: string | null
          preferred_planner_id?: string | null
          proposal_cents?: number | null
          proposal_notes?: string | null
          recurrence_pattern?: string | null
          recurring_schedule?: string | null
          status?: Database["public"]["Enums"]["brief_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catering_briefs_preferred_caterer_id_fkey"
            columns: ["preferred_caterer_id"]
            isOneToOne: false
            referencedRelation: "caterers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catering_briefs_preferred_planner_id_fkey"
            columns: ["preferred_planner_id"]
            isOneToOne: false
            referencedRelation: "planners"
            referencedColumns: ["id"]
          },
        ]
      }
      catering_matches: {
        Row: {
          brief_id: string
          caterer_id: string
          created_at: string
          id: string
          match_reasons: string[]
          match_score: number
          product_id: string | null
          status: string
          warnings: string[]
        }
        Insert: {
          brief_id: string
          caterer_id: string
          created_at?: string
          id?: string
          match_reasons?: string[]
          match_score?: number
          product_id?: string | null
          status?: string
          warnings?: string[]
        }
        Update: {
          brief_id?: string
          caterer_id?: string
          created_at?: string
          id?: string
          match_reasons?: string[]
          match_score?: number
          product_id?: string | null
          status?: string
          warnings?: string[]
        }
        Relationships: []
      }
      catering_packages: {
        Row: {
          add_ons: string[] | null
          booking_notice_days: number | null
          cancellation_policy: string | null
          category: string | null
          caterer_id: string
          cleanup_time_minutes: number | null
          cover_image_url: string | null
          created_at: string
          cuisine_type: string | null
          currency: string
          deposit_percentage: number | null
          description: string | null
          dietary_options: string[] | null
          duration_hours: number | null
          event_type: string | null
          event_types: string[] | null
          featured: boolean
          gallery_images: string[] | null
          id: string
          image_url: string | null
          images: string[] | null
          included_items: string[] | null
          includes: string[] | null
          is_active: boolean
          is_published: boolean
          keywords: string[] | null
          location: string | null
          max_bookings_per_day: number | null
          max_guests: number | null
          min_guests: number | null
          price_amount: number
          price_type: string
          service_area: string[] | null
          setup_time_hours: number | null
          setup_time_minutes: number | null
          short_summary: string | null
          status: string
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          add_ons?: string[] | null
          booking_notice_days?: number | null
          cancellation_policy?: string | null
          category?: string | null
          caterer_id: string
          cleanup_time_minutes?: number | null
          cover_image_url?: string | null
          created_at?: string
          cuisine_type?: string | null
          currency?: string
          deposit_percentage?: number | null
          description?: string | null
          dietary_options?: string[] | null
          duration_hours?: number | null
          event_type?: string | null
          event_types?: string[] | null
          featured?: boolean
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          included_items?: string[] | null
          includes?: string[] | null
          is_active?: boolean
          is_published?: boolean
          keywords?: string[] | null
          location?: string | null
          max_bookings_per_day?: number | null
          max_guests?: number | null
          min_guests?: number | null
          price_amount?: number
          price_type?: string
          service_area?: string[] | null
          setup_time_hours?: number | null
          setup_time_minutes?: number | null
          short_summary?: string | null
          status?: string
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          add_ons?: string[] | null
          booking_notice_days?: number | null
          cancellation_policy?: string | null
          category?: string | null
          caterer_id?: string
          cleanup_time_minutes?: number | null
          cover_image_url?: string | null
          created_at?: string
          cuisine_type?: string | null
          currency?: string
          deposit_percentage?: number | null
          description?: string | null
          dietary_options?: string[] | null
          duration_hours?: number | null
          event_type?: string | null
          event_types?: string[] | null
          featured?: boolean
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          included_items?: string[] | null
          includes?: string[] | null
          is_active?: boolean
          is_published?: boolean
          keywords?: string[] | null
          location?: string | null
          max_bookings_per_day?: number | null
          max_guests?: number | null
          min_guests?: number | null
          price_amount?: number
          price_type?: string
          service_area?: string[] | null
          setup_time_hours?: number | null
          setup_time_minutes?: number | null
          short_summary?: string | null
          status?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "catering_packages_caterer_id_fkey"
            columns: ["caterer_id"]
            isOneToOne: false
            referencedRelation: "caterers"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_logs: {
        Row: {
          action_type: string
          consent_id: string | null
          created_at: string | null
          email: string
          id: string
          metadata: Json | null
          source: string
          source_detail: string | null
        }
        Insert: {
          action_type: string
          consent_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          metadata?: Json | null
          source: string
          source_detail?: string | null
        }
        Update: {
          action_type?: string
          consent_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          metadata?: Json | null
          source?: string
          source_detail?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_logs_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "user_consents"
            referencedColumns: ["id"]
          },
        ]
      }
      event_bookings: {
        Row: {
          booking_status: string
          brief_id: string | null
          cancellation_by: string | null
          cancellation_reason: string | null
          created_at: string
          currency: string
          customer_id: string
          deposit_amount: number
          deposit_paid_at: string | null
          deposit_refunded_at: string | null
          event_date: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          location: string | null
          planner_id: string
          quoted_amount: number
          updated_at: string
        }
        Insert: {
          booking_status?: string
          brief_id?: string | null
          cancellation_by?: string | null
          cancellation_reason?: string | null
          created_at?: string
          currency?: string
          customer_id: string
          deposit_amount: number
          deposit_paid_at?: string | null
          deposit_refunded_at?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          location?: string | null
          planner_id: string
          quoted_amount: number
          updated_at?: string
        }
        Update: {
          booking_status?: string
          brief_id?: string | null
          cancellation_by?: string | null
          cancellation_reason?: string | null
          created_at?: string
          currency?: string
          customer_id?: string
          deposit_amount?: number
          deposit_paid_at?: string | null
          deposit_refunded_at?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          location?: string | null
          planner_id?: string
          quoted_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "catering_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "planner_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_planner_id_fkey"
            columns: ["planner_id"]
            isOneToOne: false
            referencedRelation: "planners"
            referencedColumns: ["id"]
          },
        ]
      }
      german_locations: {
        Row: {
          id: string
          lat: number | null
          lng: number | null
          name: string
          postal_code: string | null
          state: string | null
          type: string | null
        }
        Insert: {
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          postal_code?: string | null
          state?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          postal_code?: string | null
          state?: string | null
          type?: string | null
        }
        Relationships: []
      }
      partner_profiles: {
        Row: {
          business_address: string
          business_name: string
          contact_person: string
          created_at: string
          email: string
          id: string
          license_number: string
          partner_type: Database["public"]["Enums"]["app_role"]
          phone: string
          service_area: string
          service_city: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_address: string
          business_name: string
          contact_person: string
          created_at?: string
          email: string
          id?: string
          license_number: string
          partner_type: Database["public"]["Enums"]["app_role"]
          phone: string
          service_area: string
          service_city: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_address?: string
          business_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          license_number?: string
          partner_type?: Database["public"]["Enums"]["app_role"]
          phone?: string
          service_area?: string
          service_city?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_total: number
          booking_id: string
          catering_booking_id: string | null
          created_at: string
          currency: string
          event_booking_id: string | null
          id: string
          platform_fee_amount: number
          refund_reason: string | null
          status: string
          stripe_payment_intent_id: string
          updated_at: string
        }
        Insert: {
          amount_total: number
          booking_id: string
          catering_booking_id?: string | null
          created_at?: string
          currency?: string
          event_booking_id?: string | null
          id?: string
          platform_fee_amount: number
          refund_reason?: string | null
          status: string
          stripe_payment_intent_id: string
          updated_at?: string
        }
        Update: {
          amount_total?: number
          booking_id?: string
          catering_booking_id?: string | null
          created_at?: string
          currency?: string
          event_booking_id?: string | null
          id?: string
          platform_fee_amount?: number
          refund_reason?: string | null
          status?: string
          stripe_payment_intent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_catering_booking_id_fkey"
            columns: ["catering_booking_id"]
            isOneToOne: false
            referencedRelation: "catering_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_event_booking_id_fkey"
            columns: ["event_booking_id"]
            isOneToOne: false
            referencedRelation: "event_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_reviews: {
        Row: {
          booking_id: string | null
          comment: string
          communication_rating: number
          created_at: string | null
          creativity_rating: number
          customer_id: string | null
          execution_rating: number
          id: string
          overall_rating: number
          planner_id: string
          status: Database["public"]["Enums"]["review_status"]
          value_rating: number
          vendor_reply: string | null
        }
        Insert: {
          booking_id?: string | null
          comment: string
          communication_rating: number
          created_at?: string | null
          creativity_rating: number
          customer_id?: string | null
          execution_rating: number
          id?: string
          overall_rating: number
          planner_id: string
          status?: Database["public"]["Enums"]["review_status"]
          value_rating: number
          vendor_reply?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string
          communication_rating?: number
          created_at?: string | null
          creativity_rating?: number
          customer_id?: string | null
          execution_rating?: number
          id?: string
          overall_rating?: number
          planner_id?: string
          status?: Database["public"]["Enums"]["review_status"]
          value_rating?: number
          vendor_reply?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planner_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "event_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planner_reviews_planner_id_fkey"
            columns: ["planner_id"]
            isOneToOne: false
            referencedRelation: "planners"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          planner_id: string
          starting_price_cents: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          planner_id: string
          starting_price_cents?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          planner_id?: string
          starting_price_cents?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planner_services_planner_id_fkey"
            columns: ["planner_id"]
            isOneToOne: false
            referencedRelation: "planners"
            referencedColumns: ["id"]
          },
        ]
      }
      planners: {
        Row: {
          announcement_active: boolean
          announcement_bg_color: string | null
          announcement_text: string | null
          banner_image_url: string | null
          business_address: string | null
          city: string | null
          created_at: string
          custom_domain: string | null
          delivery_fee_cents: number | null
          description: string | null
          id: string
          logo_url: string | null
          max_delivery_distance_km: number | null
          min_delivery_cents: number | null
          name: string
          owner_id: string
          phone: string | null
          postal_code: string | null
          service_areas: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          banner_image_url?: string | null
          business_address?: string | null
          city?: string | null
          created_at?: string
          custom_domain?: string | null
          delivery_fee_cents?: number | null
          description?: string | null
          id?: string
          logo_url?: string | null
          max_delivery_distance_km?: number | null
          min_delivery_cents?: number | null
          name: string
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          service_areas?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          banner_image_url?: string | null
          business_address?: string | null
          city?: string | null
          created_at?: string
          custom_domain?: string | null
          delivery_fee_cents?: number | null
          description?: string | null
          id?: string
          logo_url?: string | null
          max_delivery_distance_km?: number | null
          min_delivery_cents?: number | null
          name?: string
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          service_areas?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          language: string
          last_name: string | null
          phone: string | null
          phone_verified: boolean
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          language?: string
          last_name?: string | null
          phone?: string | null
          phone_verified?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          language?: string
          last_name?: string | null
          phone?: string | null
          phone_verified?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          applies_to_product_name: string | null
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          ends_at: string | null
          free_item_name: string | null
          id: string
          is_active: boolean
          min_order_value_cents: number | null
          owner_id: string
          required_qty: number | null
          starts_at: string | null
        }
        Insert: {
          applies_to_product_name?: string | null
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          ends_at?: string | null
          free_item_name?: string | null
          id?: string
          is_active?: boolean
          min_order_value_cents?: number | null
          owner_id: string
          required_qty?: number | null
          starts_at?: string | null
        }
        Update: {
          applies_to_product_name?: string | null
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          free_item_name?: string | null
          id?: string
          is_active?: boolean
          min_order_value_cents?: number | null
          owner_id?: string
          required_qty?: number | null
          starts_at?: string | null
        }
        Relationships: []
      }
      restaurant_orders: {
        Row: {
          applied_promo_code: string | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          id: string
          items: Json
          notes: string | null
          order_type: string | null
          restaurant_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_cents: number
          updated_at: string
        }
        Insert: {
          applied_promo_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_type?: string | null
          restaurant_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cents?: number
          updated_at?: string
        }
        Update: {
          applied_promo_code?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_type?: string | null
          restaurant_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          price_cents: number
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          price_cents?: number
          restaurant_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          price_cents?: number
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_products_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_id: string | null
          food_quality_rating: number
          id: string
          order_id: string | null
          overall_rating: number
          restaurant_id: string
          speed_rating: number
          status: Database["public"]["Enums"]["review_status"]
          vendor_reply: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          food_quality_rating: number
          id?: string
          order_id?: string | null
          overall_rating: number
          restaurant_id: string
          speed_rating: number
          status?: Database["public"]["Enums"]["review_status"]
          vendor_reply?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          food_quality_rating?: number
          id?: string
          order_id?: string | null
          overall_rating?: number
          restaurant_id?: string
          speed_rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          vendor_reply?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "restaurant_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_stripe_accounts: {
        Row: {
          restaurant_id: string
          stripe_connected_at: string
          stripe_user_id: string
        }
        Insert: {
          restaurant_id: string
          stripe_connected_at?: string
          stripe_user_id: string
        }
        Update: {
          restaurant_id?: string
          stripe_connected_at?: string
          stripe_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_stripe_accounts_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          accepts_cash: boolean
          accepts_delivery: boolean | null
          accepts_paypal: boolean
          accepts_pickup: boolean | null
          announcement_active: boolean
          announcement_bg_color: string | null
          announcement_text: string | null
          banner_image_url: string | null
          billing_cycle_start: string | null
          business_address: string | null
          certifications: string | null
          city: string | null
          created_at: string
          cuisine_type: string | null
          custom_domain: string | null
          delivery_fee: number | null
          delivery_radius_km: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          logo_url: string | null
          min_order_amount: number | null
          name: string
          operating_hours: Json | null
          owner_id: string
          phone: string | null
          plan_name: string | null
          postal_code: string | null
          seat_capacity: number | null
          service_areas: string | null
          slug: string
          stripe_connect_status: string | null
          stripe_connected_at: string | null
          subscription_status: string | null
        }
        Insert: {
          accepts_cash?: boolean
          accepts_delivery?: boolean | null
          accepts_paypal?: boolean
          accepts_pickup?: boolean | null
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          banner_image_url?: string | null
          billing_cycle_start?: string | null
          business_address?: string | null
          certifications?: string | null
          city?: string | null
          created_at?: string
          cuisine_type?: string | null
          custom_domain?: string | null
          delivery_fee?: number | null
          delivery_radius_km?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          logo_url?: string | null
          min_order_amount?: number | null
          name: string
          operating_hours?: Json | null
          owner_id: string
          phone?: string | null
          plan_name?: string | null
          postal_code?: string | null
          seat_capacity?: number | null
          service_areas?: string | null
          slug: string
          stripe_connect_status?: string | null
          stripe_connected_at?: string | null
          subscription_status?: string | null
        }
        Update: {
          accepts_cash?: boolean
          accepts_delivery?: boolean | null
          accepts_paypal?: boolean
          accepts_pickup?: boolean | null
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          banner_image_url?: string | null
          billing_cycle_start?: string | null
          business_address?: string | null
          certifications?: string | null
          city?: string | null
          created_at?: string
          cuisine_type?: string | null
          custom_domain?: string | null
          delivery_fee?: number | null
          delivery_radius_km?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          logo_url?: string | null
          min_order_amount?: number | null
          name?: string
          operating_hours?: Json | null
          owner_id?: string
          phone?: string | null
          plan_name?: string | null
          postal_code?: string | null
          seat_capacity?: number | null
          service_areas?: string | null
          slug?: string
          stripe_connect_status?: string | null
          stripe_connected_at?: string | null
          subscription_status?: string | null
        }
        Relationships: []
      }
      review_invites: {
        Row: {
          consumed_at: string | null
          created_at: string | null
          customer_email: string
          expires_at: string
          id: string
          reference_id: string
          role: Database["public"]["Enums"]["review_role"]
          token: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string | null
          customer_email: string
          expires_at: string
          id?: string
          reference_id: string
          role: Database["public"]["Enums"]["review_role"]
          token: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string | null
          customer_email?: string
          expires_at?: string
          id?: string
          reference_id?: string
          role?: Database["public"]["Enums"]["review_role"]
          token?: string
        }
        Relationships: []
      }
      saved_caterers: {
        Row: {
          caterer_id: string
          created_at: string
          customer_id: string
          id: string
        }
        Insert: {
          caterer_id: string
          created_at?: string
          customer_id: string
          id?: string
        }
        Update: {
          caterer_id?: string
          created_at?: string
          customer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_caterers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_content_pages: {
        Row: {
          content: string | null
          created_at: string
          cta_text: string | null
          id: string
          internal_links: Json | null
          last_edited_by: string | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          sitemap_indexed: boolean | null
          slug: string | null
          status: Database["public"]["Enums"]["seo_content_status"] | null
          target_keyword: string
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          cta_text?: string | null
          id?: string
          internal_links?: Json | null
          last_edited_by?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          sitemap_indexed?: boolean | null
          slug?: string | null
          status?: Database["public"]["Enums"]["seo_content_status"] | null
          target_keyword: string
          title?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          cta_text?: string | null
          id?: string
          internal_links?: Json | null
          last_edited_by?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          sitemap_indexed?: boolean | null
          slug?: string | null
          status?: Database["public"]["Enums"]["seo_content_status"] | null
          target_keyword?: string
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      storefront_page_views: {
        Row: {
          created_at: string
          id: string
          url_path: string | null
          vendor_id: string
          vendor_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          url_path?: string | null
          vendor_id: string
          vendor_type: string
        }
        Update: {
          created_at?: string
          id?: string
          url_path?: string | null
          vendor_id?: string
          vendor_type?: string
        }
        Relationships: []
      }
      storefront_settings: {
        Row: {
          accepts_delivery: boolean
          accepts_pickup: boolean
          banner_image_url: string | null
          caterer_id: string
          created_at: string
          delivery_fee: number | null
          description: string | null
          estimated_prep_time_minutes: number | null
          id: string
          is_active: boolean
          min_order_amount: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          accepts_delivery?: boolean
          accepts_pickup?: boolean
          banner_image_url?: string | null
          caterer_id: string
          created_at?: string
          delivery_fee?: number | null
          description?: string | null
          estimated_prep_time_minutes?: number | null
          id?: string
          is_active?: boolean
          min_order_amount?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          accepts_delivery?: boolean
          accepts_pickup?: boolean
          banner_image_url?: string | null
          caterer_id?: string
          created_at?: string
          delivery_fee?: number | null
          description?: string | null
          estimated_prep_time_minutes?: number | null
          id?: string
          is_active?: boolean
          min_order_amount?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      stripe_webhook_events: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          processed_at: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id: string
          metadata?: Json | null
          processed_at?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          processed_at?: string | null
          type?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          restaurant_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan: string
          restaurant_id?: string | null
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          restaurant_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      table_reservations: {
        Row: {
          created_at: string
          customer_id: string | null
          first_name: string
          guest_count: number
          id: string
          last_name: string
          notes: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          first_name: string
          guest_count: number
          id?: string
          last_name: string
          notes?: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          first_name?: string
          guest_count?: number
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string
          reservation_date?: string
          reservation_time?: string
          restaurant_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          audience_type: string
          created_at: string | null
          double_opt_in_confirmed: boolean | null
          double_opt_in_token: string | null
          email: string
          id: string
          locale: string | null
          marketing_opt_in: boolean | null
          marketing_unsubscribed_at: string | null
          pref_interests: string[] | null
          pref_language: string | null
          source_detail: string | null
          terms_acknowledged: boolean | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audience_type: string
          created_at?: string | null
          double_opt_in_confirmed?: boolean | null
          double_opt_in_token?: string | null
          email: string
          id?: string
          locale?: string | null
          marketing_opt_in?: boolean | null
          marketing_unsubscribed_at?: string | null
          pref_interests?: string[] | null
          pref_language?: string | null
          source_detail?: string | null
          terms_acknowledged?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audience_type?: string
          created_at?: string | null
          double_opt_in_confirmed?: boolean | null
          double_opt_in_token?: string | null
          email?: string
          id?: string
          locale?: string | null
          marketing_opt_in?: boolean | null
          marketing_unsubscribed_at?: string | null
          pref_interests?: string[] | null
          pref_language?: string | null
          source_detail?: string | null
          terms_acknowledged?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_blackout_dates: {
        Row: {
          blackout_date: string
          created_at: string
          id: string
          vendor_id: string
          vendor_type: string
        }
        Insert: {
          blackout_date: string
          created_at?: string
          id?: string
          vendor_id: string
          vendor_type: string
        }
        Update: {
          blackout_date?: string
          created_at?: string
          id?: string
          vendor_id?: string
          vendor_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      planner_requests: {
        Row: {
          budget_cents: number | null
          created_at: string | null
          customer_id: string | null
          id: string | null
          planner_id: string | null
          preferred_planner_id: string | null
          status: Database["public"]["Enums"]["brief_status"] | null
        }
        Insert: {
          budget_cents?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string | null
          planner_id?: string | null
          preferred_planner_id?: string | null
          status?: Database["public"]["Enums"]["brief_status"] | null
        }
        Update: {
          budget_cents?: number | null
          created_at?: string | null
          customer_id?: string | null
          id?: string | null
          planner_id?: string | null
          preferred_planner_id?: string | null
          status?: Database["public"]["Enums"]["brief_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "catering_briefs_preferred_planner_id_fkey"
            columns: ["planner_id"]
            isOneToOne: false
            referencedRelation: "planners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catering_briefs_preferred_planner_id_fkey"
            columns: ["preferred_planner_id"]
            isOneToOne: false
            referencedRelation: "planners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "customer"
        | "restaurant_owner"
        | "caterer"
        | "planner"
        | "admin"
      brief_status:
        | "draft"
        | "needs_more_info"
        | "ready_for_matching"
        | "matched"
        | "quote_requested"
        | "booked"
        | "submitted"
        | "reviewing"
        | "quoted"
        | "accepted"
        | "declined"
        | "cancelled"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "picked_up"
        | "delivered"
        | "cancelled"
      review_role: "restaurant" | "caterer" | "planner"
      review_status: "pending_moderation" | "published" | "flagged" | "hidden"
      seo_content_status:
        | "draft"
        | "in_review"
        | "approved"
        | "published"
        | "rejected"
        | "archived"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["customer", "restaurant_owner", "caterer", "planner", "admin"],
      brief_status: [
        "draft",
        "needs_more_info",
        "ready_for_matching",
        "matched",
        "quote_requested",
        "booked",
        "submitted",
        "reviewing",
        "quoted",
        "accepted",
        "declined",
        "cancelled",
      ],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      review_role: ["restaurant", "caterer", "planner"],
      review_status: ["pending_moderation", "published", "flagged", "hidden"],
      seo_content_status: [
        "draft",
        "in_review",
        "approved",
        "published",
        "rejected",
        "archived",
      ],
    },
  },
} as const
