#!/usr/bin/env node
/**
 * Speisely Production Smoke Test — Node 4: Live Verifier
 * =======================================================
 * Hits the live deployment after every push to confirm:
 *   - HTTP 200 on all public routes
 *   - Body contains expected brand/content markers
 *   - No SSR crash indicators in the HTML
 *   - Response time within acceptable thresholds
 *   - Response body is non-trivially large (>500 bytes)
 *   - No Supabase config leaks or internal error strings
 *
 * Usage:
 *   node scripts/smoke-test.mjs                           # → speisely.de
 *   node scripts/smoke-test.mjs https://preview.vercel.app  # → preview URL
 *
 * Exit codes:
 *   0 — All checks passed
 *   1 — One or more checks failed (blocks CI/CD merge)
 */

const BASE_URL = process.argv[2] || "https://speisely.de";
const SLOW_THRESHOLD_MS = 4000; // warn if any route exceeds this

// ─────────────────────────────────────────────────────────────────────────────
// Route definitions
// Every public route that must be reachable is listed here.
// Add new routes here the moment they are shipped.
// ─────────────────────────────────────────────────────────────────────────────
const ROUTES = [
  // Core public pages
  {
    path: "/",
    name: "Homepage",
    expect: { status: 200, bodyContains: "Speisely" },
  },
  {
    path: "/catering",
    name: "Catering listing",
    expect: { status: 200, bodyContains: "Catering" },
  },
  {
    path: "/planner",
    name: "Event planner listing",
    expect: { status: 200 },
  },
  {
    path: "/restaurants",
    name: "Restaurant listing",
    expect: { status: 200 },
  },
  {
    path: "/instant-order",
    name: "Instant order page",
    expect: { status: 200 },
  },
  {
    path: "/partners",
    name: "Partner program",
    expect: { status: 200, bodyContains: "Partner" },
  },
  {
    path: "/contact",
    name: "Contact page",
    expect: { status: 200 },
  },
  {
    path: "/about",
    name: "About / Über uns",
    expect: { status: 200 },
  },
  {
    path: "/blog",
    name: "Blog index",
    expect: { status: 200 },
  },
  {
    path: "/faq",
    name: "FAQ page",
    expect: { status: 200 },
  },
  {
    path: "/auth",
    name: "Auth (login/signup)",
    expect: { status: 200 },
  },
  // Authenticated shell — must return 200 (React app) or redirect, never 500
  {
    path: "/restaurant",
    name: "Restaurant dashboard shell",
    expect: { status: [200, 302, 307] },
  },
  // Dynamic route spot-check — live restaurant storefront
  {
    path: "/restaurant/schnitzel-schmiede",
    name: "Schnitzel Schmiede storefront",
    expect: { status: [200, 404] }, // 404 acceptable if restaurant not published yet
    skipCrashCheck: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Crash indicator strings — if any of these appear in the HTML, fail hard
// ─────────────────────────────────────────────────────────────────────────────
const CRASH_INDICATORS = [
  "Internal Server Error",
  "Application error",
  "supabaseUrl is required",
  "Invalid supabaseUrl",
  "Something went wrong on our end",
  "h3 swallowed SSR error",
  '"unhandled":true',
  "NEXT_NOT_FOUND",
  "TypeError: Cannot read",
  "ReferenceError:",
  "Unhandled Runtime Error",
];

// ─────────────────────────────────────────────────────────────────────────────
// Security indicator strings — if any of these leak into HTML, fail hard
// ─────────────────────────────────────────────────────────────────────────────
const SECURITY_INDICATORS = [
  "eyJhbGciOiJ",         // JWT token fragment (base64 prefix)
  "service_role",        // Supabase service role key fragment
  "SUPABASE_SERVICE",    // Leaked env var name
  "STRIPE_SECRET",       // Leaked Stripe secret key name
  "sk_live_",            // Stripe live secret key
  "sk_test_",            // Stripe test secret key
];

// ANSI helpers
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const red    = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;

async function testRoute(route) {
  const url = `${BASE_URL}${route.path}`;
  const start = Date.now();

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Speisely-SmokeTest/2.0",
        Accept: "text/html,application/json",
      },
      signal: AbortSignal.timeout(15_000),
    });

    const elapsed = Date.now() - start;
    const body = await res.text();
    const errors = [];
    const warnings = [];

    // ── Status code check ──────────────────────────────────────────────────
    const expectedStatuses = Array.isArray(route.expect.status)
      ? route.expect.status
      : [route.expect.status];

    if (!expectedStatuses.includes(res.status)) {
      errors.push(`HTTP ${res.status} — expected ${expectedStatuses.join(" or ")}`);
    }

    // ── Body content check ─────────────────────────────────────────────────
    if (route.expect.bodyContains && !body.includes(route.expect.bodyContains)) {
      errors.push(`Body missing expected string: "${route.expect.bodyContains}"`);
    }

    // ── Body size check (>500 bytes = real content, not blank page) ────────
    if (body.length < 500) {
      errors.push(`Suspiciously small body (${body.length} bytes) — possible blank page`);
    }

    // ── Crash indicator scan ───────────────────────────────────────────────
    if (!route.skipCrashCheck) {
      for (const indicator of CRASH_INDICATORS) {
        if (body.includes(indicator)) {
          errors.push(`SSR crash indicator: "${indicator}"`);
        }
      }
    }

    // ── Security leak scan ─────────────────────────────────────────────────
    for (const indicator of SECURITY_INDICATORS) {
      if (body.includes(indicator)) {
        errors.push(`🔐 SECURITY LEAK: "${indicator}" found in HTML response`);
      }
    }

    // ── Response time warning ──────────────────────────────────────────────
    if (elapsed > SLOW_THRESHOLD_MS) {
      warnings.push(`Slow response: ${elapsed}ms (threshold: ${SLOW_THRESHOLD_MS}ms)`);
    }

    return {
      route: route.name,
      path: route.path,
      status: res.status,
      elapsed,
      bodySize: body.length,
      pass: errors.length === 0,
      errors,
      warnings,
    };
  } catch (err) {
    return {
      route: route.name,
      path: route.path,
      status: 0,
      elapsed: Date.now() - start,
      bodySize: 0,
      pass: false,
      errors: [`Network/timeout error: ${err.message}`],
      warnings: [],
    };
  }
}

