export default function CustomerSettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your profile, language preferences, and account details for
            your Speisely experience.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <a
              href="#personal-information"
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Name, phone number, city, and other profile details.
                  </p>
                </div>
                <span className="text-sm font-medium text-orange-600 transition-colors group-hover:text-orange-500">
                  Open
                </span>
              </div>
            </a>

            <a
              href="#language-account"
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Language & Account
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Language preferences and additional account settings.
                  </p>
                </div>
                <span className="text-sm font-medium text-orange-600 transition-colors group-hover:text-orange-500">
                  Open
                </span>
              </div>
            </a>
          </div>
        </div>

        <section
          id="personal-information"
          className="rounded-2xl border bg-white p-8 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Review and update your customer profile details.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Your phone number"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                City
              </label>
              <input
                type="text"
                placeholder="Your city"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="Your postal code"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Save Personal Information
            </button>
          </div>
        </section>

        <section
          id="language-account"
          className="rounded-2xl border bg-white p-8 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Language & Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Set your preferred language and review basic account preferences.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Preferred Language
              </label>
              <select className="w-full rounded-xl border border-gray-300 p-3 text-sm">
                <option>German</option>
                <option>English</option>
                <option>Turkish</option>
                <option>Arabic</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Account Email
              </label>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-xl border border-gray-300 p-3 text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Save Language Settings
            </button>

            <button
              type="button"
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Manage Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
