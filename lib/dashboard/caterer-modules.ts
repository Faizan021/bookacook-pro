import { createClient } from "@/lib/supabase/server";

export type CatererBooking = {
  id: string;
  event: string;
  date: string;
  guests: number;
  amount: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  customer?: string;
};

export type CatererPackage = {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  maxGuests: number;
  category: string;
  status: "active" | "draft" | "paused";
};

export type CatererPayment = {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "refunded";
};

export type CatererPaymentTotals = {
  total: string;
  commission: string;
  pending: string;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function normalizeBookingStatus(
  s: string
): "confirmed" | "pending" | "completed" | "cancelled" {
  const v = s.toLowerCase();
  if (v === "confirmed" || v === "accepted" || v === "approved") return "confirmed";
  if (v === "completed" || v === "done" || v === "delivered") return "completed";
  if (v === "cancelled" || v === "rejected" || v === "declined") return "cancelled";
  return "pending";
}

function normalizePaymentStatus(s: string): "paid" | "pending" | "refunded" {
  const v = s.toLowerCase();
  if (v === "paid" || v === "payout_sent" || v === "completed") return "paid";
  if (v === "refunded" || v === "reversed") return "refunded";
  return "pending";
}

function normalizePackageStatus(s: string): "active" | "draft" | "paused" {
  const v = s.toLowerCase();
  if (v === "active" || v === "published" || v === "live") return "active";
  if (v === "paused" || v === "hidden") return "paused";
  return "draft";
}

export async function getCatererIdForUser(
  userId: string
): Promise<{ id: string; business_name: string } | null> {
  const supabase = await createClient();
  try {
    const { data } = await supabase
      .from("caterers")
      .select("id, business_name")
      .eq("user_id", userId)
      .single();
    return (data as { id: string; business_name: string }) ?? null;
  } catch {
    return null;
  }
}

export async function getCatererBookingsList(
  catererId: string
): Promise<CatererBooking[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("caterer_id", catererId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((b) => ({
      id: String(b.id).slice(0, 8).toUpperCase(),
      event: b.event_type || b.service_type || b.package_name || "Catering Event",
      date: b.event_date ? formatDate(b.event_date) : formatDate(b.created_at),
      guests: Number(b.guest_count || b.guests || 0),
      amount: b.final_amount
        ? `€${Number(b.final_amount).toLocaleString("de-DE")}`
        : b.quoted_amount
        ? `€${Number(b.quoted_amount).toLocaleString("de-DE")}`
        : "—",
      status: normalizeBookingStatus(b.status || "pending"),
      customer: b.customer_name || (b.customer_id ? `#${String(b.customer_id).slice(0, 6)}` : undefined),
    }));
  } catch {
    return [];
  }
}

export async function getCatererPackagesList(
  catererId: string
): Promise<CatererPackage[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("caterer_id", catererId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((p) => ({
      id: String(p.id),
      name: p.name || p.title || "Package",
      description: p.description || p.summary || "",
      pricePerPerson: Number(p.price_per_person || p.price || 0),
      minGuests: Number(p.min_guests || p.minimum_guests || 1),
      maxGuests: Number(p.max_guests || p.maximum_guests || 100),
      category: p.category || p.cuisine_type || "General",
      status: normalizePackageStatus(p.status || "draft"),
    }));
  } catch {
    return [];
  }
}

export async function getCatererBookingDates(catererId: string): Promise<string[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("event_date, created_at, status")
      .eq("caterer_id", catererId)
      .in("status", ["confirmed", "pending", "accepted", "approved"]);

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[])
      .map((b) => b.event_date || b.created_at)
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export async function getCatererPaymentsList(catererId: string): Promise<{
  payments: CatererPayment[];
  totals: CatererPaymentTotals;
}> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("id, amount_total, payment_status, created_at, booking_id, description")
      .eq("caterer_id", catererId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return {
        payments: [],
        totals: { total: "€0", commission: "€0", pending: "€0" },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];

    const paidSum = rows
      .filter((p) => normalizePaymentStatus(p.payment_status) === "paid")
      .reduce((s, p) => s + Number(p.amount_total || 0), 0);

    const pendingSum = rows
      .filter((p) => normalizePaymentStatus(p.payment_status) === "pending")
      .reduce((s, p) => s + Number(p.amount_total || 0), 0);

    const commission = paidSum * 0.1;

    const payments: CatererPayment[] = rows.map((p) => ({
      id: `PAY-${String(p.id).slice(0, 6).toUpperCase()}`,
      description:
        p.description ||
        (p.booking_id ? `Booking #${String(p.booking_id).slice(0, 6)}` : "Payment"),
      date: formatDate(p.created_at),
      amount: `€${Number(p.amount_total || 0).toLocaleString("de-DE")}`,
      status: normalizePaymentStatus(p.payment_status || "pending"),
    }));

    return {
      payments,
      totals: {
        total: `€${paidSum.toLocaleString("de-DE")}`,
        commission: `€${commission.toLocaleString("de-DE")}`,
        pending: `€${pendingSum.toLocaleString("de-DE")}`,
      },
    };
  } catch {
    return {
      payments: [],
      totals: { total: "€0", commission: "€0", pending: "€0" },
    };
  }
}
