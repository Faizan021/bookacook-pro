import { SpeiselyHeader } from '@/components/layout/SpeiselyHeader';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      <SpeiselyHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#d4c5b5] py-8 px-4 text-center text-sm text-[#5a5047]">
        <p>© 2026 Speisely. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
