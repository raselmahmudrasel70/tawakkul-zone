import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateOrderStatus } from "../actions";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }
<div className="mt-8 flex flex-wrap gap-4">
  <form
    action={async () => {
      "use server";
      await updateOrderStatus(Number(order.id), "Accepted");
    }}
  >
    <button
      className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white transition hover:bg-cyan-600"
    >
      ✅ Accept Order
    </button>
  </form>

  <form
    action={async () => {
      "use server";
      await updateOrderStatus(Number(order.id), "Delivered");
    }}
  >
    <button
      className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
    >
      🚚 Mark Delivered
    </button>
  </form>

  <Link
    href="/pagol-naki/orders"
    className="rounded-xl bg-gray-700 px-6 py-3 font-bold text-white transition hover:bg-gray-800"
  >
    ⬅ Back
  </Link>
</div>
  const products = Array.isArray(order.products)
    ? order.products
    : [];

  return (
  <main className="min-h-screen bg-black">
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-cyan-400">
        📦 Order #{order.id}
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer */}
        <div className="rounded-2xl border border-cyan-500 bg-gray-700 p-6 shadow-xl">
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            👤 Customer Info
          </h2>

          <div className="space-y-3 text-white">
            <p>
              <span className="font-bold text-yellow-400">Name:</span>{" "}
              {order.customer_name}
            </p>

            <p>
              <span className="font-bold text-yellow-400">Phone:</span>{" "}
              {order.phone}
            </p>

            <p>
              <span className="font-bold text-yellow-400">Address:</span>{" "}
              {order.address}
            </p>

            <p>
              <span className="font-bold text-yellow-400">Payment:</span>{" "}
              {order.payment_method}
            </p>

            <p>
              <span className="font-bold text-yellow-400">Status:</span>{" "}
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

        {/* Summary */}
        <div className="rounded-2xl border border-cyan-500 bg-gray-700 p-6 shadow-xl">
          <h2 className="mb-5 text-2xl font-bold text-cyan-400">
            💰 Order Summary
          </h2>

          <div className="space-y-3 text-white">
            <p>
              <span className="font-bold text-yellow-400">Subtotal:</span>{" "}
              ৳ {order.subtotal}
            </p>

            <p>
              <span className="font-bold text-yellow-400">Delivery:</span>{" "}
              ৳ {order.delivery_fee}
            </p>

            <hr className="border-gray-500" />

            <p className="text-3xl font-bold text-yellow-400">
              Total: ৳ {order.total}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mt-10 rounded-2xl border border-cyan-500 bg-gray-700 p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-cyan-400">
          🛒 Ordered Products
        </h2>

        <div className="space-y-4">
          {products.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-cyan-700 bg-black p-4 transition hover:bg-gray-800"
            >
              <div>
                <h3 className="text-lg font-bold text-cyan-300">
                  {item.name}
                </h3>

                <p className="text-gray-300">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-yellow-400">
                  ৳ {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);}