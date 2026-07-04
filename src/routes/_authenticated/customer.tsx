import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Calendar, Download } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  getCustomerUnifiedActivity,
  type UnifiedActivityItem,
} from "@/lib/customer/queries.functions";
import { acceptProposal } from "@/lib/customer/mutations.functions";
import { Button } from "@/components/ui/button";
import { MilestoneTimeline } from "@/components/vendor/MilestoneTimeline";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/customer")({
  ssr: false,
  head: () => ({ meta: [{ title: "My Activity — Speisely" }] }),
  component: CustomerDashboard,
});

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-sky-100 text-sky-900",
  preparing: "bg-indigo-100 text-indigo-900",
  ready: "bg-emerald-100 text-emerald-900",
  picked_up: "bg-teal-100 text-teal-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-rose-100 text-rose-900",
  submitted: "bg-amber-100 text-amber-900",
  reviewing: "bg-sky-100 text-sky-900",
  quoted: "bg-indigo-100 text-indigo-900",
  accepted: "bg-green-100 text-green-900",
  declined: "bg-rose-100 text-rose-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-rose-100 text-rose-900",
  completed: "bg-indigo-100 text-indigo-900",
  no_show: "bg-red-100 text-red-900",
};

function price(cents: number | null | undefined) {
  if (cents == null) return "—";
  return `€${(cents / 100).toFixed(2)}`;
}

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", search: { signup: undefined, message: undefined, logout: undefined } });
  }
  return (
    <div className="min-h-screen bg-mint-dotted">
      <header className="border-b border-border/60 bg-cream/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-forest">← Main page</Link>
            <h1 className="font-display text-2xl">My Activity</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/">Main page</Link>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                router.navigate({ to: "/auth", search: { signup: undefined, message: undefined, logout: undefined } });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">{children}</main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface-card p-12 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mint text-forest text-3xl shadow-sm">
        🍃
      </div>
      <h3 className="font-display text-2xl">Nothing here yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Your orders from restaurants and your catering or event briefs will appear here in one
        place. Start by exploring what's on Speisely today.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/instant-order">Order from a restaurant</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/catering">Plan a catering</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/planner">Event planner</Link>
        </Button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-stone-200 text-stone-800";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function TimelineDot({ kind }: { kind: "order" | "brief" }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg shadow-sm ring-4 ring-cream ${
        kind === "order" ? "bg-amber-100 text-amber-900" : 
        kind === "reservation" ? "bg-sky-100 text-sky-900" :
        "bg-mint text-forest"
      }`}
      aria-hidden
    >
      {kind === "order" ? "🍽️" : kind === "reservation" ? "📅" : "📋"}
    </div>

  );
}

function getGoogleCalendarUrl(item: Extract<UnifiedActivityItem, { kind: "reservation" }>) {
  const text = encodeURIComponent(`Reservation at ${item.restaurant_name ?? "Speisely"}`);
  const details = encodeURIComponent(`Table for ${item.guest_count} guests.`);
  const startDate = new Date(`${item.reservation_date}T${item.reservation_time}`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}`;
}

function getIcsDataUrl(item: Extract<UnifiedActivityItem, { kind: "reservation" }>) {
  const startDate = new Date(`${item.reservation_date}T${item.reservation_time}`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Reservation at ${item.restaurant_name ?? "Speisely"}
DESCRIPTION:Table for ${item.guest_count} guests.
END:VEVENT
END:VCALENDAR`;
  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}

function ReservationCard({ item }: { item: Extract<UnifiedActivityItem, { kind: "reservation" }> }) {
  const isAccepted = item.status === "approved" || item.status === "accepted";
  
  return (
    <article className={`surface-card p-5 ${isAccepted ? 'ring-2 ring-emerald-400 bg-emerald-50/20' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Table Reservation
          </p>
          <h3 className="font-display text-lg mt-1">
            {item.restaurant_name ?? "Restaurant"} — {item.guest_count} Guests
          </h3>
          <p className="mt-1 text-sm font-medium text-foreground">
            {new Date(item.reservation_date).toLocaleDateString()} at {item.reservation_time}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            #{item.id.slice(0, 8)} · Booked on {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusPill status={item.status} />
          {isAccepted && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
              🎉 Reservation Accepted!
            </span>
          )}
        </div>
      </div>
      
      {isAccepted && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          <Button asChild variant="secondary" size="sm">
            <a href={getGoogleCalendarUrl(item)} target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-4 w-4" /> Add to Google
            </a>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={getIcsDataUrl(item)} download={`reservation-${item.id}.ics`}>
              <Download className="mr-2 h-4 w-4" /> Apple / Outlook (.ics)
            </a>
          </Button>
        </div>
      )}

      {item.restaurant_slug && (
        <div className={isAccepted ? "mt-3" : "mt-4"}>
          <Button asChild variant="outline" size="sm">
            <Link to="/restaurant/$slug" params={{ slug: item.restaurant_slug }}>
              View restaurant
            </Link>
          </Button>
        </div>
      )}
    </article>
  );
}

