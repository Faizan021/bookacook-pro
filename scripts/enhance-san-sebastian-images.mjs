import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = 'public/magazin/san-sebastian-berlin';

// Curated Top 6 Elite Photos
const curated = [
  {
    src: 'san-sebastian-05.jpg',
    name: 'san-sebastian-hd-01-choc-waterfall',
    brightness: 1.06,
    saturation: 1.22,
    sharpen: { sigma: 1.6, m1: 1.35, m2: 2.4 }
  },
  {
    src: 'san-sebastian-08.jpg',
    name: 'san-sebastian-hd-02-pistachio-gold',
    brightness: 1.05,
    saturation: 1.25,
    sharpen: { sigma: 1.5, m1: 1.3, m2: 2.2 }
  },
  {
    src: 'san-sebastian-02.jpg',
    name: 'san-sebastian-hd-03-showcase-varieties',
    brightness: 1.08,
    saturation: 1.20,
    sharpen: { sigma: 1.4, m1: 1.25, m2: 2.0 }
  },
  {
    src: 'san-sebastian-06.jpg',
    name: 'san-sebastian-hd-04-lotus-biscoff',
    brightness: 1.07,
    saturation: 1.24,
    sharpen: { sigma: 1.6, m1: 1.35, m2: 2.3 }
  },
  {
    src: 'san-sebastian-07.jpg',
    name: 'san-sebastian-hd-05-mango-hazelnut',
    brightness: 1.06,
    saturation: 1.26,
    sharpen: { sigma: 1.5, m1: 1.3, m2: 2.2 }
  },
  {
    src: 'san-sebastian-03.jpg',
    name: 'san-sebastian-hd-06-moss-wall-neon',
    brightness: 1.05,
    saturation: 1.20,
    sharpen: { sigma: 1.4, m1: 1.2, m2: 2.0 }
  }
];

async function enhanceImages() {
  console.log('✨ Enhancing curated San Sebastian images to HD clarity...');

  for (const item of curated) {
    const inputPath = path.join(dir, item.src);

    // Generate HD JPG
    await sharp(inputPath)
      .modulate({ brightness: item.brightness, saturation: item.saturation })
      .sharpen(item.sharpen)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(path.join(dir, `${item.name}.jpg`));

    // Generate HD WebP
    await sharp(inputPath)
      .modulate({ brightness: item.brightness, saturation: item.saturation })
      .sharpen(item.sharpen)
      .webp({ quality: 92, effort: 6 })
      .toFile(path.join(dir, `${item.name}.webp`));

    console.log(`✅ Processed HD: ${item.name}`);
  }

  console.log('\n🎉 All curated HD assets created successfully!');
}

enhanceImages().catch(console.error);
