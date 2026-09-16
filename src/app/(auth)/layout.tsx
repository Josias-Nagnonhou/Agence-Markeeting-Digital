export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="text-xl font-semibold tracking-tight text-indigo-700">OfferLab</span>
        </div>
        {children}
      </div>
    </main>
  );
}
