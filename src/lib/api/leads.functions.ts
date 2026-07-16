import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "../../integrations/supabase/client.server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@speisely.com";

const leadSchema = z.object({
  // Step 1: Event Details
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.number().min(1, "Guest count is required"),
  
  // Step 2: Location & Budget
  city: z.string().min(1, "City is required"),
  venueAddress: z.string().optional(),
  budgetRange: z.string().optional(),
  
  // Step 3: Contact
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  notes: z.string().optional(),
  
  // Tracking
  sourceRoute: z.string().optional(),
  sourceChannel: z.string().optional(),
  
  // Anti-abuse Honeypot
  honeypot: z.string().max(0, "Invalid submission").optional(),
});

export const submitLeadCapture = createServerFn({ method: "POST" })
  .inputValidator(leadSchema)
  .handler(async ({ data }) => {
    // 1. Anti-abuse validation
    if (data.honeypot && data.honeypot.length > 0) {
      // Silently accept honeypot submissions to fool bots
      return { success: true };
    }

    const today = new Date().toISOString().split("T")[0];
    if (data.eventDate < today) {
      throw new Error("Event date cannot be in the past.");
    }

    // 2. Save to database using Admin client (since guests are unauthenticated)
    const supabase = supabaseAdmin;
    
    const { data: leadData, error } = await supabase
      .from("service_leads")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        event_type: data.eventType,
        event_date: data.eventDate,
        guest_count: data.guestCount,
        budget_range: data.budgetRange,
        venue_address: data.venueAddress,
        notes: data.notes,
        source_route: data.sourceRoute,
        source_channel: data.sourceChannel,
        status: "new",
        lead_visibility_status: "locked",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[submitLeadCapture] Database Error:", error);
      throw new Error("Failed to save lead.");
    }

    // 3. Fallback Admin Email Notification
    if (resend) {
      try {
        await resend.emails.send({
          from: "Speisely Leads <leads@speisely.com>", // Replace with a verified domain
          to: ADMIN_EMAIL,
          subject: `New Lead: ${data.eventType} in ${data.city}`,
          text: `
New lead received!

Contact:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "N/A"}

Event Details:
City: ${data.city}
Event Type: ${data.eventType}
Date: ${data.eventDate}
Guests: ${data.guestCount}
Budget: ${data.budgetRange || "N/A"}
Venue: ${data.venueAddress || "N/A"}

Notes:
${data.notes || "N/A"}

Source: ${data.sourceRoute} (${data.sourceChannel})
Lead ID: ${leadData.id}
          `.trim(),
        });
      } catch (emailError) {
        // Log but do not fail the request if email fails, DB save is primary
        console.error("[submitLeadCapture] Email Notification Error:", emailError);
      }
    } else {
      console.log(`[Email Dev] Lead received from ${data.email} for ${data.city} but no Resend key found.`);
    }

    return { success: true, leadId: leadData.id };
  });