async function main() {
  console.log();
  console.log(bold("╔══════════════════════════════════════════════════════╗"));
  console.log(bold("║   SPEISELY — Node 4: Production Smoke Test           ║"));
  console.log(bold("╚══════════════════════════════════════════════════════╝"));
  console.log(dim(`   Target : ${BASE_URL}`));
  console.log(dim(`   Routes : ${ROUTES.length}`));
  console.log(dim(`   Time   : ${new Date().toISOString()}`));
  console.log();

  const results = [];
  for (const route of ROUTES) {
    const result = await testRoute(route);
    results.push(result);

    const icon    = result.pass ? green("✓") : red("✗");
    const status  = result.pass ? green(`${result.status}`) : red(`${result.status}`);
    const timing  = result.elapsed > SLOW_THRESHOLD_MS
      ? yellow(`${result.elapsed}ms ⚠`)
      : dim(`${result.elapsed}ms`);
    const size    = dim(`${Math.round(result.bodySize / 1024)}KB`);

    console.log(`  ${icon} ${result.route.padEnd(32)} ${status}  ${timing}  ${size}`);

    for (const err of result.errors) {
      console.log(`      ${red("→")} ${err}`);
    }
    for (const w of result.warnings) {
      console.log(`      ${yellow("⚠")} ${w}`);
    }
  }

  console.log();
  console.log("──────────────────────────────────────────────────────");

  const passed    = results.filter((r) => r.pass).length;
  const failed    = results.filter((r) => r.errors.length > 0).length;
  const warned    = results.filter((r) => r.warnings.length > 0).length;
  const totalTime = results.reduce((sum, r) => sum + r.elapsed, 0);
  const slowest   = results.reduce((max, r) => r.elapsed > max.elapsed ? r : max, results[0]);

  console.log(dim(`   Total time : ${totalTime}ms`));
  console.log(dim(`   Slowest    : ${slowest.path} (${slowest.elapsed}ms)`));
  console.log(dim(`   Warnings   : ${warned}`));
  console.log();

  if (failed === 0) {
    console.log(green(bold(`  ✅  All ${passed} routes passed — Production is healthy`)));
    console.log();
    process.exit(0);
  } else {
    console.log(red(bold(`  ❌  ${failed} of ${passed + failed} routes FAILED — Do not merge`)));
    console.log();
    process.exit(1);
  }
}

main();
