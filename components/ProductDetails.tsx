"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  images: string;
  category: string;
  rating: number;
  stock: boolean;
  description: string;
};

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  const { addToCart } = useCart();
const discountedPrice =
  product.price - (product.price * product.discount) / 100;
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid items-start gap-12 md:grid-cols-2">

        {/* Product Image */}
        <div className="relative h-[600px] overflow-hidden rounded-3xl border border-zinc-700 shadow-2xl">
          <Image
            src={product.images || "/products/product1.jpg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="rounded-3xl bg-zinc-900 p-10 shadow-2xl">

          <h1 className="text-4xl font-bold text-white">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl text-yellow-400">
              ★★★★★
            </span>

            <span className="font-medium text-gray-300">
              {product.rating} / 5
            </span>
          </div>

          <div className="mt-6">

  {product.discount > 0 ? (
    <>
      <div className="flex items-center gap-3">

        <span className="text-5xl font-extrabold text-green-500">
          ৳ {discountedPrice.toFixed(0)}
        </span>

        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-red-600">
          -{product.discount}%
        </span>

      </div>

      <p className="mt-2 text-2xl font-semibold text-red-600 line-through">
        ৳ {product.price}
      </p>
    </>
  ) : (
    <p className="text-5xl font-extrabold text-green-400">
      ৳ {product.price}
    </p>
  )}

</div>

          <p
            className={`mt-5 text-lg font-bold ${
              product.stock
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {product.stock
              ? "✔ In Stock"
              : "✖ Out of Stock"}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-semibold text-gray-200">
              Category:
            </span>

            <span className="rounded-full border border-green-500/30 bg-green-500/15 px-4 py-1 text-sm font-semibold text-green-300">
              {product.category}
            </span>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-xl font-bold text-white">
              Product Description
            </h3>

            <p className="leading-8 text-gray-200">
              {product.description}
            </p>
          </div>

          <div className="mt-10 flex gap-4">

            <button
              onClick={() => addToCart(product)}
              className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white transition hover:bg-green-500"
            >
              🛒 Add to Cart
            </button>

            <button className="rounded-xl border border-yellow-500 px-8 py-4 font-bold text-yellow-400 transition hover:bg-yellow-500 hover:text-black">
              ⚡ Buy Now
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}