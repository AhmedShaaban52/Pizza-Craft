"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/lib/favorites-actions";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
    productId: string;
    initialFavorited?: boolean;
    className?: string;
}

export function FavoriteButton({ productId, initialFavorited = false, className }: FavoriteButtonProps) {
    const [favorited, setFavorited] = useState(initialFavorited);
    const [, startTransition] = useTransition();

    function handleClick() {
        const next = !favorited;
        setFavorited(next);

        startTransition(async () => {
            const result = await toggleFavorite(productId);
            if (result.success && result.data) {
                setFavorited(result.data.favorited);
            } else {
                setFavorited(!next);
            }
            window.dispatchEvent(new Event("favorites-updated"));
        });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            className={cn(
                "absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-sm transition-all hover:bg-white cursor-pointer dark:bg-neutral-900/80 dark:border-neutral-800 dark:hover:bg-neutral-900",
                favorited
                    ? "text-orange-600 dark:text-orange-500"
                    : "text-neutral-500 hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-500",
                className
            )}
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-all",
                    favorited && "fill-orange-600 text-orange-600 dark:fill-orange-500 dark:text-orange-500"
                )}
            />
        </button>
    );
}