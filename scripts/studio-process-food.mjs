import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const rawDir = 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/.user_uploaded/';
const outDir = 'public/magazin/san-sebastian-berlin/';

// We will generate compact, ultra-dense 800x600 px (4:3) images with heavy micro-contrast & edge sharpening
const TARGET_W = 800;
const TARGET_H = 600;

const items = [
  {
    raw: 'media_1790688566472.png',
    name: 'san-sebastian-hd-01-choc-waterfall',
    gamma: 1.05,
    modulate: { brightness: 1.04, saturation: 1.28 },
    sharpen: { sigma: 1.2, m1: 1.6, m2: 2.8 }
  },
  {
    raw: 'media_1790688702678.png',
    name: 'san-sebastian-hd-02-pistachio-gold',
    gamma: 1.04,
    modulate: { brightness: 1.04, saturation: 1.30 },
    sharpen: { sigma: 1.1, m1: 1.5, m2: 2.6 }
  },
  {
    raw: 'media_1790688433774.png',
    name: 'san-sebastian-hd-03-showcase-varieties',
    gamma: 1.06,
    modulate: { brightness: 1.05, saturation: 1.24 },
    sharpen: { sigma: 1.2, m1: 1.5, m2: 2.6 }
  },
  {
    raw: 'media_1790688621310.png',
    name: 'san-sebastian-hd-04-lotus-biscoff',
    gamma: 1.05,
    modulate: { brightness: 1.04, saturation: 1.28 },
    sharpen: { sigma: 1.2, m1: 1.6, m2: 2.8 }
  },
  {
    raw: 'media_1790688655556.png',
    name: 'san-sebastian-hd-05-mango-hazelnut',
    gamma: 1.05,
    modulate: { brightness: 1.04, saturation: 1.30 },
    sharpen: { sigma: 1.1, m1: 1.5, m2: 2.7 }
  }
];

async function run() {
  console.log('✨ Building Studio-Grade Crisp 4:3 Food Assets...');

  for (const it of items) {
    const src = path.join(rawDir, it.raw);

    // High fidelity resize with Lanczos3 + tone curve + micro-sharpening
    await sharp(src)
      .resize(TARGET_W, TARGET_H, {
        fit: 'cover',
        position: 'center',
        kernel: 'lanczos3'
      })
      .gamma(it.gamma)
      .modulate(it.modulate)
      .sharpen(it.sharpen)
      .jpeg({ quality: 98, mozjpeg: true })
      .toFile(path.join(outDir, `${it.name}.jpg`));

    await sharp(src)
      .resize(TARGET_W, TARGET_H, {
        fit: 'cover',
        position: 'center',
        kernel: 'lanczos3'
      })
      .gamma(it.gamma)
      .modulate(it.modulate)
      .sharpen(it.sharpen)
      .webp({ quality: 96, effort: 6 })
      .toFile(path.join(outDir, `${it.name}.webp`));

    console.log(`✅ ${it.name} generated (${TARGET_W}x${TARGET_H})`);
  }

  console.log('🎉 Done studio processing!');
}

run().catch(console.error);
