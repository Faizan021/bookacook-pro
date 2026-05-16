import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Zahlung abgebrochen</h1>
      <p className="mb-8">Dein Checkout wurde abgebrochen. Du kannst es jederzeit erneut versuchen.</p>
      <Link href="/catering/demo" className="px-6 py-3 bg-gray-200 text-black rounded-lg">Zurück zum Shop</Link>
    </div>
  );
}
