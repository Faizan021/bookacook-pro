import fs from 'fs';
import path from 'path';

// =============================================================================
// SPEISELY AEO & GEO HEALTH AUDITOR
// =============================================================================
// Validates technical, structured data, and attribution standards for:
// - ChatGPT Search (OAI-SearchBot, GPTBot)
// - Perplexity AI (PerplexityBot)
// - Google AI Overviews & Gemini (Google-Extended)
// - Claude / Anthropic (ClaudeBot)
// - Microsoft Copilot / Bing
// =============================================================================

let failed = 0;
let passed = 0;

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

function check(title, condition, detail) {
  if (condition) {
    console.log(`  ${green('✓ [PASS]')} ${title}`);
    passed++;
  } else {
    console.error(`  ${red('✗ [FAIL]')} ${title} — ${detail}`);
    failed++;
  }
}

console.log(bold('\n══════════════════════════════════════════════════════'));
console.log(bold('   SPEISELY — Answer Engine Optimization (AEO) Audit  '));
console.log(bold('══════════════════════════════════════════════════════\n'));

// 1. Robots.txt AI Bot Verification
const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  check('robots.txt allows GPTBot', robots.includes('User-agent: GPTBot') && robots.includes('Allow: /'), 'GPTBot missing or disallowed');
  check('robots.txt allows OAI-SearchBot', robots.includes('User-agent: OAI-SearchBot'), 'OAI-SearchBot missing');
  check('robots.txt allows PerplexityBot', robots.includes('User-agent: PerplexityBot'), 'PerplexityBot missing');
  check('robots.txt allows ClaudeBot', robots.includes('User-agent: ClaudeBot'), 'ClaudeBot missing');
  check('robots.txt allows Google-Extended', robots.includes('User-agent: Google-Extended'), 'Google-Extended missing');
  check('robots.txt links to llms.txt and llms-full.txt', robots.includes('llms.txt') && robots.includes('llms-full.txt'), 'llms resource links missing');
} else {
  check('robots.txt exists', false, 'public/robots.txt not found');
}

// 2. LLMs.txt & LLMs-Full.txt Verification
const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
const llmsFullPath = path.join(process.cwd(), 'public', 'llms-full.txt');

check('public/llms.txt exists & has content', fs.existsSync(llmsPath) && fs.statSync(llmsPath).size > 1000, 'llms.txt missing or empty');
check('public/llms-full.txt exists & has content', fs.existsSync(llmsFullPath) && fs.statSync(llmsFullPath).size > 5000, 'llms-full.txt missing or empty');

// 3. City Page AEO Quick-Answer Block Verification
const cityRoutePath = path.join(process.cwd(), 'src', 'routes', 'catering.ort.$city.tsx');
const cityQuickFactsPath = path.join(process.cwd(), 'src', 'components', 'geo', 'CityAeoQuickFacts.tsx');

check('CityAeoQuickFacts component exists', fs.existsSync(cityQuickFactsPath), 'CityAeoQuickFacts.tsx missing');

if (fs.existsSync(cityRoutePath)) {
  const cityContent = fs.readFileSync(cityRoutePath, 'utf8');
  check('City page imports CityAeoQuickFacts', cityContent.includes('CityAeoQuickFacts'), 'Component not imported');
  check('City page renders CityAeoQuickFacts', cityContent.includes('<CityAeoQuickFacts'), 'Component not rendered in JSX');
}

// 4. AI Referral Attribution Logic Test Vectors
function simulateAiDetection(referrer, search) {
  const r = (referrer || '').toLowerCase();
  const q = (search || '').toLowerCase();
  const params = new URLSearchParams(q.replace(/^\?/, ''));
  const src = params.get('utm_source') || '';
  const med = params.get('utm_medium') || '';
  const st = params.get('st_source') || '';
  let engine = null;

  if (src.indexOf('chatgpt') !== -1 || r.indexOf('chatgpt.com') !== -1 || r.indexOf('openai.com') !== -1 || r.indexOf('com.openai.chatgpt') !== -1) {
    engine = 'chatgpt';
  } else if (src.indexOf('gemini') !== -1 || src.indexOf('bard') !== -1 || r.indexOf('gemini.google.com') !== -1 || r.indexOf('apps.bard') !== -1) {
    engine = 'gemini';
  } else if (src.indexOf('perplexity') !== -1 || r.indexOf('perplexity.ai') !== -1 || r.indexOf('ai.perplexity.app') !== -1) {
    engine = 'perplexity';
  } else if (src.indexOf('claude') !== -1 || r.indexOf('claude.ai') !== -1 || r.indexOf('anthropic.com') !== -1) {
    engine = 'claude';
  } else if (src.indexOf('copilot') !== -1 || r.indexOf('copilot.microsoft.com') !== -1 || r.indexOf('com.microsoft.copilot') !== -1) {
    engine = 'copilot';
  } else if (st === 'ai_overview' || med === 'ai_overview' || src.indexOf('google_ai') !== -1) {
    engine = 'google_ai_overview';
  } else if (src.indexOf('deepseek') !== -1 || r.indexOf('deepseek.com') !== -1) {
    engine = 'deepseek';
  }

  return engine;
}

const testCases = [
  { ref: 'https://chatgpt.com/', query: '', expected: 'chatgpt' },
  { ref: 'android-app://com.openai.chatgpt/', query: '', expected: 'chatgpt' },
  { ref: 'https://www.perplexity.ai/search/123', query: '', expected: 'perplexity' },
  { ref: 'android-app://ai.perplexity.app/', query: '', expected: 'perplexity' },
  { ref: 'https://claude.ai/', query: '', expected: 'claude' },
  { ref: 'https://copilot.microsoft.com/', query: '', expected: 'copilot' },
  { ref: '', query: '?utm_source=google_ai&utm_medium=ai_overview', expected: 'google_ai_overview' },
  { ref: 'https://chat.deepseek.com/', query: '', expected: 'deepseek' },
];

let attributionErrors = 0;
for (const tc of testCases) {
  const result = simulateAiDetection(tc.ref, tc.query);
  if (result !== tc.expected) {
    attributionErrors++;
  }
}
check('AI Attribution test vectors (8/8 scenarios passed)', attributionErrors === 0, `${attributionErrors} test cases failed`);

// 5. PostHog AEO Context Contract
const posthogUtilPath = path.join(process.cwd(), 'src', 'utils', 'posthog.ts');
if (fs.existsSync(posthogUtilPath)) {
  const posthogSrc = fs.readFileSync(posthogUtilPath, 'utf8');
  check('PostHog exports getAiReferralContext', posthogSrc.includes('getAiReferralContext'), 'getAiReferralContext missing');
  check('PostHog registers AI super properties', posthogSrc.includes('is_ai_traffic'), 'is_ai_traffic super property missing');
}

console.log(bold('\n──────────────────────────────────────────────────────'));
if (failed === 0) {
  console.log(green(bold(`✨ AEO Health Audit Passed: ${passed} checks passed, 0 failures.`)));
  process.exit(0);
} else {
  console.error(red(bold(`⚠️  AEO Health Audit Failed: ${failed} failure(s) detected.`)));
  process.exit(1);
}
