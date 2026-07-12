"use client";

import { products } from "@/data/products";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function FeaturedProducts() {
  const { addToCart } = useCart();



  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-red-900">
          ⭐ Featured Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative mb-4 h-56 overflow-hidden rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-300 hover:scale-110"
                  />

                  {product.newArrival && (
  <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
    NEW
  </span>
)}

                  <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-lg">
                    <Heart className="h-5 w-5 text-gray-700" />
                  </div>
                </div>
              </Link>

              <Link href={`/product/${product.id}`}>
                <h3 className="mt-4 text-lg font-semibold text-gray-700 hover:text-green-700">
                  {product.name}
                </h3>
              </Link>
<div className="mt-2 flex items-center gap-2">
  <span className="text-yellow-500">★★★★★</span>

  <span className="text-sm text-gray-500">
    {product.rating}
  </span>
</div>
<div className="mt-1">
  {product.stock ? (
    <span className="text-sm text-green-600">
      ✔ In Stock
    </span>
  ) : (
    <span className="text-sm text-red-600">
      ✖ Out of Stock
    </span>
  )}
</div>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {product.price}
              </p>
<div className="mt-2 text-sm">
  {product.freeDelivery ? (
    <span className="font-medium text-green-600">
      🚚 Free Delivery
    </span>
  ) : (
    <span className="text-gray-500">
      🚚 Delivery Available
    </span>
  )}
</div>
              <button
                onClick={() => addToCart(product)}
                className="mt-5 w-full rounded-xl bg-green-700 py-2 font-semibold text-white transition hover:bg-green-800"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}