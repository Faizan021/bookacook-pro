type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

type Booking = {
  id: string;
  event: string;
  date: string;
  guests: number;
  amount: string;
  status: BookingStatus;
  customer?: string;
  caterer?: string;
};

type BookingsModuleProps = {
  role: "admin" | "caterer" | "customer";
  bookings?: Booking[];
};

const statusStyles: Record<BookingStatus, string> = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
};

const adminBookings: Booking[] = [
  { id: "BK-001", customer: "Sarah Müller", caterer: "Berlin BBQ House", event: "Corporate Lunch", date: "28 Mar 2026", guests: 40, amount: "€2,100", status: "confirmed" },
  { id: "BK-002", customer: "James Chen", caterer: "Royal Events", event: "Wedding Reception", date: "5 Apr 2026", guests: 120, amount: "€8,400", status: "pending" },
  { id: "BK-003", customer: "Anika Fischer", caterer: "FreshBite Co.", event: "Birthday Dinner", date: "15 Mar 2026", guests: 30, amount: "€1,350", status: "completed" },
  { id: "BK-004", customer: "Mark Jensen", caterer: "The Grill Room", event: "Team Away Day", date: "2 Apr 2026", guests: 25, amount: "€975", status: "confirmed" },
  { id: "BK-005", customer: "Lena Bauer", caterer: "Taste of Italy", event: "Private Dinner", date: "19 Mar 2026", guests: 12, amount: "€640", status: "cancelled" },
  { id: "BK-006", customer: "Tom Richter", caterer: "Berlin BBQ House", event: "Product Launch", date: "10 Apr 2026", guests: 80, amount: "€4,800", status: "pending" },
];

const catererBookings: Booking[] = [
  { id: "BK-001", customer: "Sarah Müller", event: "Corporate Lunch", date: "28 Mar 2026", guests: 40, amount: "€2,100", status: "confirmed" },
  { id: "BK-002", customer: "James Chen", event: "Wedding Reception", date: "5 Apr 2026", guests: 120, amount: "€8,400", status: "pending" },
  { id: "BK-003", customer: "Anika Fischer", event: "Birthday Dinner", date: "15 Mar 2026", guests: 30, amount: "€1,350", status: "completed" },
  { id: "BK-004", customer: "Mark Jensen", event: "Team Away Day", date: "2 Apr 2026", guests: 25, amount: "€975", status: "confirmed" },
  { id: "BK-005", customer: "Lena Bauer", event: "Private Dinner", date: "19 Mar 2026", guests: 12, amount: "€640", status: "cancelled" },
];

const customerBookings: Booking[] = [
  { id: "BK-001", caterer: "Berlin BBQ House", event: "BBQ Party", date: "28 Mar 2026", guests: 30, amount: "€850", status: "confirmed" },
  { id: "BK-002", caterer: "Royal Events Catering", event: "Wedding Catering", date: "5 Apr 2026", guests: 80, amount: "€2,400", status: "pending" },
  { id: "BK-003", caterer: "FreshBite Catering", event: "Corporate Lunch", date: "10 Mar 2026", guests: 20, amount: "€1,150", status: "completed" },
  { id: "BK-004", caterer: "The Grill Room", event: "Birthday Party", date: "1 Feb 2026", guests: 15, amount: "€620", status: "completed" },
];

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function BookingsModule({ role, bookings }: BookingsModuleProps) {
  const data =
    bookings ??
    (role === "admin" ? adminBookings : role === "caterer" ? catererBookings : customerBookings);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {role === "customer" ? "My Bookings" : "Bookings"}
        </h2>
        <p className="mt-0.5 text-sm text-gray-500">
          {role === "admin" ? "All platform bookings" : role === "caterer" ? "Booking requests for your services" : "Your catering orders"}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
              {role === "admin" && <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>}
              {role !== "customer" && <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{role === "admin" ? "Caterer" : "Customer"}</th>}
              {role === "customer" && <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Caterer</th>}
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Event</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Guests</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{booking.id}</td>
                {role === "admin" && (
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.customer}</td>
                )}
                {role !== "customer" && (
                  <td className="px-6 py-4 text-gray-700">{role === "admin" ? booking.caterer : booking.customer}</td>
                )}
                {role === "customer" && (
                  <td className="px-6 py-4 text-gray-700">{booking.caterer}</td>
                )}
                <td className="px-6 py-4 text-gray-900">{booking.event}</td>
                <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                <td className="px-6 py-4 text-gray-600">{booking.guests}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{booking.amount}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
