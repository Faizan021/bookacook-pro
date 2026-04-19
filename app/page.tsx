import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#192b1a] text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold text-[#e4d9c2]">Speisely TEST</div>

        <nav className="hidden gap-8 md:flex">
          <Link href="/caterers" className="text-[#e4d9c2]">
            Caterer entdecken
          </Link>
          <Link href="/request/new" className="text-[#e4d9c2]">
            Event planen
          </Link>
        </nav>

        <Link href="/login" className="text-[#e4d9c2]">
          Anmelden
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6">
        <div className="max-w-3xl">
          <div className="mb-6 inline-block rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
            TEST VERSION — NO IMAGE
          </div>

          <h1 className="text-5xl font-bold leading-tight sm:text-7xl">
            Kulinarische Exzellenz,
            <br />
            <span className="text-[#c49840] italic">perfekt für Sie.</span>
          </h1>

          <p className="mt-6 text-lg text-white/80">
            Wenn Sie nach dem Deploy weiterhin ein großes Foto sehen, wird nicht
            diese Datei gerendert.
          </p>

          <div className="mt-8 rounded-2xl bg-white/10 p-6 text-lg">
            Dies ist eine reine Test-Homepage ohne Bild.
          </div>
        </div>
      </section>
    </main>
  );
}
