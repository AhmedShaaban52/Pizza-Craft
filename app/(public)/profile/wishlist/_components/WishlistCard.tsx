"use client";

import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toggleFavorite } from "@/lib/favorites-actions";
import { addToCart } from "@/lib/cart-actions";
import { useTransition } from "react";
import type { WishlistItem } from "./WishlistClient";
import { AddToCartButton } from "@/app/(public)/products/_components/AddToCartButton";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

export default function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await toggleFavorite(item.product.id);
      onRemove(item.id);
    });
  }

  function handleAddToCart() {
    startTransition(async () => {
      await addToCart(item.product.id);
    });
  }

  const finalPrice = item.product.discountValue
    ? item.product.discountType === "percent"
      ? Number(item.product.price) * (1 - Number(item.product.discountValue) / 100)
      : Number(item.product.price) - Number(item.product.discountValue)
    : Number(item.product.price);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍕
          </div>
        )}

        {/* Category badge */}
        {item.category?.name && (
          <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
            {item.category.name}
          </span>
        )}

        {/* Remove button */}
        <button
          onClick={handleRemove}
          disabled={isPending}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 w-7 h-7 rounded-md bg-black/50 hover:bg-red-500/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold leading-tight">{item.product.name}</h3>
          <div className="flex flex-col items-end shrink-0">
            {item.product.discountValue && (
              <span className="text-muted-foreground line-through text-xs">
                ${Number(item.product.price).toFixed(2)}
              </span>
            )}
            <span className="text-orange-500 font-bold text-sm">
              ${finalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        <AddToCartButton productId ={item.product.id} />
      </div>
    </div>
  );
}
