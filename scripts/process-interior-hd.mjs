import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = 'public/magazin/san-sebastian-berlin';

// Re-process the green moss wall interior to 800x600 HD with rich contrast
async function processInterior() {
  const input = path.join(dir, 'san-sebastian-03.jpg');

  await sharp(input)
    .resize(800, 600, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .modulate({ brightness: 1.05, saturation: 1.25 })
    .sharpen({ sigma: 1.2, m1: 1.4, m2: 2.4 })
    .jpeg({ quality: 96, mozjpeg: true })
    .toFile(path.join(dir, 'san-sebastian-hd-06-moss-wall-neon.jpg'));

  await sharp(input)
    .resize(800, 600, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .modulate({ brightness: 1.05, saturation: 1.25 })
    .sharpen({ sigma: 1.2, m1: 1.4, m2: 2.4 })
    .webp({ quality: 94, effort: 6 })
    .toFile(path.join(dir, 'san-sebastian-hd-06-moss-wall-neon.webp'));

  console.log('✅ Interior HD moss wall processed!');
}

processInterior().catch(console.error);
