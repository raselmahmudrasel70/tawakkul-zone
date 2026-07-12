"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = useCart();

  const total = cart.reduce((sum, item) => {
  return sum + item.price * item.quantity;
}, 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-800">
        🛒 Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="rounded-2xl bg-gray-600 p-10 text-center">
          <h2 className="text-2xl font-semibold">Your cart is empty 😒</h2>

          <p className="mt-2 text-cyan-400">
            Add some products to continue shopping.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Side */}
          <div className="space-y-5 lg:col-span-2">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-5 rounded-2xl border bg-yollow p-4 shadow"
              >
                <div className="relative h-28 w-28 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-orange-300">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-lg font-semibold text-pink-700">
                    {item.price}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
  <button
    onClick={() => decreaseQuantity(item.id)}
    className="h-9 w-9 rounded-lg bg-red-500 text-lg font-bold hover:bg-gray-300"
  >
    -
  </button>

  <span className="w-8 text-center font-bold">
    {item.quantity}
  </span>

  <button
    onClick={() => increaseQuantity(item.id)}
    className="h-9 w-9 rounded-lg bg-green-700 text-lg font-bold text-white hover:bg-green-800"
  >
    +
  </button>

  <button
    onClick={() => removeFromCart(item.id)}
    className="ml-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
  >
    Remove
  </button>
</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="rounded-2xl bg-gray-500 p-6 shadow-lg">
            <h2 className="mb-5 text-2xl font-bold">
              Order Summary
            </h2>

            <div className="mb-3 flex justify-between">
              <span>Items</span>
              <span>{
  cart.reduce((total, item) => total + item.quantity, 0)
}</span>
            </div>

            <div className="mb-5 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>৳ {total}</span>
            </div>

            <button className="w-full rounded-xl bg-pink-700 py-3 font-semibold text-white transition hover:bg-green-800">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
