"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImageZoomProps = {
  src: string;
  alt: string;
};

export default function ProductImageZoom({
  src,
  alt,
}: ProductImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Product Image */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative mx-auto block w-full max-w-[430px] cursor-zoom-in overflow-hidden rounded-xl border border-gray-200 bg-white p-2 text-left shadow-sm md:mx-0"
        aria-label="Zoom product image"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 88vw, 430px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <span className="absolute bottom-4 right-4 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          🔍 Zoom
        </span>
      </button>

      {/* Fullscreen Image */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-3xl font-bold leading-none text-black shadow-xl"
            aria-label="Close"
          >
            ×
          </button>

          {/* Large Image */}
          <div
            className="relative h-[88vh] w-[94vw] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="94vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}