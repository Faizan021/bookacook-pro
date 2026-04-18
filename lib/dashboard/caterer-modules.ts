import { createClient } from "@/lib/supabase/server";

/**
 * TYPE DEFINITIONS
 * These define the strict boundaries of our data to prevent errors.
 */

export type VerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "suspended";

export type PayoutStatus =
  | "pending_payment"
  | "funds_held"
  | "partially_released"
  | "payout_pending"
  | "payout_released"
  | "refunded"
  | "partially_refunded"
  | "cancelled"
  | "disputed";

export type CatererProfile = {
  id: string;
  businessName: string;
  contactPerson?: string;
  phone?: string;
  businessAddress?: string;
  licenseNumber?: string;
  verificationStatus: VerificationStatus;
  payoutEnabled: boolean;
};

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

export type ExtendedPayment = {
  id: string;
  description: string;
  date: string;
  grossAmount: number;
  commissionAmount: number;
  netPayout: number;
  heldAmount: number;
  releasedAmount: number;
  remainingHeld: number;
  payoutStatus: PayoutStatus;
};

export type ExtendedPaymentTotals = {
  grossTotal: string;
  commissionTotal: string;
  netTotal: string;
  heldTotal: string;
  releasedTotal: string;
  remainingTotal: string;
};

/**
 * UTILITIES
 */

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

function fmt(n: number): string {
  return `€${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * NORMALIZATION ENGINES
 * These convert messy database strings into strict, predictable types.
 */

function normalizeBookingStatus(s: string): "confirmed" | "pending" | "completed" | "cancelled" {
  // FIX: We treat 'v' as a simple string to avoid the "no overlap" Type Error
  const v = s.toLowerCase(); 
  if (v === "confirmed" || v === "accepted" || v === "approved") return "confirmed";
  if (v === "completed" || v === "done" || v === "delivered") return "completed";
  if (v === "cancelled" || v === "rejected" || v === "declined") return "cancelled";
  return "pending";
}

function normalizePaymentStatus(s: string): "paid" | "pending" | "refunded" {
  // FIX: We treat 'v' as a simple string to avoid the "no overlap" Type Error
  const v = s.toLowerCase();
  if (v === "paid" || v === "payout_sent" || v === "completed") return "paid";
  if (v === "refunded" || v === "reversed") return "refunded";
  return "pending";
}

function normalizePackageStatus(s: string): "active" | "draft" | "paused" {
  // FIX: We treat 'v' as a simple string to avoid the "no overlap" Type Error
  const v = s.toLowerCase();
  if (v === "active" || v === "published" || v === "live") return "active";
  if (v === "paused" || v === "hidden") return "paused";
  return "draft";
}

function normalizeVerificationStatus(s: string): VerificationStatus {
  const VALID: VerificationStatus[] = ["pending", "under_review", "verified", "rejected", "suspended"];
  const v = s.toLowerCase().replace(/ /g, "_") as VerificationStatus;
  return VALID.includes(v) ? v : "pending";
}

function normalizePayoutStatus(s: string): PayoutStatus {
  const VALID: PayoutStatus[] = [
    "pending_payment", "funds_held", "partially_released", "payout_pending",
    "payout_released", "refunded", "partially_refunded", "cancelled", "disputed",
  ];
  const v = s.toLowerCase();
  if (VALID.includes(v as PayoutStatus)) return v as PayoutStatus;
  if (v === "paid" || v === "payout_sent") return "payout_released";
  if (v === "refunded" || v === "reversed") return "refunded";
  return "pending_payment";
}

/**
 * DATA ACCESS LAYER (DAL)
 */

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

export async function getCatererProfile(userId: string): Promise<CatererProfile | null> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("caterers")
      .select(
        "id, business_name, contact_person, phone, business_address, license_number, verification_status, payout_enabled"
      )
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    const row = data as any;
    const vs = normalizeVerificationStatus(row.verification_status || "pending");

    return {
      id: String(row.id),
      businessName: row.business_name || "",
      contactPerson: row.contact_person ?? undefined,
      phone: row.phone ?? undefined,
      businessAddress: row.business_address ?? undefined,
      licenseNumber: row.license_number ?? undefined,
      verificationStatus: vs,
      payoutEnabled: Boolean(row.payout_enabled) || vs === "verified",
    };
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

    return (data as any[]).map((p) => ({
      id: String(p.id),
      name: p.name || p.title || "Package",
      description: p.description || p.summary || "",
      pricePerPerson: Number(p.price_amount || p.price_per_person || p.price || 0),
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
      return { payments: [], totals: { total: "€0", commission: "€0", pending: "€0" } };
    }

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
      description: p.description || (p.booking_id ? `Booking #${String(p.booking_id).slice(0, 6)}` : "Payment"),
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
    return { payments: [], totals: { total: "€0", commission: "€0", pending: "€0" } };
  }
}

export async function getCatererExtendedPayments(catererId: string): Promise<{
  payments: ExtendedPayment[];
  totals: ExtendedPaymentTotals;
}> {
  const supabase = await createClient();
  const ZERO_TOTALS: ExtendedPaymentTotals = {
    grossTotal: "€0,00", commissionTotal: "€0,00", netTotal: "€0,00",
    heldTotal: "€0,00", releasedTotal: "€0,00", remainingTotal: "€0,00",
  };

  try {
    const { data, error } = await supabase
      .from("payments")
      .select(
        "id, amount_total, gross_amount, commission_amount, net_payout, held_amount, released_amount, payout_status, payment_status, created_at, booking_id, description"
      )
      .eq("caterer_id", catererId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) {
      return { payments: [], totals: ZERO_TOTALS };
    }

    const rows = data as any[];

    const payments: ExtendedPayment[] = rows.map((p) => {
      const gross = Number(p.gross_amount || p.amount_total || 0);
      const commission = Number(p.commission_amount ?? gross * 0.1);
      const net = Number(p.net_payout ?? gross - commission);
      const payoutStatus = normalizePayoutStatus(p.payout_status || p.payment_status || "pending_payment");
      const isReleased = payoutStatus === "payout_released";
      const released = Number(p.released_amount ?? (isReleased ? net : 0));
      const held = Number(p.held_amount ?? (!isReleased ? net : 0));
      const remaining = Math.max(0, held - released);

      return {
        id: `PAY-${String(p.id).slice(0, 6).toUpperCase()}`,
        description: p.description || (p.booking_id ? `Buchung #${String(p.booking_id).slice(0, 6)}` : "Zahlung"),
        date: formatDate(p.created_at),
        grossAmount: gross,
        commissionAmount: commission,
        netPayout: net,
        heldAmount: held,
        releasedAmount: released,
        remainingHeld: remaining,
        payoutStatus,
      };
    });

    const sum = (fn: (p: ExtendedPayment) => number) => payments.reduce((s, p) => s + fn(p), 0);

    return {
      payments,
      totals: {
        grossTotal:      fmt(sum((p) => p.grossAmount)),
        commissionTotal: fmt(sum((p) => p.commissionAmount)),
        netTotal:        fmt(sum((p) => p.netPayout)),
        heldTotal:       fmt(sum((p) => p.heldAmount)),
        releasedTotal:   fmt(sum((p) => p.releasedAmount)),
        remainingTotal:  fmt(sum((p) => p.remainingHeld)),
      },
    };
  } catch {
    return { payments: [], totals: ZERO_TOTALS };
  }
}
