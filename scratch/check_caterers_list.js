const fs = require('fs');
let envText = '';
if (fs.existsSync('.env')) envText = fs.readFileSync('.env', 'utf8');
if (fs.existsSync('.env.local')) envText += '\n' + fs.readFileSync('.env.local', 'utf8');

const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const { createClient } = require('@supabase/supabase-js');
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', url, 'KEY:', key ? key.substring(0, 15) + '...' : 'NONE');
const supabase = createClient(url, key);

async function check() {
  const { data: cat, error: e1 } = await supabase.from('caterers').select('*');
  console.log('CATERERS count:', cat ? cat.length : 0, 'Error:', e1);
  if (cat) console.log(cat.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

  const { data: sf, error: e2 } = await supabase.from('storefront_settings').select('*');
  console.log('STOREFRONT count:', sf ? sf.length : 0, 'Error:', e2);
  if (sf) console.log(sf.map(s => ({ id: s.id, caterer_id: s.caterer_id, slug: s.slug })));
}
check();
