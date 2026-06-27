import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== Supabase Timestamp Investigation ===");
  
  // We don't have a password for the actual user, but we can sign up a random temporary user for the test
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  console.log(`1. Signing up fresh user: ${testEmail}`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  
  if (signUpError) {
    console.error("Sign up failed:", signUpError.message);
    process.exit(1);
  }
  
  console.log("\n--- Initial Session Object ---");
  const session1 = signUpData.session;
  const user1 = signUpData.user;
  
  console.log("session.expires_at (seconds):", session1?.expires_at);
  console.log("session.expires_in (seconds):", session1?.expires_in);
  console.log("user.created_at:", user1?.created_at);
  console.log("user.last_sign_in_at:", user1?.last_sign_in_at);
  
  // Wait a few seconds
  console.log("\n2. Waiting 3 seconds before refreshing token...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Force a token refresh
  console.log("\n3. Triggering token refresh...");
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
  
  if (refreshError) {
    console.error("Refresh failed:", refreshError.message);
    process.exit(1);
  }
  
  console.log("\n--- Session Object After Refresh ---");
  const session2 = refreshData.session;
  const user2 = refreshData.user;
  
  console.log("session.expires_at (seconds):", session2?.expires_at);
  console.log("session.expires_in (seconds):", session2?.expires_in);
  console.log("user.created_at:", user2?.created_at);
  console.log("user.last_sign_in_at:", user2?.last_sign_in_at);
  
  console.log("\n=== Comparison ===");
  console.log("Did expires_at change?", session1?.expires_at !== session2?.expires_at);
  console.log("Did created_at change?", user1?.created_at !== user2?.created_at);
  console.log("Did last_sign_in_at change?", user1?.last_sign_in_at !== user2?.last_sign_in_at);
  
  // Clean up
  console.log("\n4. Cleaning up (Logging out)");
  await supabase.auth.signOut();
}

run();
