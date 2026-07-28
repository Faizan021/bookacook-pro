const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

const routeFiles = getFiles('src/routes');
console.log('Total route files:', routeFiles.length);

const URLsToTest = [
  'https://speisely.de/',
  'https://speisely.de/catering',
  'https://speisely.de/catering/partyservice-kuepper',
  'https://speisely.de/catering/events',
  'https://speisely.de/catering/daily-catering-subscriptions',
  'https://speisely.de/catering/institutional-catering',
  'https://speisely.de/catering/ort/berlin',
  'https://speisely.de/restaurants',
  'https://speisely.de/restaurant/schnitzel-schmiede',
  'https://speisely.de/restaurant/schnitzel-schmiede/checkout',
  'https://speisely.de/restaurant/schnitzel-schmiede/table-reservation',
  'https://speisely.de/restaurant/schnitzel-schmiede/surplus-bags',
  'https://speisely.de/planner',
  'https://speisely.de/partners',
  'https://speisely.de/contact',
  'https://speisely.de/auth',
  'https://speisely.de/caterer',
  'https://speisely.de/caterer?tab=settings',
  'https://speisely.de/caterer?tab=marketing-seo',
];

async function testURLs() {
  console.log('\n--- TESTING PRODUCTION URLS ---');
  for (const url of URLsToTest) {
    try {
      const r = await fetch(url);
      const html = await r.text();
      const hasError = html.includes("Something went wrong") || html.includes("didn't load");
      console.log(`${r.status} ${hasError ? '❌ ERROR' : '✅ OK'} ${url}`);
    } catch (err) {
      console.log(`❌ FETCH FAIL ${url}: ${err.message}`);
    }
  }
}

testURLs();
