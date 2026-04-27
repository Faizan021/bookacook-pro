"use client";

import { SpeiselyHeader } from "@/components/layout/SpeiselyHeader";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <SpeiselyHeader />

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-[#e8dcc8] bg-white px-4 py-2 text-sm font-semibold text-[#8a6d35] shadow-sm">
            Über Speisely
          </div>

          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Ein Premium-Catering-Marktplatz, geprägt durch KI-gestützte
            Eventplanung.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            Speisely wurde entwickelt, um die Suche nach Catering eleganter,
            strukturierter und intelligenter zu machen. Statt Kundinnen und
            Kunden durch einen generischen Marktplatz zu führen, verwandelt
            Speisely Event-Ideen in klare Anfragen und verbindet diese mit den
            passenden Catering-Partnern.
          </p>
        </div>

        <DynamicUnsplashImage
          section="premium"
          className="h-[560px] rounded-[2.5rem] shadow-sm"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "KI-gestützte Entdeckung",
              text: "Speisely verwandelt natürliche Event-Anfragen in ein klares Catering-Briefing.",
            },
            {
              title: "Kuratiert und hochwertig",
              text: "Wir setzen auf ein selektiveres, vertrauenswürdigeres Catering-Erlebnis.",
            },
            {
              title: "Besser für beide Seiten",
              text: "Kunden erhalten Orientierung, Caterer erhalten klarere Anfragen.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm"
            >
              <div className="mb-6 h-12 w-12 rounded-full bg-[#173f35]" />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
