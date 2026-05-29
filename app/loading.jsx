export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Navbar skeleton */}
      <div className="h-16 border-b border-[#E8E4DC] bg-white" />

      {/* Hero skeleton */}
      <div className="animate-pulse">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 lg:grid-cols-2 lg:py-24">
          <div className="space-y-4">
            <div className="h-4 w-1/3 rounded-full bg-[#EDEAE6]" />
            <div className="h-10 w-3/4 rounded-xl bg-[#EDEAE6]" />
            <div className="h-10 w-1/2 rounded-xl bg-[#EDEAE6]" />
            <div className="h-4 w-2/3 rounded-full bg-[#EDEAE6]" />
            <div className="mt-6 h-12 w-40 rounded-full bg-[#EDEAE6]" />
          </div>
          <div className="aspect-square w-full rounded-3xl bg-[#EDEAE6]" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="animate-pulse mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 h-8 w-48 rounded-xl bg-[#EDEAE6]" />
        <div className="grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full rounded-2xl bg-[#EDEAE6]" />
              <div className="h-4 w-3/4 rounded-full bg-[#EDEAE6]" />
              <div className="h-4 w-1/2 rounded-full bg-[#EDEAE6]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
