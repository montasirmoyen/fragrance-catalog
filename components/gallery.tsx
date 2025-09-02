'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function FragranceGalleryClient({
  images,
  fragranceName,
}: {
  images?: { url: string; author?: string }[];
  fragranceName: string;
}) {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Fragrance Photo Gallery</h2>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className="relative w-48 h-64 flex-shrink-0"
          >
            <Image
              src={img.url}
              alt={fragranceName}
              fill
              className="object-cover rounded-lg shadow"
            />
          </button>
        ))}
      </div>

      {/* Modal viewer */}
      {activeImage !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setActiveImage(null)}
          >
            ✕
          </button>

          <div className="relative w-[90%] max-w-3xl h-[80%] flex items-center justify-center">
            <Image
              src={images[activeImage].url}
              alt={`Fragrance photo ${activeImage + 1}`}
              fill
              className="object-contain rounded-lg"
            />

            {/* Left arrow */}
            {activeImage > 0 && (
              <button
                className="absolute left-4 text-white text-3xl"
                onClick={() => setActiveImage(activeImage - 1)}
              >
                ‹
              </button>
            )}

            {/* Right arrow */}
            {activeImage < images.length - 1 && (
              <button
                className="absolute right-4 text-white text-3xl"
                onClick={() => setActiveImage(activeImage + 1)}
              >
                ›
              </button>
            )}
          </div>
          {/* Counter */}
            <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded-lg">
              {activeImage + 1}/{images.length}
            </div>
        </div>
      )}
    </div>
  );
}