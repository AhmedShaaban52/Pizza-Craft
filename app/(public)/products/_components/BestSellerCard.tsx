"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Product } from "@/lib/types";
import { FavoriteButton } from "@/app/(public)/favorites/_components/FavoriteButton";
import { AddToCartButton } from "@/app/(public)/products/_components/AddToCartButton";
import { useLocale, pickLocale } from "@/lib/locale-context";

interface BestSellerCardProps {
    product: Product;
    isFavorited?: boolean;
    cartQuantity?: number;
    cartId?: string | null;
}

export default function BestSellerCard({
    product,
    isFavorited = false,
    cartQuantity = 0,
    cartId = null,
}: BestSellerCardProps) {
    const { locale } = useLocale();
    const localizedName = pickLocale(product.name, product.nameAr, locale);
    const localizedDescription = pickLocale(
        product.description,
        product.descriptionAr,
        locale
    );
    const rating = 4.9;

    const hasBadge = product.discountValue ? `${product.discountValue}% OFF` : null;

    const currentPrice = Number(product.price || 0);
    const oldPrice = product.discountValue && currentPrice
        ? (currentPrice / (1 - Number(product.discountValue) / 100)).toFixed(2)
        : null;

    return (
        <div className="group relative w-full rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-4 transition-all duration-300 hover:border-orange-500/50 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            <Link
                href={`/products/${product.id}`}
                aria-label={localizedName}
                className="absolute inset-0 rounded-[2rem]"
            />

            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-950">
                <Image
                    src={product.image}
                    alt={localizedName}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {hasBadge && (
                    <span className="absolute top-4 left-4 rounded-full bg-orange-500/10 border border-orange-500/30 dark:border-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        {hasBadge}
                    </span>
                )}

                <FavoriteButton
                    productId={product.id}
                    initialFavorited={isFavorited}
                    className="z-10"
                />
            </div>

            <div className="mt-5 px-2 pb-2">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-1">
                        {localizedName}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                        <Star className="h-3.5 w-3.5 fill-orange-600 dark:fill-orange-400 stroke-none" />
                        <span>{rating}</span>
                    </div>
                </div>

                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed line-clamp-2 h-8">
                    {localizedDescription || "Fresh premium ingredients baked to perfection in our stone oven."}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex flex-col shrink-0">
                        <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                            ${currentPrice.toFixed(2)}
                        </span>
                        {oldPrice && (
                            <span className="text-xs text-neutral-400 dark:text-neutral-600 line-through mt-0.5">
                                ${oldPrice}
                            </span>
                        )}
                    </div>

                    <div className="w-28 relative z-10">
                        <AddToCartButton
                            productId={product.id}
                            initialQuantity={cartQuantity}
                            initialCartId={cartId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}