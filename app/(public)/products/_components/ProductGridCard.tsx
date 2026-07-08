"use client";

import { getFinalPrice } from "@/lib/getFinalPrice";
import { type Product } from "@/lib/types";
import { FavoriteButton } from "@/app/(public)/favorites/_components/FavoriteButton";
import { AddToCartButton } from "@/app/(public)/products/_components/AddToCartButton";
import { useLocale, pickLocale } from "@/lib/locale-context";
import Image from "next/image";
import Link from "next/link";

interface ProductGridCardProps {
    product: Product;
    isFavorited?: boolean;
    cartQuantity?: number;
    cartId?: string | null;
}

export default function ProductGridCard({
    product,
    isFavorited = false,
    cartQuantity = 0,
    cartId = null,
}: ProductGridCardProps) {
    const { locale } = useLocale();
    const localizedName = pickLocale(product.name, product.nameAr, locale);
    const localizedDescription = pickLocale(
        product.description,
        product.descriptionAr,
        locale
    );
    const finalPrice = getFinalPrice(product);
    const hasDiscount = !!product.discountType && !!product.discountValue;

    return (
        <div className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <Link
                href={`/products/${product.id}`}
                aria-label={localizedName}
                className="absolute inset-0 cursor-pointer"
            />

            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                <Image
                    src={product.image}
                    alt={localizedName}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {hasDiscount && (
                    <span className="absolute top-4 left-4 rounded-full bg-orange-500 text-black text-xs font-semibold px-2.5 py-1">
                        {product.discountType === "percent"
                            ? `-${product.discountValue}%`
                            : `-$${product.discountValue}`}
                    </span>
                )}

                <FavoriteButton
                    productId={product.id}
                    initialFavorited={isFavorited}
                    className="z-10"
                />
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                    {localizedName}
                </h3>
                {localizedDescription && (
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {localizedDescription}
                    </p>
                )}

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">
                        ${finalPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="mt-3 relative z-10">
                    <AddToCartButton
                        productId={product.id}
                        initialQuantity={cartQuantity}
                        initialCartId={cartId}
                    />
                </div>
            </div>
        </div>
    );
}