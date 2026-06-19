"use client";

import Image from "next/image";
import { Plus, Star, Heart } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductGridCardProps {
    product: Product;
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
    const rating = 4.9;

    const hasBadge = product.discountValue ? `${product.discountValue}% OFF` : null;

    const currentPrice = Number(product.price || 0);
    const oldPrice = product.discountValue && currentPrice
        ? (currentPrice / (1 - Number(product.discountValue) / 100)).toFixed(2)
        : null;

    return (
        <div className="group relative w-full rounded-[2rem] border border-neutral-800 bg-neutral-900/50 p-4 transition-all duration-300 hover:border-emerald-500/50 hover:bg-neutral-900 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">

            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-950">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {hasBadge && (
                    <span className="absolute top-4 left-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {hasBadge}
                    </span>
                )}

                <button className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/80 text-neutral-400 transition-all hover:bg-neutral-900 hover:text-rose-500 cursor-pointer">
                    <Heart className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-5 px-2 pb-2">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-neutral-100 transition-colors group-hover:text-emerald-400 line-clamp-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 text-emerald-400 text-sm font-semibold">
                        <Star className="h-3.5 w-3.5 fill-emerald-400 stroke-none" />
                        <span>{rating}</span>
                    </div>
                </div>

                <p className="mt-2 text-xs text-neutral-500 leading-relaxed line-clamp-2 h-8">
                    {product.description || "Fresh premium ingredients baked to perfection in our stone oven."}
                </p>

                <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold text-emerald-400">
                            ${currentPrice.toFixed(2)}
                        </span>
                        {oldPrice && (
                            <span className="text-xs text-neutral-600 line-through mt-0.5">
                                ${oldPrice}
                            </span>
                        )}
                    </div>

                    <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-800 text-neutral-200 transition-all hover:bg-emerald-500 hover:text-black active:scale-95 cursor-pointer">
                        <Plus className="h-5 w-5 stroke-[2.5]" />
                    </button>
                </div>
            </div>

        </div>
    );
}