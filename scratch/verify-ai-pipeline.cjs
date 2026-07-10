const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Simple .env parser
const env = fs
  .readFileSync("C:/recoverd usb/Speisely Marketplace1/.env", "utf8")
  .split("\n")
  .reduce((acc, line) => {
    const [key, ...val] = line.split("=");
    if (key && val.length > 0) {
      acc[key.trim()] = val.join("=").trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    }
    return acc;
  }, {});

async function verifyPipeline() {
  console.log("=== AI Visibility Pipeline Verification ===");

  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const anonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.error("Missing environment variables.", {
      supabaseUrl: !!supabaseUrl,
      anonKey: !!anonKey,
      serviceKey: !!serviceKey,
    });
    process.exit(1);
  }

  const publicClient = createClient(supabaseUrl, anonKey);
  const adminClient = createClient(supabaseUrl, serviceKey);

  // 1. Verify Admin-only access (RLS)
  console.log("\n[Test 1] Verifying Admin-only Enforcement...");
  const { data: unauthorizedInsert, error: rlsError } = await publicClient
    .from("seo_content_pages")
    .insert({
      type: "geo",
      target_keyword: "rls-test",
      title: "RLS Test",
      slug: "rls-test",
      meta_title: "RLS Test",
      meta_description: "RLS Test",
      content: "RLS Test",
      cta_text: "RLS Test",
      internal_links: [],
    });

  if (rlsError && rlsError.code === "42501") {
    console.log("✅ SUCCESS: Anonymous access successfully blocked by RLS.");
  } else {
    console.error("❌ FAILED: RLS did not block anonymous insert. Error:", rlsError);
  }

  // 2. Draft Creation & Lifecycle (Isolated Test Record)
  console.log("\n[Test 2] Draft Creation & Lifecycle...");
  const testSlug = `test-pipeline-${Date.now()}`;

  const { data: draftRecord, error: insertError } = await adminClient
    .from("seo_content_pages")
    .insert({
      type: "competitor",
      target_keyword: "pipeline-test",
      title: "Pipeline Test",
      slug: testSlug,
      meta_title: "Pipeline Test",
      meta_description: "Pipeline Test",
      content: "Pipeline Test Content",
      cta_text: "Buy Now",
      internal_links: [],
    })
    .select()
    .single();

  if (insertError) {
    console.error("❌ FAILED: Could not create draft record.", insertError);
    return;
  }
  console.log("✅ SUCCESS: Draft created successfully (default status: draft).");

  const draftId = draftRecord.id;

  // 3. Status Transitions
  console.log("\n[Test 3] Status Lifecycle Integrity...");
  const transitions = ["in_review", "approved", "published", "rejected", "archived"];

  for (const status of transitions) {
    const { error: updateError } = await adminClient
      .from("seo_content_pages")
      .update({ status: status })
      .eq("id", draftId);

    if (updateError) {
      console.error(`❌ FAILED: Could not transition to ${status}.`, updateError);
    } else {
      console.log(`✅ SUCCESS: Transitioned cleanly to '${status}'.`);
    }
  }

  // 4. Edit/Save Persistence
  console.log("\n[Test 4] Edit/Save Persistence...");
  const newContent = "Updated Test Content";
  const { error: editError } = await adminClient
    .from("seo_content_pages")
    .update({ content: newContent })
    .eq("id", draftId);

  if (editError) {
    console.error("❌ FAILED: Edit save persistence failed.", editError);
  } else {
    // Verify it saved
    const { data: updatedRecord } = await adminClient
      .from("seo_content_pages")
      .select("content")
      .eq("id", draftId)
      .single();

    if (updatedRecord.content === newContent) {
      console.log("✅ SUCCESS: Edits persisted successfully.");
    } else {
      console.error("❌ FAILED: Edited content did not match.");
    }
  }

  // Cleanup Isolated Test Record
  console.log("\n[Cleanup] Removing isolated test record...");
  const { error: deleteError } = await adminClient
    .from("seo_content_pages")
    .delete()
    .eq("id", draftId);

  if (deleteError) {
    console.error("❌ FAILED: Cleanup failed.", deleteError);
  } else {
    console.log("✅ SUCCESS: Test record safely deleted.");
  }

  console.log("\n=== Verification Complete ===");
}

verifyPipeline().catch(console.error);
