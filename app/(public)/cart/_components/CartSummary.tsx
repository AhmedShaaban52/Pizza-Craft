"use client";

import Link from "next/link";

interface CartSummaryProps {
    subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
    const deliveryFee = subtotal > 0 ? 2.99 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="h-fit rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sticky top-24">
            <h2 className="font-semibold text-white mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                    <span>Delivery fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 mt-2 flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <Link
                href="/checkout"
                className="mt-5 w-full h-11 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold flex items-center justify-center transition-colors"
            >
                Proceed to Checkout
            </Link>
        </div>
    );
}