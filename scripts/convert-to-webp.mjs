/**
 * convert-to-webp.mjs
 * Converts all large public images (PNG/JPG) to WebP, updates code references.
 * Run: node scripts/convert-to-webp.mjs
 */

import sharp from "sharp";
import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join, extname, basename, relative } from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT_DIR, "public");
const SRC_DIR = join(ROOT_DIR, "src");

const SKIP_DIRS = [".user_uploaded"];
const MIN_SIZE_BYTES = 80_000;
const WEBP_QUALITY = 82;

async function findImages(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      results.push(...(await findImages(fullPath)));
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function findSourceFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (["node_modules", ".git", ".vercel"].includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findSourceFiles(fullPath)));
    } else if (/\.(ts|tsx|html|css)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log("ROOT:", ROOT_DIR);
  console.log("PUBLIC:", PUBLIC_DIR);
  console.log("\n🔍 Scanning public directory for large images...\n");

  const images = await findImages(PUBLIC_DIR);
  console.log(`  Total images found: ${images.length}`);

  const toConvert = [];
  for (const imgPath of images) {
    const s = await stat(imgPath);
    if (s.size >= MIN_SIZE_BYTES) {
      toConvert.push({ path: imgPath, size: s.size });
    }
  }

  console.log(`  Images >= ${MIN_SIZE_BYTES / 1000}KB: ${toConvert.length}\n`);

  // --- Step 1: Convert images to WebP ---
  const converted = [];

  for (const { path: imgPath, size } of toConvert) {
    const webpPath = imgPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    if (existsSync(webpPath)) {
      const ws = await stat(webpPath);
      const saving = Math.round((1 - ws.size / size) * 100);
      console.log(`  ⏭  SKIP  ${basename(imgPath)} → already .webp (saves ${saving}%)`);
      converted.push({ original: imgPath, webp: webpPath });
      continue;
    }

    try {
      await sharp(imgPath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
      const ws = await stat(webpPath);
      const saving = Math.round((1 - ws.size / size) * 100);
      console.log(
        `  ✅ ${basename(imgPath)} (${Math.round(size / 1024)}KB) → .webp (${Math.round(ws.size / 1024)}KB, −${saving}%)`
      );
      converted.push({ original: imgPath, webp: webpPath });
    } catch (err) {
      console.error(`  ❌ FAILED ${basename(imgPath)}: ${err.message}`);
    }
  }

  // --- Step 2: Update source code references ---
  console.log("\n📝 Updating source code references...\n");

  const srcFiles = await findSourceFiles(SRC_DIR);
  const extraFiles = [join(PUBLIC_DIR, "llms.txt"), join(PUBLIC_DIR, "llms-full.txt")].filter(existsSync);
  const allFiles = [...srcFiles, ...extraFiles];

  let totalFiles = 0;

  for (const file of allFiles) {
    let content;
    try {
      content = await readFile(file, "utf8");
    } catch {
      continue;
    }

    let updated = content;

    for (const { original, webp } of converted) {
      // Build the public-relative path like /magazin/foo/bar.jpg
      const relOrig = "/" + relative(PUBLIC_DIR, original).replace(/\\/g, "/");
      const relWebp = "/" + relative(PUBLIC_DIR, webp).replace(/\\/g, "/");

      // Replace all occurrences of the original path with the webp path
      const escapedOrig = relOrig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      updated = updated.replace(new RegExp(escapedOrig, "g"), relWebp);

      // Also replace absolute speisely.de URLs
      const absOrig = "https://speisely.de" + relOrig;
      const absWebp = "https://speisely.de" + relWebp;
      updated = updated.replace(new RegExp(absOrig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), absWebp);
    }

    if (updated !== content) {
      await writeFile(file, updated, "utf8");
      console.log(`  📄 ${relative(ROOT_DIR, file).replace(/\\/g, "/")}`);
      totalFiles++;
    }
  }

  // --- Step 3: Summary ---
  let totalSavedBytes = 0;
  for (const { original, webp } of converted) {
    try {
      const [os, ws] = await Promise.all([stat(original), stat(webp)]);
      totalSavedBytes += os.size - ws.size;
    } catch {}
  }
  const savedKB = Math.round(totalSavedBytes / 1024);

  console.log("\n" + "=".repeat(60));
  console.log(`✅ Done!`);
  console.log(`   Images converted  : ${converted.length}`);
  console.log(`   Source files updated : ${totalFiles}`);
  console.log(`   Total saved        : ~${savedKB} KB (~${(savedKB / 1024).toFixed(1)} MB)`);
  console.log("\n⚠️  Original files kept. Delete after confirming WebP works on prod.\n");
}

main().catch(console.error);
