export default function CatererStorefrontDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbf7ef] flex flex-col">
      <div className="border-b border-[#d4c5b5] bg-white py-4 px-6 flex justify-between items-center">
        <span className="font-bold text-[#173f35] text-xl font-heading">Speisely Caterer Dashboard</span>
      </div>
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
