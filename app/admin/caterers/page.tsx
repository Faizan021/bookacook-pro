import Link from "next/link";

// --- TYPES (Should eventually come from your lib/packages/types.ts) ---
type Caterer = {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  description: string;
  status: "verified" | "pending" | "suspended";
};

const sampleCaterers: Caterer[] = [
  {
    id: "berlin-bbq-house",
    name: "Berlin BBQ House",
    city: "Berlin",
    cuisine: "BBQ & Grill",
    description: "Authentic BBQ catering for private parties, office lunches, and outdoor events.",
    status: "verified",
  },
  {
    id: "royal-events-catering",
    name: "Royal Events Catering",
    city: "Hamburg",
    cuisine: "Wedding & Fine Dining",
    description: "Elegant catering for weddings, receptions, and premium private events.",
    status: "pending",
  },
  {
    id: "freshbite-catering",
    name: "FreshBite Catering",
    city: "Munich",
    cuisine: "Corporate & Healthy Menus",
    description: "Modern menus for offices, business lunches, and team events.",
    status: "verified",
  },
];

export default function AdminCaterersPage() {
  return (
    <main className="min-h-screen bg-[#f8f9f8] p-6"> {/* Light version of your green */}
      <div className="mx-auto max-w-6xl">
        
        {/* PAGE HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#192b1a]">Caterer Management</h1>
            <p className="text-[#7a9470]">Review, verify, and manage all catering providers.</p>
          </div>
          <button className="rounded-xl bg-[#192b1a] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#2a4a2c]">
            + Add New Caterer
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sampleCaterers.map((caterer) => (
            <div
              key={caterer.id}
              className="rounded-2xl border border-white bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#192b1a]">
                    {caterer.name}
                  </h2>
                  <p className="text-sm text-[#7a9470]">
                    {caterer.city} • {caterer.cuisine}
                  </p>
                </div>
                
                {/* STATUS BADGE */}
                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  caterer.status === 'verified' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {caterer.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {caterer.description}
              </p>

              {/* ADMIN ACTIONS */}
              <div className="mt-8 flex flex-col gap-2">
                <Link
                  href={`/admin/caterers/${caterer.id}/edit`} 
                  className="flex items-center justify-center rounded-xl bg-[#c49840] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#d4a85a]"
                >
                  Manage Details
                </Link>
                
                <Link
                  href={`/admin/caterers/${caterer.id}/verify`}
                  className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Review Verification
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
