import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-800">
        🛠️ Tawakkul Zone Admin
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-2xl bg-green-700 p-8 text-center text-xl font-bold text-white shadow-lg transition hover:bg-green-800"
        >
          📦 Manage Products
        </Link>

        <div className="rounded-2xl bg-gray-500 p-8 text-center text-xl font-bold text-white">
          📊 Dashboard
          <p className="mt-2 text-sm font-normal">
            Coming Soon
          </p>
        </div>

        <div className="rounded-2xl bg-gray-500 p-8 text-center text-xl font-bold text-white">
          ⚙️ Settings
          <p className="mt-2 text-sm font-normal">
            Coming Soon
          </p>
        </div>
      </div>
    </main>
  );
}