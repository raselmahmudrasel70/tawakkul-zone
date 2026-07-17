"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
export default function CheckoutPage() {
    const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
async function placeOrder() {
  if (cart.length === 0) {
  Swal.fire({
    icon: "warning",
    title: "Your cart is empty",
  });
  return;
}
  if (!name || !phone || !address) {
    Swal.fire({
      icon: "warning",
      title: "সব তথ্য পূরণ করুন",
    });
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    Swal.fire({
      icon: "error",
      title: "Please login first",
    });
    return;
  }

  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    customer_name: name,
    phone,
    address,
    products: cart,
    subtotal: total,
    delivery_fee: 0,
    total,
    payment_method: "Cash on Delivery",
    status: "Pending",
  });

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Order Failed",
      text: error.message,
    });
    return;
  }

  await Swal.fire({
    icon: "success",
    title: "Order Placed 🎉",
    text: "Your order has been placed successfully.",
    confirmButtonColor: "#15803d",
  });

  clearCart();
  setName("");
setPhone("");
setAddress("");
}
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-700">
        Checkout
      </h1>

      <div className="rounded-2xl bg-cyan-150 p-8 shadow space-y-5">

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border p-3"
          rows={4}
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
  onClick={placeOrder}
  className="w-full rounded-xl bg-green-700 py-3 font-bold text-white hover:bg-green-800"
>
  Place Order
</button>

      </div>
    </main>
  );
}