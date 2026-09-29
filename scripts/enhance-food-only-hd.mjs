import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = 'public/magazin/san-sebastian-berlin';

// ONLY the 5 sharpest, crisp, mouth-watering close-up food photos (NO blurry wide room shots)
const eliteFoodPhotos = [
  {
    src: 'san-sebastian-05.jpg',
    name: 'san-sebastian-hd-01-choc-waterfall',
    scale: 2,
    brightness: 1.05,
    saturation: 1.22,
    sharpen: { sigma: 1.4, m1: 1.4, m2: 2.4 }
  },
  {
    src: 'san-sebastian-08.jpg',
    name: 'san-sebastian-hd-02-pistachio-gold',
    scale: 2,
    brightness: 1.05,
    saturation: 1.25,
    sharpen: { sigma: 1.3, m1: 1.35, m2: 2.3 }
  },
  {
    src: 'san-sebastian-02.jpg',
    name: 'san-sebastian-hd-03-showcase-varieties',
    scale: 2,
    brightness: 1.06,
    saturation: 1.20,
    sharpen: { sigma: 1.3, m1: 1.3, m2: 2.2 }
  },
  {
    src: 'san-sebastian-06.jpg',
    name: 'san-sebastian-hd-04-lotus-biscoff',
    scale: 2,
    brightness: 1.06,
    saturation: 1.24,
    sharpen: { sigma: 1.4, m1: 1.4, m2: 2.4 }
  },
  {
    src: 'san-sebastian-07.jpg',
    name: 'san-sebastian-hd-05-mango-hazelnut',
    scale: 2,
    brightness: 1.06,
    saturation: 1.26,
    sharpen: { sigma: 1.3, m1: 1.35, m2: 2.3 }
  }
];

async function process() {
  console.log('✨ Upscaling and enhancing ONLY the 5 ultra-sharp food close-up photos...');

  for (const item of eliteFoodPhotos) {
    const inputPath = path.join(dir, item.src);
    const meta = await sharp(inputPath).metadata();
    const targetW = meta.width * item.scale;
    const targetH = meta.height * item.scale;

    // 2x Lanczos3 super-sampling + tonal grading + unsharp mask
    await sharp(inputPath)
      .resize(targetW, targetH, { kernel: 'lanczos3' })
      .modulate({ brightness: item.brightness, saturation: item.saturation })
      .sharpen(item.sharpen)
      .jpeg({ quality: 96, mozjpeg: true })
      .toFile(path.join(dir, `${item.name}.jpg`));

    await sharp(inputPath)
      .resize(targetW, targetH, { kernel: 'lanczos3' })
      .modulate({ brightness: item.brightness, saturation: item.saturation })
      .sharpen(item.sharpen)
      .webp({ quality: 94, effort: 6 })
      .toFile(path.join(dir, `${item.name}.webp`));

    console.log(`✅ ${item.name} enhanced to ${targetW}x${targetH} HD`);
  }

  // Remove any legacy wide room shot files if present
  try {
    await fs.unlink(path.join(dir, 'san-sebastian-hd-06-moss-wall-neon.jpg'));
    await fs.unlink(path.join(dir, 'san-sebastian-hd-06-moss-wall-neon.webp'));
    await fs.unlink(path.join(dir, 'san-sebastian-09.jpg'));
    await fs.unlink(path.join(dir, 'san-sebastian-09.webp'));
  } catch(e) {}

  console.log('🎉 Done! Zero blurry room images remain.');
}

process().catch(console.error);
