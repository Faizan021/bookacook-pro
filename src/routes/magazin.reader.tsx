import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/magazin/reader")({
  head: () => ({
    meta: [
      {
        title: "Speisely Journal — Digital Reader (Ausgabe 01)",
      },
      {
        name: "description",
        content:
          "Das interaktive digitale Speisely 3D-Magazin: King Tut, Alzaeem, Thronburger, Mandy und FoodTech-Trends 2026 im Vollbild-Reader.",
      },
      {
        property: "og:title",
        content: "Speisely Journal — Digital Reader (Ausgabe 01)",
      },
      {
        property: "og:description",
        content:
          "Das interaktive digitale Speisely 3D-Magazin: King Tut, Alzaeem, Thronburger, Mandy und FoodTech-Trends 2026 im Vollbild-Reader.",
      },
      { property: "og:image", content: "https://speisely.de/hero-cinematic.webp" },
      { property: "og:url", content: "https://speisely.de/magazin/reader" },
    ],
    links: [{ rel: "canonical", href: "https://speisely.de/magazin/reader" }],
  }),
  component: MagazineReaderPage,
});

function MagazineReaderPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#EDEAE3] z-50">
      <iframe
        src="/magazin/edition.html?v=5"
        title="Speisely Magazin Digital Edition"
        className="w-full h-full border-0 block"
        allow="fullscreen; autoplay; clipboard-write"
      />
    </div>
  );
}
