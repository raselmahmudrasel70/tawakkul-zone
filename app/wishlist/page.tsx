"use client";
import ProductRow from "@/components/ProductRow";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import SummaryCard from "@/components/SummaryCard";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-800">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="rounded-2xl bg-gray-600 p-10 text-center">
          <h2 className="text-6xl">💔</h2>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            Your Wishlist is Empty
          </h3>

          <p className="mt-3 text-cyan-300">
            আপনার পছন্দের পণ্যগুলো ❤️ চাপলে এখানে সংরক্ষিত হবে।
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-pink-700 px-8 py-3 font-semibold text-white hover:bg-green-800"
          >
            🛍 Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Side */}
          <div className="space-y-5 lg:col-span-2">
            {wishlist.map((item) => (
              <ProductRow
  key={item.id}
  images={item.images}
  name={item.name}
  price={item.price}
>
  <button
    onClick={() => addToCart(item)}
    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
  >
    🛒 Add to Cart
  </button>

  <button
    onClick={() => removeFromWishlist(item.id)}
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
  >
    Remove
  </button>
</ProductRow>
            ))}
          </div>

          {/* Right Side */}
          <SummaryCard title="Wishlist Summary">
  <div className="mb-5 flex justify-between">
    <span>Items</span>
    <span>{wishlist.length}</span>
  </div>

  <Link
    href="/"
    className="block w-full rounded-xl bg-pink-700 py-3 text-center font-semibold text-white transition hover:bg-green-800"
  >
    🛍 Continue Shopping
  </Link>
</SummaryCard>
        </div>
      )}
    </main>
  );
}