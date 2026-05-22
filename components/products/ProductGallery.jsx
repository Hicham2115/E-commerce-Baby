"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  if (!activeImage?.url) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-[#E8DCCB] text-sm text-[#5C5C5C]/60">
        Image produit
      </div>
    );
  }

  return (
    <div className="flex gap-3 md:gap-4">
      {images.length > 1 ? (
        <div className="flex shrink-0 flex-col gap-2 md:gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              aria-label={`Voir l'image ${index + 1}`}
              className={`relative size-14 overflow-hidden rounded-xl border-2 transition-all md:size-16 ${
                activeIndex === index
                  ? "border-[#001B36]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image
                alt={image.altText ?? `${title} — vue ${index + 1}`}
                className="object-cover"
                fill
                sizes="64px"
                src={image.url}
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative min-w-0 flex-1">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#E8DCCB]">
          <Image
            alt={activeImage.altText ?? title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            src={activeImage.url}
          />
        </div>
      </div>
    </div>
  );
}
