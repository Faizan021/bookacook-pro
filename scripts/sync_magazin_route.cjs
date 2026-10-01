const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, '../public/speisely-magazin-edition.html'), 'utf8');

const routeCode = `import { createFileRoute } from "@tanstack/react-router";

const HTML_CONTENT = ${JSON.stringify(htmlContent)};

export const Route = createFileRoute("/magazin/edition.html")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(HTML_CONTENT, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        });
      },
    },
  },
});
`;

fs.writeFileSync(path.join(__dirname, '../src/routes/magazin.edition[.]html.ts'), routeCode, 'utf8');
console.log('Successfully generated src/routes/magazin.edition[.]html.ts');
