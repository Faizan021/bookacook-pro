import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const outDir = 'public/instagram/san-sebastian-berlin';
const W = 1080;
const H = 1350;

// Curated HD enhanced assets
const photos = {
  hero:       'public/magazin/san-sebastian-berlin/san-sebastian-hd-01-choc-waterfall.jpg',
  pistachio:  'public/magazin/san-sebastian-berlin/san-sebastian-hd-02-pistachio-gold.jpg',
  showcase:   'public/magazin/san-sebastian-berlin/san-sebastian-hd-03-showcase-varieties.jpg',
  lotus:      'public/magazin/san-sebastian-berlin/san-sebastian-hd-04-lotus-biscoff.jpg',
  mango:      'public/magazin/san-sebastian-berlin/san-sebastian-hd-05-mango-hazelnut.jpg',
  moss:       'public/magazin/san-sebastian-berlin/san-sebastian-hd-06-moss-wall-neon.jpg',
};

async function generateSlides() {
  await fs.mkdir(outDir, { recursive: true });

  // ═══════════════════════════════════════════════════════════
  // SLIDE 1 — COVER (Chocolate waterfall slice HD)
  // ═══════════════════════════════════════════════════════════
  const coverBg = await sharp(photos.hero)
    .resize(W, H, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .toBuffer();

  const svgCover = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1f1a" stop-opacity="0.0"/>
        <stop offset="38%" stop-color="#0a1f1a" stop-opacity="0.0"/>
        <stop offset="58%" stop-color="#0a1f1a" stop-opacity="0.62"/>
        <stop offset="78%" stop-color="#0a1f1a" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#0a1f1a" stop-opacity="0.97"/>
      </linearGradient>
      <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a1f1a" stop-opacity="0.52"/>
        <stop offset="20%" stop-color="#0a1f1a" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="230" fill="url(#topFade)"/>
    <rect width="${W}" height="${H}" fill="url(#bottomFade)"/>

    <!-- TOP BAR -->
    <g transform="translate(48, 54)">
      <rect width="248" height="52" rx="26" fill="#173C32"/>
      <text x="124" y="34" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
        font-size="18" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="2.5">SPEISELY MAGAZIN</text>
    </g>
    <g transform="translate(${W - 148}, 54)">
      <rect width="100" height="52" rx="26" fill="rgba(10,31,26,0.72)" stroke="rgba(250,247,240,0.25)" stroke-width="1.5"/>
      <text x="50" y="34" font-family="'Arial Black',Arial,sans-serif"
        font-size="20" font-weight="900" fill="#FAF7F0" text-anchor="middle">1/5</text>
    </g>

    <!-- BOTTOM CONTENT -->
    <g transform="translate(52, ${H - 410})">
      <!-- Gold story badge -->
      <rect width="352" height="54" rx="27" fill="#E6B84A"/>
      <text x="176" y="35" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
        font-size="17" font-weight="900" fill="#173C32" text-anchor="middle" letter-spacing="2">SPEISELY COMMUNITY STORY</text>

      <!-- Headline -->
      <text x="0" y="128" font-family="Georgia,'Times New Roman',serif"
        font-size="66" font-weight="900" fill="#FFFFFF">Karamellisierte Kruste,</text>
      <text x="0" y="208" font-family="Georgia,'Times New Roman',serif"
        font-size="66" font-weight="900" fill="#FFFFFF">samtiger Kern &amp;</text>
      <text x="0" y="288" font-family="Georgia,'Times New Roman',serif"
        font-size="66" font-weight="900" fill="#FFFFFF">warmer Schokofluss</text>

      <!-- Subtitle -->
      <text x="0" y="352" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
        font-size="30" font-weight="400" fill="rgba(250,247,240,0.85)">Zu Besuch bei San Sebastian The Original® in Berlin.</text>

      <!-- Dot indicators -->
      <g transform="translate(2, 396)">
        <rect width="34" height="12" rx="6" fill="#E6B84A"/>
        <circle cx="54" cy="6" r="6" fill="rgba(250,247,240,0.32)"/>
        <circle cx="75" cy="6" r="6" fill="rgba(250,247,240,0.32)"/>
        <circle cx="96" cy="6" r="6" fill="rgba(250,247,240,0.32)"/>
        <circle cx="117" cy="6" r="6" fill="rgba(250,247,240,0.32)"/>
      </g>
    </g>
  </svg>`;

  await sharp(coverBg)
    .composite([{ input: Buffer.from(svgCover), top: 0, left: 0 }])
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'slide-1.png'));
  console.log('✅ slide-1.png (Cover — HD Chocolate Waterfall)');

  // ═══════════════════════════════════════════════════════════
  // SLIDES 2–4: Split layout
  // ═══════════════════════════════════════════════════════════
  async function makeSplitSlide({ num, imgPath, kicker, heading, body, slideNum, total = 5 }) {
    const photoH = 836;
    const cardH = H - photoH;

    const photo = await sharp(imgPath)
      .resize(W, photoH, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
      .toBuffer();

    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1f1a" stop-opacity="0.52"/>
          <stop offset="18%" stop-color="#0a1f1a" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="180" fill="url(#pt)"/>

      <!-- TOP BAR -->
      <g transform="translate(48, 54)">
        <rect width="278" height="52" rx="26" fill="#173C32"/>
        <text x="139" y="34" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
          font-size="17" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="2.5">SPEISELY COMMUNITY</text>
      </g>
      <g transform="translate(${W - 148}, 54)">
        <rect width="100" height="52" rx="26" fill="rgba(10,31,26,0.72)" stroke="rgba(250,247,240,0.25)" stroke-width="1.5"/>
        <text x="50" y="34" font-family="'Arial Black',Arial,sans-serif"
          font-size="20" font-weight="900" fill="#FAF7F0" text-anchor="middle">${slideNum}/${total}</text>
      </g>

      <!-- WHITE CARD -->
      <rect x="0" y="${photoH}" width="${W}" height="${cardH}" fill="#FFFFFF"/>
      <line x1="0" y1="${photoH}" x2="${W}" y2="${photoH}" stroke="rgba(23,60,50,0.1)" stroke-width="2"/>
      <!-- Gold left accent bar -->
      <rect x="52" y="${photoH + 48}" width="6" height="${cardH - 96}" rx="3" fill="#E6B84A"/>

      <!-- KICKER -->
      <text x="84" y="${photoH + 94}" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
        font-size="20" font-weight="900" fill="#A85C36" letter-spacing="3">${kicker}</text>

      <!-- HEADING -->
      <text x="84" y="${photoH + 168}" font-family="Georgia,'Times New Roman',serif"
        font-size="56" font-weight="900" fill="#173C32">${heading}</text>

      <!-- BODY -->
      <text x="84" y="${photoH + 254}" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
        font-size="30" font-weight="400" fill="rgba(23,60,50,0.78)">${body[0]}</text>
      ${body[1] ? `<text x="84" y="${photoH + 298}" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
        font-size="30" font-weight="400" fill="rgba(23,60,50,0.78)">${body[1]}</text>` : ''}
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
    console.log(`✅ slide-${num}.png (HD)`);
  }

  // Slide 2 — History / Tradition (HD Pistachio on gold plate)
  await makeSplitSlide({
    num: 2, imgPath: photos.pistachio, slideNum: 2,
    kicker: '01 · DIE LEGENDE AUS SPANIEN',
    heading: 'Aus San Sebastián 1990',
    body: ['Erfunden in der Pintxos-Bar La Viña:', 'Ohne Boden, bei hoher Hitze gebacken.']
  });

  // Slide 3 — Lotus Biscoff Crumble (HD Lotus)
  await makeSplitSlide({
    num: 3, imgPath: photos.lotus, slideNum: 3,
    kicker: '02 · DAS GESCHMACKSPROFIL',
    heading: 'Karamell trifft Schmelz',
    body: ['Dunkle Röstaromen außen, herrlich samtiger', 'Vanille-Frischkäsekern im Inneren.']
  });

  // Slide 4 — Showcase & Variety (HD Showcase)
  await makeSplitSlide({
    num: 4, imgPath: photos.showcase, slideNum: 4,
    kicker: '03 · DIE TOPPING-KUNST',
    heading: 'Pistazie, Lotus &amp; Mango',
    body: ['Von heißer belgischer Schokolade bis', 'Pistazienstaub, Bueno &amp; Lotus Biscoff.']
  });

  // ═══════════════════════════════════════════════════════════
  // SLIDE 5 — OUTRO (Solid dark forest green CTA)
  // ═══════════════════════════════════════════════════════════
  const svgOutro = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="42%" r="68%">
        <stop offset="0%" stop-color="#1e5242"/>
        <stop offset="58%" stop-color="#173C32"/>
        <stop offset="100%" stop-color="#0f2720"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>

    <!-- TOP BAR -->
    <g transform="translate(48, 54)">
      <rect width="248" height="52" rx="26" fill="rgba(255,255,255,0.09)" stroke="rgba(250,247,240,0.28)" stroke-width="1.5"/>
      <text x="124" y="34" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
        font-size="18" font-weight="900" fill="#FAF7F0" text-anchor="middle" letter-spacing="2.5">SPEISELY MAGAZIN</text>
    </g>
    <g transform="translate(${W - 148}, 54)">
      <rect width="100" height="52" rx="26" fill="rgba(255,255,255,0.09)" stroke="rgba(250,247,240,0.28)" stroke-width="1.5"/>
      <text x="50" y="34" font-family="'Arial Black',Arial,sans-serif"
        font-size="20" font-weight="900" fill="#FAF7F0" text-anchor="middle">5/5</text>
    </g>

    <!-- CENTER BRAND BLOCK -->
    <g transform="translate(510, 268)">
      <path d="M-24,-32 C-24,-20 -14,-13 -8,-7 L-30,18 C-32,20 -32,24 -30,27 C-28,30 -24,30 -22,27 L2,0 C-4,-6 -11,-18 -24,-32 Z" fill="#E6B84A"/>
      <path d="M24,-32 C24,-20 14,-13 8,-7 L30,18 C32,20 32,24 30,27 C28,30 24,30 22,27 L-2,0 C4,-6 11,-18 24,-32 Z" fill="#E6B84A"/>
      <circle cx="0" cy="-7" r="5" fill="#E6B84A"/>
    </g>

    <!-- Brand wordmark -->
    <text x="540" y="470" font-family="Georgia,'Times New Roman',serif"
      font-size="82" font-weight="900" fill="#E6B84A" text-anchor="middle" letter-spacing="1">Speisely</text>

    <!-- Venue name -->
    <text x="540" y="542" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
      font-size="22" font-weight="900" fill="#E6B84A" text-anchor="middle" letter-spacing="4">SAN SEBASTIAN THE ORIGINAL® BERLIN</text>

    <!-- Gold underline -->
    <rect x="280" y="568" width="520" height="3" rx="1.5" fill="#E6B84A"/>

    <!-- CTA Headline -->
    <text x="540" y="692" font-family="Georgia,'Times New Roman',serif"
      font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle">Lies die ganze Story</text>
    <text x="540" y="772" font-family="Georgia,'Times New Roman',serif"
      font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle">auf speisely.de!</text>

    <!-- Subline -->
    <text x="540" y="848" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
      font-size="28" font-weight="400" fill="rgba(250,247,240,0.68)" text-anchor="middle">Baskische Käsekuchenkultur in Berlin-Charlottenburg</text>

    <!-- Action icons row -->
    <rect x="148" y="930" width="784" height="94" rx="47"
      fill="rgba(255,255,255,0.07)" stroke="rgba(230,184,74,0.4)" stroke-width="2"/>
    <text x="298" y="990" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
      font-size="28" font-weight="700" fill="#FAF7F0" text-anchor="middle">🔖 Speichern</text>
    <line x1="406" y1="952" x2="406" y2="1012" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="540" y="990" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
      font-size="28" font-weight="700" fill="#FAF7F0" text-anchor="middle">🔗 Teilen</text>
    <line x1="674" y1="952" x2="674" y2="1012" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <text x="782" y="990" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
      font-size="28" font-weight="700" fill="#FAF7F0" text-anchor="middle">❤️ Liken</text>

    <!-- CTA pill button -->
    <rect x="305" y="1072" width="470" height="86" rx="43"
      fill="none" stroke="#E6B84A" stroke-width="3"/>
    <text x="540" y="1127" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif"
      font-size="32" font-weight="900" fill="#E6B84A" text-anchor="middle" letter-spacing="2">↗ speisely.de ↗</text>

    <!-- URL tag -->
    <text x="540" y="1298" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
      font-size="20" font-weight="400" fill="rgba(250,247,240,0.28)" text-anchor="middle">speisely.de/magazin/community/san-sebastian-berlin</text>
  </svg>`;

  await sharp(Buffer.from(svgOutro))
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'slide-5.png'));
  console.log('✅ slide-5.png (Outro — HD dark forest CTA)');

  console.log('\n🎉 All 5 San Sebastian carousel slides rendered at 1080×1350 px in crisp HD!');
}

generateSlides().catch(console.error);
