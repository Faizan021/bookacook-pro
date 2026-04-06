type CatererStatus = "approved" | "pending" | "suspended";

type Caterer = {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  bookings: number;
  revenue: string;
  rating: number;
  status: CatererStatus;
};

const caterers: Caterer[] = [
  { id: "CAT-001", name: "Berlin BBQ House", location: "Berlin", cuisine: "BBQ & Grill", bookings: 34, revenue: "€12,400", rating: 4.8, status: "approved" },
  { id: "CAT-002", name: "Royal Events Catering", location: "Hamburg", cuisine: "Fine Dining", bookings: 28, revenue: "€31,200", rating: 4.9, status: "approved" },
  { id: "CAT-003", name: "FreshBite Co.", location: "Munich", cuisine: "Healthy & Organic", bookings: 19, revenue: "€7,600", rating: 4.6, status: "approved" },
  { id: "CAT-004", name: "Taste of Italy", location: "Frankfurt", cuisine: "Italian", bookings: 22, revenue: "€9,800", rating: 4.7, status: "approved" },
  { id: "CAT-005", name: "The Grill Room", location: "Cologne", cuisine: "International", bookings: 15, revenue: "€6,200", rating: 4.5, status: "approved" },
  { id: "CAT-006", name: "Spice Route", location: "Berlin", cuisine: "Asian Fusion", bookings: 0, revenue: "€0", rating: 0, status: "pending" },
  { id: "CAT-007", name: "Vegan Feast Co.", location: "Düsseldorf", cuisine: "Vegan", bookings: 0, revenue: "€0", rating: 0, status: "pending" },
  { id: "CAT-008", name: "Old World Bistro", location: "Leipzig", cuisine: "German", bookings: 8, revenue: "€2,100", rating: 3.9, status: "suspended" },
];

const statusStyles: Record<CatererStatus, string> = {
  approved: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  suspended: "bg-red-50 text-red-700",
};

export default function DemoAdminCaterersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Caterer Management</h2>
          <p className="text-sm text-gray-500">Review applications and manage registered caterers</p>
        </div>
        <div className="flex gap-2 text-sm text-gray-500">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">5 Approved</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">2 Pending</span>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">1 Suspended</span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Cuisine</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {caterers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-gray-600">{c.location}</td>
                  <td className="px-6 py-4 text-gray-600">{c.cuisine}</td>
                  <td className="px-6 py-4 text-gray-700">{c.bookings}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{c.revenue}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {c.rating > 0 ? `★ ${c.rating}` : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.status === "pending" ? (
                      <button className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
                        Review
                      </button>
                    ) : (
                      <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
