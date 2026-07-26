// Speisely Premium Branding SVG Generators

// A list of harmonious premium gradient colors based on business name string hashing
const GRADIENTS = [
  { start: "#1e3f20", end: "#0b2010" }, // Forest Green
  { start: "#2c3e50", end: "#0f171e" }, // Midnight Slate
  { start: "#8c6239", end: "#402205" }, // Warm Coffee Bronze
  { start: "#34495e", end: "#2c3e50" }, // Elegant Navy
  { start: "#d4af37", end: "#7a5c10" }, // Gold Ocher
  { start: "#7d1919", end: "#3d0b0b" }, // Crimson Burgundy
];

function getBrandColors(name?: string) {
  const safeName = name || "Restaurant";
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function generateSvgLogo(businessName?: string, category?: string): string {
  const safeName = businessName || "Restaurant";
  const initials =
    safeName
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "S";

  const colors = getBrandColors(safeName);
  const catText = category ? category.toUpperCase() : "SPEISELY PARTNER";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.start}" />
          <stop offset="100%" stop-color="${colors.end}" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="240" fill="url(#logo-grad)" stroke="#ffffff" stroke-width="8" />
      <circle cx="256" cy="256" r="220" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="10 10" opacity="0.3" />
      
      <text x="256" y="270" font-family="'Inter', 'Outfit', sans-serif" font-size="140" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-2">
        ${initials}
      </text>
      
      <rect x="156" y="360" width="200" height="28" rx="14" fill="#ffffff" fill-opacity="0.1" />
      <text x="256" y="378" font-family="'Inter', 'Outfit', sans-serif" font-size="14" font-weight="700" fill="#ffffff" fill-opacity="0.9" text-anchor="middle" letter-spacing="3">
        ${catText}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export function generateSvgBanner(businessName?: string, category?: string): string {
  const safeName = businessName || "Speisely Partner";
  const colors = getBrandColors(safeName);
  const catText = category ? category.toUpperCase() : "SPEISELY MARKETPLACE PARTNER";

  // Dynamically calculate font size based on business name length to prevent crop clipping
  let fontSize = 56;
  if (safeName.length > 25) {
    fontSize = 32;
  } else if (safeName.length > 20) {
    fontSize = 38;
  } else if (safeName.length > 15) {
    fontSize = 44;
  } else if (safeName.length > 10) {
    fontSize = 48;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
      <defs>
        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.start}" />
          <stop offset="60%" stop-color="${colors.end}" />
          <stop offset="100%" stop-color="#0b1710" />
        </linearGradient>
        <linearGradient id="gold-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f2d896" />
          <stop offset="100%" stop-color="#b28a3c" />
        </linearGradient>
        <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1.5" fill="#ffffff" fill-opacity="0.04" />
        </pattern>
      </defs>

      <!-- Rich Gradient Background -->
      <rect width="100%" height="100%" fill="url(#bg-grad)" />
      <rect width="100%" height="100%" fill="url(#dots)" />

      <!-- Organic Food & Event Plates Illumination -->
      <circle cx="180" cy="100" r="160" fill="none" stroke="url(#gold-accent)" stroke-width="1.5" stroke-opacity="0.15" />
      <circle cx="180" cy="100" r="110" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="6 6" />
      <circle cx="1020" cy="300" r="200" fill="none" stroke="url(#gold-accent)" stroke-width="1.5" stroke-opacity="0.15" />
      <circle cx="1020" cy="300" r="140" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="8 8" />

      <!-- Center Ambient Glow -->
      <circle cx="600" cy="200" r="300" fill="#f2d896" fill-opacity="0.04" filter="blur(40px)" />

      <!-- Center Typography Group -->
      <g transform="translate(600, 195)" text-anchor="middle">
        <!-- Subtitle Eyebrow -->
        <rect x="-140" y="-85" width="280" height="26" rx="13" fill="#ffffff" fill-opacity="0.08" />
        <text y="-68" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#f2d896" letter-spacing="3">
          ${catText}
        </text>

        <!-- Main Business Title -->
        <text font-family="'Outfit', 'Playfair Display', Georgia, serif" font-size="${fontSize}" font-weight="900" fill="#000000" fill-opacity="0.3" letter-spacing="-1" dy="16">
          ${safeName}
        </text>
        <text font-family="'Outfit', 'Playfair Display', Georgia, serif" font-size="${fontSize}" font-weight="900" fill="#ffffff" letter-spacing="-1" dy="12">
          ${safeName}
        </text>

        <!-- Divider & Motto -->
        <line x1="-80" y1="52" x2="80" y2="52" stroke="url(#gold-accent)" stroke-width="2" stroke-opacity="0.6" />
        <text y="78" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#ffffff" fill-opacity="0.8" letter-spacing="2">
          SPEISELY PREMIUM STOREFRONT
        </text>
      </g>

      <!-- Corner Frame Elements -->
      <path d="M 50 60 L 50 50 L 60 50" fill="none" stroke="#f2d896" stroke-width="2" stroke-opacity="0.3" />
      <path d="M 1150 60 L 1150 50 L 1140 50" fill="none" stroke="#f2d896" stroke-width="2" stroke-opacity="0.3" />
      <path d="M 50 340 L 50 350 L 60 350" fill="none" stroke="#f2d896" stroke-width="2" stroke-opacity="0.3" />
      <path d="M 1150 340 L 1150 350 L 1140 350" fill="none" stroke="#f2d896" stroke-width="2" stroke-opacity="0.3" />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
