"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 120;
  const router = useRouter();
  const total = subtotal + deliveryFee;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

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

    const phoneRegex = /^01\d{9}$/;

    if (!phoneRegex.test(phone)) {
      Swal.fire({
        icon: "warning",
        title: "Enter a valid phone number",
        text: "Phone number must start with 01 and contain exactly 11 digits.",
      });
      return;
    }

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

    const insertResult = await supabase.from("orders").insert({
      user_id: user.id,
      customer_name: name,
      phone,
      address,
      products: cart,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      payment_method: paymentMethod,
      status: "Pending",
    });

    if (insertResult.error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: insertResult.error.message,
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Order Placed 🎉",
      text: "Your order has been placed successfully. We will call you for the order confirmation.",
      confirmButtonColor: "#15803d",
    });

    clearCart();
    setName("");
    setPhone("");
    setAddress("");
    setPaymentMethod("Cash On Delivery");

    router.push("/dashboard");
  }

  return (
    <main suppressHydrationWarning className="mx-auto max-w-5xl px-6 py-10 bg-slate-50">
      <h1 className="mb-8 text-4xl font-bold text-slate-900">Checkout</h1>

      <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/40 space-y-6">
        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm transition focus:border-emerald-600 focus:outline-none"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            inputMode="numeric"
            maxLength={11}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm transition focus:border-emerald-600 focus:outline-none"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />

          <textarea
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm transition focus:border-emerald-600 focus:outline-none"
            rows={4}
            placeholder="Shipping Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-900">Payment method</p>
            <p className="mt-1 text-sm text-slate-500">Choose one payment option for your order.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "Bkash", label: "Bkash" },
              { value: "Nagad", label: "Nagad" },
              { value: "Cash On Delivery", label: "Cash On Delivery" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPaymentMethod(option.value)}
                className={`rounded-3xl border px-4 py-4 text-left transition ${
                  paymentMethod === option.value
                    ? "border-emerald-600 bg-emerald-100 text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {paymentMethod === option.value ? "Selected" : "Tap to choose"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-100 p-5 text-slate-700">
          <div className="flex justify-between text-slate-700">
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Delivery Fee</span>
            <span>৳{deliveryFee}</span>
          </div>
          <hr className="my-4 border-slate-200" />
          <div className="flex justify-between text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={placeOrder}
          className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Place Order
        </button>
      </div>
    </main>
  );
}
