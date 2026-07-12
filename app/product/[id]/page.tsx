import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2">

        {/* Product Image */}
        <div className="relative h-[500px] overflow-hidden rounded-2xl border">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-green-700">
            ৳ {product.price}
          </p>

          <p className="mt-4 text-green-600 font-semibold">
            ✔ In Stock
          </p>

          <p className="mt-6 text-gray-600">
            Premium quality Islamic fashion product from Tawakkul Zone.
            Comfortable fabric, elegant design and perfect for everyday use.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-green-700 px-8 py-3 font-semibold text-white hover:bg-green-800">
              Add to Cart
            </button>

            <button className="rounded-xl border border-green-700 px-8 py-3 font-semibold text-green-700 hover:bg-green-50">
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}