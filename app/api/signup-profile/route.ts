import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, contact_person, role } = body ?? {};

    if (!id || !email || !contact_person || !role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("[signup-profile] Supabase credentials missing, skipping profile creation");
      return NextResponse.json(
        { success: true, message: "Auth successful, profile skipped" },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id,
        email,
        contact_person,
        role,
      });

    if (upsertError) {
      console.error("[signup-profile] Upsert failed:", upsertError);
      
      if (upsertError.code === "42P01") {
        console.error("[signup-profile] Table does not exist");
        return NextResponse.json(
          { success: true, message: "Auth successful, profiles table not available" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { success: false, error: upsertError.message || "Failed to save profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[signup-profile] Exception:", error);
    return NextResponse.json(
      { success: true, message: "Auth successful" },
      { status: 200 }
    );
  }
}
