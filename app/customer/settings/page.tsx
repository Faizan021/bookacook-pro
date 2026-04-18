"use client";

export default function CustomerSettingsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[1.75rem] border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your profile, language preferences, and account details for your
            Speisely experience.
          </p>

          <section id="personal-information" className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Review and update your customer profile details.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Your phone number"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Your city"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="Your postal code"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Save Personal Information
              </button>
            </div>
          </section>

          <div className="my-8 h-px bg-border" />

          <section id="language-account">
            <h2 className="text-xl font-semibold text-foreground">
              Language & Account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Set your preferred language and review basic account preferences.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Preferred Language
                </label>
                <select className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
                  <option>German</option>
                  <option>English</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Account Email
                </label>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Save Language Settings
              </button>

              <button
                type="button"
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Manage Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
