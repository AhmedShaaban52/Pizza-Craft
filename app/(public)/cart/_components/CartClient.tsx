"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CartItemRow } from "./CartItemRow";
import { OrderSummary } from "./OrderSummary";
import { createCheckoutSession } from "@/lib/actions/checkoutActions";
import { validateCoupon } from "@/lib/actions/couponActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartItem {
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
}

interface CartClientProps {
    initialItems: CartItem[];
    subtotal: number;
}

export function CartClient({ initialItems, subtotal }: CartClientProps) {
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const router = useRouter();

    async function handleApplyCoupon() {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const result = await validateCoupon(couponCode.trim(), subtotal);
            if (result.valid) {
                setCouponDiscount(result.discount!);
                setAppliedCoupon(couponCode.toUpperCase().trim());
                toast.success(`Coupon applied! You save $${result.discount}`);
            } else {
                toast.error(result.error || "Invalid coupon");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setCouponLoading(false);
        }
    }

    function handleRemoveCoupon() {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
    }

    async function handleCheckout() {
        setCheckoutLoading(true);
        try {
            const result = await createCheckoutSession(
                appliedCoupon || undefined,
                couponDiscount || undefined,
            );
            if (result?.error) { toast.error(result.error); return; }
            if (result?.url) window.location.href = result.url;
        } catch {
            toast.error("Checkout failed. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    }

    if (initialItems.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-6">
                <ShoppingBag className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Your cart is empty
                </h2>
                <Link
                    href="/products"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const total = Math.max(0, subtotal + subtotal * 0.1 - couponDiscount);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-12 py-10 transition-colors">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium mb-4 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
                        Shopping <span className="text-emerald-500">Cart</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        {initialItems.reduce((s, i) => s + i.quantity, 0)} items
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        {initialItems.map((item) => (
                            <CartItemRow key={item.id} item={item} />
                        ))}
                    </div>

                    <OrderSummary
                        subtotal={subtotal}
                        total={total}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        appliedCoupon={appliedCoupon}
                        couponDiscount={couponDiscount}
                        couponLoading={couponLoading}
                        checkoutLoading={checkoutLoading}
                        onApplyCoupon={handleApplyCoupon}
                        onRemoveCoupon={handleRemoveCoupon}
                        onCheckout={handleCheckout}
                    />
                </div>
            </div>
        </div>
    );
}