import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
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

    // Verify merchant
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

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Find ONLY this merchant's product
    const { data: product, error: findError } =
      await supabaseAdmin
        .from("products")
        .select("id, name, created_by")
        .eq("id", productId)
        .eq("created_by", user.id)
        .single();

    if (findError || !product) {
      return NextResponse.json(
        {
          error:
            "Product not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    // Delete ONLY if owned by current merchant
    const { error: deleteError } =
      await supabaseAdmin
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("created_by", user.id);

    if (deleteError) {
      console.error(
        "Delete product error:",
        deleteError
      );

      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete API error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}