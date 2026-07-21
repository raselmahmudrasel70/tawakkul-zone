import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdminToken, ADMIN_EMAIL } from "@/lib/admin-auth";

const COOKIE_NAME = "admin-auth";

async function verifyRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyAdminToken(token);

  if (!payload) {
    return null;
  }

  return payload;
}

export async function GET(request: NextRequest) {
  const user = await verifyRequest(request);

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  }

  let query = supabaseAdmin
  .from("products")
  .select("*")
  .order("id", { ascending: false });

if (user.role === "merchant") {
  query = query.eq("created_by", user.id);
}

const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: NextRequest) {
  const user = await verifyRequest(request);

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price"));
  const discount = Number(formData.get("discount"));
  const rating = Number(formData.get("rating"));
  const stock = String(formData.get("stock")) === "true";
  const featured = String(formData.get("featured")) === "true";
  const newArrival = String(formData.get("newArrival")) === "true";
  const freeDelivery = String(formData.get("freeDelivery")) === "true";
  const cashOnDelivery = String(formData.get("cashOnDelivery")) === "true";
  const isActive = String(formData.get("isActive")) === "true";
  const imageFile = formData.get("image");

  if (!name || !slug || !category || !brand || !price) {
    return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
  }

  let imageUrl = "";
  if (imageFile instanceof File && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const fileData = await imageFile.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("products")
      .upload(fileName, new Uint8Array(fileData), {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error } = await supabaseAdmin.from("products").insert({
    name,
    slug,
    category,
    brand,
    sku,
    images: imageUrl,
    price,
    discount,
    description,
    rating,
    stock,
    featured,
    new_arrival: newArrival,
    free_delivery: freeDelivery,
    cash_on_delivery: cashOnDelivery,
    is_active: isActive,
    created_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const user = await verifyRequest(request);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing product id." },
      { status: 400 }
    );
  }

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("created_by")
    .eq("id", Number(id))
    .single();

  if (productError || !product) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  if (
    user.role === "merchant" &&
    product.created_by !== user.id
  ) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const updateData: Record<string, unknown> = {};

  const name = String(formData.get("name") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceValue = String(formData.get("price") || "").trim();
  const discountValue = String(formData.get("discount") || "").trim();
  const ratingValue = String(formData.get("rating") || "").trim();
  const stockValue = String(formData.get("stock") || "").trim();
  const featuredValue = String(formData.get("featured") || "").trim();
  const newArrivalValue = String(formData.get("newArrival") || "").trim();
  const freeDeliveryValue = String(formData.get("freeDelivery") || "").trim();
  const cashOnDeliveryValue = String(formData.get("cashOnDelivery") || "").trim();
  const isActiveValue = String(formData.get("isActive") || "").trim();
  const imageFile = formData.get("image");

  if (name) updateData.name = name;
  if (slug) updateData.slug = slug;
  if (category) updateData.category = category;
  if (brand) updateData.brand = brand;
  if (sku) updateData.sku = sku;
  if (description) updateData.description = description;

  if (priceValue !== "") {
    const parsedPrice = Number(priceValue);
    if (!Number.isNaN(parsedPrice)) updateData.price = parsedPrice;
  }

  if (discountValue !== "") {
    const parsedDiscount = Number(discountValue);
    if (!Number.isNaN(parsedDiscount)) updateData.discount = parsedDiscount;
  }

  if (ratingValue !== "") {
    const parsedRating = Number(ratingValue);
    if (!Number.isNaN(parsedRating)) updateData.rating = parsedRating;
  }

  if (stockValue !== "") updateData.stock = stockValue === "true";
  if (featuredValue !== "") updateData.featured = featuredValue === "true";
  if (newArrivalValue !== "") updateData.new_arrival = newArrivalValue === "true";
  if (freeDeliveryValue !== "") updateData.free_delivery = freeDeliveryValue === "true";
  if (cashOnDeliveryValue !== "") updateData.cash_on_delivery = cashOnDeliveryValue === "true";
  if (isActiveValue !== "") updateData.is_active = isActiveValue === "true";

  if (imageFile instanceof File && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const fileData = await imageFile.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("products")
      .upload(fileName, new Uint8Array(fileData), {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(fileName);

    updateData.images = publicUrlData.publicUrl;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "Nothing to update." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update(updateData)
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}