import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const outDir = 'public/instagram/chicken-krush-prag';

// ═══════════════════════════════════════════════════════════
// SPEISELY BRAND COLORS (exact from reference)
// ═══════════════════════════════════════════════════════════
// Forest Green:  #173C32
// Forest Dark:   #0f2720
// Gold:          #E6B84A
// Sand/Cream:    #FAF7F0
// Clay/Terracotta: #A85C36

async function generateSlides() {
  await fs.mkdir(outDir, { recursive: true });

  const W = 1080;
  const H = 1350;

  // ═══════════════════════════════════════════════════════════
  // SLIDE 1 — COVER (matches reference exactly)
  // ═══════════════════════════════════════════════════════════
  const coverBg = await sharp('public/magazin/chicken-krush-prag/chicken-krush-real-01.jpg')
    .resize(W, H, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .modulate({ brightness: 1.08, saturation: 1.22 })
    .sharpen({ sigma: 1.8, m1: 1.4, m2: 2.5 })
    .toBuffer();

  const svgCover = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Strong bottom gradient matching reference -->
      <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1f1a" stop-opacity="0.0"/>
        <stop offset="42%" stop-color="#0a1f1a" stop-opacity="0.0"/>
        <stop offset="62%" stop-color="#0a1f1a" stop-opacity="0.65"/>
        <stop offset="80%" stop-color="#0a1f1a" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#0a1f1a" stop-opacity="0.97"/>
      </linearGradient>
      <!-- Top subtle fade -->
      <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1f1a" stop-opacity="0.45"/>
        <stop offset="18%" stop-color="#0a1f1a" stop-opacity="0.0"/>
      </linearGradient>
    </defs>

    <!-- Top gradient for badge readability -->
    <rect width="${W}" height="220" fill="url(#topFade)"/>
    <!-- Strong bottom gradient -->
    <rect width="${W}" height="${H}" fill="url(#bottomFade)"/>

    <!-- ╔══ TOP BAR ══╗ -->
    <!-- LEFT: SPEISELY MAGAZIN pill (dark forest green, matching reference) -->
    <g transform="translate(48, 52)">
      <rect width="248" height="52" rx="26" fill="#173C32"/>
      <text x="124" y="33" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        font-size="18" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="2.5">SPEISELY MAGAZIN</text>
    </g>

    <!-- RIGHT: Counter pill (dark semi-transparent) -->
    <g transform="translate(${W - 150}, 52)">
      <rect width="102" height="52" rx="26" fill="rgba(10,31,26,0.72)" stroke="rgba(250,247,240,0.25)" stroke-width="1.5"/>
      <text x="51" y="33" font-family="'Arial Black', Arial, sans-serif"
        font-size="20" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="1">1/5</text>
    </g>

    <!-- ╔══ BOTTOM CONTENT ══╗ -->
    <g transform="translate(52, ${H - 420})">

      <!-- GOLD COMMUNITY STORY BADGE (solid gold pill, matching reference) -->
      <rect width="348" height="52" rx="26" fill="#E6B84A"/>
      <text x="174" y="34" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        font-size="17" font-weight="900" fill="#173C32" text-anchor="middle" letter-spacing="2">SPEISELY COMMUNITY STORY</text>

      <!-- HEADLINE (large bold Fraunces-style serif, white) -->
      <text x="0" y="130" font-family="Georgia, 'Times New Roman', serif"
        font-size="66" font-weight="900" fill="#FFFFFF">Goldener Crunch,</text>
      <text x="0" y="210" font-family="Georgia, 'Times New Roman', serif"
        font-size="66" font-weight="900" fill="#FFFFFF">Yangnyeom &amp; Tteokbokki</text>

      <!-- SUBTITLE -->
      <text x="0" y="275" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="30" font-weight="400" fill="rgba(250,247,240,0.85)">Zu Besuch bei Chicken Krush in Prag.</text>

      <!-- DOT INDICATORS (matching reference: gold active + grey) -->
      <g transform="translate(4, 318)">
        <rect width="32" height="11" rx="5.5" fill="#E6B84A"/>
        <circle cx="52" cy="5.5" r="5.5" fill="rgba(250,247,240,0.35)"/>
        <circle cx="72" cy="5.5" r="5.5" fill="rgba(250,247,240,0.35)"/>
        <circle cx="92" cy="5.5" r="5.5" fill="rgba(250,247,240,0.35)"/>
        <circle cx="112" cy="5.5" r="5.5" fill="rgba(250,247,240,0.35)"/>
      </g>
    </g>
  </svg>`;

  await sharp(coverBg)
    .composite([{ input: Buffer.from(svgCover), top: 0, left: 0 }])
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'slide-1.png'));
  console.log('✅ slide-1.png (Cover)');

  // ═══════════════════════════════════════════════════════════
  // SLIDES 2–4: Split layout (photo top, white card bottom)
  // Matching the Speisely design system exactly
  // ═══════════════════════════════════════════════════════════
  async function makeSplitSlide({ num, imgPath, kicker, heading, body1, body2 }) {
    const photoH = 840;
    const cardY = photoH;
    const cardH = H - photoH;

    // Process photo with clarity boost
    const photo = await sharp(imgPath)
      .resize(W, photoH, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
      .modulate({ brightness: 1.06, saturation: 1.20 })
      .sharpen({ sigma: 1.6, m1: 1.3, m2: 2.2 })
      .toBuffer();

    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="photoTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1f1a" stop-opacity="0.5"/>
          <stop offset="15%" stop-color="#0a1f1a" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Subtle top fade for badge readability -->
      <rect width="${W}" height="180" fill="url(#photoTop)"/>

      <!-- ╔══ TOP BAR ══╗ -->
      <!-- LEFT: SPEISELY COMMUNITY pill -->
      <g transform="translate(48, 52)">
        <rect width="272" height="52" rx="26" fill="#173C32"/>
        <text x="136" y="33" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
          font-size="17" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="2.5">SPEISELY COMMUNITY</text>
      </g>

      <!-- RIGHT: Counter -->
      <g transform="translate(${W - 150}, 52)">
        <rect width="102" height="52" rx="26" fill="rgba(10,31,26,0.72)" stroke="rgba(250,247,240,0.25)" stroke-width="1.5"/>
        <text x="51" y="33" font-family="'Arial Black', Arial, sans-serif"
          font-size="20" font-weight="900" fill="#FAF7F0" text-anchor="middle">${num}/5</text>
      </g>

      <!-- ╔══ WHITE CARD (bottom) ══╗ -->
      <rect x="0" y="${cardY}" width="${W}" height="${cardH}" fill="#FFFFFF"/>

      <!-- Top border line on card -->
      <line x1="0" y1="${cardY}" x2="${W}" y2="${cardY}" stroke="rgba(23,60,50,0.1)" stroke-width="2"/>

      <!-- Left accent bar -->
      <rect x="52" y="${cardY + 52}" width="5" height="${cardH - 104}" rx="2.5" fill="#E6B84A"/>

      <!-- KICKER (terracotta uppercase, matching Speisely style) -->
      <text x="80" y="${cardY + 95}" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        font-size="19" font-weight="900" fill="#A85C36" letter-spacing="3">${kicker}</text>

      <!-- HEADING (dark forest serif) -->
      <text x="80" y="${cardY + 170}" font-family="Georgia, 'Times New Roman', serif"
        font-size="54" font-weight="900" fill="#173C32">${heading}</text>

      <!-- BODY TEXT -->
      <text x="80" y="${cardY + 250}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="28" font-weight="400" fill="rgba(23,60,50,0.78)">${body1}</text>
      <text x="80" y="${cardY + 294}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="28" font-weight="400" fill="rgba(23,60,50,0.78)">${body2}</text>

      <!-- Gold bottom accent line on card -->
      <rect x="52" y="${cardY + cardH - 52}" width="${W - 104}" height="3" rx="1.5" fill="rgba(230,184,74,0.18)"/>
    </svg>`;

    const base = await sharp({
      create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
    }).png().toBuffer();

    await sharp(base)
      .composite([
        { input: photo, top: 0, left: 0 },
        { input: Buffer.from(svg), top: 0, left: 0 }
      ])
      .png({ quality: 100 })
      .toFile(path.join(outDir, `slide-${num}.png`));
    console.log(`✅ slide-${num}.png`);
  }

  await makeSplitSlide({
    num: 2,
    imgPath: 'public/magazin/chicken-krush-prag/chicken-krush-real-02.jpg',
    kicker: '01 · DIE LOCATION',
    heading: 'Neonschein &amp; Touchscreen',
    body1: 'Versteckt in der Příčná-Straße: Urbanes K-Food-',
    body2: 'Ambiente mit Touchscreen-Order an jedem Tisch.'
  });

  await makeSplitSlide({
    num: 3,
    imgPath: 'public/magazin/chicken-krush-prag/chicken-krush-real-03.jpg',
    kicker: '02 · DAS SLOW-FRIED-PRINZIP',
    heading: 'Crunch, der laut bricht',
    body1: 'Feine Stärkepanade, punktgenau frittiert. Die Kruste',
    body2: 'bricht laut — innen bleibt das Fleisch saftig heiß.'
  });

  await makeSplitSlide({
    num: 4,
    imgPath: 'public/magazin/chicken-krush-prag/chicken-krush-real-04.jpg',
    kicker: '03 · DIE GLASUR',
    heading: 'Yangnyeom-Glanz',
    body1: 'Gochujang, Honig, Knoblauch — dick eingekocht.',
    body2: 'Abgerundet mit gerösteten Mandelsplittern.'
  });

  // ═══════════════════════════════════════════════════════════
  // SLIDE 5 — OUTRO (solid dark forest green, Thronburger-style)
  // ═══════════════════════════════════════════════════════════
  const svgOutro = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="42%" r="70%">
        <stop offset="0%" stop-color="#1e5242"/>
        <stop offset="60%" stop-color="#173C32"/>
        <stop offset="100%" stop-color="#0f2720"/>
      </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="${W}" height="${H}" fill="url(#bg)"/>

    <!-- Subtle grain texture lines -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>

    <!-- ╔══ TOP BAR ══╗ -->
    <g transform="translate(48, 52)">
      <rect width="248" height="52" rx="26" fill="rgba(255,255,255,0.08)" stroke="rgba(250,247,240,0.3)" stroke-width="1.5"/>
      <text x="124" y="33" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        font-size="18" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="2.5">SPEISELY MAGAZIN</text>
    </g>
    <g transform="translate(${W - 150}, 52)">
      <rect width="102" height="52" rx="26" fill="rgba(255,255,255,0.08)" stroke="rgba(250,247,240,0.3)" stroke-width="1.5"/>
      <text x="51" y="33" font-family="'Arial Black', Arial, sans-serif"
        font-size="20" font-weight="900" fill="#FAF7F0" text-anchor="middle">5/5</text>
    </g>

    <!-- ╔══ CENTER BRAND BLOCK ══╗ -->
    <!-- Fork & Knife SVG icon -->
    <g transform="translate(490, 280)">
      <path d="M-22,-30 C-22,-18 -12,-12 -7,-7 L-28,15 C-30,17 -30,21 -28,24 C-26,26 -23,26 -21,24 L2,-1 C-4,-6 -10,-16 -22,-30 Z" fill="#E6B84A" opacity="0.9"/>
      <path d="M22,-30 C22,-18 12,-12 7,-7 L28,15 C30,17 30,21 28,24 C26,26 23,26 21,24 L-2,-1 C4,-6 10,-16 22,-30 Z" fill="#E6B84A" opacity="0.9"/>
      <circle cx="0" cy="-7" r="4.5" fill="#E6B84A"/>
    </g>

    <!-- Brand wordmark -->
    <text x="540" y="460" font-family="Georgia, 'Times New Roman', serif"
      font-size="80" font-weight="900" fill="#E6B84A" text-anchor="middle" letter-spacing="1">Speisely</text>

    <!-- Venue name (uppercase gold) -->
    <text x="540" y="530" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      font-size="24" font-weight="900" fill="#E6B84A" text-anchor="middle" letter-spacing="5.5">CHICKEN KRUSH PRAG</text>

    <!-- Gold underline accent -->
    <rect x="350" y="556" width="380" height="3" rx="1.5" fill="#E6B84A"/>

    <!-- ╔══ CTA HEADLINE ══╗ -->
    <text x="540" y="680" font-family="Georgia, 'Times New Roman', serif"
      font-size="62" font-weight="900" fill="#FFFFFF" text-anchor="middle">Lies die ganze Story</text>
    <text x="540" y="758" font-family="Georgia, 'Times New Roman', serif"
      font-size="62" font-weight="900" fill="#FFFFFF" text-anchor="middle">auf speisely.de!</text>

    <!-- Subline -->
    <text x="540" y="836" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="28" font-weight="400" fill="rgba(250,247,240,0.7)" text-anchor="middle">Authentische K-Food-Kultur in Prag-Nové Město</text>

    <!-- ╔══ ACTION ICONS ROW ══╗ -->
    <rect x="160" y="920" width="760" height="92" rx="46"
      fill="rgba(255,255,255,0.07)" stroke="rgba(230,184,74,0.4)" stroke-width="2"/>
    <!-- Speichern -->
    <text x="305" y="977" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="26" font-weight="700" fill="#FAF7F0" text-anchor="middle">🔖 Speichern</text>
    <!-- Dividers -->
    <line x1="400" y1="942" x2="400" y2="1000" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <line x1="680" y1="942" x2="680" y2="1000" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <!-- Teilen -->
    <text x="540" y="977" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="26" font-weight="700" fill="#FAF7F0" text-anchor="middle">🔗 Teilen</text>
    <!-- Liken -->
    <text x="775" y="977" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="26" font-weight="700" fill="#FAF7F0" text-anchor="middle">❤️ Liken</text>

    <!-- ╔══ CTA PILL BUTTON ══╗ -->
    <rect x="315" y="1064" width="450" height="82" rx="41"
      fill="none" stroke="#E6B84A" stroke-width="3"/>
    <text x="540" y="1119" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      font-size="30" font-weight="900" fill="#E6B84A" text-anchor="middle" letter-spacing="2">↗ speisely.de ↗</text>

    <!-- Small bottom tag -->
    <text x="540" y="1290" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size="20" font-weight="500" fill="rgba(250,247,240,0.3)" text-anchor="middle">speisely.de/magazin/community/chicken-krush-prag</text>
  </svg>`;

  await sharp(Buffer.from(svgOutro))
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'slide-5.png'));
  console.log('✅ slide-5.png (Outro)');

  console.log('\n🎉 All 5 carousel slides rendered at 1080×1350 px!');
}

generateSlides().catch(console.error);
