import { confirmOrder } from "@/lib/actions/checkoutActions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string }>;
}) {
    const { session_id } = await searchParams;
    if (!session_id) redirect("/");

    const result = await confirmOrder(session_id);

    if (!result.success) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-4">
                <p className="text-red-400 text-lg font-semibold">
                    Something went wrong confirming your order.
                </p>
                <Link
                    href="/cart"
                    className="mt-4 text-orange-400 hover:underline text-sm"
                >
                    Return to cart
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-md w-full">
                <div className="h-20 w-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-orange-400" />
                </div>

                <h1 className="text-3xl font-black text-white">
                    Payment <span className="text-orange-400">Successful!</span>
                </h1>

                <p className="mt-3 text-neutral-400">
                    Your order has been confirmed and is being prepared fresh for you.
                </p>

                <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-left space-y-3">
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-orange-400 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-white">Order Confirmed</p>
                            <p className="text-xs text-neutral-500">
                                You will receive a confirmation shortly.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/orders"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
                    >
                        View My Orders
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