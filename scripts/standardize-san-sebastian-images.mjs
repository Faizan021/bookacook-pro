import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = 'public/magazin/san-sebastian-berlin';

// UNIFIED 4:3 EDITORIAL DIMENSIONS (1200 x 900 px) for ALL photos
const TARGET_W = 1200;
const TARGET_H = 900;

const photos = [
  {
    src: 'san-sebastian-05.jpg',
    name: 'san-sebastian-hd-01-choc-waterfall',
    pos: 'center',
    brightness: 1.05,
    saturation: 1.22
  },
  {
    src: 'san-sebastian-08.jpg',
    name: 'san-sebastian-hd-02-pistachio-gold',
    pos: 'center',
    brightness: 1.05,
    saturation: 1.25
  },
  {
    src: 'san-sebastian-02.jpg',
    name: 'san-sebastian-hd-03-showcase-varieties',
    pos: 'center',
    brightness: 1.07,
    saturation: 1.20
  },
  {
    src: 'san-sebastian-06.jpg',
    name: 'san-sebastian-hd-04-lotus-biscoff',
    pos: 'center',
    brightness: 1.06,
    saturation: 1.24
  },
  {
    src: 'san-sebastian-07.jpg',
    name: 'san-sebastian-hd-05-mango-hazelnut',
    pos: 'center',
    brightness: 1.06,
    saturation: 1.26
  }
];

async function standardizeAllImages() {
  console.log(`📐 Standardizing all photos to matching ${TARGET_W}x${TARGET_H} (4:3) with HD grading...`);

  for (const item of photos) {
    const inputPath = path.join(dir, item.src);

    // Standardized HD JPG (1200x900)
    await sharp(inputPath)
      .resize(TARGET_W, TARGET_H, {
        fit: 'cover',
        position: item.pos,
        kernel: 'lanczos3'
      })
      .modulate({ brightness: item.brightness, saturation: item.saturation })
      .sharpen({ sigma: 1.5, m1: 1.35, m2: 2.3 })
      .jpeg({ quality: 96, mozjpeg: true })
      .toFile(path.join(dir, `${item.name}.jpg`));

    // Standardized HD WebP (1200x900)
    await sharp(inputPath)
      .resize(TARGET_W, TARGET_H, {
        fit: 'cover',
        position: item.pos,
        kernel: 'lanczos3'
      })
      .modulate({ brightness: item.brightness, saturation: item.saturation })
      .sharpen({ sigma: 1.5, m1: 1.35, m2: 2.3 })
      .webp({ quality: 94, effort: 6 })
      .toFile(path.join(dir, `${item.name}.webp`));

    console.log(`✅ ${item.name} -> exact ${TARGET_W}x${TARGET_H} px`);
  }

  console.log('🎉 All images are now 100% matching in aspect ratio, size and visual grading!');
}

standardizeAllImages().catch(console.error);
