import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://athwccvgdovglcpluwnu.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUyNjc1MSwiZXhwIjoyMDkwMTAyNzUxfQ.wGRxIMTBMoP04Gdsy63hm7e_mBfy4gQHgzYGkwesHQI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  // Let's run raw SQL query using postgres function or RPC since we have the service role key?
  // Wait, service role key doesn't allow executing arbitrary SQL directly unless we use an RPC, 
  // but let's see if we can use a query that gets the RPC definition, or check if there is an existing RPC.
  // Wait! Let's call supabase.rpc('is_admin') or check what is_admin does.
  // Let's check if there is an RPC proname 'is_admin' source code. Let's see if we can query pg_proc using postgres REST API.
  // PostgREST doesn't expose pg_proc directly unless it's configured. But we can write a short pg client script in node!
  // Oh, wait, the project uses Supabase local or remote DB. The remote database URL or connection string is not in .env,
  // but we can query it if we install 'pg' or if we look at the supabase client config.
  // Wait! Is there an rpc 'is_admin' we can invoke? Let's check what it returns for our own session.
  // Wait, let's look at the RPCs we have. We can write a script that queries pg_proc using a custom function or let's see if there is any other way.
  // Actually, we can run a postgres function that returns pg_proc. But wait, is 'is_admin' checking if the user's role is 'admin' or if a column 'is_admin' is true?
  // Let's write a script to query profiles where role is 'admin' or see if there is any row in profiles or user_roles.
  
  const { data: adminProfiles, error: aError } = await supabase.from('profiles').select('*').eq('role', 'admin');
  console.log('Profiles with role admin:', adminProfiles, aError);
  
  const { data: adminRoles, error: arError } = await supabase.from('user_roles').select('*').eq('role', 'admin');
  console.log('User roles with admin:', adminRoles, arError);
}

run();
