import Image from "next/image";
import { Star } from "lucide-react";
import { AddToCartButton } from "../../products/_components/AddToCartButton";
import { getFinalPrice } from "@/lib/getFinalPrice";
import { FavoriteButton } from "../../favorites/_components/FavoriteButton";

interface FavoriteCardProps {
    favorite: {
        id: string;
        product: {
            id: string;
            name: string;
            image: string;
            price: string;
            discountType: "percent" | "amount" | null;
            discountValue: string | null;
        };
        category: { name: string } | null;
    };
    cartQuantity?: number;
    cartId?: string | null;
}

export function FavoriteCard({ favorite, cartQuantity = 0, cartId = null }: FavoriteCardProps) {
    const { product } = favorite;
    const finalPrice = getFinalPrice({
        price: product.price,
        discountType: product.discountType,
        discountValue: product.discountValue,
    });

    return (
        <div className="group rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-orange-500/40 transition-colors">
            <div className="relative aspect-4/3 bg-neutral-800">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <FavoriteButton
                    productId={product.id}
                    initialFavorited={true}
                    className="absolute top-3 right-3"
                />
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-white text-base">{product.name}</h3>

                <div className="mt-1.5 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    ))}
                    <span className="text-xs text-neutral-500 ml-1">(128)</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-400">
                        ${finalPrice.toFixed(2)}
                    </span>
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