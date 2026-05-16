import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Zahlung erfolgreich!</h1>
      <p className="mb-8">Vielen Dank für deine Bestellung bei Speisely.</p>
      <Link href="/" className="px-6 py-3 bg-[#16372f] text-white rounded-lg">Zurück zur Startseite</Link>
    </div>
  );
}
