"use client";

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
      alert(error.message);
      return;
    }

    router.push("/pagol-naki");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-xl border p-6 space-y-4"
      >
        <h1 className="text-3xl font-bold">Admin Login</h1>

        <input
          className="w-full border p-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="w-full rounded bg-green-700 py-3 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}