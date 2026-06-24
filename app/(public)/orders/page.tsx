import { getUserOrders } from "@/lib/actions/checkoutActions";
import { requireUser } from "@/lib/requireUser";
import { ShoppingBag, Calendar, CreditCard, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Order, OrderItem, OrderWithItems } from "@/lib/types";

export const revalidate = 0;

export default async function OrdersPage() {
    await requireUser();

    const result = await getUserOrders();
    const orders = result.success ? result.data ?? [] : [];

    if (orders.length === 0) {
        return (
            <div className="min-h-[75vh] bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-6 px-4">
                <ShoppingBag className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    No orders found yet
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-sm">
                    Looks like you haven not made your choice yet. Explore our delicious menu and place your first order!
                </p>
                <Link
                    href="/products"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                    Explore Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-12 py-10 transition-colors">
            <div className="max-w-4xl mx-auto">

                <div className="mb-10">
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
                        Your <span className="text-emerald-500">Orders</span>
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                        Track and manage your recent meal orders.
                    </p>
                </div>


                <div className="space-y-6">
                    {orders.map((order: Order) => {
                        const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        });

                        return (
                            <div
                                key={order.id}
                                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
                            >
                                <div className="bg-neutral-50/50 dark:bg-neutral-800/30 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-6 text-sm">
                                        <div>
                                            <p className="text-neutral-400 font-medium text-xs uppercase tracking-wider">Order ID</p>
                                            <p className="font-mono font-bold text-neutral-700 dark:text-neutral-300 mt-0.5">
                                                #{order.id.slice(0, 8)}...
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-400 font-medium text-xs uppercase tracking-wider">Date Placed</p>
                                            <p className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                {formattedDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-neutral-400 font-medium text-xs uppercase tracking-wider">Total Amount</p>
                                            <p className="font-black text-emerald-600 dark:text-emerald-400 text-base mt-0.5">
                                                ${Number(order.total).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {order.status === "paid" ? (
                                            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Paid & Confirmed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                                                <Clock className="w-3.5 h-3.5" />
                                                {order.status}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 px-6">
                                    {orders?.map((order: OrderWithItems) => (
                                        <div key={order.id} className="mb-6 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">

                                            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-2">
                                                <div>
                                                    <p className="text-xs text-neutral-400">Order ID: {order.id}</p>
                                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                                        Status: <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">{order.status}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-neutral-400">Total Amount</p>
                                                    <p className="text-base font-bold text-neutral-900 dark:text-white">${Number(order.total).toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {order.items?.map((item: OrderItem) => (
                                                <div key={item.id} className="py-4 flex items-center justify-between gap-4 border-b last:border-0 border-neutral-100 dark:border-neutral-800/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                                                            <Image
                                                                src={item.image || "/pizza-placeholder.jpg"}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                                                Quantity: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{item.quantity}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="font-bold text-neutral-900 dark:text-white">
                                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-neutral-400 mt-0.5">
                                                            ${Number(item.price).toFixed(2)} each
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    ))}
                                </div>

                                <div className="bg-neutral-50/30 dark:bg-neutral-900/50 px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                                        <CreditCard className="w-3.5 h-3.5" />
                                        <span>Stripe Payment Reference Card</span>
                                    </div>
                                    <Link
                                        href={`/checkout/success?session_id=${order.stripeSessionId}`}
                                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                                    >
                                        View Invoice Receipt
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}