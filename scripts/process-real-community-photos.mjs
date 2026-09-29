import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const originalImages = [
  {
    src: 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/.user_uploaded/media_1790667757667.jpg',
    outName: 'chicken-krush-01'
  },
  {
    src: 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/.user_uploaded/media_1790667819522.png',
    outName: 'chicken-krush-02'
  },
  {
    src: 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/.user_uploaded/media_1790667872977.png',
    outName: 'chicken-krush-03'
  },
  {
    src: 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/.user_uploaded/media_1790668052309.png',
    outName: 'chicken-krush-04'
  },
  {
    src: 'C:/Users/ahmad/.gemini/antigravity/brain/b308feef-2d4d-4563-b7d6-d6991ec44c51/.user_uploaded/media_1790668128279.png',
    outName: 'chicken-krush-05'
  }
];

const destDir = 'public/magazin/chicken-krush-prag';

async function processOriginals() {
  await fs.mkdir(destDir, { recursive: true });

  for (const item of originalImages) {
    console.log(`Processing real community photo: ${item.src} -> ${item.outName}`);
    
    // Standard professional photo grading with Sharp (NO AI):
    // 1. Modulate: slight brightness + saturation lift for food colors
    // 2. Sharpen: subtle unsharp mask to bring out crispy texture
    // 3. Output both JPG and WebP
    const pipeline = sharp(item.src)
      .modulate({
        brightness: 1.04,
        saturation: 1.08
      })
      .sharpen({
        sigma: 1.0,
        m1: 0.5,
        m2: 2.0
      });

    const jpgPath = path.join(destDir, `${item.outName}.jpg`);
    const webpPath = path.join(destDir, `${item.outName}.webp`);

    await pipeline.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(jpgPath);
    await pipeline.clone().webp({ quality: 85 }).toFile(webpPath);

    const sJpg = await fs.stat(jpgPath);
    const sWebp = await fs.stat(webpPath);
    console.log(`  -> JPG: ${Math.round(sJpg.size/1024)} KB, WebP: ${Math.round(sWebp.size/1024)} KB`);
  }

  console.log('All 5 real community photos processed and deployed successfully!');
}

processOriginals().catch(console.error);
