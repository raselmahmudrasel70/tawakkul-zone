"use client";

import Image from "next/image";

type ProductRowProps = {
  images: string;
  name: string;
  price: number;
  children: React.ReactNode;
};

export default function ProductRow({
  images,
  name,
  price,
  children,
}: ProductRowProps) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border bg-black p-4 shadow">
      <div className="relative h-28 w-28 overflow-hidden rounded-xl flex-shrink-0">
        <Image
  src={images || "/products/product1.jpg"}
  alt={name}
  fill
  sizes="112px"
  className="object-cover"
/>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-orange-300">
          {name}
        </h2>

        <p className="mt-2 text-lg font-semibold text-pink-700">
          ৳ {price}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}