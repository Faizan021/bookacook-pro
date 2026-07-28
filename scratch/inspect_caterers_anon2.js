import fs from 'fs';

const envProd = fs.readFileSync('.env.production', 'utf8');
const getVal = (key) => {
  const m = envProd.match(new RegExp(`${key}="([^"]+)"`));
  return m ? m[1] : '';
};

const url = getVal('SUPABASE_URL');
const key = getVal('SUPABASE_SERVICE_ROLE_KEY') || getVal('SUPABASE_PUBLISHABLE_KEY');

console.log('URL:', url);
console.log('Key exists:', !!key, 'length:', key.length);

async function listAllCaterers() {
  const res = await fetch(`${url}/rest/v1/caterers?select=*`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  const data = await res.json();
  console.log('Caterers in DB:', JSON.stringify(data, null, 2));

  const sfRes = await fetch(`${url}/rest/v1/storefront_settings?select=*`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`
    }
  });
  const sfData = await sfRes.json();
  console.log('Storefront Settings in DB:', JSON.stringify(sfData, null, 2));
}

listAllCaterers();
