"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
};

export default function DeleteButton({ id }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("Are you sure you want to delete this product?");

    if (!ok) return;

    const result = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    alert(JSON.stringify(result, null, 2));

    if (result.error) return;

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
    >
      DELETE TEST
    </button>
  );
}