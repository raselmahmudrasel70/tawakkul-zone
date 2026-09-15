"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Clock,
  CheckCircle,
  ChevronRight,
  User,
  PackageSearch,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type DashboardOrder = {
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

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState("User");
  const [email, setEmail] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const stats = useMemo(
    () => [
      {
        title: "Total Orders",
        value: String(orders.length),
        icon: ShoppingBag,
        color: "bg-blue-500",
        description: "All orders placed so far",
      },
      {
        title: "Wishlist",
        value: String(wishlistCount),
        icon: Heart,
        color: "bg-pink-500",
        description: "Products saved for later",
      },
      {
        title: "Pending",
        value: String(
          orders.filter((order) => order.status === "Pending").length
        ),
        icon: Clock,
        color: "bg-yellow-500",
        description: "Orders waiting for processing",
      },
      {
        title: "Completed",
        value: String(
          orders.filter((order) => order.status === "Completed").length
        ),
        icon: CheckCircle,
        color: "bg-emerald-500",
        description: "Orders successfully delivered",
      },
    ],
    [orders, wishlistCount]
  );

  useEffect(() => {
    async function loadDashboard() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        setEmail(user.email || "");
        setDisplayName(
          user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
        );

        const [ordersResult, profileResult] = await Promise.all([
          supabase
            .from("orders")
            .select("id,status,total,created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single(),
        ]);

        if (!ordersResult.error) {
          setOrders(ordersResult.data || []);
        }

        if (!profileResult.error && profileResult.data?.full_name) {
          setDisplayName(profileResult.data.full_name);
        }

        setWishlistCount(getWishlistCount());
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function getWishlistCount() {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem("wishlist");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-gradient-to-r from-emerald-600 via-green-700 to-teal-700 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-100/80">
              Member Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {displayName} 👋
            </h1>
            <p className="max-w-2xl text-sm text-emerald-100/90 sm:text-base">
              Your personal dashboard shows order progress, wishlist insights, and quick actions to manage your account.
            </p>
            {email ? (
              <p className="text-sm text-emerald-100/75">Signed in as {email}</p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/dashboard/profile"
              className="rounded-3xl border border-white/20 bg-white/10 px-5 py-4 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              <User className="mx-auto mb-2 h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/wishlist"
              className="rounded-3xl border border-white/20 bg-white/10 px-5 py-4 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              <Heart className="mx-auto mb-2 h-5 w-5" />
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="rounded-3xl border border-white/20 bg-white/10 px-5 py-4 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white/20"
            >
              <ShoppingBag className="mx-auto mb-2 h-5 w-5" />
              Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                        {item.title}
                      </p>
                      <p className="mt-4 text-3xl font-semibold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                    <div className={`rounded-2xl p-3 text-white ${item.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
                <p className="text-sm text-slate-500">Your latest purchases and delivery status.</p>
              </div>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                View all
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50 text-slate-500">
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
                        Loading your recent orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        You don’t have any orders yet. Start shopping to place your first order.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => (
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

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <PackageSearch size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Recommended</p>
                <h3 className="text-lg font-semibold text-slate-900">Need help placing an order?</h3>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Use the cart and wishlist to keep track of items you love. Complete your profile for faster checkout.
            </p>
            <Link
              href="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue shopping
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Wishlist</p>
                <h3 className="text-lg font-semibold text-slate-900">Saved items</h3>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              You currently have {wishlistCount} item{wishlistCount === 1 ? "" : "s"} saved for later.
            </p>
            <Link
              href="/wishlist"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              View wishlist
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
