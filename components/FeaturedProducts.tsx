"use client";
import { supabase } from "@/lib/supabase";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
export default function FeaturedProducts({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
const { addToCart } = useCart();
const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
const [products, setProducts] = useState<any[]>([]);
const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter(
        (product) => product.category === selectedCategory
      );
      useEffect(() => {
  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setProducts(data);
    }
  }

  loadProducts();
}, []);
const isWishlisted = (id: number) =>
  wishlist.some((item) => item.id === id);
  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-red-900">
          ⭐ Featured Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => {
  const discountedPrice =
    product.price - (product.price * (product.discount ?? 0)) / 100;

  return (
            <div
            
  key={product.id}
  className="rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
>
  <div className="relative mb-4 h-56 overflow-hidden rounded-xl">

    <Link href={`/product/${product.id}`}>
      <Image
        src={product.images || "/products/product1.jpg"}
        alt={product.name}
        fill
        className="object-cover transition duration-300 hover:scale-110"
      />
    </Link>

    {product.discount > 0 && (
  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-red-600 shadow-lg">
    -{product.discount}%
  </span>
)}

    <button
  onClick={() => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }}
  className="absolute right-3 top-3 rounded-full border border-white bg-pink-200 p-2.5 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 hover:bg-red-400"
>
  <Heart
    className={`h-5 w-5 transition-all duration-300 ${
      isWishlisted(product.id)
        ? "fill-red-500 text-red-500"
        : "text-gray-700"
    }`}
  />
</button>

  </div>

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

              <div className="mt-3">
  {product.discount > 0 ? (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-red-500 line-through">
          ৳ {product.price}
        </span>

        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
          -{product.discount}%
        </span>
      </div>

      <p className="mt-1 text-2xl font-extrabold text-green-700">
        ৳ {discountedPrice.toFixed(0)}
      </p>
    </>
  ) : (
    <p className="mt-1 text-2xl font-extrabold text-green-700">
      ৳ {product.price}
    </p>
  )}
</div>
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
                    );
        })}
        </div>
      </div>
    </section>
  );
}