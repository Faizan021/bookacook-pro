const https = require('https');

const url = 'https://speisely.de/magazin/edition.html?t=' + Date.now();
https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Contains SPEISELY MANIFEST:', data.includes('SPEISELY MANIFEST'));
    console.log('Contains Ahmad F.:', data.includes('Ahmad F.'));
    console.log('Contains Die Speisely Redaktion:', data.includes('Die Speisely Redaktion'));
    console.log('Contains editorial table photo banner:', data.includes('Titelthema: Die Rückkehr der großen Tafel'));
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
