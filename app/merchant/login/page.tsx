"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MerchantLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});


const session = await supabase.auth.getSession();
console.log("SESSION:", session.data.session);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login failed.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      alert("Profile not found.");
      setLoading(false);
      return;
    }

    if (profile.role !== "merchant") {
      await supabase.auth.signOut();
      alert("This account is not a merchant.");
      setLoading(false);
      return;
    }

    router.replace("/merchant/dashboard");
    router.refresh();
  }

  return (
  <main className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-8 shadow-2xl"
    >
      <h1 className="mb-6 text-center text-3xl font-bold text-slate-900">
        Merchant Login
      </h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="mb-4 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 focus:border-green-600 focus:outline-none"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="mb-6 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 focus:border-green-600 focus:outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  </main>
);
}