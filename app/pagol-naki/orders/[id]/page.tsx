import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateOrderStatus, deleteOrder } from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  // ================================
  // GET ORDER
  // ================================
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !order) {
    notFound();
  }

  // ================================
  // GET LOGIN USER INFORMATION
  // ================================
  let loginEmail = "N/A";
  let loginPhone = "N/A";

  if (order.user_id) {
    const {
      data: { user },
    } = await supabaseAdmin.auth.admin.getUserById(order.user_id);

    if (user) {
      loginEmail = user.email || "N/A";
      loginPhone = user.phone || "N/A";
    }
  }

  // ================================
  // ORDER PRODUCTS
  // ================================
  type OrderProduct = {
    name: string;
    quantity: number;
    price: number;
    discountedPrice?: number;
    images?: string;
    category?: string;
  };

  const products: OrderProduct[] = Array.isArray(order.products)
    ? order.products
    : [];

  // ================================
  // PAGE
  // ================================
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* ORDER TITLE */}
        <h1 className="mb-8 text-4xl font-bold text-cyan-400">
          📦 Order #{order.id}
        </h1>

        {/* ================================
            CUSTOMER + ORDER SUMMARY
        ================================= */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* CUSTOMER INFO */}
          <div className="rounded-2xl border border-cyan-500 bg-gray-700 p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-cyan-400">
              👤 Customer Info
            </h2>

            <div className="space-y-3 text-white">

              {/* CUSTOMER NAME */}
              <p>
                <span className="font-bold text-yellow-400">
                  Name:
                </span>{" "}
                {order.customer_name || "N/A"}
              </p>

              {/* LOGIN EMAIL */}
              <p>
                <span className="font-bold text-yellow-400">
                  Login Email:
                </span>{" "}
                <span className="text-cyan-300">
                  {loginEmail}
                </span>
              </p>

              {/* ORDER PHONE */}
              <p>
                <span className="font-bold text-yellow-400">
                  Phone:
                </span>{" "}
                {order.phone || "N/A"}
              </p>

              {/* LOGIN PHONE */}
              <p>
                <span className="font-bold text-yellow-400">
                  Login Phone:
                </span>{" "}
                <span className="text-cyan-300">
                  {loginPhone}
                </span>
              </p>

              {/* ADDRESS */}
              <p>
                <span className="font-bold text-yellow-400">
                  Address:
                </span>{" "}
                {order.address || "N/A"}
              </p>

              {/* PAYMENT */}
              <p>
                <span className="font-bold text-yellow-400">
                  Payment:
                </span>{" "}
                {order.payment_method || "N/A"}
              </p>

              {/* TRANSACTION ID */}
              <p>
                <span className="font-bold text-yellow-400">
                  Transaction ID:
                </span>{" "}
                {order.transaction_id || "N/A"}
              </p>

              {/* USER ID */}
              <p>
                <span className="font-bold text-yellow-400">
                  User ID:
                </span>{" "}
                <span className="break-all text-gray-300">
                  {order.user_id || "N/A"}
                </span>
              </p>

              {/* ORDER DATE */}
              <p>
                <span className="font-bold text-yellow-400">
                  Order date:
                </span>{" "}
                <span className="text-white">
                  {new Date(order.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </p>

              {/* STATUS */}
              <p>
                <span className="font-bold text-yellow-400">
                  Status:
                </span>{" "}

                <span
                  className={`rounded-full px-3 py-1 font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-300 text-yellow-800"
                      : order.status === "Accepted"
                      ? "bg-cyan-300 text-cyan-900"
                      : order.status === "Delivered"
                      ? "bg-green-300 text-green-900"
                      : "bg-red-300 text-red-900"
                  }`}
                >
                  {order.status}
                </span>
              </p>

            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="rounded-2xl border border-cyan-500 bg-gray-700 p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-cyan-400">
              💰 Order Summary
            </h2>

            <div className="space-y-3 text-white">

              <p>
                <span className="font-bold text-yellow-400">
                  Subtotal:
                </span>{" "}
                ৳ {order.subtotal}
              </p>

              <p>
                <span className="font-bold text-yellow-400">
                  Delivery:
                </span>{" "}
                ৳ {order.delivery_fee}
              </p>

              <hr className="border-gray-500" />

              <p className="text-3xl font-bold text-yellow-400">
                Total: ৳ {order.total}
              </p>

            </div>
          </div>
        </div>

        {/* ================================
            ORDER ACTIONS
        ================================= */}
        <div className="mt-8 flex flex-wrap gap-4">

          {/* ACCEPT */}
          <form
            action={async () => {
              "use server";

              await updateOrderStatus(
                Number(order.id),
                "Accepted"
              );
            }}
          >
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white hover:bg-cyan-600"
            >
              ✅ Accept Order
            </button>
          </form>

          {/* DELIVERED */}
          <form
            action={async () => {
              "use server";

              await updateOrderStatus(
                Number(order.id),
                "Delivered"
              );
            }}
          >
            <button
              type="submit"
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
            >
              🚚 Mark Delivered
            </button>
          </form>

          {/* DELETE */}
          <form
            action={async () => {
              "use server";

              await deleteOrder(Number(order.id));
            }}
          >
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
            >
              🗑 Delete Order
            </button>
          </form>

          {/* BACK */}
          <Link
            href="/pagol-naki/orders"
            className="rounded-xl bg-gray-700 px-6 py-3 font-bold text-white hover:bg-gray-800"
          >
            ⬅ Back
          </Link>

        </div>

        {/* ================================
            ORDERED PRODUCTS
        ================================= */}
        <div className="mt-10 rounded-2xl border border-cyan-500 bg-gray-700 p-6 shadow-xl">

          <h2 className="mb-6 text-2xl font-bold text-cyan-400">
            🛒 Ordered Products
          </h2>

          <div className="space-y-4">

            {products.map((item, index: number) => {

              const currentPrice =
                item.discountedPrice ?? item.price;

              const hasDiscount =
                item.discountedPrice !== undefined &&
                item.discountedPrice < item.price;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-cyan-700 bg-black p-4 transition hover:bg-gray-800"
                >

                  {/* PRODUCT INFO */}
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300">
                      {item.name}
                    </h3>

                    <p className="text-gray-300">
                      Qty: {item.quantity}
                    </p>

                    {item.category && (
                      <p className="text-sm text-gray-400">
                        Category: {item.category}
                      </p>
                    )}
                  </div>

                  {/* PRICE */}
                  <div className="text-right">

                    <p className="text-xl font-bold text-yellow-400">
                      ৳ {currentPrice}
                    </p>

                    {hasDiscount && (
                      <p className="text-sm text-gray-400 line-through">
                        ৳ {item.price}
                      </p>
                    )}

                    <p className="text-sm text-gray-300">
                      Total: ৳{" "}
                      {currentPrice * item.quantity}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        </div>

      </div>
    </main>
  );
}