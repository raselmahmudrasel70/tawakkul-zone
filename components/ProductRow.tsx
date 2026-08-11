"use client";

import Image from "next/image";

type ProductRowProps = {
  images: string;
  name: string;
  price: number;
  originalPrice?: number;
  children: React.ReactNode;
};

export default function ProductRow({
  images,
  name,
  price,
  originalPrice,
  children,
}: ProductRowProps) {
  const hasDiscount =
    originalPrice !== undefined && originalPrice > price;

  return (
    <div className="flex items-center gap-5 rounded-2xl border bg-black p-4 shadow">
      {/* Product Image */}
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          src={images || "/products/product1.jpg"}
          alt={name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-orange-300">
          {name}
        </h2>

        {/* Price */}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-lg font-bold text-pink-500">
            ৳ {price}
          </span>

          {hasDiscount && (
            <span className="text-sm font-medium text-gray-400 line-through">
              ৳ {originalPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}