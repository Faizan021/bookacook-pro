import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const outDir = 'public/instagram/chicken-krush-prag';

async function generateSlides() {
  await fs.mkdir(outDir, { recursive: true });

  const W = 1080;
  const H = 1350;

  // Slide 1: Cover
  const coverBg = await sharp('public/magazin/chicken-krush-prag/chicken-krush-real-01.jpg')
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  const svgCover = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f2720" stop-opacity="0.3"/>
          <stop offset="40%" stop-color="#0f2720" stop-opacity="0.05"/>
          <stop offset="70%" stop-color="#0f2720" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#0f2720" stop-opacity="0.98"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#grad)" />

      <!-- Top Header -->
      <g transform="translate(60, 60)">
        <rect width="210" height="48" rx="24" fill="#173C32" fill-opacity="0.9" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <text x="105" y="31" font-family="sans-serif" font-size="18" font-weight="800" fill="#FAF7F0" text-anchor="middle" letter-spacing="2">SPEISELY MAGAZIN</text>
      </g>
      <g transform="translate(${W - 130}, 60)">
        <rect width="70" height="48" rx="24" fill="rgba(0,0,0,0.55)" />
        <text x="35" y="31" font-family="sans-serif" font-size="20" font-weight="700" fill="#FAF7F0" text-anchor="middle">1/5</text>
      </g>

      <!-- Bottom Cover Text -->
      <g transform="translate(60, ${H - 360})">
        <!-- Badge -->
        <rect width="320" height="44" rx="22" fill="#E6B84A" />
        <text x="160" y="28" font-family="sans-serif" font-size="16" font-weight="800" fill="#173C32" text-anchor="middle" letter-spacing="1.5">✨ SPEISELY COMMUNITY STORY</text>
        
        <!-- Headline -->
        <text x="0" y="110" font-family="serif" font-size="52" font-weight="800" fill="#FAF7F0">Goldener Crunch, Yangnyeom-</text>
        <text x="0" y="175" font-family="serif" font-size="52" font-weight="800" fill="#FAF7F0">Glanz &amp; Rose Tteokbokki</text>
        
        <!-- Subline -->
        <text x="0" y="235" font-family="sans-serif" font-size="26" font-weight="500" fill="rgba(250,247,240,0.85)">Zu Besuch bei Chicken Krush in Prag-Nové Město.</text>

        <!-- Dots -->
        <g transform="translate(0, 275)">
          <rect width="36" height="10" rx="5" fill="#E6B84A"/>
          <circle cx="56" cy="5" r="5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="76" cy="5" r="5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="96" cy="5" r="5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="116" cy="5" r="5" fill="rgba(255,255,255,0.4)"/>
        </g>
      </g>
    </svg>
  `;

  await sharp(coverBg)
    .composite([{ input: Buffer.from(svgCover) }])
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'slide-1.png'));
  console.log('Created slide-1.png');

  // Helper for Slides 2, 3, 4
  async function makeSplitSlide({ num, imgPath, kicker, title, desc }) {
    const imgH = 880;
    const cardH = H - imgH;

    const topImg = await sharp(imgPath)
      .resize(W, imgH, { fit: 'cover', position: 'center' })
      .toBuffer();

    const svgOverlay = `
      <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <!-- Top Header -->
        <g transform="translate(60, 60)">
          <rect width="230" height="48" rx="24" fill="#173C32" fill-opacity="0.9" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          <text x="115" y="31" font-family="sans-serif" font-size="18" font-weight="800" fill="#FAF7F0" text-anchor="middle" letter-spacing="2">SPEISELY COMMUNITY</text>
        </g>
        <g transform="translate(${W - 130}, 60)">
          <rect width="70" height="48" rx="24" fill="rgba(0,0,0,0.55)" />
          <text x="35" y="31" font-family="sans-serif" font-size="20" font-weight="700" fill="#FAF7F0" text-anchor="middle">${num}/5</text>
        </g>

        <!-- White Bottom Card -->
        <g transform="translate(0, ${imgH})">
          <rect width="${W}" height="${cardH}" fill="#FFFFFF" />
          <line x1="0" y1="0" x2="${W}" y2="0" stroke="rgba(23,60,50,0.1)" stroke-width="2"/>
          
          <g transform="translate(60, 65)">
            <text x="0" y="0" font-family="sans-serif" font-size="18" font-weight="800" fill="#A85C36" letter-spacing="2.5">${kicker}</text>
            <text x="0" y="55" font-family="serif" font-size="44" font-weight="700" fill="#173C32">${title}</text>
            <text x="0" y="115" font-family="sans-serif" font-size="24" font-weight="400" fill="rgba(23,60,50,0.85)" width="960">
              <tspan x="0" dy="0">${desc.split('\n')[0] || ''}</tspan>
              <tspan x="0" dy="38">${desc.split('\n')[1] || ''}</tspan>
            </text>
          </g>
        </g>
      </svg>
    `;

    const baseBg = await sharp({
      create: { width: W, height: H, channels: 4, background: '#FAF7F0' }
    }).png().toBuffer();

    await sharp(baseBg)
      .composite([
        { input: topImg, top: 0, left: 0 },
        { input: Buffer.from(svgOverlay), top: 0, left: 0 }
      ])
      .png({ quality: 100 })
      .toFile(path.join(outDir, `slide-${num}.png`));
    console.log(`Created slide-${num}.png`);
  }

  // Slide 2
  await makeSplitSlide({
    num: 2,
    imgPath: 'public/magazin/chicken-krush-prag/chicken-krush-real-02.jpg',
    kicker: '01 · DIE LOCATION',
    title: 'Neonschein &amp; Touchscreen-Order',
    desc: 'Versteckt in der ruhigen Příčná-Straße: Urbanes K-Food-Ambiente\nmit eigener digitaler Bestellkonsole an jedem Tisch.'
  });

  // Slide 3
  await makeSplitSlide({
    num: 3,
    imgPath: 'public/magazin/chicken-krush-prag/chicken-krush-real-03.jpg',
    kicker: '02 · DAS SLOW-FRIED-PRINZIP',
    title: 'Hauchdünner Crunch &amp; saftiger Kern',
    desc: 'Feine Stärkepanade, punktgenau frittiert: Die Kruste bricht laut,\nwährend das Fleisch innen saftig und heiß bleibt.'
  });

  // Slide 4
  await makeSplitSlide({
    num: 4,
    imgPath: 'public/magazin/chicken-krush-prag/chicken-krush-real-04.jpg',
    kicker: '03 · DIE GLASUR',
    title: 'Klebrig-süße Schärfe mit Gochujang',
    desc: 'Dick eingekochte Sauce mit Honig, Knoblauch und Chili,\nabgerundet mit gerösteten Mandelsplittern für extra Biss.'
  });

  // Slide 5 (Feast & Spot Pass)
  const imgH5 = 800;
  const cardH5 = H - imgH5;
  const topImg5 = await sharp('public/magazin/chicken-krush-prag/chicken-krush-real-05.jpg')
    .resize(W, imgH5, { fit: 'cover', position: 'center' })
    .toBuffer();

  const svgOverlay5 = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <!-- Top Header -->
      <g transform="translate(60, 60)">
        <rect width="230" height="48" rx="24" fill="#173C32" fill-opacity="0.9" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
        <text x="115" y="31" font-family="sans-serif" font-size="18" font-weight="800" fill="#FAF7F0" text-anchor="middle" letter-spacing="2">SPEISELY COMMUNITY</text>
      </g>
      <g transform="translate(${W - 130}, 60)">
        <rect width="70" height="48" rx="24" fill="rgba(0,0,0,0.55)" />
        <text x="35" y="31" font-family="sans-serif" font-size="20" font-weight="700" fill="#FAF7F0" text-anchor="middle">5/5</text>
      </g>

      <!-- White Bottom Card with Spot-Pass -->
      <g transform="translate(0, ${imgH5})">
        <rect width="${W}" height="${cardH5}" fill="#FFFFFF" />
        <line x1="0" y1="0" x2="${W}" y2="0" stroke="rgba(23,60,50,0.1)" stroke-width="2"/>
        
        <g transform="translate(60, 50)">
          <text x="0" y="0" font-family="sans-serif" font-size="18" font-weight="800" fill="#A85C36" letter-spacing="2.5">04 · DIE TAFEL &amp; SPOT-PASS</text>
          <text x="0" y="50" font-family="serif" font-size="42" font-weight="700" fill="#173C32">Rose Tteokbokki in der Edelstahlpfanne</text>
          <text x="0" y="96" font-family="sans-serif" font-size="23" font-weight="400" fill="rgba(23,60,50,0.85)">Cremig-scharfe Reiskuchen, Pommes und Dips zum Teilen am Tisch.</text>

          <!-- Spot Pass Box -->
          <g transform="translate(0, 130)">
            <rect width="960" height="130" rx="20" fill="rgba(23,60,50,0.04)" stroke="rgba(23,60,50,0.12)" stroke-width="2"/>
            <text x="40" y="50" font-family="sans-serif" font-size="22" font-weight="600" fill="rgba(23,60,50,0.7)">📍 Ort</text>
            <text x="160" y="50" font-family="sans-serif" font-size="22" font-weight="800" fill="#173C32">Pricna 1632/9, 110 00 Praha 1 - Nove Mesto</text>
            
            <line x1="40" y1="75" x2="920" y2="75" stroke="rgba(23,60,50,0.08)" stroke-width="1.5"/>

            <text x="40" y="105" font-family="sans-serif" font-size="22" font-weight="600" fill="rgba(23,60,50,0.7)">✨ Story</text>
            <text x="160" y="105" font-family="sans-serif" font-size="22" font-weight="800" fill="#173C32">speisely.de/magazin/community/chicken-krush-prag</text>
          </g>
        </g>
      </g>
    </svg>
  `;

  const baseBg5 = await sharp({
    create: { width: W, height: H, channels: 4, background: '#FAF7F0' }
  }).png().toBuffer();

  await sharp(baseBg5)
    .composite([
      { input: topImg5, top: 0, left: 0 },
      { input: Buffer.from(svgOverlay5), top: 0, left: 0 }
    ])
    .png({ quality: 100 })
    .toFile(path.join(outDir, 'slide-5.png'));
  console.log('Created slide-5.png');

  console.log('All 5 high-resolution Instagram slides rendered successfully!');
}

generateSlides().catch(console.error);
