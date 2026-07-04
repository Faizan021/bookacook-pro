const fs = require("fs");
const files = [
  "src/routes/_authenticated/restaurant.tsx",
  "src/routes/_authenticated/caterer.tsx",
  "src/routes/_authenticated/dashboard/planner.tsx"
];

for (const file of files) {
  let code = fs.readFileSync(file, "utf8");
  
  code = code.replace(/text-orange-600/g, "text-forest");
  code = code.replace(/focus:border-orange-500/g, "focus:border-forest");
  code = code.replace(/focus:ring-orange-500/g, "focus:ring-forest");
  code = code.replace(/bg-orange-600/g, "bg-forest");
  code = code.replace(/hover:bg-orange-700/g, "hover:bg-forest/90");
  code = code.replace(/peer-checked:bg-orange-600/g, "peer-checked:bg-forest");

  fs.writeFileSync(file, code);
  console.log("Patched " + file);
}

