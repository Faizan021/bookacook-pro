import Link from "next/link";
import { DynamicUnsplashImage } from "@/components/home/DynamicUnsplashImage";

const occasionCards = [
  {
    title: "Weddings",
    description: "Elegant catering for intimate ceremonies and larger celebrations.",
    section: "wedding" as const,
  },
  {
    title: "Corporate events",
    description: "Premium catering for meetings, launches, offsites and receptions.",
    section: "corporate" as const,
  },
  {
    title: "Private dinners",
    description: "Curated chefs and menus for birthdays, family events and home dining.",
    section: "private" as const,
  },
];

const caterers = [
  {
    name: "Maison Verde Catering",
    type: "Modern European",
    location: "Berlin",
    price: "from €38 p.p.",
  },
  {
    name: "Gold Table Events",
    type: "Wedding & private dining",
    location: "Berlin",
    price: "from €52 p.p.",
  },
  {
    name: "Urban Feast Studio",
    type: "Corporate catering",
    location: "Berlin",
    price: "from €29 p.p.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf6ee] text-[#16372f]">
      <header className="sticky top-0 z-50 border-b border-[#e8dcc8] bg-[#faf6ee]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Speisely
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#49645c] md:flex">
            <Link href="/caterers">Caterers</Link>
            <Link href="/request/new">Plan event</Link>
            <Link href="/caterer">For caterers</Link>
          </nav>

          <Link
            href="/request/new"
            className="rounded-full bg-[#173f35] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0f2f27]"
          >
            Start request
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <DynamicUnsplashImage
          section="hero"
          priority
          className="absolute inset-0 h-full w-full"
          imageClassName="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#102f28]/90 via-[#102f28]/65 to-[#102f28]/20" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              AI-assisted catering marketplace for premium events
            </div>

            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Describe your event. Speisely finds the right caterers.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              From weddings to corporate dinners, Speisely turns your event idea
              into a structured catering brief and matches you with curated
              caterers.
            </p>

            <div className="mt-8 rounded-3xl bg-white p-3 shadow-2xl md:flex">
              <input
                className="min-h-14 flex-1 rounded-2xl px-5 text-base text-[#173f35] outline-none placeholder:text-[#8a9a94]"
                placeholder="Example: Wedding for 80 guests in Berlin, elegant buffet, €45 per person..."
              />
              <Link
                href="/request/new"
                className="mt-3 inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#c9a45c] px-7 font-medium text-[#173f35] md:mt-0"
              >
                Match caterers
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {["Wedding", "Corporate lunch", "Private dinner", "Ramadan iftar"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/90 backdrop-blur"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "1. Describe",
              text: "Tell Speisely what you need in natural language.",
            },
            {
              title: "2. Structure",
              text: "AI converts your idea into event type, guest count, location, budget and preferences.",
            },
            {
              title: "3. Match",
              text: "You receive curated caterers instead of browsing a generic directory.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#eadfce] bg-white p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#5c6f68]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#173f35] py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#d7b66d]">
              Premium presentation
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Catering decisions are emotional. The experience should feel premium.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/75">
              Speisely combines elegant presentation with practical marketplace
              logic: clear packages, structured requests, verified caterers and a
              guided customer journey.
            </p>
          </div>

          <DynamicUnsplashImage
            section="premium"
            className="h-[480px] rounded-[2rem] shadow-2xl"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#b28a3c]">
              Occasions
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Built for the events people actually plan
            </h2>
          </div>
          <Link href="/request/new" className="font-medium text-[#173f35]">
            Start with AI matching →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {occasionCards.map((card) => (
            <div
              key={card.title}
              className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm"
            >
              <DynamicUnsplashImage
                section={card.section}
                className="h-64"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <div className="p-7">
                <h3 className="text-2xl font-semibold">{card.title}</h3>
                <p className="mt-3 leading-7 text-[#5c6f68]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-sm md:p-12">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#b28a3c]">
                Curated caterers
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                A marketplace that feels selected, not crowded
              </h2>
            </div>
            <Link href="/caterers" className="font-medium text-[#173f35]">
              Browse caterers →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {caterers.map((caterer) => (
              <div
                key={caterer.name}
                className="rounded-[1.5rem] border border-[#eadfce] bg-[#faf6ee] p-6"
              >
                <div className="mb-8 h-10 w-10 rounded-full bg-[#173f35]" />
                <h3 className="text-xl font-semibold">{caterer.name}</h3>
                <p className="mt-2 text-[#5c6f68]">{caterer.type}</p>
                <div className="mt-6 flex justify-between text-sm">
                  <span>{caterer.location}</span>
                  <span className="font-medium">{caterer.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 md:grid-cols-2">
        <DynamicUnsplashImage
          section="caterer"
          className="h-[460px] rounded-[2rem] shadow-sm"
          sizes="(min-width: 768px) 50vw, 100vw"
        />

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#b28a3c]">
            For caterers
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Receive better inquiries, not random leads.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
            Speisely helps caterers get structured requests with event details,
            budget, guest count, dietary needs and service expectations already
            clarified.
          </p>
          <Link
            href="/caterer"
            className="mt-8 inline-flex rounded-full bg-[#173f35] px-6 py-3 font-medium text-white"
          >
            Join as caterer
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#173f35] px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Plan your next catered event with AI guidance.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Start with a simple description. Speisely turns it into a clear brief
            and helps you move toward the right caterer.
          </p>
          <Link
            href="/request/new"
            className="mt-8 inline-flex rounded-full bg-[#d7b66d] px-8 py-4 font-medium text-[#173f35]"
          >
            Start your request
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#5c6f68] md:flex-row">
          <p>© 2026 Speisely. Premium AI-assisted catering marketplace.</p>
          <div className="flex gap-6">
            <Link href="/caterers">Caterers</Link>
            <Link href="/request/new">Plan event</Link>
            <Link href="/caterer">For caterers</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
