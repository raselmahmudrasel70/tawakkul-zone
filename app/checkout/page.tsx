﻿"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type CheckoutItem = {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number;
  images: string;
  quantity: number;
  stock?: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    cart,
    clearCart,
    hydrated,
  } = useCart();

  /* =========================================
     URL
  ========================================= */

  const searchParams = useSearchParams();

  const isBuyNow =
    searchParams.get("buyNow") === "true";

  /* =========================================
     BUY NOW PRODUCT
     
     sessionStorage থেকে product নেওয়া হচ্ছে।
     
     Buy Now হলে:
     শুধু সেই product

     Cart হলে:
     cart-এর সব product
  ========================================= */

  const buyNowStorage =
    useSyncExternalStore(
      () => {
        return () => {};
      },
      () => {
        return sessionStorage.getItem(
          "buyNowProduct"
        );
      },
      () => {
        return null;
      }
    );

  const buyNowItem: CheckoutItem | null =
    useMemo(() => {
      if (
        !isBuyNow ||
        !buyNowStorage
      ) {
        return null;
      }

      try {
        return JSON.parse(
          buyNowStorage
        ) as CheckoutItem;
      } catch {
        return null;
      }
    }, [
      isBuyNow,
      buyNowStorage,
    ]);

  /* =========================================
     BUY NOW QUANTITY
     
     Minimum = 1
  ========================================= */

  const [
    buyNowQuantity,
    setBuyNowQuantity,
  ] = useState(1);

  /* =========================================
     CUSTOMER INFO
  ========================================= */

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  /* =========================================
     PAYMENT
  ========================================= */

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState(
    "Cash On Delivery"
  );

  const [
    transactionId,
    setTransactionId,
  ] = useState("");

  /* =========================================
     CHECKOUT ITEMS
     
     Buy Now:
     শুধু buyNowItem

     Cart:
     পুরো cart
  ========================================= */

  const checkoutItems: CheckoutItem[] =
    useMemo(() => {
      if (
        isBuyNow &&
        buyNowItem
      ) {
        return [
          {
            ...buyNowItem,
            quantity:
              buyNowQuantity,
          },
        ];
      }

      return cart;
    }, [
      isBuyNow,
      buyNowItem,
      buyNowQuantity,
      cart,
    ]);

  /* =========================================
     PRICE
  ========================================= */

  const getItemPrice = (
    item: CheckoutItem
  ) => {
    return (
      item.discountedPrice ??
      item.price
    );
  };

  /* =========================================
     SUBTOTAL
  ========================================= */

  const subtotal =
    checkoutItems.reduce(
      (sum, item) => {
        return (
          sum +
          getItemPrice(item) *
            item.quantity
        );
      },
      0
    );

  const deliveryFee = 120;

  const total =
    subtotal + deliveryFee;

  /* =========================================
     BUY NOW +
     
     কোনো stock restriction নেই।
     যত খুশি quantity বাড়ানো যাবে।
  ========================================= */

  const increaseBuyNowQuantity =
    () => {
      if (!buyNowItem) {
        return;
      }

      setBuyNowQuantity(
        (prev) => prev + 1
      );
    };

  /* =========================================
     BUY NOW -
     
     Minimum = 1
  ========================================= */

  const decreaseBuyNowQuantity =
    () => {
      setBuyNowQuantity(
        (prev) =>
          Math.max(1, prev - 1)
      );
    };

  /* =========================================
     PLACE ORDER
  ========================================= */

  async function placeOrder() {
    if (
      checkoutItems.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "কোনো product নেই",
      });

      return;
    }

    /* Customer Info */
    if (
      !name ||
      !phone ||
      !address
    ) {
      Swal.fire({
        icon: "warning",
        title: "সব তথ্য পূরণ করুন",
      });

      return;
    }

    /* Bangladesh Phone */
    const bdPhoneRegex =
      /^01[3-9]\d{8}$/;

    if (
      !bdPhoneRegex.test(phone)
    ) {
      Swal.fire({
        icon: "warning",
        title:
          "সঠিক ১১ ডিজিটের বাংলাদেশি নাম্বার দিন",
      });

      return;
    }

    /* bKash / Nagad */
    if (
      (
        paymentMethod ===
          "bKash" ||
        paymentMethod ===
          "Nagad"
      ) &&
      !transactionId.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Payment তথ্য দিন",
        text:
          "Transaction ID অথবা Sender Mobile Number লিখুন।",
      });

      return;
    }

    /* Current User */
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Please login first",
      });

      return;
    }

    /* =====================================
       ORDER PRODUCTS

       Buy Now:
       শুধু একটি product

       Cart:
       সব cart product
    ===================================== */

    const orderProducts =
      checkoutItems.map(
        (item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discountedPrice:
            item.discountedPrice ??
            item.price,
          images: item.images,
          quantity: item.quantity,
        })
      );

    /* =====================================
       INSERT ORDER
    ===================================== */

    const insertResult =
      await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: name,
          phone,
          address,
          products:
            orderProducts,
          subtotal,
          delivery_fee:
            deliveryFee,
          total,
          payment_method:
            paymentMethod,
          transaction_id:
            transactionId,
          status: "Pending",
        });

    if (insertResult.error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text:
          insertResult.error
            .message,
      });

      return;
    }

    /* Success */
    await Swal.fire({
      icon: "success",
      title: "Order Placed 🎉",
      text:
        "Your order has been placed successfully. We will call you for the order confirmation.",
      confirmButtonColor:
        "#15803d",
    });

    /* =====================================
       IMPORTANT

       Buy Now:
       Cart clear হবে না

       Cart Checkout:
       Cart clear হবে
    ===================================== */

    if (isBuyNow) {
      sessionStorage.removeItem(
        "buyNowProduct"
      );
    } else {
      clearCart();
    }

    /* Reset */
    setName("");
    setPhone("");
    setAddress("");
    setPaymentMethod(
      "Cash On Delivery"
    );
    setTransactionId("");

    router.push("/dashboard");
  }

  /* =========================================
     HYDRATION
  ========================================= */

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl bg-slate-100 p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================
     CART EMPTY
     
     Buy Now না হলে শুধু এই check হবে
  ========================================= */

  if (
    !isBuyNow &&
    cart.length === 0
  ) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl bg-slate-100 p-10 text-center">

          <h2 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h2>

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Continue Shopping
          </button>

        </div>
      </main>
    );
  }

  /* =========================================
     BUY NOW PRODUCT LOAD CHECK
  ========================================= */

  if (
    isBuyNow &&
    !buyNowItem
  ) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl bg-slate-100 p-10 text-center">

          <p className="text-lg font-semibold text-slate-700">
            Loading product...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main
      suppressHydrationWarning
      className="mx-auto max-w-5xl bg-slate-50 px-6 py-10"
    >

      {/* =====================================
          PAGE TITLE
      ===================================== */}

      <h1 className="mb-8 text-4xl font-bold text-slate-900">
        Checkout
      </h1>

      <div className="space-y-6 rounded-2xl bg-cyan-100 p-8 shadow-xl shadow-slate-200/40">

        {/* =====================================
            PRODUCTS
        ===================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          <h2 className="mb-5 text-xl font-bold text-slate-900">
            {isBuyNow
              ? "Buy Now"
              : "Your Cart"}
          </h2>

          <div className="space-y-4">

            {checkoutItems.map(
              (item) => {
                const currentPrice =
                  getItemPrice(item);

                const hasDiscount =
                  item.discountedPrice !==
                    undefined &&
                  item.discountedPrice <
                    item.price;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >

                    {/* IMAGE */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">

                      <Image
                        src={
                          item.images ||
                          "/products/product1.jpg"
                        }
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />

                    </div>

                    {/* PRODUCT INFO */}
                    <div className="flex-1">

                      <h3 className="font-bold text-slate-900">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">

                        <span className="font-bold text-green-700">
                          ৳ {currentPrice}
                        </span>

                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">
                            ৳ {item.price}
                          </span>
                        )}

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Price × Quantity
                      </p>

                    </div>

                    {/* =================================
                        QUANTITY
                    ================================= */}

                    <div className="flex items-center gap-3">

                      {/* MINUS */}
                      <button
                        type="button"
                        onClick={
                          isBuyNow
                            ? decreaseBuyNowQuantity
                            : undefined
                        }
                        disabled={
                          !isBuyNow ||
                          buyNowQuantity <= 1
                        }
                        className="h-10 w-10 rounded-lg bg-red-500 text-xl font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      {/* NUMBER */}
                      <span className="min-w-8 text-center text-lg font-bold text-slate-900">
                        {isBuyNow
                          ? buyNowQuantity
                          : item.quantity}
                      </span>

                      {/* PLUS */}
                      <button
                        type="button"
                        onClick={
                          isBuyNow
                            ? increaseBuyNowQuantity
                            : undefined
                        }
                        disabled={
                          !isBuyNow
                        }
                        className="h-10 w-10 rounded-lg bg-green-700 text-xl font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>

                    </div>

                    {/* ITEM TOTAL */}
                    <div className="min-w-24 text-right">

                      <p className="text-sm text-slate-500">
                        Total
                      </p>

                      <p className="text-lg font-bold text-slate-900">
                        ৳{" "}
                        {currentPrice *
                          item.quantity}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* BUY NOW NOTICE */}
          {isBuyNow && (
            <p className="mt-4 text-sm font-medium text-blue-700">
              ℹ️ আপনি Buy It Now করেছেন।
              শুধু এই product-টিই checkout হবে।
            </p>
          )}

          {/* CART NOTICE */}
          {!isBuyNow && (
            <p className="mt-4 text-sm font-medium text-green-700">
              🛒 Cart-এর সব product এই order-এর সাথে যাবে।
            </p>
          )}

        </div>

        {/* =====================================
            CUSTOMER INFORMATION
        ===================================== */}

        <div className="space-y-4">

          {/* NAME */}
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          {/* PHONE */}
          <input
            type="tel"
            inputMode="numeric"
            maxLength={11}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => {
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              if (
                value === "" ||
                value === "0" ||
                value === "01" ||
                /^01[3-9]\d{0,8}$/.test(
                  value
                )
              ) {
                setPhone(value);
              }
            }}
          />

          {/* ADDRESS */}
          <textarea
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
            placeholder="Shipping Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
          />

        </div>

        {/* =====================================
            PAYMENT
        ===================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Payment Method
          </h3>

          {/* =================================
              BKASH DETAILS
          ================================= */}

          {paymentMethod ===
            "bKash" && (
            <div className="mb-6 rounded-2xl border border-pink-300 bg-pink-50 p-5">

              <h4 className="text-lg font-bold text-pink-700">
                bKash Payment
              </h4>

              <p className="mt-3 text-sm text-slate-600">
                Send Money to this number:
              </p>

              <div className="mt-2 flex items-center justify-between rounded-xl border bg-white p-3">

                <span className="font-bold text-black">
                  01637133488
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "01637133488"
                    )
                  }
                  className="rounded-lg bg-pink-600 px-3 py-2 text-white"
                >
                  Copy
                </button>

              </div>

              <label className="mt-4 mb-2 block text-sm font-medium text-slate-700">
                Transaction ID অথবা Sender Mobile Number দিন
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="Transaction ID অথবা Sender Number"
                value={
                  transactionId
                }
                onChange={(e) =>
                  setTransactionId(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-red-600 focus:border-emerald-600 focus:outline-none"
              />

            </div>
          )}

          {/* =================================
              NAGAD DETAILS
          ================================= */}

          {paymentMethod ===
            "Nagad" && (
            <div className="mb-6 rounded-2xl border border-orange-300 bg-orange-50 p-5">

              <h4 className="text-lg font-bold text-orange-700">
                Nagad Payment
              </h4>

              <p className="mt-3 text-sm text-slate-600">
                Send Money to this number:
              </p>

              <div className="mt-2 flex items-center justify-between rounded-xl border bg-white p-3">

                <span className="font-bold text-black">
                  01637133488
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "01637133488"
                    )
                  }
                  className="rounded-lg bg-orange-500 px-3 py-2 text-white"
                >
                  Copy
                </button>

              </div>

              <label className="mt-4 mb-2 block text-sm font-medium text-red-700">
                Transaction ID অথবা Sender Mobile Number দিন
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="Transaction ID অথবা Sender Number"
                value={
                  transactionId
                }
                onChange={(e) =>
                  setTransactionId(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-orange-600 focus:border-emerald-600 focus:outline-none"
              />

            </div>
          )}

          {/* =================================
              PAYMENT BUTTONS
          ================================= */}

          <div className="grid gap-4 sm:grid-cols-3">

            {/* COD */}
            <button
              type="button"
              onClick={() =>
                setPaymentMethod(
                  "Cash On Delivery"
                )
              }
              className={`rounded-2xl border p-5 transition ${
                paymentMethod ===
                "Cash On Delivery"
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-400"
              }`}
            >

              <div className="text-4xl">
                📦
              </div>

              <p className="mt-3 font-bold text-yellow-700">
                Cash On Delivery
              </p>

              <p className="text-sm text-slate-500">
                Pay after delivery
              </p>

            </button>

            {/* BKASH */}
            <button
              type="button"
              onClick={() =>
                setPaymentMethod(
                  "bKash"
                )
              }
              className={`rounded-2xl border p-5 transition ${
                paymentMethod ===
                "bKash"
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

              <p className="mt-3 font-bold text-yellow-700">
                bKash
              </p>

              <p className="text-sm text-slate-500">
                Send Money
              </p>

            </button>

            {/* NAGAD */}
            <button
              type="button"
              onClick={() =>
                setPaymentMethod(
                  "Nagad"
                )
              }
              className={`rounded-2xl border p-5 transition ${
                paymentMethod ===
                "Nagad"
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

              <p className="mt-3 font-bold text-yellow-700">
                Nagad
              </p>

              <p className="text-sm text-slate-500">
                Cash In
              </p>

            </button>

          </div>

        </div>

        {/* =====================================
            SUMMARY
        ===================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5">

          {/* ITEMS */}
          <div className="flex justify-between text-black">

            <span>
              Items
            </span>

            <span>
              {checkoutItems.reduce(
                (sum, item) =>
                  sum +
                  item.quantity,
                0
              )}
            </span>

          </div>

          {/* SUBTOTAL */}
          <div className="mt-2 flex justify-between text-black">

            <span>
              Subtotal
            </span>

            <span>
              ৳{subtotal}
            </span>

          </div>

          {/* DELIVERY */}
          <div className="flex justify-between text-black">

            <span>
              Delivery Fee
            </span>

            <span>
              ৳{deliveryFee}
            </span>

          </div>

          <hr className="my-4" />

          {/* TOTAL */}
          <div className="flex justify-between text-lg font-bold text-yellow-700">

            <span>
              Total
            </span>

            <span>
              ৳{total}
            </span>

          </div>

        </div>

        {/* =====================================
            PLACE ORDER
        ===================================== */}

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