import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Loading stripe library...");
  try {
    const { getConnectOAuthUrl } = await import("./src/lib/stripe");
    console.log("getConnectOAuthUrl:", getConnectOAuthUrl);
    const url = getConnectOAuthUrl("schnitzel-schmiede", "http://localhost:3000");
    console.log("OAuth URL:", url);
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

main().catch(console.error);
