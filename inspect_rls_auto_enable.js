import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://athwccvgdovglcpluwnu.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0aHdjY3ZnZG92Z2xjcGx1d251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUyNjc1MSwiZXhwIjoyMDkwMTAyNzUxfQ.wGRxIMTBMoP04Gdsy63hm7e_mBfy4gQHgzYGkwesHQI";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data, error } = await supabase.rpc("rls_auto_enable");
  console.log("rls_auto_enable response:", { data, error });
}

check();
