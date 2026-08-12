"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

export default function FeaturedProducts({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const { addToCart } = useCart();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [products, setProducts] =
    useState<Product[]>([]);

  /* =====================================
     LOAD PRODUCTS
  ===================================== */

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setProducts(data as Product[]);
      }
    }

    loadProducts();
  }, []);

  /* =====================================
     FILTER PRODUCTS
  ===================================== */

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter(
          (product) =>
            product.category ===
            selectedCategory
        );

  /* =====================================
     CHECK WISHLIST
  ===================================== */

  const isWishlisted = (id: number) =>
    wishlist.some(
      (item) => item.id === id
    );

  return (
    <section className="bg-gray-50 py-10">

      <div className="mx-auto max-w-7xl px-6">

        {/* TITLE */}

        <h2 className="mb-10 text-center text-4xl font-bold text-red-900">
          ⭐ Featured Products
        </h2>

        {/* PRODUCTS */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          {filteredProducts.map(
            (product) => {

              /* =========================
                 DISCOUNTED PRICE
              ========================= */

              const discountedPrice =
                product.discount > 0
                  ? Math.round(
                      product.price -
                        (product.price *
                          product.discount) /
                          100
                    )
                  : product.price;

              return (
                <div
                  key={product.id}
                  className="rounded-xl bg-gray-300 p-2.5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-3 md:p-5"
                >

                  {/* =======================
                      IMAGE
                  ======================= */}

                  <div className="relative mb-2 h-32 overflow-hidden rounded-lg sm:h-36 md:h-52">

                    <Link
                      href={`/product/${product.id}`}
                      className="relative block h-full w-full"
                    >
                      <Image
                        src={
                          product.images ||
                          "/products/product1.jpg"
                        }
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-300 hover:scale-110"
                      />
                    </Link>

                    {/* DISCOUNT BADGE */}

                    {product.discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-red-600 shadow-lg">
                        -{product.discount}%
                      </span>
                    )}

                    {/* =======================
                        WISHLIST
                    ======================= */}

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          isWishlisted(
                            product.id
                          )
                        ) {
                          removeFromWishlist(
                            product.id
                          );
                        } else {
                          addToWishlist({
                            id: product.id,
                            name: product.name,

                            /* ORIGINAL PRICE */
                            price:
                              product.price,

                            /* DISCOUNTED PRICE */
                            discountedPrice:
                              discountedPrice,

                            images:
                              product.images,

                            /* CATEGORY */
                            category:
                              product.category,
                          });
                        }
                      }}
                      className="absolute right-3 top-3 rounded-full border border-white bg-pink-200 p-2.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-red-400"
                      aria-label={
                        isWishlisted(
                          product.id
                        )
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${
                          isWishlisted(
                            product.id
                          )
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700"
                        }`}
                      />
                    </button>

                  </div>

                  {/* =======================
                      PRODUCT NAME
                  ======================= */}

                  <Link
                    href={`/product/${product.id}`}
                  >
                    <h3 className="mt-2 line-clamp-2 text-xs font-semibold leading-tight text-gray-700 hover:text-green-700 sm:text-sm md:text-base">
  {product.name}
</h3>
                  </Link>

                  {/* =======================
                      STOCK
                  ======================= */}

                  <div className="mt-0.5">
                    {product.stock ? (
                      <span className="text-xs text-green-600">
                        ✔ In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600">
                        ✖ Out of Stock
                      </span>
                    )}
                  </div>

                  {/* =======================
                      PRICE
                  ======================= */}

                  <div className="mt-2">

                    {product.discount > 0 ? (
                      <>
                        <div className="flex items-center gap-2">

                          {/* ORIGINAL PRICE */}

                          <span className="text-sm font-semibold text-red-500 line-through">
                            ৳ {product.price}
                          </span>

                          {/* DISCOUNT */}

                          <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                            -{product.discount}%
                          </span>

                        </div>

                        {/* DISCOUNTED PRICE */}

                        <p className="mt-1 text-2xl font-extrabold text-green-700">
                          ৳{" "}
                          {discountedPrice}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-2xl font-extrabold text-green-700">
                        ৳ {product.price}
                      </p>
                    )}

                  </div>

                  {/* =======================
                      ADD TO CART
                  ======================= */}

                  <button
  type="button"
  onClick={() => {
    addToCart({
      id: product.id,
      name: product.name,

      // Original price
      price: product.price,

      // Discounted price
      discountedPrice:
        discountedPrice,

      // Product image
      images: product.images,

      // Product category
      category:
        product.category,
    });
  }}
  className="mt-3 w-full rounded-lg bg-green-700 py-2 text-xs font-semibold text-white transition hover:bg-green-800 sm:text-sm"
>
  Add to Cart
</button>

                </div>
              );
            }
          )}

        </div>
      </div>
    </section>
  );
}