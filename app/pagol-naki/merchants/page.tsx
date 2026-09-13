"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Merchant = {
  id: string;
  username: string;
  role: string;
};

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMerchants() {
      try {
        const res = await fetch("/api/pagol-naki/merchants");

        if (!res.ok) {
          throw new Error("Failed to load merchants");
        }

        const data = await res.json();
        setMerchants(data);
      } finally {
        setLoading(false);
      }
    }

    loadMerchants();
  }, []);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <main className="p-8 text-cyan-600">
      <div className="mb-6 flex items-center justify-between text-yellow-700">
        <h1 className="text-3xl font-bold">
          Merchants
        </h1>

        <Link
          href="/pagol-naki/merchants/add"
          className="rounded bg-green-700 px-4 py-2 text-white"
        >
          + Add Merchant
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-pink-100">
            <tr>
              <th className="p-3 text-left text-red-700">Username</th>
              <th className="p-3 text-left text-red-700">Role</th>
            </tr>
          </thead>

          <tbody>
            {merchants.map((merchant) => (
              <tr key={merchant.id} className="border-t">
                <td className="p-3 text-blue-500">{merchant.username}</td>
                <td className="p-3 text-blue-500">{merchant.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}