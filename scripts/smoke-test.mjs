#!/usr/bin/env node
/**
 * Speisely Post-Deploy Smoke Test
 * ================================
 * Run after every production deployment to verify the site is healthy.
 *
 * Usage:
 *   node scripts/smoke-test.mjs                    # Test speisely.de (default)
 *   node scripts/smoke-test.mjs https://preview.vercel.app  # Test a preview URL
 */

const BASE_URL = process.argv[2] || "https://speisely.de";

const ROUTES = [
  {
    path: "/",
    name: "Homepage",
    expect: { status: 200, bodyContains: "Speisely" },
  },
  {
    path: "/catering",
    name: "Catering listing page",
    expect: { status: 200, bodyContains: "Catering" },
  },
  {
    path: "/instant-order",
    name: "Instant Order page",
    expect: { status: 200 },
  },
  {
    path: "/planner",
    name: "Planner listing page",
    expect: { status: 200 },
  },
  {
    path: "/partners",
    name: "Partner registration page",
    expect: { status: 200, bodyContains: "Partner" },
  },
  {
    path: "/contact",
    name: "Contact page",
    expect: { status: 200 },
  },
  {
    path: "/auth",
    name: "Auth page (login/signup)",
    expect: { status: 200 },
  },
];

// ANSI color helpers
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

async function testRoute(route) {
  const url = `${BASE_URL}${route.path}`;
  const start = Date.now();

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Speisely-SmokeTest/1.0",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(15_000),
    });

    const elapsed = Date.now() - start;
    const body = await res.text();

    const errors = [];

    // Check HTTP status
    if (res.status !== route.expect.status) {
      errors.push(
        `Expected HTTP ${route.expect.status}, got ${res.status}`
      );
    }

    // Check body contains expected string
    if (route.expect.bodyContains && !body.includes(route.expect.bodyContains)) {
      errors.push(
        `Expected body to contain "${route.expect.bodyContains}"`
      );
    }

    // Check for common crash indicators in the HTML
    const crashIndicators = [
      "NEXT_NOT_FOUND",
      "Internal Server Error",
      "Application error",
      "supabaseUrl is required",
      "Invalid supabaseUrl",
    ];

    for (const indicator of crashIndicators) {
      if (body.includes(indicator)) {
        errors.push(`Crash indicator found in HTML: "${indicator}"`);
      }
    }

    // Check for reasonable response size (> 500 bytes means real content)
    if (body.length < 500) {
      errors.push(
        `Suspiciously small response body (${body.length} bytes)`
      );
    }

    return {
      route: route.name,
      path: route.path,
      status: res.status,
      elapsed,
      bodySize: body.length,
      pass: errors.length === 0,
      errors,
    };
  } catch (err) {
    return {
      route: route.name,
      path: route.path,
      status: 0,
      elapsed: Date.now() - start,
      bodySize: 0,
      pass: false,
      errors: [`Network error: ${err.message}`],
    };
  }
}

async function main() {
  console.log();
  console.log(bold(`🔍 Speisely Smoke Test`));
  console.log(dim(`   Target: ${BASE_URL}`));
  console.log(dim(`   Routes: ${ROUTES.length}`));
  console.log(dim(`   Time:   ${new Date().toISOString()}`));
  console.log();

  const results = [];
  for (const route of ROUTES) {
    const result = await testRoute(route);
    results.push(result);

    const icon = result.pass ? green("✓") : red("✗");
    const timing = dim(`${result.elapsed}ms`);
    const status = result.pass
      ? green(`${result.status}`)
      : red(`${result.status}`);

    console.log(
      `  ${icon} ${result.route.padEnd(30)} ${status}  ${timing}  ${dim(
        `${Math.round(result.bodySize / 1024)}KB`
      )}`
    );

    if (!result.pass) {
      for (const err of result.errors) {
        console.log(`      ${red("→")} ${err}`);
      }
    }
  }

  console.log();

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  const totalTime = results.reduce((sum, r) => sum + r.elapsed, 0);

  if (failed === 0) {
    console.log(
      green(bold(`  ✅ All ${passed} routes passed`)) +
        dim(` (${totalTime}ms total)`)
    );
    console.log();
    process.exit(0);
  } else {
    console.log(
      red(bold(`  ❌ ${failed} of ${passed + failed} routes failed`)) +
        dim(` (${totalTime}ms total)`)
    );
    console.log();
    process.exit(1);
  }
}

main();
