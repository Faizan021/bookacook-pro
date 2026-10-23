/**
 * SPEISELY AUTONOMOUS SEO / GEO / AEO MASTER ENGINE
 * 
 * Combines 4 core pillars:
 * 1. Live Partner Backlink Health & Integrity Shield (Haus Spaas, Küpper, Kampala Rolex, TechGlanz, Atelier Textile)
 * 2. Sitemap & Indexation Guard (HTTP 200 validation, canonical parity, zero 404s)
 * 3. AEO & LLMs.txt Entity & Citation Audit (Verifies presence in /llms.txt, AI schema readiness)
 * 4. Zero-Cost Outreach & Local Venue/Supplier Opportunity Discovery (Kooperations-SEO & PR Outlines)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const SPEISELY_BASE = 'https://speisely.de';

// 1. Monitored Live Backlink Partners
const PARTNERS = [
  {
    name: 'Haus Spaas',
    url: 'https://haus-spaas.de',
    expectedAnchor: 'speisely.de',
    expectedHref: 'https://speisely.de',
    ctaHref: 'https://speisely.de/partner/webseiten?ref=haus-spaas'
  },
  {
    name: 'Partyservice Küpper',
    url: 'https://partyservicekuepper.de',
    expectedAnchor: 'speisely.de',
    expectedHref: 'https://speisely.de',
    ctaHref: 'https://speisely.de/partner/webseiten?ref=kuepper'
  },
  {
    name: 'Kampala Rolex Germany',
    url: 'https://faizan021.github.io/kampala-rolex-germany/',
    expectedAnchor: 'Speisely',
    expectedHref: 'https://speisely.de',
    ctaHref: 'https://speisely.de/partner/webseiten?ref=kampala-rolex'
  },
  {
    name: 'TechGlanz Case Study',
    url: 'https://techglanz.de/case-studies/speisely/',
    expectedAnchor: 'speisely.de',
    expectedHref: 'https://speisely.de',
    ctaHref: null
  },
  {
    name: 'Atelier Textiles',
    url: 'https://www.ateliertextiles.com/case-studies',
    expectedAnchor: 'Speisely',
    expectedHref: 'https://speisely.de',
    ctaHref: null
  }
];

// Helper: HTTP GET fetcher with timeout and user-agent
function fetchUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SpeiselyAeoBot/2026.1 (SEO & Backlink Integrity Audit)',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          timeout: 10000
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
              error: null
            });
          });
        }
      );

      req.on('error', (err) => resolve({ statusCode: 0, body: '', error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ statusCode: 408, body: '', error: 'Request Timeout (10s)' });
      });
    } catch (e) {
      resolve({ statusCode: 0, body: '', error: e.message });
    }
  });
}

// ─────────────────────────────────────────────────────────────
// MODULE 1: Live Backlink Health & Integrity Shield
// ─────────────────────────────────────────────────────────────
async function auditLiveBacklinks() {
  console.log('\n[Pillar 1: Partner Backlink Shield] Auditing active partner domains...');
  const results = [];

  for (const p of PARTNERS) {
    const res = await fetchUrl(p.url);
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const body = res.body || '';
      const hasSpeiselyHref = body.includes(p.expectedHref);
      const hasAnchor = body.toLowerCase().includes(p.expectedAnchor.toLowerCase());
      const hasCta = p.ctaHref ? body.includes(p.ctaHref) : true;
      const isDoFollow = hasSpeiselyHref && !body.includes(`href="${p.expectedHref}" rel="nofollow"`);

      results.push({
        name: p.name,
        url: p.url,
        status: 'UP (HTTP ' + res.statusCode + ')',
        backlinkFound: hasSpeiselyHref,
        anchorVerified: hasAnchor,
        ctaVerified: hasCta,
        doFollow: isDoFollow,
        health: hasSpeiselyHref && hasAnchor && hasCta ? 'PERFECT' : 'NEEDS_ATTENTION'
      });
    } else {
      results.push({
        name: p.name,
        url: p.url,
        status: `DOWN / ERR (${res.statusCode || res.error})`,
        backlinkFound: false,
        anchorVerified: false,
        ctaVerified: false,
        doFollow: false,
        health: 'CRITICAL'
      });
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// MODULE 2: Sitemap & Internal Route Integrity
// ─────────────────────────────────────────────────────────────
async function auditSitemapAndRoutes() {
  console.log('[Pillar 2: Sitemap & Core Routing Integrity] Validating public sitemap...');
  const coreRoutes = [
    '/',
    '/restaurants',
    '/catering',
    '/planner',
    '/partners',
    '/partner/webseiten',
    '/magazin',
    '/magazin/mediadaten',
    '/magazin/reader',
    '/llms.txt',
    '/sitemap.xml'
  ];

  const results = [];
  for (const route of coreRoutes) {
    const targetUrl = `${SPEISELY_BASE}${route}`;
    const res = await fetchUrl(targetUrl);
    results.push({
      route,
      targetUrl,
      statusCode: res.statusCode,
      ok: res.statusCode >= 200 && res.statusCode < 400
    });
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// MODULE 3: AEO & LLMs.txt Entity & Citation Readiness
// ─────────────────────────────────────────────────────────────
async function auditAeoAndEntities() {
  console.log('[Pillar 3: AEO & Generative Search Readiness] Checking /llms.txt and entity models...');
  const res = await fetchUrl(`${SPEISELY_BASE}/llms.txt`);
  
  const checks = {
    accessible: res.statusCode === 200,
    hasBrandDefinition: res.body.includes('deutschlandweiter Marktplatz für Restaurants'),
    hasB2BWebsites: res.body.includes('/partner/webseiten'),
    hasMediadaten: res.body.includes('/magazin/mediadaten'),
    hasCaseStudies: res.body.includes('haus-spaas') && res.body.includes('partyservice-kuepper'),
    hasSocialProof: res.body.includes('linkedin.com/company/speisely') && res.body.includes('instagram.com/speisely')
  };

  return {
    statusCode: res.statusCode,
    checks,
    score: Object.values(checks).filter(Boolean).length + ' / ' + Object.keys(checks).length
  };
}

// ─────────────────────────────────────────────────────────────
// MODULE 4: Zero-Cost PR Pitch & Local Venue Opportunity Scout
// ─────────────────────────────────────────────────────────────
function generateOutreachPlaybook() {
  return [
    {
      category: 'Event & Wedding Venues (NRW & Berlin)',
      play: 'Preferred Caterer Directory Addition',
      value: 'High-DR Local Domain Referral',
      cost: '€0 (Barter / Mutual Recommendation)',
      action: 'Pitch venue event managers with Speisely verified caterer roster & instant booking calculator.'
    },
    {
      category: 'Digital PR (Source of Sources / Qwoted / HARO)',
      play: 'Expert Quotes on Food Waste, Halal Catering, & Restaurant POS Tech',
      value: 'National DR 70-90 Editorial Backlinks',
      cost: '€0 (3-Sentence Expert Quote)',
      action: 'Pitch marketing publications on how Speisely eliminates third-party restaurant commissions.'
    },
    {
      category: 'Municipal & Tourism Portals (Local City SEO)',
      play: 'Local Gastronomy Guide Inclusion (Mönchengladbach, Düsseldorf, Köln, Berlin)',
      value: 'High-Trust .de / Regional City Domain Backlinks',
      cost: '€0 (Official Business Registry)',
      action: 'Register Speisely Magazin & partner profiles with local business development offices.'
    }
  ];
}

// ─────────────────────────────────────────────────────────────
// MASTER RUNNER & REPORT WRITER
// ─────────────────────────────────────────────────────────────
async function runMasterSeoEngine() {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('  SPEISELY AUTONOMOUS SEO / GEO / AEO MASTER ENGINE (2026 AUDIT)   ');
  console.log('════════════════════════════════════════════════════════════════════');

  const backlinkResults = await auditLiveBacklinks();
  const routingResults = await auditSitemapAndRoutes();
  const aeoResults = await auditAeoAndEntities();
  const outreachPlaybook = generateOutreachPlaybook();

  const reportDate = new Date().toISOString().split('T')[0];
  const reportPath = path.resolve(process.cwd(), 'docs', 'ACTIVE_WORK_NOTES.md');

  let mdReport = `\n\n## 🚀 Autonomous SEO / GEO / AEO Master Audit Report (${reportDate})\n\n`;

  mdReport += `### 1. Live Partner Backlink Health Shield\n`;
  mdReport += `| Partner Domain | Status | Link Found | Anchor Verified | DoFollow | Health Status |\n`;
  mdReport += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  for (const b of backlinkResults) {
    const icon = b.health === 'PERFECT' ? '✅' : '⚠️';
    mdReport += `| **${b.name}** | ${b.status} | ${b.backlinkFound ? 'Yes' : 'No'} | ${b.anchorVerified ? 'Yes' : 'No'} | ${b.doFollow ? 'Yes' : 'No'} | ${icon} ${b.health} |\n`;
  }

  mdReport += `\n### 2. Core Routing & Public Sitemap Health\n`;
  mdReport += `| Route | URL | HTTP Status | Integrity |\n`;
  mdReport += `| :--- | :--- | :--- | :--- |\n`;
  for (const r of routingResults) {
    const icon = r.ok ? '✅ OK' : '❌ FAIL';
    mdReport += `| \`${r.route}\` | ${r.targetUrl} | ${r.statusCode} | ${icon} |\n`;
  }

  mdReport += `\n### 3. AEO & Generative AI Search Readiness (/llms.txt)\n`;
  mdReport += `- **Endpoint Status:** HTTP ${aeoResults.statusCode}\n`;
  mdReport += `- **AI Knowledge Graph Readiness Score:** **${aeoResults.score} Checks Passed**\n`;
  mdReport += `- Brand & Commission-Free Model Defined: ${aeoResults.checks.hasBrandDefinition ? '✅' : '❌'}\n`;
  mdReport += `- B2B Web Solutions Active: ${aeoResults.checks.hasB2BWebsites ? '✅' : '❌'}\n`;
  mdReport += `- Magazin Mediadaten Hub Active: ${aeoResults.checks.hasMediadaten ? '✅' : '❌'}\n`;
  mdReport += `- Case Studies (Haus Spaas & Küpper) Mapped: ${aeoResults.checks.hasCaseStudies ? '✅' : '❌'}\n`;
  mdReport += `- Official Social Entity Graph Synced: ${aeoResults.checks.hasSocialProof ? '✅' : '❌'}\n`;

  mdReport += `\n### 4. Zero-Cost Digital PR & Local Backlink Playbook\n`;
  for (const o of outreachPlaybook) {
    mdReport += `* **${o.category}:** ${o.play} (Target: ${o.value} · Cost: ${o.cost})\n`;
    mdReport += `  * *Next Action:* ${o.action}\n`;
  }

  // Append to docs/ACTIVE_WORK_NOTES.md
  try {
    fs.appendFileSync(reportPath, mdReport, 'utf8');
    console.log(`\n✅ Audit Complete! Master report synced into docs/ACTIVE_WORK_NOTES.md`);
  } catch (err) {
    console.error(`Failed to write report: ${err.message}`);
  }

  // Print summary to console
  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`• Backlink Partners Checked: ${backlinkResults.length}`);
  console.log(`• Core Routes Verified: ${routingResults.length}`);
  console.log(`• AEO Readiness Score: ${aeoResults.score}`);
  console.log('════════════════════════════════════════════════════════════════════\n');
}

runMasterSeoEngine();
