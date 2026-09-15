import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [{ count: productCount }, { count: orderCount }, { count: pendingOrderCount }] =
    await Promise.all([
      supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "Pending"),
    ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-green-800">🛠️ Tawakkul Zone Admin</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            This dashboard shows live product and order counts, plus quick access to product management and order review.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/pagol-naki/logout"
            className="inline-flex rounded bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
          >
            Logout
          </Link>
          <Link
            href="/pagol-naki/products"
            className="inline-flex rounded bg-green-700 px-5 py-3 text-white transition hover:bg-green-800"
          >
            Manage Products
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Products</p>
          <p className="mt-4 text-5xl font-bold text-green-800">{productCount ?? 0}</p>
          <p className="mt-2 text-sm text-gray-500">Total active products in inventory</p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Orders</p>
          <p className="mt-4 text-5xl font-bold text-blue-800">{orderCount ?? 0}</p>
          <p className="mt-2 text-sm text-gray-500">Total orders placed by customers</p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Pending</p>
          <p className="mt-4 text-5xl font-bold text-amber-700">{pendingOrderCount ?? 0}</p>
          <p className="mt-2 text-sm text-gray-500">Orders awaiting processing</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/pagol-naki/products"
          className="rounded-3xl bg-green-700 p-8 text-left text-white shadow-lg transition hover:bg-green-800"
        >
          <p className="text-sm uppercase tracking-[0.2em]">Products</p>
          <h2 className="mt-4 text-3xl font-bold">Manage inventory</h2>
          <p className="mt-3 text-sm text-green-100">Add, edit, or delete products and update stock details.</p>
        </Link>

        <Link
          href="/pagol-naki/orders"
          className="rounded-3xl bg-blue-700 p-8 text-left text-white shadow-lg transition hover:bg-blue-800"
        >
          <p className="text-sm uppercase tracking-[0.2em]">Orders</p>
          <h2 className="mt-4 text-3xl font-bold">Review orders</h2>
          <p className="mt-3 text-sm text-blue-100">See all incoming orders and update their status from the admin panel.</p>
        </Link>
      </div>
    </main>
  );
}
