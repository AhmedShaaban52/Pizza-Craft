"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCartCount } from "@/lib/cart-actions";
import { getFavoritesCount } from "@/lib/favorites-actions";

interface CartFavCountProps {
    variant?: "desktop" | "mobile";
}

export function CartFavCount({ variant = "desktop" }: CartFavCountProps) {
    const [counts, setCounts] = useState({ cart: 0, fav: 0 });

    const fetchCounts = useCallback(async () => {
        const [cart, fav] = await Promise.all([getCartCount(), getFavoritesCount()]);
        return { cart, fav };
    }, []);

    useEffect(() => {
        let ignore = false;

        fetchCounts().then((result) => {
            if (!ignore) {
                setCounts(result);
            }
        });

        return () => {
            ignore = true;
        };
    }, [fetchCounts]);

    useEffect(() => {
        function handleUpdate() {
            fetchCounts().then(setCounts);
        }

        window.addEventListener("cart-updated", handleUpdate);
        window.addEventListener("favorites-updated", handleUpdate);

        return () => {
            window.removeEventListener("cart-updated", handleUpdate);
            window.removeEventListener("favorites-updated", handleUpdate);
        };
    }, [fetchCounts]);

    const iconSize = variant === "desktop" ? "h-5 w-5" : "h-5 w-5";

    return (
        <>
            <Link href="/favorites">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 cursor-pointer"
                >
                    <Heart className={iconSize} />
                    {counts.fav > 0 && (
                        <span className="absolute top-1 right-1 bg-orange-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                            {counts.fav}
                        </span>
                    )}
                </Button>
            </Link>

            <Link href="/cart">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 cursor-pointer"
                >
                    <ShoppingCart className={iconSize} />
                    {counts.cart > 0 && (
                        <span className="absolute top-1 right-1 bg-orange-600 text-white font-sans text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse ">
                            {counts.cart}
                        </span>
                    )}
                </Button>
            </Link>
        </>
    );
}