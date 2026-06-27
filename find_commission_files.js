import fs from 'fs';
import path from 'path';

const rootDir = 'C:\\recoverd usb\\Speisely Marketplace1';

function scan(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return;
  }
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.lovable' || file === '.vercel' || file === 'dist') {
      continue;
    }
    const fullPath = path.join(dir, file);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        scan(fullPath);
      } else if (stats.isFile()) {
        if (file.toLowerCase().includes('commission')) {
          console.log(`Found file: ${fullPath}`);
        }
      }
    } catch (e) {
      // Ignore
    }
  }
}

scan(rootDir);
