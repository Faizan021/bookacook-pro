
export default function CustomerBookingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Meine Buchungen</h1>
          <p className="mt-2 text-sm text-gray-600">
            Hier sehen Sie Ihre Buchungen und Anfragen.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
            Noch keine Buchungen vorhanden.
          </div>
        </div>
      </div>
    </main>
  );
}
