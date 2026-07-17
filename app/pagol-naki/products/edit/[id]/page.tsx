"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const response = await fetch(`/pagol-naki/products/actions?id=${id}`);
      const result = await response.json();

      if (!response.ok || !result.product) {
        alert(result.error || "Failed to load product.");
        router.push("/pagol-naki/products");
        return;
      }

      const data = result.product;
      setName(data.name ?? "");
      setPrice(String(data.price ?? ""));
      setCategory(data.category ?? "");
      setDiscount(String(data.discount ?? 0));

      setLoading(false);
    }

    if (!isNaN(id)) {
      loadProduct();
    }
  }, [id, router]);

  async function updateProduct() {
    setSaving(true);

    const response = await fetch(`/pagol-naki/products/actions?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        category,
        discount: Number(discount),
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      alert(result.error || "Update failed.");
      return;
    }

    alert("✅ Product Updated Successfully");
    router.push("/pagol-naki/products");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        ✏️ Edit Product
      </h1>

      <div className="space-y-4 rounded-xl border p-6">

        <input
          className="w-full rounded border p-3"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <button
          onClick={updateProduct}
          disabled={saving}
          className="w-full rounded bg-green-700 p-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

      </div>
    </main>
  );
}