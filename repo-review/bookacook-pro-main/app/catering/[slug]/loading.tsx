export default function Loading() {
  return (
    <div className="min-h-screen bg-[#faf6ee] p-8 animate-pulse">
      <div className="h-12 w-full bg-gray-200 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
