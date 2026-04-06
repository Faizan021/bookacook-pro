"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function CustomerSignupPage() {
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    if (!contactPerson.trim() || !email.trim() || !password || !confirmPassword) {
      setStatusMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabaseBrowser.auth.signUp({
      email,
      password,
      options: {
        data: {
          contact_person: contactPerson,
          role: "customer",
        },
      },
    });

    if (signUpError) {
      setStatusMessage(signUpError.message);
      setLoading(false);
      return;
    }

    if (!signUpData?.user?.id) {
      setStatusMessage("Unable to create account. Please try again.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/signup-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: signUpData.user.id,
        email,
        contact_person: contactPerson,
        role: "customer",
      }),
    });

    setLoading(false);

    const result = await response.json();
    if (result.success) {
      setStatusMessage(
        "Success! Your account was created. Please check your email to confirm and then log in."
      );
    } else {
      setStatusMessage(
        `Account created, but profile save had an issue: ${result?.error ?? "unknown error"}. You can still log in.`
      );
    }

    setContactPerson("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Customer Sign Up</h1>
          <p className="mt-2 text-gray-600">
            Create a new customer account with email, password, and contact person.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Contact Person</span>
              <input
                type="text"
                value={contactPerson}
                onChange={(event) => setContactPerson(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="John Doe"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Enter a strong password"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                placeholder="Repeat your password"
                required
              />
            </label>

            {statusMessage ? (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {statusMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create customer account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
