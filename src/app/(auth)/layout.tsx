export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="text-xl font-semibold tracking-tight">OfferLab</span>
        </div>
        {children}
      </div>
    </main>
  );
}
