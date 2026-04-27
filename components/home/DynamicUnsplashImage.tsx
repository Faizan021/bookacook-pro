"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Section =
  | "hero"
  | "premium"
  | "caterer"
  | "wedding"
  | "corporate"
  | "birthday"
  | "private"
  | "ramadan";

type ImageData = {
  url: string;
  alt: string;
};

type DynamicUnsplashImageProps = {
  section: Section;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function DynamicUnsplashImage({
  section,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "100vw",
}: DynamicUnsplashImageProps) {
  const [image, setImage] = useState<ImageData | null>(null);

  useEffect(() => {
    let active = true;

    async function loadImage() {
      try {
        const response = await fetch(`/api/unsplash-image?section=${section}`);
        const data = await response.json();

        if (active && data?.url) {
          setImage({
            url: data.url,
            alt: data.alt || "Premium catering image",
          });
        }
      } catch {
        setImage(null);
      }
    }

    loadImage();

    return () => {
      active = false;
    };
  }, [section]);

  return (
    <div className={`relative overflow-hidden bg-[#efe7d8] ${className}`}>
      {image?.url ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3ea] via-[#e8dcc8] to-[#1f3d33]" />
      )}
    </div>
  );
}
