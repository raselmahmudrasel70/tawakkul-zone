"use client";

import Image from "next/image";
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
const [transactionId, setTransactionId] = useState("");

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

    if (
  (paymentMethod === "bKash" || paymentMethod === "Nagad") &&
  !transactionId.trim()
) {
  Swal.fire({
    icon: "warning",
    title: "Payment তথ্য দিন",
    text: "Transaction ID অথবা Sender Mobile Number লিখুন।",
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
      transaction_id: transactionId,
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
  <main
    suppressHydrationWarning
    className="mx-auto max-w-5xl px-6 py-10 bg-slate-50"
  >
    <h1 className="mb-8 text-4xl font-bold text-slate-900">
      Checkout
    </h1>

    <div className="rounded-2xl bg-cyan-100 p-8 shadow-xl shadow-slate-200/40 space-y-6">
      {/* Customer Info */}
      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          inputMode="numeric"
          maxLength={11}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        />

        <textarea
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
          placeholder="Shipping Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* Payment Method */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Payment Method
        </h3>
{paymentMethod === "bKash" && (
  <div className="mt-6 rounded-2xl border border-pink-300 bg-pink-50 p-5">
    <h4 className="text-lg font-bold text-pink-700">
      bKash Payment
    </h4>

    <p className="mt-3 text-sm text-slate-600">
      Send Money to this number:
    </p>

    <div className="mt-2 flex items-center justify-between rounded-xl border bg-white p-3">
      <span className="font-bold text-black">01637133488</span>

      <button
        type="button"
        onClick={() => navigator.clipboard.writeText("01637133488")}
        className="rounded-lg bg-pink-600 px-3 py-2 text-white"
      >
        Copy
      </button>
    </div>

    <label className="mt-4 mb-2 block text-sm font-medium text-slate-700">
  Transaction ID অথবা Sender Mobile Number দিন<span className="text-red-500">*</span>
</label>

<input
  type="text"
  placeholder="যেমন: 9ABCD12345 অথবা 01712345678"
  value={transactionId}
  onChange={(e) => setTransactionId(e.target.value)}
  className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-600 focus:outline-none text-red-600"
/>
  </div>
)}

{paymentMethod === "Nagad" && (
  <div className="mt-6 rounded-2xl border border-orange-300 bg-orange-50 p-5">
    <h4 className="text-lg font-bold text-orange-700">
      Nagad Payment
    </h4>

    <p className="mt-3 text-sm text-slate-600">
      Send Money to this number:
    </p>

    <div className="mt-2 flex items-center justify-between rounded-xl border bg-white p-3">
      <span className="font-bold text-black">01637133488</span>

      <button
        type="button"
        onClick={() => navigator.clipboard.writeText("01637133488")}
        className="rounded-lg bg-orange-500 px-3 py-2 text-white"
      >
        Copy
      </button>
    </div>

    <label className="mt-4 mb-2 block text-sm font-medium text-red-700">
  Transaction ID অথবা Sender Mobile Number দিন<span className="text-red-500">*</span>
</label>

<input
  type="text"
  placeholder="যেমন: 9ABCD12345 অথবা 01712345678"
  value={transactionId}
  onChange={(e) => setTransactionId(e.target.value)}
  className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-600 focus:outline-none text-orange-600"
/>
  </div>
)}
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("Cash On Delivery")}
            className={`rounded-2xl border p-5 transition ${
              paymentMethod === "Cash On Delivery"
                ? "border-emerald-600 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-emerald-400"
            }`}
          >
            <div className="text-4xl">📦</div>
            <p className="mt-3 font-bold text-yellow-700">Cash On Delivery</p>
            <p className="text-sm text-slate-500">Pay after delivery</p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("bKash")}
            className={`rounded-2xl border p-5 transition ${
              paymentMethod === "bKash"
                ? "border-pink-600 bg-pink-50"
                : "border-slate-200 bg-white hover:border-pink-400"
            }`}
          >
            <Image
              src="/bkash.png"
              alt="bKash"
              width={110}
              height={40}
              className="mx-auto h-10 w-auto"
            />
            <p className="mt-3 font-bold text-yellow-700">bKash</p>
            <p className="text-sm text-slate-500">Send Money</p>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("Nagad")}
            className={`rounded-2xl border p-5 transition ${
              paymentMethod === "Nagad"
                ? "border-orange-500 bg-orange-50"
                : "border-slate-200 bg-white hover:border-orange-400"
            }`}
          >
            <Image
              src="/nagad.png"
              alt="Nagad"
              width={110}
              height={40}
              className="mx-auto h-10 w-auto"
            />
            <p className="mt-3 font-bold text-yellow-700">Nagad</p>
            <p className="text-sm text-slate-500">Cash In</p>
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex justify-between text-black">
          <span>Subtotal</span>
          <span>৳{subtotal}</span>
        </div>

        <div className="flex justify-between text-black">
          <span>Delivery Fee</span>
          <span>৳{deliveryFee}</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-bold text-yellow-700">
          <span>Total</span>
          <span>৳{total}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={placeOrder}
        className="w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700"
      >
        Place Order
      </button>
    </div>
  </main>
 );
}