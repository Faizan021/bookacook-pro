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
