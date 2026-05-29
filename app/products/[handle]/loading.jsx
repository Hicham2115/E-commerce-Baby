export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#F9F8F6]">
      <div className="h-16 border-b border-[#E8E4DC] bg-white" />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-3 w-16 rounded-full bg-[#EDEAE6]" />
          <div className="h-3 w-3 rounded-full bg-[#EDEAE6]" />
          <div className="h-3 w-24 rounded-full bg-[#EDEAE6]" />
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square w-full rounded-3xl bg-[#EDEAE6]" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square w-16 rounded-xl bg-[#EDEAE6]" />
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="space-y-5 pt-2">
            <div className="h-8 w-3/4 rounded-xl bg-[#EDEAE6]" />
            <div className="h-6 w-1/4 rounded-full bg-[#EDEAE6]" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-[#EDEAE6]" />
              <div className="h-4 w-5/6 rounded-full bg-[#EDEAE6]" />
              <div className="h-4 w-4/6 rounded-full bg-[#EDEAE6]" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-14 rounded-xl bg-[#EDEAE6]" />
              ))}
            </div>
            <div className="h-12 w-full rounded-2xl bg-[#EDEAE6]" />
          </div>
        </div>
      </div>
    </div>
  );
}
