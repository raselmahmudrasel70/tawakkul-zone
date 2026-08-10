import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getMerchant() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      supabase,
      user: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "merchant"
  ) {
    return {
      supabase,
      user: null,
      errorResponse: NextResponse.json(
        { error: "Merchant access required" },
        { status: 403 }
      ),
    };
  }

  return {
    supabase,
    user,
    errorResponse: null,
  };
}

/* =========================================================
   GET - Load one merchant-owned product
   ========================================================= */

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { user, errorResponse } = await getMerchant();

    if (errorResponse || !user) {
      return errorResponse;
    }

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, price, category, discount, images, created_by, stock, featured, cash_on_delivery, is_active, brand, sku, description"
      )
      .eq("id", productId)
      .eq("created_by", user.id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        {
          error:
            "Product not found or you do not have permission to view it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get merchant product error:", error);

    return NextResponse.json(
      { error: "Failed to load product." },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH - Update one merchant-owned product
   ========================================================= */

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { user, errorResponse } = await getMerchant();

    if (errorResponse || !user) {
      return errorResponse;
    }

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Make sure the product belongs to this merchant.
    const { data: existingProduct, error: findError } =
      await supabaseAdmin
        .from("products")
        .select("id, name, created_by, images")
        .eq("id", productId)
        .eq("created_by", user.id)
        .single();

    if (findError || !existingProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found or you do not have permission to edit it.",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const category = String(
      formData.get("category") ?? ""
    ).trim();

    const price = Number(
      formData.get("price") ?? 0
    );

    const discount = Number(
      formData.get("discount") ?? 0
    );

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { error: "Valid product price is required." },
        { status: 400 }
      );
    }

    if (discount < 0 || discount > 100) {
      return NextResponse.json(
        {
          error:
            "Discount must be between 0 and 100.",
        },
        { status: 400 }
      );
    }

    /*
     * Image upload is intentionally not changed here.
     *
     * Your current product API does not have a confirmed
     * Supabase Storage bucket configuration, so we keep
     * the existing image.
     */

    const updateData = {
      name,
      category,
      price,
      discount,
    };

    const { data: updatedProduct, error: updateError } =
      await supabaseAdmin
        .from("products")
        .update(updateData)
        .eq("id", productId)
        .eq("created_by", user.id)
        .select()
        .single();

    if (updateError) {
      console.error(
        "Update merchant product error:",
        updateError
      );

      return NextResponse.json(
        {
          error: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Patch merchant product error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE - Existing working merchant delete
   ========================================================= */

export async function DELETE(
  request: Request,
  { params }: RouteContext
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
    console.error("Delete API error:", error);

    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}