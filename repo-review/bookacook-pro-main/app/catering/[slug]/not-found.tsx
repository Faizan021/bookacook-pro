export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Caterer nicht gefunden</h1>
      <p className="mb-8">Der gesuchte Storefront existiert nicht oder wurde deaktiviert.</p>
      <a href="/" className="px-6 py-3 bg-[#16372f] text-white rounded-lg">Zurück zur Startseite</a>
    </div>
  );
}
