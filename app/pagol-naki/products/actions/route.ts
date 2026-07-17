import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdminToken, ADMIN_EMAIL } from "@/lib/admin-auth";

const COOKIE_NAME = "admin-auth";

async function verifyRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyAdminToken(token);
  return payload?.email === ADMIN_EMAIL;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }

  const body = await request.json();
  const updateData: Record<string, unknown> = {};

  if (typeof body.name === "string") updateData.name = body.name.trim();
  if (typeof body.slug === "string") updateData.slug = body.slug.trim();
  if (typeof body.category === "string") updateData.category = body.category.trim();
  if (typeof body.brand === "string") updateData.brand = body.brand.trim();
  if (typeof body.sku === "string") updateData.sku = body.sku.trim();
  if (typeof body.description === "string") updateData.description = body.description.trim();
  if (typeof body.price === "number") updateData.price = body.price;
  if (typeof body.discount === "number") updateData.discount = body.discount;
  if (typeof body.rating === "number") updateData.rating = body.rating;
  if (typeof body.stock === "boolean") updateData.stock = body.stock;
  if (typeof body.featured === "boolean") updateData.featured = body.featured;
  if (typeof body.newArrival === "boolean") updateData.new_arrival = body.newArrival;
  if (typeof body.freeDelivery === "boolean") updateData.free_delivery = body.freeDelivery;
  if (typeof body.cashOnDelivery === "boolean") updateData.cash_on_delivery = body.cashOnDelivery;
  if (typeof body.isActive === "boolean") updateData.is_active = body.isActive;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update(updateData)
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
