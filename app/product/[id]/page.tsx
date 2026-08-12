import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductActions from "@/components/ProductActions";
import ProductImageZoom from "@/components/ProductImageZoom";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | Tawakkul Zone",
    };
  }

  const image = product.images || "/icon.png";

  return {
    title: product.name,
    description:
      product.description ||
      `Buy ${product.name} online from Tawakkul Zone.`,

    openGraph: {
      title: product.name,
      description:
        product.description ||
        `Buy ${product.name} online from Tawakkul Zone.`,
      images: [image],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.description ||
        `Buy ${product.name} online from Tawakkul Zone.`,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const image = product.images || "";

  const discountedPrice =
    product.discount > 0
      ? Math.round(
          product.price -
            (product.price * product.discount) / 100
        )
      : product.price;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[42fr_58fr]">

          {/* =========================================
              LEFT - IMAGE
          ========================================= */}

          <div className="flex w-full items-start justify-center md:justify-start">
            {image ? (
              <ProductImageZoom
                src={image}
                alt={product.name}
              />
            ) : (
              <div className="flex aspect-square w-full max-w-[430px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* =========================================
              RIGHT - PRODUCT DETAILS
          ========================================= */}

          <div className="min-w-0">

            {/* Product Name */}
            <h1 className="text-2xl font-bold leading-tight text-black sm:text-3xl lg:text-[38px]">
              {product.name}
            </h1>

            {/* Brand */}
            <p className="mt-3 text-sm text-black sm:text-base">
              <span className="font-medium">Brand:</span>{" "}
              {product.brand}
            </p>

            {/* Category */}
            <p className="mt-1 text-sm text-black sm:text-base">
              <span className="font-medium">Category:</span>{" "}
              {product.category}
            </p>

            {/* =========================================
                PRICE
            ========================================= */}

            <div className="mt-5 flex flex-wrap items-center gap-3">

              {product.discount > 0 && (
                <span className="text-xl text-gray-500 line-through sm:text-2xl">
                  ৳{product.price}
                </span>
              )}

              <span className="text-3xl font-bold text-green-600 sm:text-4xl">
                ৳{discountedPrice}
              </span>

              {product.discount > 0 && (
                <span className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white">
                  -{product.discount}%
                </span>
              )}

            </div>

            {/* =========================================
                STOCK
            ========================================= */}

            <div className="mt-5">
              {product.stock ? (
                <span className="font-semibold text-green-600">
                  ✓ In Stock
                </span>
              ) : (
                <span className="font-semibold text-red-600">
                  ✕ Out of Stock
                </span>
              )}
            </div>

            {/* =========================================
                DESCRIPTION
            ========================================= */}

            {product.description && (
              <div className="mt-6">
                <p className="whitespace-pre-line text-base leading-7 text-black">
                  {product.description}
                </p>
              </div>
            )}

            {/* =========================================
                ACTIONS
            ========================================= */}

            <div className="mt-6">
              <ProductActions product={product} />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}