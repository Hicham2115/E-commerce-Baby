export default function ProductsLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#F9F8F6]">
      <div className="h-16 border-b border-[#E8E4DC] bg-white" />

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-[#EDEAE6]" />
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full rounded-2xl bg-[#EDEAE6]" />
              <div className="h-4 w-4/5 rounded-full bg-[#EDEAE6]" />
              <div className="h-4 w-2/5 rounded-full bg-[#EDEAE6]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
