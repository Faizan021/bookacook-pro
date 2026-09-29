import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = 'public/magazin/chicken-krush-prag/';

// Standardized 800x600 (4:3) with micro-contrast and sharpening
const TARGET_W = 800;
const TARGET_H = 600;

const ckPhotos = [
  {
    raw: 'ck-new-03.jpg', // circular logo on brick wall -> Hero / Iconic
    name: 'ck-hd-01-neon-emblem',
    gamma: 1.05,
    modulate: { brightness: 1.05, saturation: 1.25 },
    sharpen: { sigma: 1.3, m1: 1.6, m2: 2.8 }
  },
  {
    raw: 'ck-new-01.jpg', // facade golden sign
    name: 'ck-hd-02-facade-sign',
    gamma: 1.05,
    modulate: { brightness: 1.05, saturation: 1.22 },
    sharpen: { sigma: 1.2, m1: 1.5, m2: 2.6 }
  },
  {
    raw: 'ck-new-05.jpg', // classic fried chicken Born in Seoul
    name: 'ck-hd-03-classic-fried',
    gamma: 1.05,
    modulate: { brightness: 1.06, saturation: 1.26 },
    sharpen: { sigma: 1.3, m1: 1.6, m2: 2.8 }
  },
  {
    raw: 'ck-new-02.jpg', // yangnyeom taste respect
    name: 'ck-hd-04-yangnyeom-glaze',
    gamma: 1.05,
    modulate: { brightness: 1.05, saturation: 1.28 },
    sharpen: { sigma: 1.3, m1: 1.6, m2: 2.8 }
  },
  {
    raw: 'ck-new-04.jpg', // full feast sharing board
    name: 'ck-hd-05-sharing-board',
    gamma: 1.05,
    modulate: { brightness: 1.06, saturation: 1.24 },
    sharpen: { sigma: 1.3, m1: 1.6, m2: 2.8 }
  }
];

async function run() {
  console.log('✨ Standardizing Chicken Krush Prague assets to 800x600 (4:3) Luxury HD...');

  for (const item of ckPhotos) {
    const inputPath = path.join(dir, item.raw);

    await sharp(inputPath)
      .resize(TARGET_W, TARGET_H, {
        fit: 'cover',
        position: 'center',
        kernel: 'lanczos3'
      })
      .gamma(item.gamma)
      .modulate(item.modulate)
      .sharpen(item.sharpen)
      .jpeg({ quality: 98, mozjpeg: true })
      .toFile(path.join(dir, `${item.name}.jpg`));

    await sharp(inputPath)
      .resize(TARGET_W, TARGET_H, {
        fit: 'cover',
        position: 'center',
        kernel: 'lanczos3'
      })
      .gamma(item.gamma)
      .modulate(item.modulate)
      .sharpen(item.sharpen)
      .webp({ quality: 96, effort: 6 })
      .toFile(path.join(dir, `${item.name}.webp`));

    console.log(`✅ ${item.name} standardized to ${TARGET_W}x${TARGET_H} px`);
  }

  console.log('🎉 Chicken Krush HD standardization complete!');
}

run().catch(console.error);
