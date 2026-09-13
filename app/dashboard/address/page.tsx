"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Home, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AddressPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAddress() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("address")
        .eq("id", user.id)
        .single();

      setAddress(data?.address || null);
      setIsLoading(false);
    }

    loadAddress();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Address</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Shipping address</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Keep your delivery address up to date for faster checkout and reliable shipping.
            </p>
          </div>

          <Link
            href="/dashboard/profile/edit"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Pencil size={18} />
            Edit address
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-slate-500">Loading address…</div>
        ) : address ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-700">
              <Home size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Your current shipping address</h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-emerald-600" size={20} />
                <div className="whitespace-pre-wrap text-base leading-7">{address}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            <p className="text-xl font-semibold text-slate-900">No address saved yet</p>
            <p className="mt-3 text-sm text-slate-600">
              Add your shipping address to make checkout faster and easier.
            </p>
            <Link
              href="/dashboard/profile/edit"
              className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Add address now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
