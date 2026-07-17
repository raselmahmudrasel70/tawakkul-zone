"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditProductPage() {
  const params = useParams();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        ✏️ Edit Product
      </h1>

      <div className="rounded-xl border p-6">
        <p>
          Product ID: <strong>{params.id}</strong>
        </p>
      </div>
    </main>
  );
}