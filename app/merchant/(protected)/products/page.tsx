"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: boolean;
  is_active: boolean;
};

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch("/api/merchant/products");

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        if (!cancelled) {
          setProducts(data.products ?? []);
        }
      } catch (error) {
        console.error("Products load error:", error);

        if (!cancelled) {
          alert("Products load করা যায়নি");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: number, name: string) {
    const confirmed = window.confirm(
      `"${name}" product টি কি delete করতে চান?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch(`/api/merchant/products/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Delete failed");
      }

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );

      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Product delete করা যায়নি"
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Products</h1>

        <Link
          href="/merchant/products/add"
          className="rounded bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-slate-900">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-yellow-700"
              >
                <td className="p-3">{product.name}</td>

                <td className="p-3">{product.category}</td>

                <td className="p-3">৳ {product.price}</td>

                <td className="p-3">
                  {product.stock ? (
                    <span className="font-semibold text-green-700">
                      In Stock
                    </span>
                  ) : (
                    <span className="font-semibold text-red-600">
                      Out of Stock
                    </span>
                  )}
                </td>

                <td className="p-3">
                  {product.is_active ? (
                    <span className="font-semibold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-500">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/merchant/products/edit/${product.id}`}
                      className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product.id, product.name)
                      }
                      disabled={deletingId === product.id}
                      className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {deletingId === product.id
                        ? "Deleting..."
                        : "🗑️ Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}