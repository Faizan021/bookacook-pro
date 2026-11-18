/**
 * SPEISELY INDEXNOW INSTANT DISCOVERY PINGER
 * Submits newly published and core canonical URLs directly to IndexNow API
 * (Instant push to Microsoft Bing, Microsoft Copilot, Seznam, and Yandex).
 */

import https from 'https';

const KEY = 'urq9kn2hg31y6jx3ahugbd466h393rv1';
const HOST = 'speisely.de';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  'https://speisely.de/',
  'https://speisely.de/restaurants',
  'https://speisely.de/catering',
  'https://speisely.de/catering/rechner',
  'https://speisely.de/catering/halal',
  'https://speisely.de/catering/fingerfood',
  'https://speisely.de/catering/events',
  'https://speisely.de/catering/daily-catering-subscriptions',
  'https://speisely.de/catering/institutional-catering',
  'https://speisely.de/planner',
  'https://speisely.de/partners',
  'https://speisely.de/partner/webseiten',
  'https://speisely.de/magazin',
  'https://speisely.de/magazin/digital',
  'https://speisely.de/magazin/mediadaten',
  'https://speisely.de/community',
  'https://speisely.de/blog',
  'https://speisely.de/blog/catering-meetings-seminare-berlin',
  'https://speisely.de/blog/speisely-google-for-startups-immersion-emea',
  'https://speisely.de/blog/catering-firmenevents-deutschland-2026',
  'https://speisely.de/blog/sustainable-plant-based-catering-trends-2026',
  'https://speisely.de/blog/what-is-speisely',
  'https://speisely.de/catering/ort/berlin',
  'https://speisely.de/catering/ort/muenchen',
  'https://speisely.de/catering/ort/hamburg',
  'https://speisely.de/catering/ort/frankfurt',
  'https://speisely.de/catering/ort/koeln',
  'https://speisely.de/catering/ort/duesseldorf',
  'https://speisely.de/catering/ort/stuttgart',
  'https://speisely.de/case-study/partyservice-kuepper',
  'https://speisely.de/case-study/haus-spaas',
  'https://speisely.de/case-study/schnitzelschmiede'
];

async function pingIndexNow() {
  console.log(`\n🚀 Submitting ${URLS.length} URLs to IndexNow (Bing / Copilot / Seznam / Yandex)...`);

  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS
  });

  return new Promise((resolve, reject) => {
    let completed = false;
    const req = https.request({
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        completed = true;
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ IndexNow Success: HTTP ${res.statusCode} ${res.statusMessage}`);
          console.log(`✨ All ${URLS.length} URLs queued for rapid indexing.\n`);
          resolve(true);
        } else {
          console.warn(`⚠️ IndexNow responded with HTTP ${res.statusCode} ${res.statusMessage}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      if (!completed) {
        console.error(`❌ IndexNow Request Failed:`, err.message);
        reject(err);
      }
    });

    req.write(payload);
    req.end();
  });
}

pingIndexNow().catch(() => process.exit(1));
