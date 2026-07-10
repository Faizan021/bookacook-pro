const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

pkg["lint-staged"] = {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
};

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
console.log("Added lint-staged config to package.json");
