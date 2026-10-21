const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function generateLinkedInCarousel() {
  console.log('🎨 Regenerating Speisely × Google for Startups LinkedIn Carousel with OFFICIAL Speisely Crossed Cutlery Logo & Forest Brand Colors...');

  // Read the official badge as Base64 for zero-latency in-browser rendering
  const badgePath = path.join(__dirname, '../public/images/google-antler-immersion.png');
  const badgeBase64 = fs.existsSync(badgePath) 
    ? `data:image/png;base64,${fs.readFileSync(badgePath).toString('base64')}`
    : '/images/google-antler-immersion.png';

  // Official Speisely Cutlery Emblem SVG (from SpeiselyLogo.tsx & favicon.svg)
  const officialLogoSvg = (strokeColor, bgColor, circleSize = 44, iconSize = 24) => `
    <div style="width: ${circleSize}px; height: ${circleSize}px; border-radius: 9999px; background: ${bgColor}; display: grid; place-items: center; flex-shrink: 0;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${iconSize}" height="${iconSize}" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
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
    </div>
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
    background: #000;
    font-family: 'Inter', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @page {
    size: 1080px 1350px;
    margin: 0;
  }

  .slide {
    width: 1080px;
    height: 1350px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 80px 64px 80px;
  }

  /* Deep Speisely Forest Green & Warm Cream Brand Palette */
  .slide-forest-dark {
    background: radial-gradient(circle at 50% 30%, #0d3822 0%, #082819 60%, #04170e 100%);
    color: #F6F4EB;
  }

  .slide-cream-light {
    background: #F7F5EE;
    color: #082819;
  }

  .slide-forest-deep {
    background: radial-gradient(circle at 75% 25%, #0f3d26 0%, #082819 65%, #051a10 100%);
    color: #F6F4EB;
  }

  .slide-ivory-light {
    background: linear-gradient(180deg, #FBF9F4 0%, #EFECE1 100%);
    color: #082819;
  }

  .slide-forest-midnight {
    background: radial-gradient(circle at 30% 25%, #0e3722 0%, #082516 65%, #04140c 100%);
    color: #F6F4EB;
  }

  .slide-forest-gold {
    background: radial-gradient(circle at 50% 45%, #124028 0%, #082819 65%, #04160d 100%);
    color: #F6F4EB;
  }

  /* Header Bar */
  .slide-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    z-index: 10;
  }

  .brand-tag {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .brand-logo-text {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .slide-counter {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.12em;
    padding: 7px 18px;
    border-radius: 9999px;
  }

  .counter-dark {
    background: rgba(246, 244, 235, 0.08);
    color: rgba(246, 244, 235, 0.75);
    border: 1px solid rgba(246, 244, 235, 0.15);
  }

  .counter-light {
    background: rgba(8, 40, 25, 0.06);
    color: #082819;
    border: 1px solid rgba(8, 40, 25, 0.15);
  }

  /* Eyebrow Pill */
  .eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    padding: 8px 18px;
    border-radius: 9999px;
    margin-bottom: 24px;
    width: fit-content;
  }

  .pill-gold {
    background: rgba(230, 184, 74, 0.15);
    color: #E6B84A;
    border: 1px solid rgba(230, 184, 74, 0.35);
  }

  .pill-forest {
    background: rgba(8, 40, 25, 0.08);
    color: #082819;
    border: 1px solid rgba(8, 40, 25, 0.2);
  }

  /* Typography */
  .title-serif {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.12;
  }

  .title-hero {
    font-size: 58px;
  }

  .title-section {
    font-size: 50px;
    margin-bottom: 24px;
  }

  .lead-text {
    font-size: 22px;
    line-height: 1.5;
    opacity: 0.88;
    font-weight: 400;
  }

  /* Cards */
  .card-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 32px;
    width: 100%;
  }

  .feature-card {
    border-radius: 24px;
    padding: 28px 32px;
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }

  .card-dark {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  .card-light {
    background: #FFFFFF;
    border: 1px solid rgba(8, 40, 25, 0.1);
    box-shadow: 0 10px 30px rgba(8, 40, 25, 0.04);
  }

  .card-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    flex-shrink: 0;
  }

  .icon-dark {
    background: rgba(230, 184, 74, 0.15);
    border: 1px solid rgba(230, 184, 74, 0.3);
  }

  .icon-light {
    background: rgba(8, 40, 25, 0.08);
    border: 1px solid rgba(8, 40, 25, 0.18);
  }

  .card-content h3 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .card-content p {
    font-size: 17px;
    line-height: 1.55;
    opacity: 0.82;
  }

  /* Metrics Grid */
  .metrics-2x2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 32px;
  }

  .metric-box {
    border-radius: 24px;
    padding: 32px 28px;
  }

  .metric-number {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 46px;
    font-weight: 800;
    line-height: 1.0;
    margin-bottom: 10px;
    color: #082819;
  }

  .metric-label {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #082819;
  }

  .metric-sub {
    font-size: 15px;
    line-height: 1.45;
    color: rgba(8, 40, 25, 0.68);
  }

  /* Footer Bar */
  .slide-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-top: 24px;
    border-top: 1px solid rgba(246, 244, 235, 0.12);
    z-index: 10;
  }

  .footer-light-border {
    border-top: 1px solid rgba(8, 40, 25, 0.12);
  }

  .footer-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
    opacity: 0.65;
  }

  .swipe-cta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 700;
    color: #E6B84A;
  }

  .swipe-cta-forest {
    color: #082819;
  }

  /* Center Badge Frame on Cover */
  .badge-frame {
    background: #092617;
    border: 2px solid rgba(230, 184, 74, 0.4);
    border-radius: 36px;
    padding: 24px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(230, 184, 74, 0.15);
    margin: 36px auto;
    width: 380px;
    height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 20px;
  }

  /* Outro CTA Box */
  .cta-big-card {
    background: linear-gradient(135deg, rgba(230, 184, 74, 0.18) 0%, rgba(8, 40, 25, 0.35) 100%);
    border: 1.5px solid rgba(230, 184, 74, 0.45);
    border-radius: 28px;
    padding: 38px 40px;
    margin-top: 32px;
    text-align: center;
  }

  .cta-button {
    display: inline-block;
    background: #E6B84A;
    color: #082819;
    font-size: 20px;
    font-weight: 800;
    padding: 18px 44px;
    border-radius: 9999px;
    margin-top: 24px;
    letter-spacing: -0.01em;
  }
</style>
</head>
<body>

<!-- SLIDE 1: COVER -->
<div class="slide slide-forest-dark" id="slide-1">
  <div class="slide-header">
    <div class="brand-tag">
      ${officialLogoSvg('#F6F4EB', 'rgba(246, 244, 235, 0.15)', 46, 24)}
      <span class="brand-logo-text" style="color: #F6F4EB;">Speisely</span>
    </div>
    <span class="slide-counter counter-dark">01 / 06</span>
  </div>

  <div style="text-align: center; margin-top: auto; margin-bottom: auto;">
    <div class="eyebrow-pill pill-gold" style="margin-left: auto; margin-right: auto;">
      <span>★</span> OFFICIAL PROGRAM SELECTION <span>★</span>
    </div>

    <div class="badge-frame">
      <img src="${badgeBase64}" alt="Google for Startups Immersion EMEA powered by Antler" class="badge-image" />
    </div>

    <h1 class="title-serif title-hero" style="color: #FFFFFF; max-width: 900px; margin: 0 auto 16px auto;">
      Speisely Joins Google for Startups Immersion EMEA
    </h1>
    <p class="lead-text" style="color: rgba(246, 244, 235, 0.85); max-width: 780px; margin: 0 auto;">
      Powered by Antler · Scaling Germany’s direct digital gastronomy & catering ecosystem.
    </p>
  </div>

  <div class="slide-footer">
    <span class="footer-label" style="color: rgba(246, 244, 235, 0.6);">OFFICIAL ANNOUNCEMENT · SPEISELY 2026</span>
    <span class="swipe-cta">Swipe to read our story ➔</span>
  </div>
</div>

<!-- SLIDE 2: THE PROBLEM -->
<div class="slide slide-cream-light" id="slide-2">
  <div class="slide-header">
    <div class="brand-tag">
      ${officialLogoSvg('#F6F4EB', '#082819', 46, 24)}
      <span class="brand-logo-text" style="color: #082819;">Speisely</span>
    </div>
    <span class="slide-counter counter-light">02 / 06</span>
  </div>

  <div style="margin-top: auto; margin-bottom: auto;">
    <div class="eyebrow-pill pill-forest">
      THE INDUSTRY CHALLENGE
    </div>
    <h2 class="title-serif title-section" style="color: #082819;">
      The \$12 Billion Catering Market Nobody Modernized
    </h2>
    <p class="lead-text" style="color: rgba(8, 40, 25, 0.8);">
      Across Germany, corporate event planning and team catering have been stranded in outdated workflows:
    </p>

    <div class="card-grid">
      <div class="feature-card card-light">
        <div class="card-icon icon-light">🏢</div>
        <div class="card-content">
          <h3 style="color: #082819;">Opaque Corporate Booking</h3>
          <p style="color: rgba(8, 40, 25, 0.75);">Companies spend days chasing quotes, exchanging PDF attachments, and risking poor food quality with zero reliable price comparisons.</p>
        </div>
      </div>

      <div class="feature-card card-light">
        <div class="card-icon icon-light">👨‍🍳</div>
        <div class="card-content">
          <h3 style="color: #082819;">Hidden Behind 25% Middlemen</h3>
          <p style="color: rgba(8, 40, 25, 0.75);">Artisanal caterers and restaurants are squeezed by broker commissions, losing customer contact and direct brand ownership.</p>
        </div>
      </div>

      <div class="feature-card card-light">
        <div class="card-icon icon-light">📋</div>
        <div class="card-content">
          <h3 style="color: #082819;">Fragmented Discovery</h3>
          <p style="color: rgba(8, 40, 25, 0.75);">No unified platform united corporate meetings, authentic regional caterers, and direct restaurant ordering in one place.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer footer-light-border">
    <span class="footer-label" style="color: rgba(8, 40, 25, 0.6);">MARKET CONTEXT · WHY WE STARTED</span>
    <span class="swipe-cta swipe-cta-forest">Swipe to the solution ➔</span>
  </div>
</div>

<!-- SLIDE 3: THE SOLUTION -->
<div class="slide slide-forest-deep" id="slide-3">
  <div class="slide-header">
    <div class="brand-tag">
      ${officialLogoSvg('#F6F4EB', 'rgba(246, 244, 235, 0.15)', 46, 24)}
      <span class="brand-logo-text" style="color: #F6F4EB;">Speisely</span>
    </div>
    <span class="slide-counter counter-dark">03 / 06</span>
  </div>

  <div style="margin-top: auto; margin-bottom: auto;">
    <div class="eyebrow-pill pill-gold">
      OUR PLATFORM ARCHITECTURE
    </div>
    <h2 class="title-serif title-section" style="color: #FFFFFF;">
      Direct, Tech-Driven & Fair: The Speisely Platform
    </h2>
    <p class="lead-text" style="color: rgba(246, 244, 235, 0.8);">
      We built Speisely to give companies seamless event dining while putting culinary creators first:
    </p>

    <div class="card-grid">
      <div class="feature-card card-dark">
        <div class="card-icon icon-dark">🍽️</div>
        <div class="card-content">
          <h3 style="color: #F6F4EB;">Direct B2B Catering Marketplace</h3>
          <p style="color: rgba(246, 244, 235, 0.75);">Transparent per-person packages, dietary filters (Halal, Vegan, Organic), and verified local caterers for 10 to 500+ guests.</p>
        </div>
      </div>

      <div class="feature-card card-dark">
        <div class="card-icon icon-dark">⚡</div>
        <div class="card-content">
          <h3 style="color: #F6F4EB;">No-Commission Food Ordering</h3>
          <p style="color: rgba(246, 244, 235, 0.75);">Direct ordering and table reservations for local restaurants with lightning-fast digital storefronts and zero predatory fees.</p>
        </div>
      </div>

      <div class="feature-card card-dark">
        <div class="card-icon icon-dark">🤖</div>
        <div class="card-content">
          <h3 style="color: #F6F4EB;">AI-Driven Event Concierge</h3>
          <p style="color: rgba(246, 244, 235, 0.75);">Instant smart matching: companies describe their budget, date, and vibe — our engine pairs them with verified local culinary partners.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span class="footer-label" style="color: rgba(246, 244, 235, 0.6);">SPEISELY PRODUCT SUITE</span>
    <span class="swipe-cta">Swipe for traction ➔</span>
  </div>
</div>

<!-- SLIDE 4: TRACTION -->
<div class="slide slide-ivory-light" id="slide-4">
  <div class="slide-header">
    <div class="brand-tag">
      ${officialLogoSvg('#F6F4EB', '#082819', 46, 24)}
      <span class="brand-logo-text" style="color: #082819;">Speisely</span>
    </div>
    <span class="slide-counter counter-light">04 / 06</span>
  </div>

  <div style="margin-top: auto; margin-bottom: auto;">
    <div class="eyebrow-pill pill-forest">
      MOMENTUM & SCALE
    </div>
    <h2 class="title-serif title-section" style="color: #082819;">
      Rapid Growth Across Germany’s Top Metropolises
    </h2>
    <p class="lead-text" style="color: rgba(8, 40, 25, 0.8);">
      Connecting authentic gastronomic craftsmanship with corporate demand:
    </p>

    <div class="metrics-2x2">
      <div class="metric-box card-light">
        <div class="metric-number">5 Hubs</div>
        <div class="metric-label">Regional Expansion</div>
        <div class="metric-sub">Dedicated hubs live across Berlin, Frankfurt, Köln, München & Hamburg.</div>
      </div>

      <div class="metric-box card-light">
        <div class="metric-number">100%</div>
        <div class="metric-label">Direct Relationship</div>
        <div class="metric-sub">Caterers keep their customer contacts, custom pricing, and repeat client trust.</div>
      </div>

      <div class="metric-box card-light">
        <div class="metric-number">B2B + B2C</div>
        <div class="metric-label">Unified Marketplace</div>
        <div class="metric-sub">Office catering, executive board dinners, private festivals, and neighborhood dining.</div>
      </div>

      <div class="metric-box card-light">
        <div class="metric-number">Zero Risk</div>
        <div class="metric-label">Fair Partner Terms</div>
        <div class="metric-sub">Free verified partner onboarding, high-ranking AI SEO, and fast secure payouts.</div>
      </div>
    </div>
  </div>

  <div class="slide-footer footer-light-border">
    <span class="footer-label" style="color: rgba(8, 40, 25, 0.6);">TRACTION & VALIDATION</span>
    <span class="swipe-cta swipe-cta-forest">Swipe to the milestone ➔</span>
  </div>
</div>

<!-- SLIDE 5: WHY GOOGLE & ANTLER -->
<div class="slide slide-forest-midnight" id="slide-5">
  <div class="slide-header">
    <div class="brand-tag">
      ${officialLogoSvg('#F6F4EB', 'rgba(246, 244, 235, 0.15)', 46, 24)}
      <span class="brand-logo-text" style="color: #F6F4EB;">Speisely</span>
    </div>
    <span class="slide-counter counter-dark">05 / 06</span>
  </div>

  <div style="margin-top: auto; margin-bottom: auto;">
    <div class="eyebrow-pill pill-gold">
      INSTITUTIONAL ACCELERATION
    </div>
    <h2 class="title-serif title-section" style="color: #FFFFFF;">
      Why Google for Startups & Antler Backed Speisely
    </h2>
    <p class="lead-text" style="color: rgba(246, 244, 235, 0.8);">
      Selected for Google for Startups Immersion EMEA (powered by Antler) to scale marketplace intelligence:
    </p>

    <div class="card-grid">
      <div class="feature-card card-dark">
        <div class="card-icon icon-dark">☁️</div>
        <div class="card-content">
          <h3 style="color: #F6F4EB;">Google AI & Cloud Architecture</h3>
          <p style="color: rgba(246, 244, 235, 0.75);">Access to Google's engineering team and Gemini AI models to build Europe's smartest conversational event planning engine.</p>
        </div>
      </div>

      <div class="feature-card card-dark">
        <div class="card-icon icon-dark">🚀</div>
        <div class="card-content">
          <h3 style="color: #F6F4EB;">Antler Venture Mentorship</h3>
          <p style="color: rgba(246, 244, 235, 0.75);">Direct strategic advisory from one of the world’s most active early-stage venture builders on marketplace unit economics.</p>
        </div>
      </div>

      <div class="feature-card card-dark">
        <div class="card-icon icon-dark">🌐</div>
        <div class="card-content">
          <h3 style="color: #F6F4EB;">EMEA Tech Network</h3>
          <p style="color: rgba(246, 244, 235, 0.75);">Joining an elite cohort of high-growth founders tackling complex supply-demand ecosystems across Europe and beyond.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span class="footer-label" style="color: rgba(246, 244, 235, 0.6);">PARTNERSHIP IMPACT · PHASE 1</span>
    <span class="swipe-cta">Swipe for the next step ➔</span>
  </div>
</div>

<!-- SLIDE 6: OUTRO & CTA -->
<div class="slide slide-forest-gold" id="slide-6">
  <div class="slide-header">
    <div class="brand-tag">
      ${officialLogoSvg('#F6F4EB', 'rgba(246, 244, 235, 0.15)', 46, 24)}
      <span class="brand-logo-text" style="color: #F6F4EB;">Speisely</span>
    </div>
    <span class="slide-counter counter-dark">06 / 06</span>
  </div>

  <div style="margin-top: auto; margin-bottom: auto; text-align: center;">
    <div class="eyebrow-pill pill-gold" style="margin-left: auto; margin-right: auto;">
      JOIN THE JOURNEY
    </div>

    <h2 class="title-serif title-hero" style="color: #FFFFFF; max-width: 900px; margin: 0 auto 20px auto;">
      The Future of Food & Events Starts Here.
    </h2>

    <p class="lead-text" style="color: rgba(246, 244, 235, 0.85); max-width: 780px; margin: 0 auto;">
      Whether you are organizing a corporate meeting or running a culinary business — be part of the shift.
    </p>

    <div class="cta-big-card">
      <div style="font-size: 22px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
        🍽️ Corporate Catering & Events
      </div>
      <p style="font-size: 16px; color: rgba(255, 255, 255, 0.75); margin-bottom: 20px;">
        Explore artisanal caterers & get fast, transparent proposals for your team.
      </p>

      <div style="font-size: 22px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
        👨‍🍳 Restaurants & Caterers
      </div>
      <p style="font-size: 16px; color: rgba(255, 255, 255, 0.75);">
        Join Germany's direct, fair food marketplace with zero middleman commissions.
      </p>

      <div class="cta-button">
        Visit speisely.de
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <span class="footer-label" style="color: rgba(246, 244, 235, 0.6);">FOLLOW @SPEISELY ON LINKEDIN & INSTAGRAM</span>
    <span style="font-size: 14px; font-weight: 700; color: #E6B84A;">speisely.de</span>
  </div>
</div>

</body>
</html>`;

  // Output directories
  const outDir = path.join(__dirname, '../public/linkedin_carousel');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const htmlPath = path.join(outDir, 'carousel.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`✓ HTML written to ${htmlPath}`);

  // Launch Playwright Headless Chromium
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2 // High-DPI Retina
  });
  const page = await context.newPage();

  await page.setContent(html, { waitUntil: 'networkidle' });

  // 1. Export High-Res PNG for each slide
  const brainDir = 'C:/Users/ahmad/.gemini/antigravity/brain/e300fbcd-7d24-407c-be78-4176a826313b';
  const slideIds = ['#slide-1', '#slide-2', '#slide-3', '#slide-4', '#slide-5', '#slide-6'];

  for (let i = 0; i < slideIds.length; i++) {
    const slideId = slideIds[i];
    const element = await page.$(slideId);
    if (element) {
      const fileName = `linkedin_slide_${i + 1}.png`;
      const publicPath = path.join(outDir, fileName);
      const brainPath = path.join(brainDir, fileName);

      await element.screenshot({ path: publicPath });
      fs.copyFileSync(publicPath, brainPath);
      console.log(`✓ Rendered Slide ${i + 1}: ${fileName}`);
    }
  }

  // 2. Export Multi-Page PDF Document for LinkedIn Document Upload
  const pdfPublicPath = path.join(__dirname, '../public/speisely_google_startups_carousel.pdf');
  const pdfBrainPath = path.join(brainDir, 'speisely_google_startups_carousel.pdf');

  await page.pdf({
    path: pdfPublicPath,
    width: '1080px',
    height: '1350px',
    printBackground: true,
    pageRanges: '1-6'
  });

  fs.copyFileSync(pdfPublicPath, pdfBrainPath);
  console.log(`✓ Generated LinkedIn Multi-Page PDF: ${pdfPublicPath}`);

  await browser.close();
  console.log('🎉 LinkedIn Carousel regeneration complete!');
}

generateLinkedInCarousel().catch(console.error);
