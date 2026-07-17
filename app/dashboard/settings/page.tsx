"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Bell, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      setEmail(user.email || "");
      setIsLoading(false);
    }

    loadUser();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Settings</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Account preferences</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review your account details and manage security preferences for a safer experience.
            </p>
          </div>
          <Link
            href="/dashboard/profile/edit"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <ShieldCheck size={18} />
            Manage profile
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Account</p>
              <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
            </div>
          </div>
          {isLoading ? (
            <p className="text-slate-500">Loading your account details…</p>
          ) : (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Email</span>
                <span className="font-medium">{email || "Not available"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Account type</span>
                <span className="font-medium">Standard user</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Notifications</p>
              <h2 className="text-lg font-semibold text-slate-900">Email updates</h2>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">Order updates</p>
                <p className="text-sm text-slate-500">Get notified when your order status changes.</p>
              </div>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  notificationsEnabled
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 bg-white text-slate-700"
                }`}
                onClick={() => setNotificationsEnabled((value) => !value)}
              >
                {notificationsEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">Security tips</p>
                <p className="text-sm text-slate-500">Keep your account secure with a strong password.</p>
              </div>
              <Link
                href="/dashboard/profile/edit"
                className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                Update profile
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
