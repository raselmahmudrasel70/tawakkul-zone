"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#dc2626",
      });

      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
      confirmButtonColor: "#16a34a",
    });

    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={login}
        className="w-full max-w-md space-y-4 rounded-xl border p-6"
      >
        <h1 className="text-center text-3xl font-bold">Login</h1>

        <input
          type="email"
          className="w-full rounded border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full rounded border p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-green-700 py-3 text-white hover:bg-green-800"
        >
          Login
        </button>
      </form>
    </main>
  );
}