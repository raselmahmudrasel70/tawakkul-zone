"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";

type OrderItem = {
  id: number;
  status: string;
  total: number;
  created_at: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("id,status,total,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setOrders(data || []);
      }

      setIsLoading(false);
    }

    loadOrders();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">My Orders</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Your order history</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review your past purchases, track order status, and reorder your favorites.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <ShoppingCart size={18} />
            Shop again
          </Link>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="border-b bg-white text-slate-500">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold">Order</th>
                <th className="px-4 py-3 text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    No orders yet. Add items to your cart to place your first order.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-700">#{String(order.id).slice(0, 8)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Accepted"
                            ? "bg-cyan-100 text-cyan-800"
                            : order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">৳{order.total}</td>
                    <td className="px-4 py-4 text-slate-500">{formatDate(order.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
