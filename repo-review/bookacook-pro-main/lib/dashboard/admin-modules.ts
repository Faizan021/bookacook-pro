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
  const VALID: VerificationStatus[] = [
    "pending",
    "under_review",
    "verified",
    "rejected",
    "suspended",
  ];
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
  return `€${n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function getAdminCaterersList(): Promise<AdminCatererRecord[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("caterers")
      .select(
        "id, user_id, business_name, phone, business_address, license_number, verification_status, payout_enabled, created_at"
      )
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    const rows = data as any[];
    const userIds = rows.map((c) => c.user_id).filter(Boolean);
    const emailMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profiles) {
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
    gmv: "€0,00",
    commissionTotal: "€0,00",
    heldFunds: "€0,00",
    eligibleForRelease: "€0,00",
    releasedTotal: "€0,00",
    blockedPayouts: "€0,00",
  };

  try {
    const [paymentsRes, caterersRes] = await Promise.all([
      supabase
        .from("payments")
        .select(
          "amount_total, gross_amount, commission_amount, net_payout, held_amount, released_amount, payout_status, payment_status, caterer_id, completed_at, dispute_status"
        ),
      supabase
        .from("caterers")
        .select("id, verification_status, payout_enabled"),
    ]);

    if (!paymentsRes.data || !caterersRes.data) return ZERO;

    const catererVerified: Record<string, boolean> = {};

    for (const c of caterersRes.data as any[]) {
      const vs = String(c.verification_status || "").toLowerCase();
      catererVerified[String(c.id)] =
        Boolean(c.payout_enabled) || vs === "verified";
    }

    const now = new Date();

    let gmv = 0;
    let commission = 0;
    let held = 0;
    let eligibleForRelease = 0;
    let released = 0;
    let blocked = 0;

    for (const p of paymentsRes.data as any[]) {
      const gross = Number(p.gross_amount || p.amount_total || 0);
      const comm = Number(p.commission_amount ?? gross * 0.1);
      const net = Number(p.net_payout ?? gross - comm);
      const heldAmount = Number(p.held_amount || net);
      const releasedAmount = Number(p.released_amount || 0);

      const payoutStatus = String(p.payout_status || "").toLowerCase();
      const paymentStatus = String(p.payment_status || "").toLowerCase();
      const disputeStatus = String(p.dispute_status || "").toLowerCase();

      const isPaid =
        paymentStatus === "paid" ||
        paymentStatus === "completed" ||
        payoutStatus === "funds_held" ||
        payoutStatus === "payout_pending" ||
        payoutStatus === "payout_released";

      if (!isPaid) continue;

      const isVerified = catererVerified[String(p.caterer_id)] ?? false;
      const hasDispute =
        disputeStatus === "open" ||
        disputeStatus === "under_review" ||
        payoutStatus === "disputed";

      const completedDate = p.completed_at ? new Date(p.completed_at) : null;
      const olderThan7Days =
        completedDate &&
        now.getTime() - completedDate.getTime() >= 7 * 24 * 60 * 60 * 1000;

      gmv += gross;
      commission += comm;
      released += releasedAmount;

      if (payoutStatus === "payout_released") continue;

      if (!isVerified || hasDispute) {
        blocked += net;
        continue;
      }

      if (olderThan7Days) {
        eligibleForRelease += net;
      } else {
        held += heldAmount;
      }
    }

    return {
      gmv: fmt(gmv),
      commissionTotal: fmt(commission),
      heldFunds: fmt(held),
      eligibleForRelease: fmt(eligibleForRelease),
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
      .select(
        "id, amount_total, payment_status, payout_status, created_at, booking_id, description, caterer_id"
      )
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !data) return [];

    const rows = data as any[];
    const catererIds = [
      ...new Set(rows.map((r) => r.caterer_id).filter(Boolean)),
    ];

    const nameMap: Record<string, string> = {};

    if (catererIds.length > 0) {
      const { data: caterers } = await supabase
        .from("caterers")
        .select("id, business_name")
        .in("id", catererIds);

      if (caterers) {
        for (const c of caterers as any[]) {
          nameMap[String(c.id)] = c.business_name;
        }
      }
    }

    function normalizeStatus(s: string): "paid" | "pending" | "refunded" {
      const v = (s || "").toLowerCase();

      if (v === "paid" || v === "payout_released" || v === "completed") {
        return "paid";
      }

      if (v === "refunded" || v === "partially_refunded" || v === "reversed") {
        return "refunded";
      }

      return "pending";
    }

    return rows.map((p) => ({
      id: `PAY-${String(p.id).slice(0, 6).toUpperCase()}`,
      description:
        p.description ||
        (p.booking_id
          ? `Buchung #${String(p.booking_id).slice(0, 6)}`
          : "Zahlung"),
      date: p.created_at ? formatDate(p.created_at) : "—",
      amount: fmt(Number(p.amount_total || 0)),
      catererName: nameMap[String(p.caterer_id)] ?? undefined,
      status: normalizeStatus(p.payout_status || p.payment_status || "pending"),
    }));
  } catch {
    return [];
  }
}
