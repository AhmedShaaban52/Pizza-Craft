"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { addToCart, updateCartQuantity, getCartQuantityForProduct } from "@/lib/cart-actions";

interface AddToCartButtonProps {
    productId: string;
    initialQuantity?: number;
    initialCartId?: string | null;
    className?: string;
    onQuantityChange?: (newQuantity: number) => void;
}

export function AddToCartButton({
    productId,
    initialQuantity = 0,
    initialCartId = null,
    className,
    onQuantityChange,
}: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [cartId, setCartId] = useState<string | null>(initialCartId);
    const syncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingQuantity = useRef(initialQuantity);

    function scheduleSync(newQuantity: number) {
        pendingQuantity.current = newQuantity;

        if (syncTimeout.current) clearTimeout(syncTimeout.current);

        syncTimeout.current = setTimeout(async () => {
            const finalQty = pendingQuantity.current;

            if (finalQty <= 0) {
                if (cartId) {
                    await updateCartQuantity(cartId, 0);
                    setCartId(null);
                }
            } else if (!cartId) {
                await addToCart(productId, finalQty);
                const { cartId: newCartId } = await getCartQuantityForProduct(productId);
                setCartId(newCartId);
            } else {
                await updateCartQuantity(cartId, finalQty);
            }

            window.dispatchEvent(new Event("cart-updated"));
        }, 400);
    }

    useEffect(() => {
        return () => {
            if (syncTimeout.current) clearTimeout(syncTimeout.current);
        };
    }, []);

    function handleAdd() {
        const next = quantity + 1;
        setQuantity(next); // instant UI update, every click
        onQuantityChange?.(next);
        scheduleSync(next);
    }

    function handleIncrement() {
        const next = quantity + 1;
        setQuantity(next);
        onQuantityChange?.(next);
        scheduleSync(next);
    }

    function handleDecrement() {
        const next = Math.max(0, quantity - 1);
        setQuantity(next);
        onQuantityChange?.(next);
        scheduleSync(next);
    }

    if (quantity === 0) {
        return (
            <button
                type="button"
                onClick={handleAdd}
                className={`w-full h-9 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${className ?? ""}`}
            >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
            </button>
        );
    }

    return (
        <div className={`flex items-center justify-between w-full gap-2 ${className ?? ""}`}>
            <button
                type="button"
                onClick={handleDecrement}
                className="h-9 w-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-orange-500 hover:text-orange-600 transition-colors shrink-0 cursor-pointer dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
            >
                <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="flex-1 text-center text-neutral-900 font-semibold dark:text-white">
                {quantity}
            </span>

            <button
                type="button"
                onClick={handleIncrement}
                className="h-9 w-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-orange-500 hover:text-orange-600 transition-colors shrink-0 cursor-pointer dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
            >
                <Plus className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}