"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductActions({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  return (
    <div className="mt-8 flex gap-4">
      <button
        onClick={() =>
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
          })
        }
        className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
      >
        Add to Cart
      </button>

      <button
        onClick={() =>
          addToWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
          })
        }
        className="rounded-xl border border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-pink-600"
      >
        ❤️ Wishlist
      </button>
    </div>
  );
}