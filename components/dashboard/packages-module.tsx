type PackageStatus = "active" | "draft" | "paused";

type CateringPackage = {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  maxGuests: number;
  category: string;
  status: PackageStatus;
};

const demoPackages: CateringPackage[] = [
  {
    id: "PKG-001",
    name: "Classic BBQ Package",
    description: "Slow-cooked meats, grilled vegetables, homemade sauces, and all the sides you need for a great outdoor event.",
    pricePerPerson: 38,
    minGuests: 20,
    maxGuests: 150,
    category: "BBQ & Grill",
    status: "active",
  },
  {
    id: "PKG-002",
    name: "Wedding Deluxe",
    description: "Three-course plated dinner with wine pairing, professional wait staff, and full setup included.",
    pricePerPerson: 95,
    minGuests: 50,
    maxGuests: 300,
    category: "Fine Dining",
    status: "active",
  },
  {
    id: "PKG-003",
    name: "Corporate Buffet",
    description: "Hot and cold buffet with a wide selection of international dishes, perfect for business events.",
    pricePerPerson: 28,
    minGuests: 15,
    maxGuests: 200,
    category: "Buffet",
    status: "active",
  },
  {
    id: "PKG-004",
    name: "Cocktail & Canapés",
    description: "Elegant finger food and canapés with non-alcoholic welcome drinks. Ideal for networking events.",
    pricePerPerson: 22,
    minGuests: 30,
    maxGuests: 500,
    category: "Cocktail",
    status: "active",
  },
  {
    id: "PKG-005",
    name: "Private Chef Dinner",
    description: "An intimate dining experience with a personal chef cooking a bespoke menu for your guests.",
    pricePerPerson: 120,
    minGuests: 6,
    maxGuests: 20,
    category: "Fine Dining",
    status: "draft",
  },
  {
    id: "PKG-006",
    name: "Street Food Festival",
    description: "Multiple street food stations with a variety of cuisines — a crowd-pleasing format for large events.",
    pricePerPerson: 32,
    minGuests: 100,
    maxGuests: 1000,
    category: "Street Food",
    status: "paused",
  },
];

const statusStyles: Record<PackageStatus, string> = {
  active: "bg-green-50 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  paused: "bg-amber-50 text-amber-700",
};

export function PackagesModule() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Packages</h2>
          <p className="text-sm text-gray-500">Manage your catering packages and pricing</p>
        </div>
        <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          + New Package
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {demoPackages.map((pkg) => (
          <div key={pkg.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-400">{pkg.category}</p>
                <h3 className="mt-1 font-semibold text-gray-900">{pkg.name}</h3>
              </div>
              <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[pkg.status]}`}>
                {pkg.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{pkg.description}</p>

            <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">€{pkg.pricePerPerson}</p>
                <p className="text-xs text-gray-400">per person</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">
                  {pkg.minGuests}–{pkg.maxGuests} guests
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
