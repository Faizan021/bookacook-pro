export const SPEISELY_FEATURE_REGISTRY = {
  // Features we explicitly have and encourage mentioning
  verified_features: [
    "B2B Catering Orders",
    "Corporate Catering",
    "Vendor Marketplace",
    "Dietary Filters",
    "Invoice",
    "Billing",
    "Stripe integration",
    "Event Catering",
  ],

  // A strict blocklist of claims that AI tends to hallucinate.
  // Each entry has a regex pattern to match the claim and a human-readable reason.
  blocked_claims: [
    {
      pattern: /live\s+(order\s+)?tracking/i,
      name: "Live Order Tracking",
      reason: "Speisely does not currently offer real-time GPS delivery tracking.",
    },
    {
      pattern: /gps\s+tracking/i,
      name: "GPS Tracking",
      reason: "Speisely does not currently offer real-time GPS delivery tracking.",
    },
    {
      pattern: /mobile\s+app/i,
      name: "Mobile App",
      reason:
        "Speisely is a responsive web platform, but does not have a native iOS/Android mobile app.",
    },
    {
      pattern: /(ios|android)\s+app/i,
      name: "iOS/Android App",
      reason: "Speisely does not have a native iOS/Android app.",
    },
    {
      pattern: /corporate\s+meal\s+planning/i,
      name: "Corporate Meal Planning",
      reason:
        "We offer event planner inquiries and catering, but not a daily corporate meal calendar/planner software.",
    },
    {
      pattern: /built-in\s+planner/i,
      name: "Built-in Planner",
      reason: "We have planner inquiry flows, not a full daily meal planner feature.",
    },
    {
      pattern: /meal\s+prep\s+subscription/i,
      name: "Meal Prep Subscription",
      reason:
        "Speisely handles catering subscriptions, but not individual D2C meal prep subscriptions.",
    },
    {
      pattern: /open\s?table/i,
      name: "OpenTable Integration",
      reason: "We do not integrate with OpenTable for restaurant reservations.",
    },
    {
      pattern: /subscription\s+box/i,
      name: "Subscription Box",
      reason: "We do not offer subscription boxes.",
    },
    {
      pattern: /recipe\s+library/i,
      name: "Recipe Library",
      reason: "We are an ordering platform, not a recipe portal.",
    },
  ],
};

export interface VerificationResult {
  isValid: boolean;
  flaggedPhrases: { phrase: string; reason: string }[];
}

/**
 * Validates the draft content against the Blocked Claims registry.
 */
export function verifyDraftContent(content: string): VerificationResult {
  const flaggedPhrases: { phrase: string; reason: string }[] = [];

  for (const claim of SPEISELY_FEATURE_REGISTRY.blocked_claims) {
    const match = content.match(claim.pattern);
    if (match) {
      flaggedPhrases.push({
        phrase: match[0],
        reason: claim.reason,
      });
    }
  }

  return {
    isValid: flaggedPhrases.length === 0,
    flaggedPhrases,
  };
}
