import fs from "fs";
import path from "path";

const routesDir = "C:\\Users\\ahmad\\.gemini\\antigravity\\scratch\\SpeiselyMarketplace\\src\\routes";

// We want to scan files for:
// 1. Array/Object declarations inside React components (potential re-render issues)
// 2. Non-standard font weights (e.g. font-light, font-medium, font-semibold, font-bold vs arbitrary font-[300], font-[500])
// 3. Mobile horizontal scroll layouts
// 4. TanStack Router Link components to check preloading options.

function scanFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const lines = code.split("\n");
  const fileName = path.basename(filePath);

  console.log(`\n=== Auditing ${fileName} ===`);

  // 1. Check for objects/arrays declared directly inside components (excluding hooks and simple states)
  const innerArrays = [];
  lines.forEach((line, idx) => {
    if (line.includes("const ") && (line.includes(" = [") || line.includes(" = {")) && !line.includes("useState") && !line.includes("useMemo") && !line.includes("useCallback")) {
      // Check if it's inside a function/component
      const isInsideComponent = idx > 20 && idx < lines.length - 20; // heuristic
      if (isInsideComponent && !line.includes("const Route") && !line.includes("const searchSchema")) {
        innerArrays.push({ line: idx + 1, content: line.trim() });
      }
    }
  });

  if (innerArrays.length > 0) {
    console.log("  [Re-renders] Found variables defined in render body:");
    innerArrays.forEach((item) => console.log(`    Line ${item.line}: ${item.content}`));
  }

  // 2. Check for arbitrary font-weight classes
  const fontWeights = [];
  lines.forEach((line, idx) => {
    const match = line.match(/font-\[(\d+)\]/);
    if (match) {
      fontWeights.push({ line: idx + 1, weight: match[1], content: line.trim() });
    }
  });

  if (fontWeights.length > 0) {
    console.log("  [Typography] Found arbitrary font-weights:");
    fontWeights.forEach((item) => console.log(`    Line ${item.line}: ${item.content}`));
  }

  // 3. Check for mobile horizontal scroll styling
  const horizontalScrolls = [];
  lines.forEach((line, idx) => {
    if (line.includes("overflow-x-") || line.includes("flex-row") && (line.includes("overflow-auto") || line.includes("overflow-scroll"))) {
      horizontalScrolls.push({ line: idx + 1, content: line.trim() });
    }
  });

  if (horizontalScrolls.length > 0) {
    console.log("  [Mobile Scroll] Found horizontal scroll containers:");
    horizontalScrolls.forEach((item) => console.log(`    Line ${item.line}: ${item.content}`));
  }
}

const files = fs.readdirSync(routesDir).filter(f => f.endsWith(".tsx"));
files.forEach(f => {
  scanFile(path.join(routesDir, f));
});
