"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  discount: number;
  images: string | null;
};

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
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(
          `/api/merchant/products/${id}`
        );

        const result = await response.json();

        if (!response.ok || !result.product) {
          alert(result.error || "Failed to load product.");
          router.push("/merchant/products");
          return;
        }

        const data: Product = result.product;

        setName(data.name ?? "");
        setPrice(String(data.price ?? ""));
        setCategory(data.category ?? "");
        setDiscount(String(data.discount ?? 0));
        setCurrentImageUrl(data.images ?? "");
      } catch (error) {
        console.error("Load product error:", error);
        alert("Product load করা যায়নি");
        router.push("/merchant/products");
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(id)) {
      loadProduct();
    }
  }, [id, router]);

  async function updateProduct() {
    if (!name.trim()) {
      alert("Product name দিন");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Valid price দিন");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("discount", discount);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `/api/merchant/products/${id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Product update failed."
        );
      }

      alert("✅ Product Updated Successfully");

      router.push("/merchant/products");
      router.refresh();
    } catch (error) {
      console.error("Update product error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Product update করা যায়নি"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <p>Loading product...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">
          ✏️ Edit Product
        </h1>

        <div className="space-y-4 rounded-xl bg-white p-6 text-slate-900 shadow">
          <input
            className="w-full rounded border p-3"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
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
            type="number"
            min="0"
            max="100"
            className="w-full rounded border p-3"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <div>
            <label className="mb-2 block font-semibold">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              className="w-full rounded border p-2"
            />

            {currentImageUrl && (
              <div className="mt-3 rounded border p-3">
                <p className="mb-2 text-sm text-gray-600">
                  Current image
                </p>

                <img
                  src={currentImageUrl}
                  alt={name || "Product preview"}
                  className="h-40 w-full rounded object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/merchant/products")}
              className="flex-1 rounded bg-gray-600 p-3 font-semibold text-white hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={updateProduct}
              disabled={saving}
              className="flex-1 rounded bg-green-700 p-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}