"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Three Piece");
  const [brand, setBrand] = useState("Tawakkul Zone");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(true);
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [newArrival, setNewArrival] = useState(true);
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const originalPrice = Number(price) || 0;
  const discountPercent = Number(discount) || 0;
  const finalPrice =
    originalPrice - (originalPrice * discountPercent) / 100;

    function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}


function generateSKU(text: string) {
  const words = text
    .toUpperCase()
    .split(" ")
    .filter(Boolean);

  let code = words.map((word) => word[0]).join("");

  if (code.length < 3) {
    code = text.substring(0, 3).toUpperCase();
  }

  const random = Date.now().toString().slice(-6);

  return `TZ-${code}-${random}`;
}


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("sku", sku);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("description", description);
      formData.append("stock", String(stock));
      formData.append("featured", String(featured));
      formData.append("newArrival", String(newArrival));
      formData.append("freeDelivery", String(freeDelivery));
      formData.append("cashOnDelivery", String(cashOnDelivery));
      formData.append("isActive", String(isActive));
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/pagol-naki/products/actions", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to add product.");
        return;
      }

      alert("✅ Product Added Successfully");
      router.push("/merchant/products");
    } catch (error) {
      alert("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-800">➕ Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border bg-blue-100 p-8 shadow-lg">

        {/* Basic Information */}
        <div>
          <h2 className="mb-5 text-2xl font-bold text-green-700">
            📦 Basic Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2 text-black">

            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Product Name
              </label>

              <input
  type="text"
  value={name}
  onChange={(e) => {
    const value = e.target.value;

    setName(value);
    setSlug(generateSlug(value));
    setSku(generateSKU(value));
  }}
  className="w-full rounded-xl border p-3 outline-none text-black focus:border-green-700"
/>
            </div>
            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Slug
              </label>

              <input
  type="text"
  value={sku}
  readOnly
  className="w-full rounded-xl border p-3 text-black"
/>
            </div>
            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border p-3"
              >
                <option>Three Piece</option>
                <option>Socks</option>
                <option>Abaya</option>
                <option>Hijab</option>
                <option>Fabric</option>
                <option>Kids</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Brand
              </label>

              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-xl border p-3 text-blue-700"
              />
            </div>
            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                SKU
              </label>

              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="TZ-TP-001"
                className="w-full rounded-xl border p-3 text-black"
              />
            </div>
            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
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
                className="w-full rounded-xl border p-2 text-black"
              />
            </div>

          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="mb-5 text-2xl font-bold text-green-700">
            💰 Pricing
          </h2>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Main Price */}
            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Main Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2000"
                className="w-full rounded-xl border p-3 text-black"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Discount (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="20"
                className="w-full rounded-xl border p-3 text-black"
              />
            </div>

            {/* Final Price */}
            <div>
              <label className="mb-2 block font-semibold text-green-700">
                Final Price
              </label>

              <input
                type="number"
                value={finalPrice}
                readOnly
                className="w-full rounded-xl border bg-gray-100 p-3 font-bold text-green-700"
              />

              <p className="mt-2 text-sm font-medium text-red-600">
                You Save: ৳{originalPrice - finalPrice}
              </p>
            </div>

          </div>
        </div>

        <div>

          
        </div>

        {/* Product */}
        <div>
          <h2 className="mb-5 text-2xl font-bold text-green-700">
            📋 Product
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Stock
              </label>

              <select
                value={stock ? "true" : "false"}
                onChange={(e) => setStock(e.target.value === "true")}
                className="w-full rounded-xl border p-3 text-black"
              >
                <option value="true">🟢 In Stock</option>
                <option value="false">🔴 Out of Stock</option>
              </select>
            </div>

          </div>

          <div className="mt-5">
            <label className="mb-2 block font-semibold text-yellow-700">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border p-3 outline-none text-black focus:border-green-700"
            />
          </div>
        </div>

        {/* Options */}
        <div>
          <h2 className="mb-5 text-2xl font-bold text-green-700">
            ⚙ Product Options
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <label className="flex items-center gap-3 text-yellow-700">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured Product
            </label>

            <label className="flex items-center gap-3 text-yellow-700">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
              />
              New Arrival
            </label>

          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-700 py-4 text-lg font-bold text-white hover:bg-green-800 disabled:bg-gray-400"
        >
          {loading ? "⏳ Saving..." : "💾 Save Product"}
        </button>

      </form>
    </main>
  );
}