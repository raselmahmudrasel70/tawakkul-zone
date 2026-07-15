"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DeleteButtonProps = {
  id: string;
};

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলিট করতে চান?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    alert("✅ Product deleted successfully!");
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