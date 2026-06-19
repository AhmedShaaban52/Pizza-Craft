import { Button } from "@/components/ui/button";
import { getFinalPrice } from "@/lib/getFinalPrice";
import { ProductWithCategory } from "@/utils/ProductsFields";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

export function ProductGridCard({ product }: { product: ProductWithCategory }) {
    const finalPrice = getFinalPrice(product);
    const hasDiscount = !!product.discountType && !!product.discountValue;

    return (
        <div className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden hover:border-emerald-500/40 transition-colors">
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {hasDiscount && (
                    <span className="absolute top-3 left-3 rounded-full bg-emerald-500 text-black text-xs font-semibold px-2.5 py-1">
                        {product.discountType === "percent"
                            ? `-${product.discountValue}%`
                            : `-$${product.discountValue}`}
                    </span>
                )}

                <button
                    aria-label="Add to favorites"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black"
                >
                    <Heart className="h-4 w-4 text-neutral-700 dark:text-white" />
                </button>
            </div>

            <div className="p-4">
                {product.category && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                        {product.category.name}
                    </p>
                )}
                <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-neutral-900 dark:text-white">
                            ${finalPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-neutral-400 line-through">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <Button
                        size="icon"
                        className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 rounded-full"
                    >
                        <ShoppingCart className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}