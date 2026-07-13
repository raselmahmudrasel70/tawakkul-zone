import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 bg-blue-100">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-green-800 bg-cyan-100">
          📦 Products
        </h1>

        <Link
          href="/admin/products/add"
          className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
        >
          ➕ Add Product
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-100 p-4 text-red-600">
          {error.message}
        </p>
      )}

      <div className="rounded-2xl border bg-white p-6 shadow">
        {products?.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="space-y-5">
  {products?.map((product) => (
    <div
      key={product.id}
      className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          {product.name}
        </h2>

        <p className="text-gray-500">
          {product.category}
        </p>

        <p className="mt-2 font-bold text-green-700">
          ৳ {product.price}
        </p>
      </div>

      <div>
        {product.stock ? (
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            In Stock
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            Out of Stock
          </span>
        )}
      </div>
    </div>
  ))}
</div>
        )}
      </div>
    </main>
  );
}