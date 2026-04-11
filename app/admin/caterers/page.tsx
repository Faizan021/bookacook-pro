import Link from "next/link";

const sampleCaterers = [
  {
    id: "berlin-bbq-house",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description:
      "Authentic BBQ catering for private parties, office lunches, and outdoor events.",
  },
  {
    id: "royal-events-catering",
    name: "Royal Events Catering",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description:
      "Elegant catering for weddings, receptions, and premium private events.",
  },
  {
    id: "freshbite-catering",
    name: "FreshBite Catering",
    city: "Munich",
    cuisine: "Corporate & Healthy Menus",
    description:
      "Modern menus for offices, business lunches, and team events.",
  },
];

export default function CaterersPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Find Caterers</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse catering providers and discover options for your next event.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sampleCaterers.map((caterer) => (
              <div
                key={caterer.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {caterer.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {caterer.city} · {caterer.cuisine}
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                    Caterer
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {caterer.description}
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
                    href="/customer/bookings"
                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
                  >
                    Request Booking
                  </Link>

                  <button
                    className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    type="button"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
