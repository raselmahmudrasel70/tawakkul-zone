"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart } = useCart();

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-4xl font-bold">
        🛒 Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border p-4"
            >
              <h2 className="font-bold">{item.name}</h2>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}