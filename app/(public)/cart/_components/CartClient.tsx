"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { CartItemRow } from "./CartItemRow";
import { OrderSummary } from "./OrderSummary";
import { createCheckoutSession } from "@/lib/actions/checkoutActions";
import { validateCoupon } from "@/lib/actions/couponActions";
import { toast } from "sonner";

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        nameAr: string | null;
        description: string | null;
        descriptionAr: string | null;
        image: string;
        price: string;
        discountType: "percent" | "amount" | null;
        discountValue: string | null;
    };
    category: { name: string; nameAr: string | null } | null;
}

interface CartClientProps {
    initialItems: CartItem[];
    subtotal: number;
}

export function CartClient({ initialItems, subtotal }: CartClientProps) {
    const t = useTranslations("ShoppingCart");
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    async function handleApplyCoupon() {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const result = await validateCoupon(couponCode.trim(), subtotal);
            if (result.valid) {
                setCouponDiscount(result.discount!);
                setAppliedCoupon(couponCode.toUpperCase().trim());
                toast.success(t("couponAppliedToast", { amount: `$${result.discount}` }));
            } else {
                toast.error(result.error || t("invalidCouponError"));
            }
        } catch {
            toast.error(t("genericError"));
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
            toast.error(t("checkoutFailedError"));
        } finally {
            setCheckoutLoading(false);
        }
    }

    if (initialItems.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-6">
                <ShoppingBag className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {t("emptyTitle")}
                </h2>
                <Link
                    href="/products"
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t("continueShopping")}
                </Link>
            </div>
        );
    }

    const total = Math.max(0, subtotal + subtotal * 0.1 - couponDiscount);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-12 pt-20 md:pt-24 pb-10 transition-colors">
            <div className="max-w-6xl mx-auto pt-3">
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:underline text-sm font-medium mb-4 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("continueShopping")}
                    </Link>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
                        {t("titlePart1")} <span className="text-orange-500">{t("titlePart2")}</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        {t("itemsCount", { count: initialItems.reduce((s, i) => s + i.quantity, 0) })}
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