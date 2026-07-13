import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import DeleteButton from "./DeleteButton";
export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-green-800">
          📦 Products
        </h1>

        <Link
          href="/admin/products/add"
          className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          ➕ Add Product
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-100 p-4 text-red-700">
          {error.message}
        </div>
      )}

      {/* Empty */}
      {!products || products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            No Products Found
          </h2>

          <p className="mt-2 text-gray-500">
            Click "Add Product" to create your first product.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Left */}
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-gray-100">
                  <Image
                    src={product.image || "/products/product1.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-gray-500">
                    {product.category}
                  </p>

                  <p className="mt-2 text-lg font-bold text-green-700">
                    ৳ {product.price}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                {product.stock ? (
                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    🟢 In Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                    🔴 Out of Stock
                  </span>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    ✏️ Edit
                  </button>

                  <DeleteButton id={product.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}