function OrderCard({ item }: { item: Extract<UnifiedActivityItem, { kind: "order" }> }) {
  
  return (
    <article className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Restaurant order
          </p>
          <h3 className="font-display text-lg mt-1">
            {item.restaurant_name ?? "Restaurant"} — {price(item.total_cents)}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            #{item.id.slice(0, 8)} · {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
        <StatusPill status={item.status} />
      </div>
      {item.items.length > 0 && (
        <ul className="mt-3 text-sm text-foreground/80 space-y-0.5">
          {item.items.map((it, i) => (
            <li key={i}>
              {it.qty ?? 1}× {it.name}
            </li>
          ))}
        </ul>
      )}

      {item.notes && (
        <p className="mt-2 text-sm italic text-muted-foreground">"{item.notes}"</p>
      )}
      {item.restaurant_slug && (
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/restaurant/$slug" params={{ slug: item.restaurant_slug }}>
              View restaurant
            </Link>
          </Button>
        </div>
      )}
    </article>
  );
}

function BriefCard({ item, onUpdate }: { item: Extract<UnifiedActivityItem, { kind: "brief" }>; onUpdate: () => void }) {
  const [accepting, setAccepting] = useState(false);
  const acceptFn = useServerFn(acceptProposal);
  const router = useRouter();

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await acceptFn({ data: { briefId: item.id } });
      if (res?.bookingId) {
        router.navigate({ to: `/checkout/deposit/${res.bookingId}` });
      } else {
        alert("Failed to accept proposal");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setAccepting(false);
    }
  };

  const target = item.caterer_slug
    ? { label: "View caterer", to: "/catering/$slug" as const, slug: item.caterer_slug }
    : item.planner_slug
      ? { label: "View planner", to: "/planner/$slug" as const, slug: item.planner_slug }
      : null;
  return (
    <article className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {item.caterer_slug ? "Catering brief" : item.planner_slug ? "Event brief" : "Brief"}
          </p>
          <h3 className="font-display text-lg mt-1">
            {item.event_type ?? "Event"}
            {item.guest_count ? ` · ${item.guest_count} guests` : ""}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            #{item.id.slice(0, 8)} · submitted {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
        <StatusPill status={item.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
        {item.event_date && (
          <div>
            <dt className="text-muted-foreground text-xs">Date</dt>
            <dd>{new Date(item.event_date).toLocaleDateString()}</dd>
          </div>
        )}
        {item.location && (
          <div>
            <dt className="text-muted-foreground text-xs">Location</dt>
            <dd>{item.location}</dd>
          </div>
        )}
        {item.budget_cents != null && (
          <div>
            <dt className="text-muted-foreground text-xs">Budget</dt>
            <dd>{price(item.budget_cents)}</dd>
          </div>
        )}
      </dl>
      {item.notes && (
        <p className="mt-3 text-sm italic text-muted-foreground">"{item.notes}"</p>
      )}
      
      {item.status === "quoted" && (
        <div className="mt-4 p-4 rounded-xl bg-[#eadfce]/30 border border-[#eadfce] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="font-semibold text-forest text-sm">Proposal Received</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pay the 10% booking deposit of {price((item.budget_cents || 0) * 0.10)} to secure this service.
            </p>
          </div>
          <Button 
            onClick={handleAccept} 
            disabled={accepting} 
            className="rounded-full bg-forest text-white hover:bg-forest/90 font-bold text-xs"
          >
            {accepting ? "Processing..." : "Accept & Pay Deposit"}
          </Button>
        </div>
      )}

      {target && (
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to={target.to} params={{ slug: target.slug }}>
              {target.label}
            </Link>
          </Button>
        </div>
      )}

      {item.milestones && item.milestones.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <MilestoneTimeline 
            briefId={item.id} 
            milestones={item.milestones} 
            onUpdate={onUpdate} 
            isVendor={false} 
          />
        </div>
      )}
    </article>
  );
}

function CustomerDashboard() {
  const qc = useQueryClient();
  const fetchActivity = useServerFn(getCustomerUnifiedActivity);
  const q = useQuery({
    queryKey: ["customer", "activity"],
    queryFn: () => fetchActivity(),
  });

  return (
    <Shell>
      {q.isLoading && <div className="surface-card p-8 text-center">Loading your activity…</div>}
      {q.error && (
        <div className="surface-card p-8 text-center text-destructive">
          Could not load your activity. Please try again.
        </div>
      )}
      {q.data && q.data.timeline.length === 0 && <EmptyState />}
      {q.data && q.data.timeline.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="surface-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
              <p className="font-display text-3xl mt-1">{q.data.counts.total}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Orders</p>
              <p className="font-display text-3xl mt-1">{q.data.counts.orders}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Briefs</p>
              <p className="font-display text-3xl mt-1">{q.data.counts.briefs}</p>
            </div>
          </div>

          <section>
            <h2 className="font-display text-2xl mb-4">Timeline</h2>
            <ol className="relative space-y-5 border-l-2 border-mint/60 pl-6">
              {q.data.timeline.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="relative">
                  <div className="absolute -left-[34px] top-2">
                    <TimelineDot kind={item.kind as any} />
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.kind === "order" && <OrderCard item={item} />}
                    {item.kind === "reservation" && <ReservationCard item={item} />}
                    {item.kind === "brief" && (
                      <BriefCard 
                        item={item} 
                        onUpdate={() => qc.invalidateQueries({ queryKey: ["customer", "activity"] })} 
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </Shell>
  );
}
