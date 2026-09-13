"use client";

import ProductRow from "@/components/ProductRow";
import { useCart } from "@/context/CartContext";
import SummaryCard from "@/components/SummaryCard";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // -----------------------------------------
  // TOTAL PRICE
  // -----------------------------------------
  const total = cart.reduce((sum, item) => {
    const currentPrice =
      item.discountedPrice ?? item.price;

    return sum + currentPrice * item.quantity;
  }, 0);

  // -----------------------------------------
  // TOTAL ITEMS
  // -----------------------------------------
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* =====================================
          TITLE
      ===================================== */}
      <h1 className="mb-8 text-4xl font-bold text-green-800">
        🛒 Shopping Cart
      </h1>

      {/* =====================================
          EMPTY CART
      ===================================== */}
      {cart.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your cart is empty 😒
          </h2>

          <p className="mt-2 text-gray-600">
            Add some products to continue shopping.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        /* ===================================
           CART CONTENT
        =================================== */
        <div className="grid items-start gap-8 lg:grid-cols-3">

          {/* =================================
              LEFT SIDE - CART PRODUCTS
          ================================= */}
          <div className="space-y-5 lg:col-span-2">
            {cart.map((item) => {
              const currentPrice =
                item.discountedPrice ?? item.price;

              const hasDiscount =
                item.discountedPrice !== undefined &&
                item.discountedPrice < item.price;

              return (
                <ProductRow
                  key={item.id}
                  images={item.images}
                  name={item.name}
                  price={currentPrice}
                  originalPrice={
                    hasDiscount
                      ? item.price
                      : undefined
                  }
                >
                  {/* =========================
                      MINUS
                  ========================= */}
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    className="h-9 w-9 rounded-lg bg-red-500 text-lg font-bold text-white transition hover:bg-red-600"
                  >
                    -
                  </button>

                  {/* =========================
                      QUANTITY
                  ========================= */}
                  <span className="w-8 text-center font-bold text-gray-900">
                    {item.quantity}
                  </span>

                  {/* =========================
                      PLUS
                  ========================= */}
                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    className="h-9 w-9 rounded-lg bg-green-700 text-lg font-bold text-white transition hover:bg-green-800"
                  >
                    +
                  </button>

                  {/* =========================
                      REMOVE
                  ========================= */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="ml-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Remove
                  </button>
                </ProductRow>
              );
            })}
          </div>

          {/* =================================
              RIGHT SIDE - ORDER SUMMARY

              Wishlist-এর মতো compact design
          ================================= */}
          <div className="lg:col-span-1">
            <SummaryCard title="Order Summary">

              {/* =========================
                  ITEMS
              ========================= */}
              <div className="mb-8 flex justify-between text-lg text-gray-900">
                <span>Items</span>

                <span className="font-semibold">
                  {totalItems}
                </span>
              </div>

              {/* =========================
                  TOTAL
              ========================= */}
              <div className="mb-8 flex justify-between text-2xl font-bold text-gray-900">
                <span>Total</span>

                <span>
                  ৳ {total}
                </span>
              </div>

              {/* =========================
                  CHECKOUT BUTTON
              ========================= */}
              <button
                type="button"
                onClick={() =>
                  router.push("/checkout")
                }
                className="block w-full rounded-xl bg-pink-700 py-4 text-center text-lg font-bold text-white transition hover:bg-pink-800"
              >
                Proceed to Checkout
              </button>

            </SummaryCard>
          </div>
        </div>
      )}
    </main>
  );
}