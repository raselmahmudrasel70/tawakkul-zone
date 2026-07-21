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

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
        confirmButtonColor: "#dc2626",
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <form
        onSubmit={login}
        className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Login
        </h1>

        <input
          type="email"
          className="w-full rounded-lg border border-gray-300 p-3 text-slate-900 placeholder:text-gray-500 focus:border-green-700 focus:outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full rounded-lg border border-gray-300 p-3 text-slate-900 placeholder:text-gray-500 focus:border-green-700 focus:outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Login
        </button>

        <div className="my-4 flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="mx-3 text-sm text-gray-600">OR</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-medium text-slate-900 transition hover:bg-gray-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Continue with Google
        </button>
      </form>
    </main>
  );
}