import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    // Current Supabase logged-in user
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify merchant role
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (
      profileError ||
      !profile ||
      profile.role !== "merchant"
    ) {
      return NextResponse.json(
        { error: "Merchant access required" },
        { status: 403 }
      );
    }

    // Only this merchant's products
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, category, price, stock, is_active, created_by"
      )
      .eq("created_by", user.id)
      .order("id", { ascending: false });

    if (error) {
      console.error(
        "Merchant products database error:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(
      "Merchant products API error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}