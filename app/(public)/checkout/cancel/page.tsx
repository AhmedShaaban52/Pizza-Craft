import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-md w-full">
                <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-400" />
                </div>

                <h1 className="text-3xl font-black text-white">
                    Payment <span className="text-red-400">Cancelled</span>
                </h1>

                <p className="mt-3 text-neutral-400">
                    No charges were made. Your cart is still saved.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/cart"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
                    >
                        Return to Cart
                    </Link>
                    <Link
                        href="/products"
                        className="flex-1 border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}