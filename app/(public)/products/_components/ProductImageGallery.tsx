"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    image: string;
    thumbnails?: string[] | null;
    alt: string;
    discountLabel?: string | null;
}

export function ProductImageGallery({
    image,
    thumbnails,
    alt,
    discountLabel,
}: ProductImageGalleryProps) {
    const limitedThumbnails = (thumbnails ?? []).slice(0, 3);
    const [activeImage, setActiveImage] = useState(image);

    return (
        <div className="flex gap-3">
            {limitedThumbnails.length > 0 && (
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => setActiveImage(image)}
                        aria-label="Show main image"
                        className={cn(
                            "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-100 dark:bg-neutral-900 transition-colors cursor-pointer",
                            activeImage === image
                                ? "border-orange-500"
                                : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                        )}
                    >
                        <Image src={image} alt={alt} fill unoptimized className="object-cover" />
                    </button>

                    {limitedThumbnails.map((thumb, index) => (
                        <button
                            key={thumb + index}
                            type="button"
                            onClick={() => setActiveImage(thumb)}
                            aria-label={`Show image ${index + 2}`}
                            className={cn(
                                "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-100 dark:bg-neutral-900 transition-colors cursor-pointer",
                                activeImage === thumb
                                    ? "border-orange-500"
                                    : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
                            )}
                        >
                            <Image
                                src={thumb}
                                alt={`${alt} thumbnail ${index + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                />
                {discountLabel && (
                    <span className="absolute top-4 left-4 rounded-full bg-orange-500 text-black text-sm font-semibold px-3 py-1.5">
                        {discountLabel}
                    </span>
                )}
            </div>
        </div>
    );
}