import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const allConfigured = Object.values(checks).every(Boolean);

  return NextResponse.json({
    configured: allConfigured,
    checks,
    message: allConfigured 
      ? "All Supabase credentials are configured"
      : "Missing Supabase credentials - check Vercel environment variables",
  });
}
