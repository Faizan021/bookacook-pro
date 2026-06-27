import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { trackEvent } from "@/utils/posthog";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, MapPin, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { optionalSupabaseAuth, requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { UnifiedCustomerFields } from "@/components/UnifiedCustomerFields";

export const getPublicPlannerProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: planner, error: pErr } = await supabaseAdmin
      .from("planners")
      .select("id, name, slug")
      .eq("slug", data.slug)
      .maybeSingle();
    
    if (pErr || !planner) return null;
    return planner;
  });

export const submitPublicPlannerBrief = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator(
    (input: {
      plannerId: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      eventType: string;
      eventDate: string;
      guestCount: number;
      budgetCents: number;
      location: string;
      notes: string;
    }) =>
      z
        .object({
          plannerId: z.string().uuid(),
          customerName: z.string().min(1),
          customerEmail: z.string().email(),
          customerPhone: z.string().min(1),
          eventType: z.string().min(1),
          eventDate: z.string(),
          guestCount: z.number().min(1),
          budgetCents: z.number().min(0),
          location: z.string().min(1),
          notes: z.string(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context as { userId: string };

    const { error } = await supabaseAdmin.from("catering_briefs").insert({
      customer_id: userId,
      preferred_planner_id: data.plannerId,
      status: "quote_requested", // Start immediately as quote requested
      event_type: data.eventType,
      event_date: data.eventDate,
      guest_count: data.guestCount,
      budget_cents: data.budgetCents,
      location: data.location,
      notes: `[GUEST INQUIRY]\nName: ${data.customerName}\nEmail: ${data.customerEmail}\nPhone: ${data.customerPhone}\n\nNotes:\n${data.notes}`,
      milestones: [{
        title: "Request Received",
        description: "Public brief submitted via integration companion.",
        completed: true,
        date: new Date().toISOString()
      }]
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const Route = createFileRoute("/embed/planner/$slug/inquiry")({
  loader: async ({ params }) => {
    try {
      const res = await getPublicPlannerProfile({ data: { slug: params.slug } });
      return { planner: res, error: null };
    } catch (e: any) {
      return { planner: null, error: e.message || "Planner profile not found" };
    }
  },
  head: () => ({ meta: [{ title: "Request Event Planner — Speisely" }] }),
  component: PlannerEmbedPage,
});

function PlannerEmbedPage() {
  const { planner, error } = Route.useLoaderData();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitFn = useServerFn(submitPublicPlannerBrief);
  const startedRef = useRef(false);
  const handleStartForm = () => {
    if (!startedRef.current && planner) {
      startedRef.current = true;
      trackEvent("planner_inquiry_started", { plannerId: planner.id, isEmbed: true });
    }
  };

  const [identity, setIdentity] = useState({
    name: "",
    email: "",
    phone: "",
    marketingOptIn: false,
    termsAccepted: false,
  });

  const [form, setForm] = useState({
    eventType: "Wedding",
    eventDate: "",
    guestCount: 50,
    budget: "",
    location: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planner) return;
    if (!identity.termsAccepted) {
      alert("Please agree to the platform terms.");
      return;
    }
    setLoading(true);
    try {
      // 2. Submit Payload
      const budgetCents = Math.round((parseFloat(form.budget) || 0) * 100);
      const notesWithContact = `[INQUIRY]\nName: ${identity.name}\nEmail: ${identity.email}\nPhone: ${identity.phone}\n\nNotes:\n${form.notes}`;
      
      await submitFn({
        data: {
          plannerId: planner.id,
          customerName: identity.name,
          customerEmail: identity.email,
          customerPhone: identity.phone,
          eventType: form.eventType,
          eventDate: form.eventDate,
          guestCount: form.guestCount,
          budgetCents,
          location: form.location,
          notes: form.notes,
        }
      });

      trackEvent("reservation_submitted", { plannerId: planner.id, type: "planner", isEmbed: true });
      setSuccess(true);
    } catch (err: any) {
      alert("Submission Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error || !planner) {
    return (
      <div className="p-8 text-center bg-[#fdfaf5] text-forest min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold font-display">Profile Not Available</h2>
        <p className="text-sm text-muted-foreground mt-2">{error || "Planner profile could not be loaded."}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 text-center bg-[#fdfaf5] text-forest min-h-screen flex flex-col justify-center items-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h2 className="text-2xl font-bold font-display">Inquiry Sent Successfully!</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Thank you! Your event brief has been received by {planner.name}. We will review the details and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfaf5] text-forest min-h-screen p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-forest/70" />
        <div>
          <h2 className="font-display font-bold text-lg">Hire Event Planner</h2>
          <p className="text-xs text-muted-foreground">In partnership with {planner.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} onInput={handleStartForm} className="space-y-4">
        <UnifiedCustomerFields
          value={identity}
          onChange={(fields) => setIdentity({ ...identity, ...fields })}
        />

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[oklch(0.85_0.05_152)]">
          <div className="space-y-1.5">
            <Label htmlFor="eventType">Event Type *</Label>
            <Select value={form.eventType} onValueChange={val => setForm({...form, eventType: val})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#fdfaf5] border-[#eadfce]">
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Corporate Gala">Corporate Gala</SelectItem>
                <SelectItem value="Birthday Anniversary">Birthday Anniversary</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="eventDate" className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date *</Label>
            <Input id="eventDate" type="date" required value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="guests" className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Guests *</Label>
            <Input id="guests" type="number" min="1" required value={form.guestCount} onChange={e => setForm({...form, guestCount: parseInt(e.target.value) || 1})} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="budget">Budget (€) *</Label>
            <Input id="budget" type="number" min="0" required value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="5000" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location" className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Event Location / City *</Label>
          <Input id="location" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Hamburg Altona" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Special Requirements / Notes</Label>
          <Textarea id="notes" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Please tell us about your vision, themes, catering coordination or decoration requirements..." />
        </div>

        <div className="pt-4">
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full rounded-full bg-forest text-white py-3 font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Inquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}
