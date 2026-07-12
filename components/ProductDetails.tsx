"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: boolean;
  description: string;
};

export default function ProductDetails({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2">

        {/* Product Image */}
        <div className="relative h-[500px] overflow-hidden rounded-2xl border">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
  <span className="text-yellow-500 text-xl">★★★★★</span>

  <span className="font-medium text-gray-600">
    {product.rating} / 5
  </span>
</div>

          <p className="mt-4 text-3xl font-bold text-green-700">
            ৳ {product.price}
          </p>

          <p
  className={`mt-4 font-semibold ${
    product.stock ? "text-green-600" : "text-red-600"
  }`}
>
  {product.stock ? "✔ In Stock" : "✖ Out of Stock"}
</p>
<div className="mt-3">
  <span className="font-semibold">Category:</span>{" "}
  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
    {product.category}
  </span>
</div>

          <p className="mt-6 leading-7 text-gray-600">
  {product.description}
</p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => addToCart(product)}
              className="rounded-xl bg-green-700 px-8 py-3 font-semibold text-white hover:bg-green-800"
            >
              🛒 Add to Cart
            </button>

            <button className="rounded-xl border border-green-700 px-8 py-3 font-semibold text-green-700 hover:bg-green-50">
              ⚡ Buy Now
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}