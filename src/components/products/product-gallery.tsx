"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : [`https://placehold.co/800x800?text=${encodeURIComponent(product.name)}`];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const mainImage = images[currentIndex];

  return (
    <div className="w-full max-w-[700px] mx-auto">
      <div className="relative aspect-square rounded-xl border-oj-border bg-oj-gray-100 overflow-hidden">
        {zoomed ? (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <Image
                src={mainImage}
                alt={product.name}
                className="max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setZoomed(false)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white text-black hover:bg-oj-red hover:text-white transition-colors z-10"
                aria-label="Close zoom"
              >
                <Minimize className="w-6 h-6" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1)); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-oj-black" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1)); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-oj-black" />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover object-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setZoomed(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <button
              onClick={() => setZoomed(true)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white text-oj-black transition-colors"
              aria-label="Zoom image"
            >
              <Maximize className="w-5 h-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1)); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-oj-black transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1)); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-oj-black transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? "bg-oj-red w-6" : "bg-oj-gray-300 hover:bg-oj-gray-400"}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
            {hoverIndex !== null && hoverIndex !== currentIndex && (
              <Image
                src={images[hoverIndex]}
                alt={`Preview ${hoverIndex + 1}`}
                fill
                className="absolute inset-0 object-cover object-center opacity-70 transition-opacity duration-200"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </>
        )}
      </div>

      {images.length > 1 && !zoomed && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`aspect-square rounded-lg border overflow-hidden ${
                i === currentIndex
                  ? "border-oj-red ring-2 ring-oj-red"
                  : "border-oj-border hover:border-oj-red transition-colors"
              } bg-oj-gray-100`}
            >
              <Image
                src={img}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

