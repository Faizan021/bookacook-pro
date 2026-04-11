export default function CustomerSettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your profile, language, and account preferences here.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-dashed border-gray-300 p-5">
              <h2 className="text-sm font-semibold text-gray-900">Personal Information</h2>
              <p className="mt-2 text-sm text-gray-500">
                Name, phone number, city, and other profile details.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-gray-300 p-5">
              <h2 className="text-sm font-semibold text-gray-900">Language & Account</h2>
              <p className="mt-2 text-sm text-gray-500">
                Language preferences and additional account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
