import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('public/speisely-magazin-edition.html');
const routePath = path.resolve('src/routes/magazin.edition[.]html.ts');

const html = fs.readFileSync(htmlPath, 'utf8');

const output = `import { createFileRoute } from "@tanstack/react-router";

const HTML_CONTENT =
  ` + JSON.stringify(html) + `;

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

fs.writeFileSync(routePath, output, 'utf8');
console.log('Successfully synced public/speisely-magazin-edition.html into src/routes/magazin.edition[.]html.ts');
