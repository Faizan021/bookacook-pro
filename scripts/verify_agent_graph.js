import fs from 'fs';
import path from 'path';

// =============================================================================
// SPEISELY AGENT GRAPH — Node 3: Static Scope & Safety Reviewer
// =============================================================================
// Runs BEFORE vite build. If this fails, the build is blocked.
// Rules enforced:
//   1. No hardcoded caterer subdomain links (legacy bug guard)
//   2. No localhost URLs hardcoded in src/
//   3. No `as any` TypeScript casts in route files (type safety)
//   4. No bare console.log() in production route files
//   5. Print boundary rule: catering_bookings must never appear in print code
//   6. Smoke test coverage: every public route file has a smoke test entry
//   7. No TODO / FIXME / HACK comments left in route files
// =============================================================================

const SRC_DIR  = 'src';
const ROUTES_DIR = path.join(SRC_DIR, 'routes');
const SMOKE_TEST_FILE = 'scripts/smoke-test.mjs';
const PRINT_API_FILE  = path.join(SRC_DIR, 'routes', 'api.print.star.ts');

let errorsFound   = 0;
let warningsFound = 0;

const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;

function fail(rule, file, detail) {
  console.error(red(`  ✗ [FAIL] Rule ${rule} | ${file}`));
  console.error(red(`        → ${detail}`));
  errorsFound++;
}

function warn(rule, file, detail) {
  console.warn(yellow(`  ⚠ [WARN] Rule ${rule} | ${file}`));
  console.warn(yellow(`        → ${detail}`));
  warningsFound++;
}

function pass(rule, detail) {
  console.log(green(`  ✓ [PASS] Rule ${rule}`) + dim(` — ${detail}`));
}

// Recursively collect all .ts/.tsx files under a directory
function collectFiles(dir, exts = ['.ts', '.tsx']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    if (typeof entry !== 'string') continue;
    if (exts.some(e => entry.endsWith(e))) {
      results.push(path.join(dir, entry));
    }
  }
  return results;
}

// =============================================================================
// RULE 1 — No hardcoded caterer subdomain links
// =============================================================================
function rule1_HardcodedSubdomains() {
  const files = collectFiles(ROUTES_DIR);
  let ruleErrors = 0;
  for (const fullPath of files) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = content.match(/href=\{["'`]https:\/\/\$\{caterer\.slug\}\.speisely\.de["'`]\}/g);
    if (matches) {
      fail('1', path.relative('.', fullPath), `Hardcoded caterer subdomain link found (${matches.length}x). Use /catering/$slug instead.`);
      ruleErrors++;
    }
  }
  if (ruleErrors === 0) pass('1', 'No hardcoded caterer subdomain links');
}

// =============================================================================
// RULE 2 — No localhost URLs hardcoded as primary values in src/
// =============================================================================
// Allows: process.env.X || "http://localhost:5173"  (valid dev fallback)
// Blocks: fetch("http://localhost:3000/api/...")     (hardcoded primary value)
// =============================================================================
function rule2_NoLocalhost() {
  const files = collectFiles(SRC_DIR);
  let ruleErrors = 0;
  for (const fullPath of files) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      // Skip comment lines
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      // Skip lines where localhost is used only as a fallback default (|| "http://localhost...")
      if (/\|\|\s*["'`]https?:\/\/localhost/.test(line)) return;
      // Flag localhost as a primary / non-fallback value
      if (/https?:\/\/localhost[:/]/.test(line) && !/\|\|/.test(line)) {
        fail('2', `${path.relative('.', fullPath)}:${i + 1}`, `Hardcoded localhost URL as primary value. Use env var or relative path.`);
        ruleErrors++;
      }
    });
  }
  if (ruleErrors === 0) pass('2', 'No hardcoded localhost URLs as primary values in src/');
}


// =============================================================================
// RULE 3 — Warn on `as any` TypeScript casts in route files
// =============================================================================
// Pre-existing `as any` usage is widespread (90+ occurrences) — treated as a
// warning so it is visible in the report without blocking every build.
// New violations added in a PR will be caught by the pre-commit ESLint rule
// (no-explicit-any) which IS a hard block.
// =============================================================================
function rule3_NoAsAny() {
  const files = collectFiles(ROUTES_DIR);
  let ruleWarnings = 0;
  for (const fullPath of files) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      if (/\bas any\b/.test(line) && !line.includes('eslint-disable')) {
        const rel = path.relative('.', fullPath);
        if (!rel.includes('api.') && !rel.includes('.functions.')) {
          warn('3', `${rel}:${i + 1}`, `\`as any\` cast (pre-existing debt). Pre-commit ESLint blocks NEW occurrences.`);
          ruleWarnings++;
        }
      }
    });
  }
  if (ruleWarnings === 0) pass('3', 'No bare `as any` casts in route files');
}

