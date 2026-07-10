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

function getBrandColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export function generateSvgLogo(businessName: string, category?: string): string {
  const initials = businessName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "S";

  const colors = getBrandColors(businessName);
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

export function generateSvgBanner(businessName: string, category?: string): string {
  const colors = getBrandColors(businessName);
  const catText = category ? category : "Speisely Marketplace Partner";

  // Dynamically calculate font size based on business name length to prevent crop clipping on cards
  let fontSize = 64;
  if (businessName.length > 25) {
    fontSize = 32;
  } else if (businessName.length > 20) {
    fontSize = 38;
  } else if (businessName.length > 15) {
    fontSize = 44;
  } else if (businessName.length > 10) {
    fontSize = 52;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
      <defs>
        <linearGradient id="banner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.start}" />
          <stop offset="100%" stop-color="${colors.end}" />
        </linearGradient>
        <linearGradient id="glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.03" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#banner-grad)" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      <!-- Dynamic creative shapes / Abstract plates -->
      <circle cx="150" cy="80" r="120" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
      <circle cx="150" cy="80" r="80" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.05" stroke-dasharray="5 5" />
      <circle cx="1050" cy="320" r="160" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
      <circle cx="1050" cy="320" r="120" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.05" stroke-dasharray="10 5" />

      <!-- Large glowing background blobs -->
      <circle cx="600" cy="200" r="280" fill="#ffffff" fill-opacity="0.02" filter="blur(30px)" />
      <circle cx="200" cy="300" r="180" fill="${colors.start}" fill-opacity="0.2" filter="blur(50px)" />
      <circle cx="1000" cy="100" r="220" fill="${colors.end}" fill-opacity="0.2" filter="blur(60px)" />

      <!-- Elegant wave ribbon for restaurant flavor -->
      <path d="M-100,280 C300,180 400,380 800,280 C1000,230 1100,330 1300,280" fill="none" stroke="url(#glow-grad)" stroke-width="4" stroke-opacity="0.3" />
      <path d="M-100,290 C300,190 400,390 800,290 C1000,240 1100,340 1300,290" fill="none" stroke="url(#glow-grad)" stroke-width="2" stroke-opacity="0.15" stroke-dasharray="10 10" />

      <!-- Center-aligned typography (safe from cropping) -->
      <g transform="translate(600, 210)" text-anchor="middle">
        <!-- Drop shadow text -->
        <text font-family="'Outfit', 'Inter', sans-serif" font-size="${fontSize}" font-weight="900" fill="#000000" fill-opacity="0.2" letter-spacing="-1" dy="4">
          ${businessName}
        </text>
        <text font-family="'Outfit', 'Inter', sans-serif" font-size="${fontSize}" font-weight="900" fill="#ffffff" letter-spacing="-1">
          ${businessName}
        </text>
        <text y="52" font-family="'Inter', sans-serif" font-size="20" font-weight="600" fill="#ffffff" fill-opacity="0.75" letter-spacing="2" text-transform="uppercase">
          ✨ ${catText} ✨
        </text>
      </g>

      <!-- Framing corners -->
      <path d="M 40 60 L 40 40 L 60 40" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.2" />
      <path d="M 1160 60 L 1160 40 L 1140 40" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.2" />
      <path d="M 40 340 L 40 360 L 60 360" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.2" />
      <path d="M 1160 340 L 1160 360 L 1140 360" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.2" />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
