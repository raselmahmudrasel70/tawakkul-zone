"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
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

const [featured, setFeatured] = useState(false);
const [newArrival, setNewArrival] = useState(false);
const [freeDelivery, setFreeDelivery] = useState(false);
const [cashOnDelivery, setCashOnDelivery] = useState(true);

const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

  const { error } = await supabase
    .from("products")
    .insert({
      name,
      category,
      brand,
      image,
      price: Number(price),
      discount: Number(discount),
      description,
      stock,
      featured,
      new_arrival: newArrival,
      free_delivery: freeDelivery,
      cash_on_delivery: cashOnDelivery,
    });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("✅ Product Added Successfully");

  router.push("/admin/products");
}
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 bg-yellow-200">
      <h1 className="mb-8 text-4xl font-bold text-green-800">
        ➕ Add Product
      </h1>

      <form
  onSubmit={handleSubmit}
  className="space-y-8 rounded-2xl border bg-white p-8 shadow-lg"
>

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
  onChange={(e) => setName(e.target.value)}
  className="w-full rounded-xl border p-3 outline-none text-black focus:border-green-700"
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
                <option>Saree</option>
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
                Product Image
              </label>

              <input
                type="file"
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

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Price
              </label>

              <input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.target.value)}
  className="w-full rounded-xl border p-3 text-black"
/>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-yellow-700">
                Discount (%)
              </label>

              <input
  type="number"
  value={discount}
  onChange={(e) => setDiscount(e.target.value)}
  className="w-full rounded-xl border p-3 text-black"
/>
            </div>

          </div>
        </div>

        {/* Product */}
        <div>
          <h2 className="mb-5 text-2xl font-bold text-green-700">
            📋 Product
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold">
                Stock
              </label>

              <select className="w-full rounded-xl border p-3 text-black">
                <option>🟢 In Stock</option>
                <option>🔴 Out of Stock</option>
              </select>
            </div>

          </div>

          <div className="mt-5">
            <label className="mb-2 block font-semibold text-black">
              Description
            </label>

            <textarea
  rows={5}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="w-full rounded-xl border p-3"
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
              <input type="checkbox" />
              Featured Product
            </label>

            <label className="flex items-center gap-3 text-yellow-700">
              <input type="checkbox" />
              New Arrival
            </label>

            <label className="flex items-center gap-3 text-yellow-700">
              <input type="checkbox" />
              Free Delivery
            </label>

            <label className="flex items-center gap-3 text-yellow-700">
              <input type="checkbox" />
              Cash on Delivery
            </label>

          </div>
        </div>

        <button
          className="w-full rounded-xl bg-green-700 py-4 text-lg font-bold text-white hover:bg-green-800"
        >
          💾 Save Product
        </button>

      </form>
    </main>
  );
}