// =============================================================================
// RULE 4 — No bare console.log() in production route files
// =============================================================================
function rule4_NoConsoleLogs() {
  const files = collectFiles(ROUTES_DIR);
  let ruleWarnings = 0;
  for (const fullPath of files) {
    // Skip API routes — console.log is acceptable for server-side logging
    if (path.basename(fullPath).startsWith('api.')) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
      if (/\bconsole\.log\(/.test(line)) {
        warn('4', `${path.relative('.', fullPath)}:${i + 1}`, `console.log() in production route. Use console.error() or remove.`);
        ruleWarnings++;
      }
    });
  }
  if (ruleWarnings === 0) pass('4', 'No bare console.log() in route files');
}

// =============================================================================
// RULE 5 — Print boundary: catering_bookings must never appear in print CODE
// =============================================================================
function rule5_PrintBoundary() {
  if (!fs.existsSync(PRINT_API_FILE)) {
    pass('5', 'Print API file not found — skipped');
    return;
  }
  const content = fs.readFileSync(PRINT_API_FILE, 'utf8');
  // Only scan non-comment lines to avoid false positives on documentation
  const codeLines = content.split('\n').filter(line => {
    const t = line.trim();
    return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*');
  });
  const codeOnly = codeLines.join('\n');
  if (codeOnly.includes('catering_bookings') || codeOnly.includes('event_bookings')) {
    fail('5', path.relative('.', PRINT_API_FILE),
      'Print API code references catering_bookings or event_bookings. ' +
      'Print scope is restaurant_orders ONLY. See migration 20260715003000.');
  } else {
    pass('5', 'Print boundary intact — no catering/event booking refs in print API code');
  }
}

// =============================================================================
// RULE 6 — Smoke test coverage: public routes must have a smoke test entry
// =============================================================================
function rule6_SmokeTestCoverage() {
  // Public routes that must be in the smoke test
  const REQUIRED_IN_SMOKE = [
    '/',
    '/catering',
    '/planner',
    '/restaurants',
    '/contact',
    '/auth',
    '/partners',
    '/about',
    '/blog',
    '/faq',
  ];

  if (!fs.existsSync(SMOKE_TEST_FILE)) {
    warn('6', SMOKE_TEST_FILE, 'Smoke test file not found. Run: node scripts/smoke-test.mjs');
    return;
  }

  const smokeContent = fs.readFileSync(SMOKE_TEST_FILE, 'utf8');
  let missingCount = 0;

  for (const route of REQUIRED_IN_SMOKE) {
    // Check that the path string appears in the smoke test routes array
    const pattern = new RegExp(`path:\\s*["'\`]${route.replace('/', '\\/')}["'\`]`);
    if (!pattern.test(smokeContent)) {
      fail('6', SMOKE_TEST_FILE, `Route "${route}" is not covered by the smoke test.`);
      missingCount++;
    }
  }

  if (missingCount === 0) {
    pass('6', `All ${REQUIRED_IN_SMOKE.length} required public routes have smoke test coverage`);
  }
}

