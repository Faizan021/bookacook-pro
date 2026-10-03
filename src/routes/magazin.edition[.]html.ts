import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

export const Route = createFileRoute("/magazin/edition.html")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const filePath = path.resolve(process.cwd(), "public/magazin/edition.html");
          if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, "utf-8");
            return new Response(html, {
              status: 200,
              headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
              },
            });
          }
        } catch (e) {
          console.error("Error reading edition.html:", e);
        }
        return new Response("Edition not found", { status: 404 });
      },
    },
  },
});
