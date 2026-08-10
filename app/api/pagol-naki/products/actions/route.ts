import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    // Get currently logged-in Supabase user
    const authSupabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await authSupabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login again." },
        { status: 401 }
      );
    }

    // Check merchant role
    const { data: profile, error: profileError } =
      await authSupabase
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
        { error: "Merchant access required." },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const brand = String(formData.get("brand") || "").trim();
    const sku = String(formData.get("sku") || "").trim();

    const price = Number(formData.get("price") || 0);
    const discount = Number(formData.get("discount") || 0);

    const description = String(
      formData.get("description") || ""
    );

    const stock =
      String(formData.get("stock")) === "true";

    const featured =
      String(formData.get("featured")) === "true";

    const cashOnDelivery =
      String(formData.get("cashOnDelivery")) === "true";

    const isActive =
      String(formData.get("isActive")) === "true";

    const image = formData.get("image");

    // Basic validation
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

    // Admin/service-role client for database operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Generate slug if empty
    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Check duplicate SKU
    if (sku) {
      const {
        data: existingSku,
        error: skuError,
      } = await supabase
        .from("products")
        .select("id")
        .eq("sku", sku)
        .maybeSingle();

      if (skuError) {
        console.error(
          "SKU check error:",
          skuError
        );

        return NextResponse.json(
          { error: skuError.message },
          { status: 500 }
        );
      }

      if (existingSku) {
        return NextResponse.json(
          {
            error: `SKU "${sku}" already exists.`,
          },
          { status: 409 }
        );
      }
    }

    // Check duplicate slug
    const {
      data: existingSlug,
      error: slugError,
    } = await supabase
      .from("products")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (slugError) {
      console.error(
        "Slug check error:",
        slugError
      );

      return NextResponse.json(
        { error: slugError.message },
        { status: 500 }
      );
    }

    if (existingSlug) {
      return NextResponse.json(
        {
          error: `Slug "${finalSlug}" already exists.`,
        },
        { status: 409 }
      );
    }

    /*
     * Image
     *
     * Storage upload can be added later.
     */
    const images: string | null = null;

    if (
      image instanceof File &&
      image.size > 0
    ) {
      console.log(
        "Image received:",
        image.name,
        image.type,
        image.size
      );
    }

    // Insert product
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug: finalSlug,
        category,
        brand,
        sku: sku || null,
        price,
        discount,
        description,
        stock,
        featured,
        cash_on_delivery: cashOnDelivery,
        is_active: isActive,
        images,

        // IMPORTANT:
        // Save the logged-in merchant's UUID
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Supabase product insert error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Product added successfully.",
        product: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Product API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}