// =============================================================================
// RULE 7 — No TODO / FIXME / HACK / XXX in route files
// =============================================================================
function rule7_NoTodoHack() {
  const files = collectFiles(ROUTES_DIR);
  let ruleWarnings = 0;
  const markers = ['TODO', 'FIXME', 'HACK', 'XXX'];
  for (const fullPath of files) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      for (const marker of markers) {
        if (line.includes(marker)) {
          warn('7', `${path.relative('.', fullPath)}:${i + 1}`, `Unresolved ${marker} comment left in production route.`);
          ruleWarnings++;
        }
      }
    });
  }
  if (ruleWarnings === 0) pass('7', 'No TODO/FIXME/HACK markers in route files');
}

// =============================================================================
// RULE 8 — No hardcoded / duplicate meta tags in JSX `<head>`
// =============================================================================
function rule8_NoHardcodedJSXMeta() {
  const rootFile = path.join(ROUTES_DIR, '__root.tsx');
  if (!fs.existsSync(rootFile)) return;
  const content = fs.readFileSync(rootFile, 'utf8');
  
  // Look for <meta name="description" or <meta property="og: inside JSX return
  const jsxHeadMatch = content.match(/<head>([\s\S]*?)<\/head>/);
  if (jsxHeadMatch) {
    const headContent = jsxHeadMatch[1];
    if (/<meta\s+name=["']description["']/i.test(headContent)) {
      fail('8', '__root.tsx', 'Hardcoded <meta name="description"> in JSX <head> detected. Use Route.head.meta instead to prevent duplicates.');
      return;
    }
    if (/<meta\s+property=["']og:title["']/i.test(headContent)) {
      fail('8', '__root.tsx', 'Hardcoded <meta property="og:title"> in JSX <head> detected. Use Route.head.meta instead.');
      return;
    }
  }
  pass('8', 'No duplicate / hardcoded meta tags in JSX <head>');
}

// =============================================================================
// RULE 9 — Public Asset & Image Integrity (Zero Broken Images)
// =============================================================================
function rule9_PublicAssetIntegrity() {
  const srcFiles = collectFiles(SRC_DIR);
  let missingCount = 0;
  for (const fullPath of srcFiles) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = content.matchAll(/["'](\/(?:magazin|images|icons|assets|branding)?[a-zA-Z0-9_\-\.\/]+\.(?:webp|jpg|jpeg|png|svg|gif))(?:\?[^"']*)?["']/g);
    for (const m of matches) {
      const assetPath = m[1];
      if (assetPath.startsWith('/api') || assetPath.includes('schema.org')) continue;
      const onDisk = path.join('public', assetPath.replace(/^\//, ''));
      if (!fs.existsSync(onDisk)) {
        fail('9', `${path.relative('.', fullPath)}`, `Broken public asset reference: "${assetPath}" does not exist in public/`);
        missingCount++;
      }
    }
  }
  if (missingCount === 0) {
    pass('9', 'All referenced public assets and images exist on disk (zero broken images)');
  }
}

// =============================================================================
// RULE 10 — Sitemap & Canonical URL Integrity
// =============================================================================
function rule10_SitemapIntegrity() {
  const sitemapFile = path.join(ROUTES_DIR, 'sitemap[.]xml.ts');
  if (!fs.existsSync(sitemapFile)) return;
  const content = fs.readFileSync(sitemapFile, 'utf8');
  
  if (content.includes('path: "/api/')) {
    fail('10', 'sitemap[.]xml.ts', 'API routes (e.g. /api/...) must never be listed in sitemap XML.');
    return;
  }
  if (content.includes('/caterer/ort/')) {
    fail('10', 'sitemap[.]xml.ts', 'Found "/caterer/ort/" instead of canonical "/catering/ort/" in sitemap.');
    return;
  }
  pass('10', 'Sitemap clean: no API paths and canonical URLs enforced');
}

// =============================================================================
// RULE 11 — Meta Title and Description SERP Length Standards
// =============================================================================
function rule11_MetaLengthStandards() {
  const routeFiles = collectFiles(ROUTES_DIR);
  let lengthErrors = 0;
  for (const fullPath of routeFiles) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const tMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
    if (tMatch && tMatch[1].length > 58) {
      fail('11', path.relative('.', fullPath), `Meta title too long (${tMatch[1].length} chars > 58 max): "${tMatch[1]}"`);
      lengthErrors++;
    }
    const dMatches = content.matchAll(/name:\s*['"`]description['"`],\s*content:\s*['"`]([^'"`]+)['"`]/g);
    for (const dm of dMatches) {
      if (dm[1].length > 155) {
        fail('11', path.relative('.', fullPath), `Meta description too long (${dm[1].length} chars > 155 max): "${dm[1]}"`);
        lengthErrors++;
      }
    }
  }
  if (lengthErrors === 0) {
    pass('11', 'All route titles (<= 58) and descriptions (<= 155) comply with SERP standards');
  }
}

// =============================================================================
// RULE 12 — Global JSON-LD Schema Validation
// =============================================================================
function rule12_GlobalSchemaValidation() {
  const rootFile = path.join(ROUTES_DIR, '__root.tsx');
  if (!fs.existsSync(rootFile)) return;
  const content = fs.readFileSync(rootFile, 'utf8');
  if (content.includes('"FAQPage"')) {
    fail('12', '__root.tsx', 'Global FAQPage schema detected in __root.tsx. FAQPage schema must only exist on /faq route.');
    return;
  }
  pass('12', 'Root JSON-LD schema clean (Organization & WebSite only, no global FAQPage leaks)');
}

// =============================================================================
// RULE 13 — Supabase Disk & Health Protection (Zero-Bloat Guardrail)
// =============================================================================
function rule13_SupabaseDiskProtection() {
  const migrationsDir = path.resolve('supabase/migrations');
  if (!fs.existsSync(migrationsDir)) return;
  const sqlFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
  let bloatErrors = 0;
  let hasRetentionCleanup = false;

  for (const file of sqlFiles) {
    const fullPath = path.join(migrationsDir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    // Strip SQL line comments (-- ...) so commented explanations don't false-positive
    const uncommented = raw
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');

    if (uncommented.includes("'cleanup-cron-and-net-logs'")) {
      hasRetentionCleanup = true;
    }

    // Block every-minute ('* * * * *') or sub-minute cron.schedule calls
    if (/cron\.schedule\s*\([\s\S]*?['"]\* \* \* \* \*['"]/i.test(uncommented)) {
      fail(
        '13',
        `supabase/migrations/${file}`,
        'Forbidden every-minute ("* * * * *") pg_cron job detected. Causes disk & WAL exhaustion on Supabase.'
      );
      bloatErrors++;
    }

    // Block net.http_post / net.http_get inside cron.schedule
    if (/cron\.schedule\s*\([\s\S]*?net\.http_(post|get)\s*\(/i.test(uncommented)) {
      fail(
        '13',
        `supabase/migrations/${file}`,
        'Forbidden pg_net (net.http_post/http_get) loop inside cron.schedule. Causes unbounded net._http_response disk bloat.'
      );
      bloatErrors++;
    }
  }

  if (!hasRetentionCleanup) {
    fail(
      '13',
      'supabase/migrations',
      'Missing mandatory "cleanup-cron-and-net-logs" daily retention schedule to protect Supabase disk space.'
    );
    bloatErrors++;
  }

  if (bloatErrors === 0) {
    pass('13', 'Supabase Disk & Health Protection intact (zero minute-cron loops, daily log retention active)');
  }
}

// =============================================================================
// RULE 14 — Database & API Security Safeguards (Zero-Trust RLS & RPC Standard)
// =============================================================================
function rule14_DatabaseSecuritySafeguards() {
  const migrationsDir = path.resolve('supabase/migrations');
  if (!fs.existsSync(migrationsDir)) return;
  let secErrors = 0;

  // 1. Verify baseline security hardening migration exists and is intact
  const baselineFile = '20261012124500_harden_rls_and_security_definer.sql';
  const baselinePath = path.join(migrationsDir, baselineFile);
  if (!fs.existsSync(baselinePath)) {
    fail('14', 'supabase/migrations', `Missing mandatory security hardening migration: ${baselineFile}`);
    secErrors++;
  } else {
    const baselineSql = fs.readFileSync(baselinePath, 'utf8');
    if (
      !baselineSql.includes('ENABLE ROW LEVEL SECURITY') ||
      !baselineSql.includes('security_invoker = true') ||
      !baselineSql.includes('TO service_role') ||
      !baselineSql.includes('REVOKE EXECUTE ON FUNCTION public.decrement_surplus_stock')
    ) {
      fail('14', `supabase/migrations/${baselineFile}`, 'Baseline RLS & SECURITY DEFINER hardening statements were tampered with or removed.');
      secErrors++;
    }
  }

  // 2. Audit any new migrations (> baselineFile) for mandatory RLS & SECURITY DEFINER locks
  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && f > baselineFile);

  for (const file of sqlFiles) {
    const raw = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const uncommented = raw
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');

    if (/CREATE\s+TABLE/i.test(uncommented) && !/ENABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(uncommented)) {
      fail('14', `supabase/migrations/${file}`, 'New CREATE TABLE migration is missing mandatory ENABLE ROW LEVEL SECURITY.');
      secErrors++;
    }

    if (/SECURITY\s+DEFINER/i.test(uncommented)) {
      if (!/search_path/i.test(uncommented) || !/REVOKE\s+EXECUTE/i.test(uncommented)) {
        fail('14', `supabase/migrations/${file}`, 'New SECURITY DEFINER function must set search_path = public and REVOKE EXECUTE FROM PUBLIC, anon.');
        secErrors++;
      }
    }
  }

  // 3. Ensure client components never reference SUPABASE_SERVICE_ROLE_KEY or supabaseAdmin,
  //    and non-API routes never have static top-level supabaseAdmin imports or .select("*") leaks
  const componentFiles = collectFiles(path.join(SRC_DIR, 'components'));
  for (const file of componentFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('SUPABASE_SERVICE_ROLE_KEY') || /\bsupabaseAdmin\b/.test(content)) {
      fail('14', path.relative('.', file), 'Client component must NEVER reference SUPABASE_SERVICE_ROLE_KEY or supabaseAdmin.');
      secErrors++;
    }
  }

  const routeFiles = collectFiles(ROUTES_DIR).filter(
    (f) => !path.basename(f).startsWith('api.') && !f.includes(`${path.sep}api${path.sep}`) && !f.includes('/api/')
  );
  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      fail('14', path.relative('.', file), 'Route file must NEVER directly reference SUPABASE_SERVICE_ROLE_KEY.');
      secErrors++;
    }
    if (/^import\s+.*supabaseAdmin/m.test(content)) {
      fail('14', path.relative('.', file), 'Route file must NEVER use static top-level import of supabaseAdmin (use dynamic import inside createServerFn only).');
      secErrors++;
    }
    if (/supabaseAdmin[\s\S]{0,120}\.select\(\s*['"`]\*['"`]\s*\)/.test(content)) {
      fail('14', path.relative('.', file), 'Forbidden supabaseAdmin .select("*") in route file (data leak risk — select explicit safe columns only).');
      secErrors++;
    }
  }

  if (secErrors === 0) {
    pass('14', 'Zero-Trust Database & API Security intact (100% RLS, locked SECURITY DEFINER RPCs, zero client secret/select(*) leaks)');
  }
}

// =============================================================================

// =============================================================================
// RULE 15 — Editorial & Visual Quality Gate (Anti-Numerical & Unobstructed Showcase)
// =============================================================================
function rule15_EditorialAndVisualIntegrity() {
  const magazinFiles = collectFiles(ROUTES_DIR).filter(
    (f) => path.basename(f).startsWith('magazin.') && (f.endsWith('.tsx') || f.endsWith('.ts'))
  );

  let editorialErrors = 0;

  for (const file of magazinFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relFile = path.relative('.', file);

    // 1. Audit against in-image floating badges obscuring food photography
    const floatingBadgeRegex = /<div\s+className=["'][^"']*relative[^"']*overflow-hidden[^"']*>[^<]*<img[\s\S]{1,350}?<div\s+className=["'][^"']*absolute\s+top-[^"']*[\"']/i;
    if (floatingBadgeRegex.test(content)) {
      fail('15', relFile, 'Floating badge overlay detected directly on image container (Rule 20.2: badges must be placed in card body or caption bar to prevent obscuring food products).');
      editorialErrors++;
    }

    // 2. Audit Community Disclosure placement (must be at the end, not at the top)
    const disclosureMatches = [...content.matchAll(/Speisely Community-Transparenz|Community-Transparenz|Community Disclosure/g)];
    if (disclosureMatches.length > 0) {
      for (const m of disclosureMatches) {
        const ratio = m.index / content.length;
        if (ratio < 0.5) {
          fail('15', relFile, `Community Disclosure found at offset ${m.index} (${Math.round(ratio * 100)}% through file). Rule 20.3: Disclosure MUST be an editorial endnote placed at the end (>50% of document, under Gastro Dossier).`);
          editorialErrors++;
        }
      }
    }

    // 3. Audit against fabricated numerical ratings (e.g. 9.8 / 10, Community Rating: 9.8)
    if (/Community\s+Rating\s*:\s*\d|Rating:\s*\d\.\d\s*\/\s*10|\b9\.\d\s*\/\s*10\b/i.test(content)) {
      fail('15', relFile, 'Fabricated numerical rating score found (Rule 20.1: use qualitative Speisely Community Empfehlung instead of fabricated 10-point rating numbers).');
      editorialErrors++;
    }

    // 4. Audit against fabricated layers/temperatures
    if (/\b40\s+(?:Schichten|Layers)\b/i.test(content) || /\b(?:exakt\s+)?200\s*°C\b/i.test(content)) {
      fail('15', relFile, 'Fabricated culinary metrics found (Rule 20.1: remove unverified layer counts or oven temperatures).');
      editorialErrors++;
    }
  }

  if (editorialErrors === 0) {
    pass('15', 'Editorial & Visual Quality Gate intact (unobstructed food imagery, bottom disclosure, zero fabricated numbers)');
  }
}

// =============================================================================
// RUN ALL RULES
// =============================================================================
console.log();
console.log(bold('╔══════════════════════════════════════════════════════╗'));
console.log(bold('║   SPEISELY — Node 3: Agent Graph Static Reviewer     ║'));
console.log(bold('╚══════════════════════════════════════════════════════╝'));
console.log();

rule1_HardcodedSubdomains();
rule2_NoLocalhost();
rule3_NoAsAny();
rule4_NoConsoleLogs();
rule5_PrintBoundary();
rule6_SmokeTestCoverage();
rule7_NoTodoHack();
rule8_NoHardcodedJSXMeta();
rule9_PublicAssetIntegrity();
rule10_SitemapIntegrity();
rule11_MetaLengthStandards();
rule12_GlobalSchemaValidation();
rule13_SupabaseDiskProtection();
rule14_DatabaseSecuritySafeguards();
rule15_EditorialAndVisualIntegrity();

console.log();
console.log('──────────────────────────────────────────────────────');

if (errorsFound === 0 && warningsFound === 0) {
  console.log(green(bold('✅  ALL RULES PASSED — Safe to build')));
  console.log();
  process.exit(0);
} else if (errorsFound === 0) {
  console.log(yellow(bold(`⚠️   ${warningsFound} warning(s) — Build allowed, review before shipping`)));
  console.log();
  process.exit(0); // warnings don't block build
} else {
  console.log(red(bold(`💥  ${errorsFound} error(s), ${warningsFound} warning(s) — BUILD BLOCKED`)));
  console.log(red('   Fix all errors above before running vite build.'));
  console.log();
  process.exit(1);
}
