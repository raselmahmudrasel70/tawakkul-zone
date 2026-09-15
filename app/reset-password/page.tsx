"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Password Updated",
      text: "Please login with your new password.",
      confirmButtonColor: "#15803d",
    });

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <form
        onSubmit={updatePassword}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-green-700">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          className="mb-5 w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-green-700 py-3 font-bold text-white hover:bg-green-800"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </main>
  );
}