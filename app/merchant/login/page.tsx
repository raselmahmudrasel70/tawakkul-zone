"use client";

import { useState } from "react";

export default function MerchantLoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/pagol-naki/login", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Login failed");
      setLoading(false);
      return;
    }

    if (data.role === "admin") {
  window.location.href = "/pagol-naki";
} else {
  window.location.href = "/merchant/dashboard";
}
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Merchant Login
        </h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="mb-4 w-full rounded border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="mb-6 w-full rounded border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-700 py-3 font-semibold text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}