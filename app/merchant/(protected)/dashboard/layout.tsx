import Link from "next/link";

export default function MerchantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-green-900 p-6 text-white">
        <h2 className="mb-8 text-2xl font-bold">
          Merchant Panel
        </h2>

        <nav className="space-y-3">
          <Link
            href="/merchant/dashboard"
            className="block rounded px-3 py-2 hover:bg-green-800"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/merchant/products"
            className="block rounded px-3 py-2 hover:bg-green-800"
          >
            📦 My Products
          </Link>

          <Link
            href="/merchant/products/add"
            className="block rounded px-3 py-2 hover:bg-green-800"
          >
            ➕ Add Product
          </Link>

          <Link
            href="/merchant/profile"
            className="block rounded px-3 py-2 hover:bg-green-800"
          >
            👤 Profile
          </Link>

          <Link
            href="/merchant/logout"
            className="block rounded px-3 py-2 hover:bg-red-700"
          >
            🚪 Logout
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}