import { notFound } from "next/navigation";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductActions from "@/components/ProductActions";
export const dynamic = "force-dynamic";

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
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">

        {/* Image */}
        {image ? (
  <div className="relative aspect-square overflow-hidden rounded-xl border">
    <Image
      src={image}
      alt={product.name}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
    />
  </div>
) : (
  <div className="flex aspect-square items-center justify-center rounded-xl border">
    No Image
  </div>
)}

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-2 text-gray-400">
            Brand: {product.brand}
          </p>

          <p className="text-gray-400">
            Category: {product.category}
          </p>

          <p className="mt-2">
            ⭐ {product.rating}/5
          </p>

          <div className="mt-6 flex items-center gap-4">
            {product.discount > 0 && (
              <span className="text-2xl text-gray-500 line-through">
                ৳{product.price}
              </span>
            )}

            <span className="text-4xl font-bold text-green-500">
              ৳{discountedPrice}
            </span>

            {product.discount > 0 && (
              <span className="rounded bg-red-600 px-2 py-1 text-white">
                -{product.discount}%
              </span>
            )}
          </div>

          <div className="mt-6">
            {product.stock ? (
              <span className="font-semibold text-green-500">
                In Stock
              </span>
            ) : (
              <span className="font-semibold text-red-500">
                Out of Stock
              </span>
            )}
          </div>

          <p className="mt-8 whitespace-pre-line text-gray-300">
            {product.description}
          </p>

          <ProductActions product={product} />
        </div>
      </div>
    </main>
  );
}