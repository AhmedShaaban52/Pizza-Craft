"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toggleFavorite } from "@/lib/actions/favorites-actions";
import { useTransition } from "react";
import type { WishlistItem } from "./WishlistClient";
import { AddToCartButton } from "@/app/(public)/products/_components/AddToCartButton";
import { pickLocale, useLocale } from "@/context/locale-context";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

export default function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const t = useTranslations("Wishlist");
  const { locale } = useLocale();
  const localizedCategory = pickLocale(item.category?.name, item.category?.nameAr, locale);
  const localizedName = pickLocale(item.product.name, item.product.nameAr, locale);
  const localizedDescription = pickLocale(item.product.description, item.product.descriptionAr, locale);
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await toggleFavorite(item.product.id);
      onRemove(item.id);
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
        {item.product.image && (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />)
        }

        {/* Category badge */}
        {item.category?.name && (
          <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
            {localizedCategory} 
          </span>
        )}

        {/* Remove button */}
        <button
          onClick={handleRemove}
          disabled={isPending}
          aria-label={t("removeFromWishlist")}
          className="absolute top-3 right-3 w-7 h-7 rounded-md bg-black/50 hover:bg-red-500/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-col items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold leading-tight">{localizedName}</h3>
          <h3 className="mt-1 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed line-clamp-2">{localizedDescription}</h3>
          <div className="flex items-end gap-1.5 shrink-0">
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
        <AddToCartButton productId={item.product.id} />
      </div>
    </div>
  );
}