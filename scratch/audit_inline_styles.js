import fs from "fs";
import path from "path";

const routesDir = "C:\\Users\\ahmad\\.gemini\\antigravity\\scratch\\SpeiselyMarketplace\\src\\routes";

function scanInlineStyles(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const lines = code.split("\n");
  
  lines.forEach((line, idx) => {
    if (line.includes("style={{") && (line.includes("fontWeight") || line.includes("fontFamily") || line.includes("fontSize"))) {
      console.log(`    Line ${idx + 1}: ${line.trim()}`);
    }
  });
}

const files = fs.readdirSync(routesDir).filter(f => f.endsWith(".tsx"));
files.forEach(f => {
  scanInlineStyles(path.join(routesDir, f));
});
