const fs = require("fs");
const files = [
  "src/routes/_authenticated/restaurant.tsx",
  "src/routes/_authenticated/caterer.tsx",
  "src/routes/_authenticated/dashboard/planner.tsx"
];

for (const file of files) {
  let code = fs.readFileSync(file, "utf8");
  const icons = ["Plus", "Loader2", "Tag", "Ticket"];
  const lucideRegex = /import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/;
  const match = code.match(lucideRegex);
  
  if (match) {
    let existingImports = match[1];
    let toAdd = [];
    for (let icon of icons) {
      if (!new RegExp(`\\b${icon}\\b`).test(existingImports)) {
        toAdd.push(icon);
      }
    }
    if (toAdd.length > 0) {
      const newImport = `import { ${existingImports}, ${toAdd.join(", ")} } from "lucide-react"`;
      code = code.replace(lucideRegex, newImport);
      fs.writeFileSync(file, code);
      console.log(`Updated lucide-react import in ${file}`);
    } else {
      console.log(`All icons present in ${file}`);
    }
  } else {
    code = `import { Plus, Loader2, Tag, Ticket } from "lucide-react";\n` + code;
    fs.writeFileSync(file, code);
    console.log(`Added lucide-react import to ${file}`);
  }
}

