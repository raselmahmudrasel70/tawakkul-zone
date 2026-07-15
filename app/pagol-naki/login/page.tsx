"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "00tamim09@gmail.com";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

console.log("DATA =", data);
console.log("USER =", data.user);
console.log("SESSION =", data.session);
console.log("ERROR =", error);

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      alert("Access denied!");
      return;
    }
alert("Login Success ✅");
    alert("Login Success");

window.location.href = "/pagol-naki";
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl border p-6 space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border rounded p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full rounded bg-green-700 p-3 text-white"
        >
          Login
        </button>
      </form>
    </main>
  );
}