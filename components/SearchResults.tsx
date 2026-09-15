"use client";

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Props = {
  search: string;
};
type Product = {
  id: number;
  name: string;
  price: number;
  images: string;
};
export default function SearchResults({
  search,
}: Props) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

useEffect(() => {
  async function searchProducts() {
    if (!search.trim()) {
      setFilteredProducts([]);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, images")
      .ilike("name", `%${search}%`);

    if (!error && data) {
      setFilteredProducts(data as Product[]);
    }
  }

  searchProducts();
}, [search]);
  if (!search.trim()) return null;

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
                src={product.images || "/products/product1.jpg"}
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