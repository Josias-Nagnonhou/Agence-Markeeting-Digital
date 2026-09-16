export function BrowserMockup() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40 ring-1 ring-black/5">
      <div className="flex items-center gap-2 rounded-t-2xl border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-gray-400 ring-1 ring-gray-200">
          offerlab.app/p/ma-formation
        </div>
      </div>
      <div className="space-y-3 rounded-b-2xl bg-gradient-to-b from-indigo-950 to-violet-950 p-6 text-center">
        <div className="mx-auto h-2 w-24 rounded-full bg-amber-400/80" />
        <div className="mx-auto h-3.5 w-64 rounded-full bg-white/90" />
        <div className="mx-auto h-2.5 w-48 rounded-full bg-white/40" />
        <div className="mx-auto mt-3 h-8 w-40 rounded-full bg-amber-400" />
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="h-12 rounded-lg bg-white/10" />
          <div className="h-12 rounded-lg bg-white/10" />
          <div className="h-12 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
}
