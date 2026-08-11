"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  images: string;
  stock?: number;
}

export default function ProductActions({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();

  const {
    cart,
    addToCart,
    removeFromCart,
  } = useCart();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const isInCart = cart.some(
    (item) => item.id === product.id
  );

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  const discountedPrice =
    product.discount > 0
      ? Math.round(
          product.price -
            (product.price * product.discount) / 100
        )
      : product.price;

  return (
    <div className="mx-auto mt-8 w-[calc(100%-40px)] max-w-[680px]">

      {/* ADD TO CART + WISHLIST */}
      <div className="grid w-full grid-cols-[1fr_56px] items-center gap-4">

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={() => {
            if (isInCart) {
              removeFromCart(product.id);
            } else {
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                discountedPrice,
                images: product.images,
              });
            }
          }}
          className={`h-11 w-full border px-4 text-base font-bold transition ${
            isInCart
              ? "border-black bg-white text-black hover:bg-black hover:text-white"
              : "border-black bg-black text-white hover:bg-white hover:text-black"
          }`}
        >
          {isInCart
            ? "REMOVE FROM CART"
            : "ADD TO CART"}
        </button>

        {/* WISHLIST */}
        <button
          type="button"
          onClick={() => {
            if (isWishlisted) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist({
                id: product.id,
                name: product.name,
                price: discountedPrice,
                images: product.images,
              });
            }
          }}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition hover:scale-105 ${
            isWishlisted
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-transparent text-black hover:border-black"
          }`}
          aria-label={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >
          <Heart
            className="h-7 w-7"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* BUY IT NOW */}
      <button
        type="button"
        disabled={!product.stock}
        onClick={() => {
          const buyNowProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            discountedPrice,
            images: product.images,
            quantity: 1,
            stock: product.stock ?? 0,
          };

          /*
           * IMPORTANT:
           * শুধু এই product-টাই Buy Now-এর জন্য save হবে।
           * Cart-এর কোনো product এখানে নেওয়া হচ্ছে না।
           */
          sessionStorage.setItem(
            "buyNowProduct",
            JSON.stringify(buyNowProduct)
          );

          router.push("/checkout?buyNow=true");
        }}
        className="mt-4 h-11 w-full border border-gray-300 bg-white px-4 text-base font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        {product.stock
          ? "BUY IT NOW"
          : "OUT OF STOCK"}
      </button>

    </div>
  );
}