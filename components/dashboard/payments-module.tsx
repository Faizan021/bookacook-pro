const simpleStatusStyle: Record<string, string> = {
  paid: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border border-amber-200 bg-amber-50 text-amber-700",
  refunded: "border border-[#eadfce] bg-[#faf6ee] text-[#5c6f68]",
};

const payoutStatusStyle: Record<string, string> = {
  pending_payment: "border border-amber-200 bg-amber-50 text-amber-700",
  funds_held: "border border-sky-200 bg-sky-50 text-sky-700",
  partially_released: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  payout_pending: "border border-purple-200 bg-purple-50 text-purple-700",
  payout_released: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  refunded: "border border-[#eadfce] bg-[#faf6ee] text-[#5c6f68]",
  partially_refunded: "border border-[#eadfce] bg-[#faf6ee] text-[#5c6f68]",
  cancelled: "border border-red-200 bg-red-50 text-red-700",
  disputed: "border border-red-200 bg-red-50 text-red-700",
};
