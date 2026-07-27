import fs from 'fs';
import path from 'path';

function listRoutes(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      listRoutes(full, prefix + file + '/');
    } else {
      console.log(prefix + file);
    }
  }
}

listRoutes('src/routes');
