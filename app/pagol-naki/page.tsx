"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "00tamim09@gmail.com";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
  router.replace("/pagol-naki/login");
  return;
}

      if (user.email !== ADMIN_EMAIL) {
        router.replace("/");
        return;
      }

      setLoading(false);
    }

    check();
  }, [router]);

  if (loading) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-semibold">Checking admin access...</p>
    </main>
  );
}

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-800">
        🛠️ Tawakkul Zone Admin
      </h1>
<button
  onClick={async () => {
    await supabase.auth.signOut();
router.replace("/pagol-naki/login");
  }}
  className="mb-8 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
  Logout
</button>
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/pagol-naki/products"
          className="rounded-2xl bg-green-700 p-8 text-center text-xl font-bold text-white shadow-lg hover:bg-green-800"
        >
          📦 Manage Products
        </Link>

        <div className="rounded-2xl bg-gray-500 p-8 text-center text-xl font-bold text-white">
          📊 Dashboard
        </div>

        <div className="rounded-2xl bg-gray-500 p-8 text-center text-xl font-bold text-white">
          ⚙️ Settings
        </div>
      </div>
    </main>
  );
}