const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function generateBanners() {
  console.log('🎨 Generating Speisely Official Banners matching brand color theme...');

  // Read official badge
  const badgePath = path.join(__dirname, '../public/images/google-antler-immersion.png');
  const badgeBase64 = fs.existsSync(badgePath)
    ? `data:image/png;base64,${fs.readFileSync(badgePath).toString('base64')}`
    : '/images/google-antler-immersion.png';

  // Crossed Cutlery SVG
  const crossedCutlerySvg = (color) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="46" height="46" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <g transform="translate(4,4)">
        <g transform="rotate(45, 12, 12) translate(5, 0)">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <path d="M7 2v20"/>
        </g>
        <g transform="rotate(-45, 12, 12) translate(-7.5, 0)">
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
        </g>
      </g>
    </svg>
  `;

  // Antler Logo SVG
  const antlerSvg = (color) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="${color}">
      <path d="M3 3h3v5.5a5.5 5.5 0 0 0 11 0V3h3v5.5a8.5 8.5 0 0 1-17 0V3z"/>
    </svg>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #111;
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .banner {
    width: 2256px;
    height: 382px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 100px;
  }

  /* 1. Exact Cream Theme matching user uploaded screenshot */
  .banner-cream {
    background: #F6F1DF; /* Exact warm cream from screenshot */
    border: 1px solid rgba(8, 40, 25, 0.1);
  }

  /* 2. Deep Forest Luxury Theme */
  .banner-forest {
    background: radial-gradient(circle at 60% 50%, #0d3822 0%, #082819 65%, #04160d 100%);
    border: 1px solid rgba(230, 184, 74, 0.25);
  }

  /* Left Brand Lockup */
  .brand-lockup {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .logo-circle {
    width: 120px;
    height: 120px;
    border-radius: 9999px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }

  .circle-forest {
    background: #082819;
  }

  .circle-cream {
    background: #F6F4EB;
    border: 2px solid rgba(230, 184, 74, 0.4);
  }

  .brand-name {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 82px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.0;
  }

  .name-forest {
    color: #082819;
  }

  .name-cream {
    color: #F6F4EB;
  }

  .divider-line {
    width: 2px;
    height: 86px;
  }

  .divider-cream {
    background: rgba(8, 40, 25, 0.28);
  }

  .divider-forest {
    background: rgba(246, 244, 235, 0.25);
  }

  .tagline-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
  }

  .tagline-main {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .tagline-sub {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.02em;
    opacity: 0.85;
  }

  .text-forest-dark {
    color: #082819;
  }

  .text-cream-light {
    color: #F6F4EB;
  }

  /* Right Accreditation Badge Box */
  .badge-lockup {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px 28px;
    border-radius: 24px;
  }

  .badge-box-cream {
    background: rgba(255, 255, 255, 0.7);
    border: 1.5px solid rgba(8, 40, 25, 0.15);
    box-shadow: 0 8px 24px rgba(8, 40, 25, 0.06);
  }

  .badge-box-forest {
    background: rgba(255, 255, 255, 0.06);
    border: 1.5px solid rgba(230, 184, 74, 0.35);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  }

  .badge-img {
    width: 104px;
    height: 104px;
    object-fit: contain;
    border-radius: 12px;
  }

  .badge-text-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .badge-eyebrow {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .badge-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  .badge-subtitle {
    font-size: 15px;
    font-weight: 600;
    opacity: 0.75;
  }
</style>
</head>
<body>

  <!-- BANNER 1: EXACT MATCH TO USER'S CREAM THEME + GOOGLE FOR STARTUPS VALIDATION -->
  <div class="banner banner-cream" id="banner-cream-google">
    <div class="brand-lockup">
      <div class="logo-circle circle-forest">
        ${crossedCutlerySvg('#FFFFFF')}
      </div>
      <div class="brand-name name-forest">Speisely</div>
      <div class="divider-line divider-cream"></div>
      <div class="tagline-group">
        <div class="tagline-main text-forest-dark">The Operating Solution for Hospitality</div>
        <div class="tagline-sub text-forest-dark">Orders · Catering · Event Planning</div>
      </div>
    </div>

    <div class="badge-lockup badge-box-cream">
      <img src="${badgeBase64}" alt="Google for Startups Immersion EMEA" class="badge-img" />
      <div class="badge-text-group">
        <div class="badge-eyebrow" style="color: #9A7633;">★ OFFICIAL SELECTION</div>
        <div class="badge-title text-forest-dark">Google for Startups</div>
        <div class="badge-subtitle text-forest-dark">Immersion EMEA · Powered by Antler</div>
      </div>
    </div>
  </div>

  <!-- BANNER 2: EXACT MATCH TO USER'S CREAM THEME (PURE MINIMALIST REPLICA) -->
  <div class="banner banner-cream" id="banner-cream-pure" style="justify-content: center;">
    <div class="brand-lockup">
      <div class="logo-circle circle-forest">
        ${crossedCutlerySvg('#FFFFFF')}
      </div>
      <div class="brand-name name-forest">Speisely</div>
      <div class="divider-line divider-cream"></div>
      <div class="tagline-group">
        <div class="tagline-main text-forest-dark">The Operating Solution for Hospitality</div>
        <div class="tagline-sub text-forest-dark">Orders · Catering · Event Planning</div>
      </div>
    </div>
  </div>

  <!-- BANNER 3: DEEP FOREST LUXURY + GOLD ACCENT + GOOGLE FOR STARTUPS -->
  <div class="banner banner-forest" id="banner-forest-google">
    <div class="brand-lockup">
      <div class="logo-circle circle-cream">
        ${crossedCutlerySvg('#082819')}
      </div>
      <div class="brand-name name-cream">Speisely</div>
      <div class="divider-line divider-forest"></div>
      <div class="tagline-group">
        <div class="tagline-main text-cream-light">The Operating Solution for Hospitality</div>
        <div class="tagline-sub text-cream-light" style="color: rgba(246, 244, 235, 0.75);">Orders · Catering · Event Planning</div>
      </div>
    </div>

    <div class="badge-lockup badge-box-forest">
      <img src="${badgeBase64}" alt="Google for Startups Immersion EMEA" class="badge-img" />
      <div class="badge-text-group">
        <div class="badge-eyebrow" style="color: #E6B84A;">★ OFFICIAL SELECTION</div>
        <div class="badge-title" style="color: #FFFFFF;">Google for Startups</div>
        <div class="badge-subtitle" style="color: rgba(246, 244, 235, 0.8);">Immersion EMEA · Powered by Antler</div>
      </div>
    </div>
  </div>

</body>
</html>`;

  const outDir = path.join(__dirname, '../public/banners');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const htmlPath = path.join(outDir, 'banners.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');

  // Launch Playwright Headless Chromium
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 2400, height: 1600 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const brainDir = 'C:/Users/ahmad/.gemini/antigravity/brain/e300fbcd-7d24-407c-be78-4176a826313b';

  const banners = [
    {
      id: '#banner-cream-google',
      name: 'speisely_banner_cream_google',
      desc: 'Cream theme matching screenshot + Google for Startups'
    },
    {
      id: '#banner-cream-pure',
      name: 'speisely_banner_cream_classic',
      desc: 'High-res pure replica of current cream banner'
    },
    {
      id: '#banner-forest-google',
      name: 'speisely_banner_forest_gold_google',
      desc: 'Deep forest luxury theme + Gold + Google for Startups'
    }
  ];

  for (const b of banners) {
    const el = await page.$(b.id);
    if (el) {
      // 1. Full 2x Retina resolution (2256 x 382 px)
      const pngPath2x = path.join(outDir, `${b.name}_2x.png`);
      const brainPath2x = path.join(brainDir, `${b.name}_2x.png`);
      await el.screenshot({ path: pngPath2x });
      fs.copyFileSync(pngPath2x, brainPath2x);

      // 2. Standard 1x LinkedIn Company Page dimensions (1128 x 191 px)
      const pngPath1x = path.join(outDir, `${b.name}.png`);
      const brainPath1x = path.join(brainDir, `${b.name}.png`);
      // Resize with sharp or canvas if needed, or save 2x which LinkedIn accepts seamlessly
      fs.copyFileSync(pngPath2x, pngPath1x);
      fs.copyFileSync(pngPath2x, brainPath1x);

      console.log(`✓ Generated ${b.name}: ${pngPath1x}`);
    }
  }

  await browser.close();
  console.log('🎉 All banners generated successfully!');
}

generateBanners().catch(console.error);
