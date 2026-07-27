import fs from "fs";
import { createClient } from "@supabase/supabase-js";

let url = "https://athwccvgdovglcpluwnu.supabase.co";
let key = "";

try {
  const envLocal = fs.readFileSync(".env.local", "utf8");
  const urlMatch = envLocal.match(/VITE_SUPABASE_URL="?([^"\r\n]+)"?/);
  const keyMatch = envLocal.match(/VITE_SUPABASE_PUBLISHABLE_KEY="?([^"\r\n]+)"?/);
  if (urlMatch) url = urlMatch[1];
  if (keyMatch) key = keyMatch[1];
} catch (e) {}

console.log("Using URL:", url);

async function run() {
  const supabase = createClient(url, key);

  // 1. Find caterers named 'milan' or 'Wali Caters' or similar test entries
  const { data: testCaterers } = await supabase
    .from("caterers")
    .select("id, name, slug")
    .or("name.ilike.%milan%,name.ilike.%wali%,slug.ilike.%milan%,slug.ilike.%wali%");

  console.log("Found test caterers to delete:", testCaterers);

  if (testCaterers && testCaterers.length > 0) {
    const ids = testCaterers.map((c) => c.id);

    const { error: menuErr } = await supabase.from("caterer_menu_items").delete().in("caterer_id", ids);
    console.log("Deleted menu items result:", menuErr);

    const { error: sfErr } = await supabase.from("storefront_settings").delete().in("caterer_id", ids);
    console.log("Deleted storefront_settings result:", sfErr);

    const { error: catErr } = await supabase.from("caterers").delete().in("id", ids);
    console.log("Deleted caterers result:", catErr);
  }

  // 2. Also check storefront_settings directly for any orphaned 'milan' or 'wali'
  const { data: testSf } = await supabase
    .from("storefront_settings")
    .select("id, caterer_id, slug")
    .or("slug.ilike.%milan%,slug.ilike.%wali%");

  if (testSf && testSf.length > 0) {
    const sfIds = testSf.map((s) => s.id);
    await supabase.from("storefront_settings").delete().in("id", sfIds);
    console.log("Deleted orphaned storefront_settings:", sfIds);
  }

  // 3. Update Partyservice Küpper image URL in caterers and storefront_settings
  const kuepperBanner = "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop";

  const { data: kuepperCat, error: kuepperCatErr } = await supabase
    .from("caterers")
    .update({ banner_image_url: kuepperBanner })
    .ilike("slug", "%kuepper%")
    .select();
  console.log("Updated Küpper in caterers:", kuepperCat, kuepperCatErr);

  const { data: kuepperSf, error: kuepperSfErr } = await supabase
    .from("storefront_settings")
    .update({ banner_image_url: kuepperBanner, is_active: true })
    .ilike("slug", "%kuepper%")
    .select();
  console.log("Updated Küpper in storefront_settings:", kuepperSf, kuepperSfErr);
}

run();
