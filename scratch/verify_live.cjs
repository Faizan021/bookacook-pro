const https = require('https');
https.get('https://speisely.de/magazin/edition.html', (res) => {
  console.log('Status:', res.statusCode);
  console.log('x-frame-options:', res.headers['x-frame-options']);
  console.log('cache-control:', res.headers['cache-control']);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Body length:', body.length);
    console.log('Contains lang switcher:', body.includes('btn-lang-en'));
    console.log('Contains auto-fit:', body.includes('autoFitScale'));
  });
});
