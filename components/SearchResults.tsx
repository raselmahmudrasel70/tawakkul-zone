"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";

type Props = {
  search: string;
};

export default function SearchResults({
  search,
}: Props) {
  if (!search.trim()) return null;

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="absolute left-0 top-full mt-3 w-full rounded-2xl bg-white shadow-2xl">

      {filteredProducts.length === 0 ? (
        <div className="p-6 text-center text-red-500">
          😅 No Products Found
        </div>
      ) : (
        filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex items-center gap-4 border-b p-4 transition hover:bg-gray-100"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                {product.name}
              </h3>

              <p className="text-green-700">
                ৳ {product.price}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}