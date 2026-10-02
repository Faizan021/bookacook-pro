const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'public', 'speisely-magazin-edition.html');
const tsPath = path.join(__dirname, '..', 'src', 'routes', 'magazin.edition[.]html.ts');

const html = fs.readFileSync(htmlPath, 'utf8');
const tsContent = `import { createFileRoute } from "@tanstack/react-router";

const HTML_CONTENT =
  ${JSON.stringify(html)};

export const Route = createFileRoute("/magazin/edition.html")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(HTML_CONTENT, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
      },
    },
  },
});
`;

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('Successfully synchronized magazin.edition[.]html.ts with public/speisely-magazin-edition.html. Bytes:', tsContent.length);
