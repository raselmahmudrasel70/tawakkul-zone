"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function updateOrderStatus(
  id: number,
  status: string
) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/pagol-naki/orders");
  revalidatePath(`/pagol-naki/orders/${id}`);
}