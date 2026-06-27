"use client";

import Image from "next/image";
import { useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeFromCart, updateCartQuantity } from "@/lib/cart-actions";
import { getFinalPrice } from "@/lib/getFinalPrice";

interface CartItemRowProps {
    item: {
        id: string;
        quantity: number;
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
}

export function CartItemRow({ item }: CartItemRowProps) {
    const [isPending, startTransition] = useTransition();
    const finalPrice = getFinalPrice({
        price: item.product.price,
        discountType: item.product.discountType,
        discountValue: item.product.discountValue,
    });
    function handleQuantityChange(newQty: number) {
        startTransition(async () => {
            await updateCartQuantity(item.id, newQty);
            window.dispatchEvent(new Event("cart-updated")); 
        });
    }

    function handleRemove() {
        startTransition(async () => {
            await removeFromCart(item.id);
            window.dispatchEvent(new Event("cart-updated"));
        });
    }

    return (
        <div className="flex items-center gap-4 rounded-2xl bg-white border border-neutral-200 p-4 transition-colors dark:bg-neutral-900 dark:border-neutral-800">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 dark:bg-neutral-800">
                <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    unoptimized
                    className="object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                    {item.product.name}
                </h3>
                {item.category && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {item.category.name}
                    </p>
                )}
                <p className="mt-1 text-orange-600 font-bold dark:text-orange-400">
                    ${finalPrice.toFixed(2)}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isPending || item.quantity <= 1}
                    className="h-7 w-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-orange-500 hover:text-orange-600 transition-colors disabled:opacity-40 cursor-pointer dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
                >
                    <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="w-6 text-center text-neutral-900 font-medium dark:text-white">
                    {item.quantity}
                </span>

                <button
                    type="button"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isPending}
                    className="h-7 w-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-orange-500 hover:text-orange-600 transition-colors disabled:opacity-40 cursor-pointer dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                aria-label="Remove item"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer dark:text-neutral-500 dark:hover:text-red-400 dark:hover:bg-red-950/30"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}