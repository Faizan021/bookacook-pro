import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                Speisely
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Premium catering for weddings, business events, and private
                occasions.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                Tell us about your event and discover suitable caterers for your
                occasion. Browse providers, submit your event details, and get
                matched with the right catering options.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/request/new"
                  className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Plan an Event
                </Link>

                <Link
                  href="/caterers"
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
                >
                  Browse Caterers
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl border px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8">
              <h2 className="text-lg font-semibold text-gray-900">
                How Speisely Works
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    1. Tell us about your event
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Share the event type, guest count, location, budget, and
                    your catering preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    2. Receive suitable caterers
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Speisely helps match your request with relevant catering
                    providers.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    3. Compare and continue
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Review your options and continue your journey through the
                    dashboard and request flow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
