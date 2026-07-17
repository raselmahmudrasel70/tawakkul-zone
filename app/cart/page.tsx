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
            {cart.map((item) => (
              <ProductRow
  key={item.id}
  images={item.images}
  name={item.name}
  price={item.price}
>
  <button
    onClick={() => decreaseQuantity(item.id)}
    className="h-9 w-9 rounded-lg bg-red-500 text-lg font-bold text-white hover:bg-red-600"
  >
    -
  </button>

  <span className="w-8 text-center font-bold text-white">
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
</ProductRow>
            ))}
          </div>

          {/* Right Side */}
          <SummaryCard title="Order Summary">
  <div className="mb-3 flex justify-between">
    <span>Items</span>
    <span>
      {cart.reduce((total, item) => total + item.quantity, 0)}
    </span>
  </div>

  <div className="mb-5 flex justify-between text-xl font-bold">
    <span>Total</span>
    <span>৳ {total}</span>
  </div>

  <button
  onClick={() => router.push("/checkout")}
  className="w-full rounded-xl bg-pink-700 py-3 font-semibold text-white transition hover:bg-green-800"
>
  Proceed to Checkout
</button>
</SummaryCard>
        </div>
      )}
    </main>
  );
}
