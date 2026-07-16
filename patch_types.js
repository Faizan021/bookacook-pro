const fs = require('fs');
let content = fs.readFileSync('src/integrations/supabase/types.ts', 'utf8');

// Insert new tables
const newTables = 
        discovery_pages: {
          Row: {
            canonical_path: string | null
            city_slug: string
            created_at: string | null
            curated_content: string | null
            entity_count: number | null
            faq_md: string | null
            hero_copy: string | null
            id: string
            intro_md: string | null
            is_published: boolean | null
            min_quality_score: number | null
            noindex: boolean | null
            seo_description: string | null
            seo_title: string | null
            updated_at: string | null
            vertical: string
          }
          Insert: {
            canonical_path?: string | null
            city_slug: string
            created_at?: string | null
            curated_content?: string | null
            entity_count?: number | null
            faq_md?: string | null
            hero_copy?: string | null
            id?: string
            intro_md?: string | null
            is_published?: boolean | null
            min_quality_score?: number | null
            noindex?: boolean | null
            seo_description?: string | null
            seo_title?: string | null
            updated_at?: string | null
            vertical: string
          }
          Update: {
            canonical_path?: string | null
            city_slug?: string
            created_at?: string | null
            curated_content?: string | null
            entity_count?: number | null
            faq_md?: string | null
            hero_copy?: string | null
            id?: string
            intro_md?: string | null
            is_published?: boolean | null
            min_quality_score?: number | null
            noindex?: boolean | null
            seo_description?: string | null
            seo_title?: string | null
            updated_at?: string | null
            vertical?: string
          }
          Relationships: []
        }
        restaurant_printers: {
          Row: {
            created_at: string
            id: string
            paper_width: number
            printer_mac: string
            restaurant_id: string | null
            status: string
            updated_at: string
          }
          Insert: {
            created_at?: string
            id?: string
            paper_width?: number
            printer_mac: string
            restaurant_id?: string | null
            status?: string
            updated_at?: string
          }
          Update: {
            created_at?: string
            id?: string
            paper_width?: number
            printer_mac?: string
            restaurant_id?: string | null
            status?: string
            updated_at?: string
          }
          Relationships: [
            {
              foreignKeyName: "restaurant_printers_restaurant_id_fkey"
              columns: ["restaurant_id"]
              isOneToOne: false
              referencedRelation: "restaurants"
              referencedColumns: ["id"]
            }
          ]
        }
        restaurant_print_jobs: {
          Row: {
            created_at: string
            id: string
            order_id: string | null
            print_data: string | null
            printer_mac: string
            restaurant_id: string | null
            status: string
            updated_at: string
          }
          Insert: {
            created_at?: string
            id?: string
            order_id?: string | null
            print_data?: string | null
            printer_mac: string
            restaurant_id?: string | null
            status?: string
            updated_at?: string
          }
          Update: {
            created_at?: string
            id?: string
            order_id?: string | null
            print_data?: string | null
            printer_mac?: string
            restaurant_id?: string | null
            status?: string
            updated_at?: string
          }
          Relationships: []
        }
        service_leads: {
          Row: {
            budget_range: string | null
            city: string
            contact_unlocked_at: string | null
            created_at: string
            customer_id: string | null
            email: string
            event_date: string | null
            event_type: string
            guest_count: number | null
            id: string
            lead_visibility_status: "locked" | "unlocked"
            name: string
            notes: string | null
            phone: string | null
            source_channel: string | null
            source_route: string | null
            status: "new" | "admin_reviewed" | "matched" | "closed"
            unlock_payment_id: string | null
            unlocked_by_partner_id: string | null
            updated_at: string
            venue_address: string | null
          }
          Insert: {
            budget_range?: string | null
            city: string
            contact_unlocked_at?: string | null
            created_at?: string
            customer_id?: string | null
            email: string
            event_date?: string | null
            event_type: string
            guest_count?: number | null
            id?: string
            lead_visibility_status?: "locked" | "unlocked"
            name: string
            notes?: string | null
            phone?: string | null
            source_channel?: string | null
            source_route?: string | null
            status?: "new" | "admin_reviewed" | "matched" | "closed"
            unlock_payment_id?: string | null
            unlocked_by_partner_id?: string | null
            updated_at?: string
            venue_address?: string | null
          }
          Update: {
            budget_range?: string | null
            city?: string
            contact_unlocked_at?: string | null
            created_at?: string
            customer_id?: string | null
            email?: string
            event_date?: string | null
            event_type?: string
            guest_count?: number | null
            id?: string
            lead_visibility_status?: "locked" | "unlocked"
            name?: string
            notes?: string | null
            phone?: string | null
            source_channel?: string | null
            source_route?: string | null
            status?: "new" | "admin_reviewed" | "matched" | "closed"
            unlock_payment_id?: string | null
            unlocked_by_partner_id?: string | null
            updated_at?: string
            venue_address?: string | null
          }
          Relationships: []
        }
;

content = content.replace(/Tables: \{/, 'Tables: {' + newTables);

// Add missing columns to restaurants
content = content.replace(/(restaurants:\s*\{\s*Row:\s*\{.*?)(?=^\s*\}\s*$)/ms, "" + 
            seo_title: string | null
            seo_description: string | null
            show_in_marketplace: boolean | null
            google_analytics_id: string | null
            meta_pixel_id: string | null
            seo_primary_keyword: string | null
            seo_secondary_keywords: string[] | null
            seo_cuisine_target: string | null
            seo_signature_dishes: string[] | null
            seo_local_intro: string | null
            seo_nearby_landmarks: string[] | null
);
content = content.replace(/(restaurants:\s*\{\s*Row:\s*\{.*?\s*\}\s*Insert:\s*\{.*?)(?=^\s*\}\s*$)/ms, "" + 
            seo_title?: string | null
            seo_description?: string | null
            show_in_marketplace?: boolean | null
            google_analytics_id?: string | null
            meta_pixel_id?: string | null
            seo_primary_keyword?: string | null
            seo_secondary_keywords?: string[] | null
            seo_cuisine_target?: string | null
            seo_signature_dishes?: string[] | null
            seo_local_intro?: string | null
            seo_nearby_landmarks?: string[] | null
);
content = content.replace(/(restaurants:\s*\{\s*Row:\s*\{.*?\s*\}\s*Insert:\s*\{.*?\s*\}\s*Update:\s*\{.*?)(?=^\s*\}\s*$)/ms, "" + 
            seo_title?: string | null
            seo_description?: string | null
            show_in_marketplace?: boolean | null
            google_analytics_id?: string | null
            meta_pixel_id?: string | null
            seo_primary_keyword?: string | null
            seo_secondary_keywords?: string[] | null
            seo_cuisine_target?: string | null
            seo_signature_dishes?: string[] | null
            seo_local_intro?: string | null
            seo_nearby_landmarks?: string[] | null
);

fs.writeFileSync('src/integrations/supabase/types.ts', content);
console.log('patched');
