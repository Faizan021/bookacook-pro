import fs from "fs";
import path from "path";

const routesDir = "C:\\Users\\ahmad\\.gemini\\antigravity\\scratch\\SpeiselyMarketplace\\src\\routes";

function scanFontWeights(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const lines = code.split("\n");
  const weights = new Set();
  
  lines.forEach((line) => {
    // Find classes like font-thin, font-extralight, font-light, font-normal, font-medium, font-semibold, font-bold, font-extrabold, font-black
    // or font-[...]
    const matches = line.match(/font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[\d+\])/g);
    if (matches) {
      matches.forEach(m => weights.add(m));
    }
  });

  if (weights.size > 0) {
    console.log(`${path.basename(filePath)}:`, Array.from(weights));
  }
}

const files = fs.readdirSync(routesDir).filter(f => f.endsWith(".tsx"));
files.forEach(f => {
  scanFontWeights(path.join(routesDir, f));
});
