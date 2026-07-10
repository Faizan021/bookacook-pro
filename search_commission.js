import fs from "fs";
import path from "path";

const rootDir = "C:\\recoverd usb\\Speisely Marketplace1";

function scan(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return;
  }
  for (const file of files) {
    if (
      file === "node_modules" ||
      file === ".git" ||
      file === ".lovable" ||
      file === ".vercel" ||
      file === "dist"
    ) {
      continue;
    }
    const fullPath = path.join(dir, file);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        scan(fullPath);
      } else if (stats.isFile()) {
        if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".sql")) {
          const content = fs.readFileSync(fullPath, "utf8");
          if (content.toLowerCase().includes("commission") || content.includes("0.02")) {
            console.log(`Found reference in: ${fullPath}`);
            const lines = content.split("\n");
            lines.forEach((line, index) => {
              if (line.toLowerCase().includes("commission") || line.includes("0.02")) {
                console.log(`  ${index + 1}: ${line.trim()}`);
              }
            });
          }
        }
      }
    } catch (e) {
      // Ignore
    }
  }
}

scan(rootDir);
