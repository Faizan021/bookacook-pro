import { createClient } from "@/lib/supabase/server";
import type { VerificationStatus } from "@/lib/dashboard/caterer-modules";

export type { VerificationStatus };

export type AdminCatererRecord = {
  id: string;
  businessName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  businessAddress?: string;
  licenseNumber?: string;
  verificationStatus: VerificationStatus;
  payoutEnabled: boolean;
  createdAt?: string;
};

export type AdminPaymentSummary = {
  gmv: string;
  commissionTotal: string;
  heldFunds: string;
  eligibleForRelease: string;
  releasedTotal: string;
  blockedPayouts: string;
};

function normalizeVS(s: string): VerificationStatus {
  const VALID: VerificationStatus[] = ["pending", "under_review", "verified", "rejected", "suspended"];
  const v = s.toLowerCase().replace(/ /g, "_") as VerificationStatus;
  return VALID.includes(v) ? v : "pending";
}

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

export async function getAdminCaterersList(): Promise<AdminCatererRecord[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("caterers")
      .select(
        "id, user_id, business_name, contact_person, phone, business_address, license_number, verification_status, payout_enabled, created_at"
      )
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];

    const userIds = rows.map((c) => c.user_id).filter(Boolean);
    const emailMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profiles) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const p of profiles as any[]) {
          if (p.id && p.email) emailMap[p.id] = p.email;
        }
      }
    }

    return rows.map((c) => {
      const vs = normalizeVS(c.verification_status || "pending");
      return {
        id: String(c.id),
        businessName: c.business_name || "—",
        contactPerson: c.contact_person ?? undefined,
        email: emailMap[c.user_id] ?? undefined,
        phone: c.phone ?? undefined,
        businessAddress: c.business_address ?? undefined,
        licenseNumber: c.license_number ?? undefined,
        verificationStatus: vs,
        payoutEnabled: Boolean(c.payout_enabled) || vs === "verified",
        createdAt: c.created_at ? formatDate(c.created_at) : undefined,
      };
    });
  } catch {
    return [];
  }
}

export async function getAdminPaymentsSummary(): Promise<AdminPaymentSummary> {
  const supabase = await createClient();
  const ZERO: AdminPaymentSummary = {
    gmv: "€0,00", commissionTotal: "€0,00",
    heldFunds: "€0,00", releasedTotal: "€0,00", blockedPayouts: "€0,00",
  };

  try {
    const [paymentsRes, caterersRes] = await Promise.all([
      supabase
        .from("payments")
        .select("amount_total, gross_amount, commission_amount, net_payout, held_amount, released_amount, payout_status, payment_status, caterer_id"),
      supabase
        .from("caterers")
        .select("id, verification_status, payout_enabled"),
    ]);

    if (!paymentsRes.data || !caterersRes.data) return ZERO;

    const catererVerified: Record<string, boolean> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const c of caterersRes.data as any[]) {
      const vs = (c.verification_status || "").toLowerCase();
      catererVerified[String(c.id)] = Boolean(c.payout_enabled) || vs === "verified";
    }

    let gmv = 0, commission = 0, held = 0, released = 0, blocked = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const p of paymentsRes.data as any[]) {
      const gross = Number(p.gross_amount || p.amount_total || 0);
      const comm = Number(p.commission_amount ?? gross * 0.1);
      const net = Number(p.net_payout ?? gross - comm);
      const isVerified = catererVerified[String(p.caterer_id)] ?? false;

      gmv += gross;
      commission += comm;
      held += Number(p.held_amount || 0);
      released += Number(p.released_amount || 0);
      if (!isVerified) blocked += net;
    }

    return {
      gmv: fmt(gmv),
      commissionTotal: fmt(commission),
      heldFunds: fmt(held),
      releasedTotal: fmt(released),
      blockedPayouts: fmt(blocked),
    };
  } catch {
    return ZERO;
  }
}

export type AdminPaymentRow = {
  id: string;
  description: string;
  date: string;
  amount: string;
  catererName?: string;
  status: "paid" | "pending" | "refunded";
};

export async function getAdminPaymentsList(): Promise<AdminPaymentRow[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("id, amount_total, payment_status, payout_status, created_at, booking_id, description, caterer_id")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];
    const catererIds = [...new Set(rows.map((r) => r.caterer_id).filter(Boolean))];
    const nameMap: Record<string, string> = {};

    if (catererIds.length > 0) {
      const { data: caterers } = await supabase
        .from("caterers")
        .select("id, business_name")
        .in("id", catererIds);
      if (caterers) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const c of caterers as any[]) nameMap[String(c.id)] = c.business_name;
      }
    }

    function normalizeStatus(s: string): "paid" | "pending" | "refunded" {
      const v = (s || "").toLowerCase();
      if (v === "paid" || v === "payout_released" || v === "completed") return "paid";
      if (v === "refunded" || v === "partially_refunded" || v === "reversed") return "refunded";
      return "pending";
    }

    function fmtDate(iso: string): string {
      try { return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }); }
      catch { return iso; }
    }

    return rows.map((p) => ({
      id: `PAY-${String(p.id).slice(0, 6).toUpperCase()}`,
      description: p.description || (p.booking_id ? `Buchung #${String(p.booking_id).slice(0, 6)}` : "Zahlung"),
      date: fmtDate(p.created_at),
      amount: `€${Number(p.amount_total || 0).toLocaleString("de-DE")}`,
      catererName: nameMap[String(p.caterer_id)] ?? undefined,
      status: normalizeStatus(p.payout_status || p.payment_status || "pending"),
    }));
  } catch {
    return [];
  }
}
