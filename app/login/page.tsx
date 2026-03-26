import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="mt-2 text-gray-600">
            Login page will be connected to Supabase next.
          </p>

          <div className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-600">
            This is a temporary placeholder so protected routes can redirect here.
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white"
            >
              Go to Sign Up
            </Link>

            <Link
              href="/demo/customer"
              className="rounded-xl border px-4 py-3 text-center text-sm font-medium text-gray-800"
            >
              Preview Customer Demo
            </Link>

            <Link
              href="/demo/caterer"
              className="rounded-xl border px-4 py-3 text-center text-sm font-medium text-gray-800"
            >
              Preview Caterer Demo
            </Link>

            <Link
              href="/demo/admin"
              className="rounded-xl border px-4 py-3 text-center text-sm font-medium text-gray-800"
            >
              Preview Admin Demo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}