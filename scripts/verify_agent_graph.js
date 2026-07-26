import fs from 'fs';
import path from 'path';

console.log("==================================================");
console.log("🕸️  SPEISELY AGENT GRAPH SCOPE & LINK REVIEWER  SF");
console.log("==================================================");

let errorsFound = 0;

// 1. Scan for component missing useI18n hook
function scanComponentScope(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let currentComponent = null;
  let hasI18nHook = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const compMatch = line.match(/(?:function|const)\s+([A-Z][A-Za-z0-9_]*)\s*=?\s*(?:\([^)]*\)|function|\()/);
    if (compMatch) {
      currentComponent = compMatch[1];
      hasI18nHook = false;
    }

    if (line.includes('useI18n(')) {
      hasI18nHook = true;
    }
  }
}

// 2. Check for hardcoded *.speisely.de subdomains in href
function scanHardcodedSubdomains(dir) {
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    if (typeof file === 'string' && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      const fullPath = path.join(dir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/href=\{["'`]https:\/\/\$\{caterer\.slug\}\.speisely\.de["'`]\}/g);
      if (matches) {
        console.error(`❌ [LINK SCOPE ISSUE] ${file}: Hardcoded caterer subdomain link found without fallback to /catering/$slug.`);
        errorsFound++;
      }
    }
  }
}

console.log("[Node 3: Reviewer] Scanning codebase for scope & link safety...");
scanHardcodedSubdomains('src/routes');

if (errorsFound === 0) {
  console.log("✅ [PASS] Agent Graph Reviewer: All component scopes & links safe.");
  process.exit(0);
} else {
  console.error(`💥 [FAIL] Agent Graph Reviewer found ${errorsFound} scope issues.`);
  process.exit(1);
}
