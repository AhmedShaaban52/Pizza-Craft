"use client";

import { Tag, X, Truck, Shield, Loader2 } from "lucide-react";

interface OrderSummaryProps {
    subtotal: number;
    total: number;
    couponCode: string;
    setCouponCode: (v: string) => void;
    appliedCoupon: string | null;
    couponDiscount: number;
    couponLoading: boolean;
    checkoutLoading: boolean;
    onApplyCoupon: () => void;
    onRemoveCoupon: () => void;
    onCheckout: () => void;
}

export function OrderSummary({
    subtotal,
    total,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponDiscount,
    couponLoading,
    checkoutLoading,
    onApplyCoupon,
    onRemoveCoupon,
    onCheckout,
}: OrderSummaryProps) {
    const tax = subtotal * 0.1;

    return (
        <div className="lg:col-span-1 flex flex-col gap-4 sticky top-24">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-5">
                    Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-5">
                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Coupon Code
                    </label>

                    {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl px-3 py-2.5">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                <span className="font-mono font-black text-orange-700 dark:text-orange-400 text-sm">
                                    {appliedCoupon}
                                </span>
                                <span className="text-orange-600 dark:text-orange-400 text-xs font-medium">
                                    -${couponDiscount.toFixed(2)}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={onRemoveCoupon}
                                className="text-orange-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                                placeholder="Enter code..."
                                className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-orange-500 font-mono uppercase"
                            />
                            <button
                                type="button"
                                onClick={onApplyCoupon}
                                disabled={couponLoading || !couponCode.trim()}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 transition-colors"
                            >
                                {couponLoading ? "..." : "Apply"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 text-sm border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                        <span>Subtotal</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                        <span>Tax (10%)</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                            ${tax.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                        <span>Delivery</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                            FREE
                        </span>
                    </div>
                    {couponDiscount > 0 && (
                        <div className="flex justify-between text-orange-600 dark:text-orange-400 font-bold">
                            <span>Coupon ({appliedCoupon})</span>
                            <span>-${couponDiscount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 flex justify-between">
                        <span className="font-black text-neutral-900 dark:text-white text-base">Total</span>
                        <span className="font-black text-orange-600 dark:text-orange-400 text-2xl">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={checkoutLoading}
                    className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {checkoutLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirecting...
                        </>
                    ) : (
                        "Proceed to Checkout"
                    )}
                </button>

                <p className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-3">
                    Secure 256-bit SSL encrypted payments.
                </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                        Free Delivery
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Delivered fresh in 30–45 minutes.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                        Secure Payment
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Your payment info is always protected.
                    </p>
                </div>
            </div>
        </div>
    );
}