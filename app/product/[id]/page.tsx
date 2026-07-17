"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditProductPage() {
  const params = useParams();
const router = useRouter();

const id = Number(params.id);

const [loading, setLoading] = useState(true);
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [category, setCategory] = useState("");
const [discount, setDiscount] = useState("");

const [slug, setSlug] = useState("");
const [brand, setBrand] = useState("");
const [sku, setSku] = useState("");
const [description, setDescription] = useState("");
const [rating, setRating] = useState("5");

const [stock, setStock] = useState(true);

const [featured, setFeatured] = useState(false);
const [newArrival, setNewArrival] = useState(false);
const [freeDelivery, setFreeDelivery] = useState(false);
const [cashOnDelivery, setCashOnDelivery] = useState(false);
const [isActive, setIsActive] = useState(true);

const [image, setImage] = useState<File | null>(null);
const [oldImage, setOldImage] = useState("");
const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        router.push("/pagol-naki/products");
        return;
      }

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-6 text-3xl font-bold">✏️ Edit Product</h1>

      <div className="space-y-4 rounded-xl border p-6">
        <input
          className="w-full rounded border p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
        />

        <input
          className="w-full rounded border p-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />

        <input
          className="w-full rounded border p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />

        <input
          className="w-full rounded border p-3"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Discount"
        />

        <button
          className="w-full rounded bg-green-700 p-3 text-white"
          onClick={() => alert("Next Step: Update Function")}
        >
          Update Product
        </button>
      </div>
    </main>
  );
}