import { supabase } from "@/lib/supabase";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <ProductDetails
      product={{
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount ?? 0,
        images: product.images || "/products/product1.jpg",
        category: product.category,
        rating: product.rating ?? 5,
        stock: product.stock,
        description: product.description,
      }}
    />
  );
}