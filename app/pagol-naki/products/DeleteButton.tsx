"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: string;
  onDelete?: () => void;
};

export default function DeleteButton({ id, onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলিট করতে চান?"
    );
    if (!confirmDelete) return;

    setLoading(true);

    const response = await fetch(`/pagol-naki/products/actions?id=${id}`, {
      method: "DELETE",
    });
    setLoading(false);

    const result = await response.json();
    if (!response.ok) {
      alert(result.error || "Delete failed.");
      return;
    }

    alert("✅ Product deleted successfully!");
    onDelete?.();
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
