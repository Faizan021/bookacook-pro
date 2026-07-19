const flagEnv =
  (typeof process !== "undefined" && process?.env
    ? process.env.BRANDING_ASSISTANT_ENABLED
    : undefined) ||
  (typeof process !== "undefined" && process?.env
    ? process.env.NEXT_PUBLIC_BRANDING_ASSISTANT_ENABLED
    : undefined) ||
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_BRANDING_ASSISTANT_ENABLED
    : undefined);

export const BRANDING_ASSISTANT_ENABLED = flagEnv === undefined ? true : flagEnv === "true";

const upsellFlagEnv =
  (typeof process !== "undefined" && process?.env
    ? process.env.UPSELL_RECOMMENDATIONS_ENABLED
    : undefined) ||
  (typeof process !== "undefined" && process?.env
    ? process.env.NEXT_PUBLIC_UPSELL_RECOMMENDATIONS_ENABLED
    : undefined) ||
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_UPSELL_RECOMMENDATIONS_ENABLED
    : undefined);

export const UPSELL_RECOMMENDATIONS_ENABLED =
  upsellFlagEnv === undefined ? true : upsellFlagEnv === "true";
