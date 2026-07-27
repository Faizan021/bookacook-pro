import fs from 'fs';
import path from 'path';

const file1 = path.join('src', 'routes', 'catering.$city.tsx');
const file2 = path.join('src', 'routes', 'planner.$city.tsx');

if (fs.existsSync(file1)) {
  fs.unlinkSync(file1);
  console.log('Deleted:', file1);
}

if (fs.existsSync(file2)) {
  fs.unlinkSync(file2);
  console.log('Deleted:', file2);
}
