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
      availability: {
        Row: {
          available_date: string
          caterer_id: string
          created_at: string
          id: string
          is_available: boolean
          note: string | null
          updated_at: string
        }
        Insert: {
          available_date: string
          caterer_id: string
          created_at?: string
          id?: string
          is_available?: boolean
          note?: string | null
          updated_at?: string
        }
        Update: {
          available_date?: string
          caterer_id?: string
          created_at?: string
          id?: string
          is_available?: boolean
          note?: string | null
          updated_at?: string
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
      caterers: {
        Row: {
          announcement_active: boolean
          announcement_bg_color: string | null
          announcement_text: string | null
          created_at: string
          custom_domain: string | null
          id: string
          name: string
          owner_id: string
          service_areas: string | null
          slug: string
          updated_at: string
          certifications: string | null
        }
        Insert: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name: string
          owner_id: string
          service_areas?: string | null
          slug: string
          updated_at?: string
          certifications?: string | null
        }
        Update: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name?: string
          owner_id?: string
          service_areas?: string | null
          slug?: string
          updated_at?: string
          certifications?: string | null
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
      event_request_matches: {
        Row: {
          caterer_id: string
          created_at: string
          event_request_id: string
          id: string
          match_reasons: Json
          match_score: number
        }
        Insert: {
          caterer_id: string
          created_at?: string
          event_request_id: string
          id?: string
          match_reasons?: Json
          match_score?: number
        }
        Update: {
          caterer_id?: string
          created_at?: string
          event_request_id?: string
          id?: string
          match_reasons?: Json
          match_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_request_matches_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      event_requests: {
        Row: {
          ai_query: string | null
          budget_per_person: number | null
          budget_total: number | null
          catering_type: string | null
          city: string | null
          created_at: string
          cuisine_preferences: string[] | null
          customer_id: string | null
          dietary_requirements: string[] | null
          event_date: string | null
          event_type: string | null
          extra_services: string[] | null
          guest_count: number | null
          id: string
          lat: number | null
          lng: number | null
          planning_stage: string | null
          postal_code: string | null
          preferred_caterer_id: string | null
          service_style: string | null
          source: string
          special_requests: string | null
          status: string
          storefront_slug: string | null
          updated_at: string
          venue_type: string | null
        }
        Insert: {
          ai_query?: string | null
          budget_per_person?: number | null
          budget_total?: number | null
          catering_type?: string | null
          city?: string | null
          created_at?: string
          cuisine_preferences?: string[] | null
          customer_id?: string | null
          dietary_requirements?: string[] | null
          event_date?: string | null
          event_type?: string | null
          extra_services?: string[] | null
          guest_count?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          planning_stage?: string | null
          postal_code?: string | null
          preferred_caterer_id?: string | null
          service_style?: string | null
          source?: string
          special_requests?: string | null
          status?: string
          storefront_slug?: string | null
          updated_at?: string
          venue_type?: string | null
        }
        Update: {
          ai_query?: string | null
          budget_per_person?: number | null
          budget_total?: number | null
          catering_type?: string | null
          city?: string | null
          created_at?: string
          cuisine_preferences?: string[] | null
          customer_id?: string | null
          dietary_requirements?: string[] | null
          event_date?: string | null
          event_type?: string | null
          extra_services?: string[] | null
          guest_count?: number | null
          id?: string
          lat?: number | null
          lng?: number | null
          planning_stage?: string | null
          postal_code?: string | null
          preferred_caterer_id?: string | null
          service_style?: string | null
          source?: string
          special_requests?: string | null
          status?: string
          storefront_slug?: string | null
          updated_at?: string
          venue_type?: string | null
        }
        Relationships: []
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
      messages: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          is_read: boolean
          message_text: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_text: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_text?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          modifiers: Json
          notes: string | null
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          modifiers?: Json
          notes?: string | null
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          modifiers?: Json
          notes?: string | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          caterer_id: string
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_city: string | null
          delivery_fee: number
          delivery_postal_code: string | null
          fulfillment_type: string
          id: string
          notes: string | null
          order_type: string
          payment_status: string
          platform_fee_amount: number
          platform_fee_rate: number
          requested_time: string | null
          source: string
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          caterer_id: string
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_fee?: number
          delivery_postal_code?: string | null
          fulfillment_type?: string
          id?: string
          notes?: string | null
          order_type?: string
          payment_status?: string
          platform_fee_amount?: number
          platform_fee_rate?: number
          requested_time?: string | null
          source?: string
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          caterer_id?: string
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_fee?: number
          delivery_postal_code?: string | null
          fulfillment_type?: string
          id?: string
          notes?: string | null
          order_type?: string
          payment_status?: string
          platform_fee_amount?: number
          platform_fee_rate?: number
          requested_time?: string | null
          source?: string
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
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
          featured: boolean | null
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
          status: string | null
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
          featured?: boolean | null
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
          price_amount: number
          price_type?: string
          service_area?: string[] | null
          setup_time_hours?: number | null
          setup_time_minutes?: number | null
          short_summary?: string | null
          status?: string | null
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
          featured?: boolean | null
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
          status?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
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
          created_at: string
          custom_domain: string | null
          id: string
          name: string
          owner_id: string
          service_areas: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name: string
          owner_id: string
          service_areas?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name?: string
          owner_id?: string
          service_areas?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          caterer_id: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          caterer_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          caterer_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          allergen_info: string | null
          category_id: string
          caterer_id: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          preparation_time_minutes: number | null
          price: number
          service_type: string
          updated_at: string
        }
        Insert: {
          allergen_info?: string | null
          category_id: string
          caterer_id: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          preparation_time_minutes?: number | null
          price: number
          service_type?: string
          updated_at?: string
        }
        Update: {
          allergen_info?: string | null
          category_id?: string
          caterer_id?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          preparation_time_minutes?: number | null
          price?: number
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
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
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          owner_id: string
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          owner_id: string
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          owner_id?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          product_id: string | null
          quantity: number
          quote_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          product_id?: string | null
          quantity?: number
          quote_id: string
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          product_id?: string | null
          quantity?: number
          quote_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          brief_id: string | null
          caterer_id: string
          created_at: string
          customer_id: string | null
          delivery_fee: number
          description: string | null
          id: string
          pdf_url: string | null
          platform_fee_amount: number
          platform_fee_rate: number
          service_fee: number
          source: string
          status: string
          subtotal: number
          title: string | null
          total_amount: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          brief_id?: string | null
          caterer_id: string
          created_at?: string
          customer_id?: string | null
          delivery_fee?: number
          description?: string | null
          id?: string
          pdf_url?: string | null
          platform_fee_amount?: number
          platform_fee_rate?: number
          service_fee?: number
          source?: string
          status?: string
          subtotal?: number
          title?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          brief_id?: string | null
          caterer_id?: string
          created_at?: string
          customer_id?: string | null
          delivery_fee?: number
          description?: string | null
          id?: string
          pdf_url?: string | null
          platform_fee_amount?: number
          platform_fee_rate?: number
          service_fee?: number
          source?: string
          status?: string
          subtotal?: number
          title?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      restaurant_orders: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string | null
          id: string
          items: Json
          notes: string | null
          restaurant_id: string
          status: Database["public"]["Enums"]["order_status"]
          total_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          items?: Json
          notes?: string | null
          restaurant_id: string
          status?: Database["public"]["Enums"]["order_status"]
          total_cents?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          items?: Json
          notes?: string | null
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
      restaurants: {
        Row: {
          announcement_active: boolean
          announcement_bg_color: string | null
          announcement_text: string | null
          billing_cycle_start: string | null
          created_at: string
          custom_domain: string | null
          id: string
          is_published: boolean | null
          name: string
          operating_hours: Json | null
          owner_id: string
          plan_name: string | null
          service_areas: string | null
          slug: string
          stripe_connect_status: string | null
          stripe_connected_at: string | null
          stripe_user_id: string | null
          subscription_status: string | null
          certifications: string | null
          paypal_email: string | null
          accepts_cash: boolean
          accepts_paypal: boolean
        }
        Insert: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          billing_cycle_start?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          operating_hours?: Json | null
          owner_id: string
          plan_name?: string | null
          service_areas?: string | null
          slug: string
          stripe_connect_status?: string | null
          stripe_connected_at?: string | null
          stripe_user_id?: string | null
          subscription_status?: string | null
          certifications?: string | null
          paypal_email?: string | null
          accepts_cash?: boolean
          accepts_paypal?: boolean
        }
        Update: {
          announcement_active?: boolean
          announcement_bg_color?: string | null
          announcement_text?: string | null
          billing_cycle_start?: string | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
          operating_hours?: Json | null
          owner_id?: string
          plan_name?: string | null
          service_areas?: string | null
          slug?: string
          stripe_connect_status?: string | null
          stripe_connected_at?: string | null
          stripe_user_id?: string | null
          subscription_status?: string | null
          certifications?: string | null
          paypal_email?: string | null
          accepts_cash?: boolean
          accepts_paypal?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          caterer_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          rating: number
          reviewed_at: string
        }
        Insert: {
          booking_id: string
          caterer_id: string
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          rating: number
          reviewed_at?: string
        }
        Update: {
          booking_id?: string
          caterer_id?: string
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          rating?: number
          reviewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "customer" | "restaurant_owner" | "caterer" | "planner"
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
      app_role: ["customer", "restaurant_owner", "caterer", "planner"],
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
    },
  },
} as const
