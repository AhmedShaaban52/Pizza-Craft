import { getFinalPrice } from "@/lib/getFinalPrice";
import { type Product } from "@/lib/types";
import { FavoriteButton } from "@/app/(public)/favorites/_components/FavoriteButton";
import { AddToCartButton } from "@/app/(public)/products/_components/AddToCartButton";
import Image from "next/image";

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
    const finalPrice = getFinalPrice(product);
    const hasDiscount = !!product.discountType && !!product.discountValue;

    return (
        <div className="group rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden hover:border-neutral-700 transition-colors">
            <div className="relative aspect-square bg-neutral-800">
                <Image
                    src={product.image}
                    alt={product.name}
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

                <FavoriteButton productId={product.id} initialFavorited={isFavorited} />
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-white line-clamp-1">{product.name}</h3>
                {product.description && (
                    <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                        {product.description}
                    </p>
                )}

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-bold text-white">${finalPrice.toFixed(2)}</span>
                    {hasDiscount && (
                        <span className="text-xs text-neutral-500 line-through">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="mt-3">
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