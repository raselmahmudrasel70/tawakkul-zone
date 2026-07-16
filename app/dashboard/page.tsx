"use client";

import {
  ShoppingBag,
  Heart,
  Clock,
  CheckCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  const [stats, setStats] = useState([
    {
      title: "Total Orders",
      value: "0",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Wishlist",
      value: "0",
      icon: Heart,
      color: "bg-pink-500",
    },
    {
      title: "Pending",
      value: "0",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
  ]);
  const [orders, setOrders] = useState<any[]>([]);
useEffect(() => {
  loadProfile();
  loadOrders();
}, []);
async function loadOrders() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return;

  setOrders(data || []);

  const pending =
    data?.filter((o) => o.status === "Pending").length || 0;

  const completed =
    data?.filter((o) => o.status === "Completed").length || 0;

  const wishlist = stats[1].value;

  setStats([
    {
      title: "Total Orders",
      value: String(data?.length || 0),
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Wishlist",
      value: wishlist,
      icon: Heart,
      color: "bg-pink-500",
    },
    {
      title: "Pending",
      value: String(pending),
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: String(completed),
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
  ]);
}
async function loadProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  setProfile(data);
}
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-3xl font-bold text-slate-900">
  👋 Assalamu Alaikum
  {profile?.full_name ? `, ${profile.full_name}` : ""}
</h2>

        <p className="mt-2 text-gray-600">
          Welcome back to your Tawakkul Zone dashboard.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-900">
                    {item.value}
                  </h3>
                </div>

                <div
                  className={`rounded-xl p-3 text-white ${item.color}`}
                >
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h3 className="mb-5 text-xl font-bold text-slate-900">
          Recent Orders
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
  <tr className="border-b">
    <th className="py-3 text-left font-semibold text-slate-800">Order ID</th>
    <th className="py-3 text-left font-semibold text-slate-800">Status</th>
    <th className="py-3 text-left font-semibold text-slate-800">Total</th>
    <th className="py-3 text-left font-semibold text-slate-800">Date</th>
  </tr>
</thead>

            <tbody>
  {orders.map((order) => (
    <tr key={order.id} className="border-b">
      <td className="text-slate-600">
        #{order.id.slice(0, 8)}
      </td>

      <td>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            order.status === "Completed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </td>

      <td className="font-medium text-green-600">
        ৳{order.total}
      </td>

      <td className="text-slate-600">
        {new Date(order.created_at).toLocaleDateString()}
      </td>
    </tr>
  ))}

  {orders.length === 0 && (
    <tr>
      <td
        colSpan={4}
        className="py-8 text-center text-gray-500"
      >
        No orders yet.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}