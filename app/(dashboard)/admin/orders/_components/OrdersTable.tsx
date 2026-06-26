"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
    Eye, Loader2, Package, CheckCircle2, Truck,
    XCircle, RotateCcw, Clock, CreditCard, ChevronDown, Zap,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateOrder } from "../actions";
import { type AdminOrder } from "@/utils/OrdersFields";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminOrderWithItems = AdminOrder & {
    items: {
        id: string;
        name: string;
        image: string;
        price: string;
        quantity: number;
    }[];
};

type OrderStatus = "pending" | "paid" | "prepared" | "in_transit" | "delivered" | "cancelled" | "refunded";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { value: "pending", label: "Pending", icon: <Clock className="w-3.5 h-3.5" /> },
    { value: "paid", label: "Paid", icon: <CreditCard className="w-3.5 h-3.5" /> },
    { value: "prepared", label: "Prepared", icon: <Package className="w-3.5 h-3.5" /> },
    { value: "in_transit", label: "In Transit", icon: <Truck className="w-3.5 h-3.5" /> },
    { value: "delivered", label: "Delivered", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { value: "cancelled", label: "Cancelled", icon: <XCircle className="w-3.5 h-3.5" /> },
    { value: "refunded", label: "Refunded", icon: <RotateCcw className="w-3.5 h-3.5" /> },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    pending: { bg: "bg-yellow-50 dark:bg-yellow-950/40", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", dot: "bg-yellow-500" },
    paid: { bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800", dot: "bg-green-500" },
    prepared: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
    in_transit: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", dot: "bg-purple-500" },
    delivered: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
    cancelled: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", dot: "bg-red-500" },
    refunded: { bg: "bg-neutral-100 dark:bg-neutral-800/40", text: "text-neutral-600 dark:text-neutral-400", border: "border-neutral-200 dark:border-neutral-700", dot: "bg-neutral-400" },
};

// ── Stepper — mirrors customer-facing OrderStatusTracker exactly ──────────────

const STEPPER_STEPS = [
    { key: "paid", label: "Placed" },
    { key: "prepared", label: "Prepared" },
    { key: "in_transit", label: "In Transit" },
    { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string): number {
    const map: Record<string, number> = {
        pending: 0,
        paid: 0,
        prepared: 1,
        in_transit: 2,
        delivered: 3,
    };
    return map[status] ?? 0;
}

function OrderStatusTracker({
    status,
    orderId,
    onUpdated,
}: {
    status: string;
    orderId: string;
    onUpdated: (s: string) => void;
}) {
    const activeStep = getStepIndex(status);
    const [loadingStep, setLoadingStep] = useState<number | null>(null);

    async function handleStepClick(i: number) {
        const newStatus = STEPPER_STEPS[i].key as OrderStatus;
        if (newStatus === status || loadingStep !== null) return;
        setLoadingStep(i);
        const fd = new FormData();
        fd.set("status", newStatus);
        const result = await updateOrder(orderId, fd);
        setLoadingStep(null);
        if (result.success) onUpdated(newStatus);
    }

    return (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 mb-6">
                <Zap className="w-4 h-4 text-orange-500" />
                Order Status
            </h2>

            <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-700" />
                <div
                    className="absolute top-4 left-0 h-0.5 bg-orange-500 transition-all duration-500"
                    style={{ width: `${(activeStep / (STEPPER_STEPS.length - 1)) * 100}%` }}
                />

                <div className="relative grid grid-cols-4">
                    {STEPPER_STEPS.map((step, i) => {
                        const isDone = i <= activeStep;
                        const isCurrent = i === activeStep;
                        const isLoading = loadingStep === i;
                        return (
                            <div key={step.key} className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handleStepClick(i)}
                                    disabled={isCurrent || loadingStep !== null}
                                    title={`Set to ${step.label}`}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10
                                        ${isDone ? "bg-orange-500 border-orange-500" : "bg-neutral-900 border-neutral-700"}
                                        ${!isCurrent && loadingStep === null ? "hover:scale-110 hover:ring-2 hover:ring-orange-400 cursor-pointer" : "cursor-default"}
                                    `}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                    ) : isDone ? (
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-xs font-bold text-neutral-400">
                                            {i + 1}
                                        </span>
                                    )}
                                </button>
                                <span className={`text-xs font-bold text-center ${isCurrent ? "text-orange-400" : isDone ? "text-white" : "text-neutral-600"}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Table status badge ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const s = STATUS_STYLE[status] ?? STATUS_STYLE["pending"];
    return (
        <span className={`inline-flex items-center gap-1.5 border text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text} ${s.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
    );
}

// ── Status dropdown ───────────────────────────────────────────────────────────

function StatusSelector({
    orderId,
    currentStatus,
    onUpdated,
}: {
    orderId: string;
    currentStatus: string;
    onUpdated: (s: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    function handleSelect(newStatus: OrderStatus) {
        setOpen(false);
        if (newStatus === currentStatus) return;

        if (newStatus === "refunded" || newStatus === "cancelled") {
            const action = newStatus === "refunded" ? "issue a full Stripe refund" : "cancel this payment on Stripe";
            if (!confirm(`This will ${action}. Are you sure?`)) return;
        }

        setError(null);
        startTransition(async () => {
            const fd = new FormData();
            fd.set("status", newStatus);
            const result = await updateOrder(orderId, fd);
            if (result.success) onUpdated(newStatus);
            else setError(result.error);
        });
    }

    const s = STATUS_STYLE[currentStatus] ?? STATUS_STYLE["pending"];
    const opt = STATUS_OPTIONS.find((o) => o.value === currentStatus);

    return (
        <div className="relative">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Change Status
            </p>
            <button
                onClick={() => setOpen((v) => !v)}
                disabled={isPending}
                className={`flex items-center gap-2 border text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-between transition-colors hover:opacity-80 disabled:opacity-50 ${s.bg} ${s.text} ${s.border}`}
            >
                <span className="flex items-center gap-2">
                    {opt?.icon}
                    {currentStatus.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                {isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                }
            </button>

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden w-full">
                        {STATUS_OPTIONS.map((o) => {
                            const os = STATUS_STYLE[o.value];
                            const isActive = o.value === currentStatus;
                            return (
                                <button
                                    key={o.value}
                                    onClick={() => handleSelect(o.value)}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left transition-colors ${isActive
                                        ? `${os.bg} ${os.text}`
                                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                        }`}
                                >
                                    <span className={isActive ? os.text : "text-neutral-400"}>{o.icon}</span>
                                    {o.label}
                                    {isActive && <span className="ml-auto text-xs opacity-60">current</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({
    order,
    open,
    onOpenChange,
}: {
    order: AdminOrderWithItems;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const [liveStatus, setLiveStatus] = useState(order.status ?? "pending");
    const shortId = `${order.id.slice(0, 4).toUpperCase()}`;
    const subtotal = order.items.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[50%]! max-w-[50%]! max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-black text-white">
                        Order Details {shortId}
                    </DialogTitle>
                    <p className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleString("en-US", {
                            month: "long", day: "numeric", year: "numeric",
                            hour: "numeric", minute: "2-digit", hour12: true,
                        })}
                    </p>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Tracker — dark orange, same as customer page */}
                    {!["cancelled", "refunded"].includes(liveStatus) && (
                        <OrderStatusTracker status={liveStatus} orderId={order.id} onUpdated={setLiveStatus} />
                    )}

                    {/* Cancelled / refunded pill */}
                    {["cancelled", "refunded"].includes(liveStatus) && (
                        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 flex items-center gap-3">
                            <StatusBadge status={liveStatus} />
                            <span className="text-sm text-neutral-400">
                                This order has been {liveStatus}.
                            </span>
                        </div>
                    )}

                    {/* Change status */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                        <StatusSelector
                            orderId={order.id}
                            currentStatus={liveStatus}
                            onUpdated={setLiveStatus}
                        />
                    </div>

                    {/* Items */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <div className="px-5 py-3 border-b border-neutral-800">
                            <p className="text-sm font-black text-white">Your Artisanal Selection</p>
                        </div>
                        <div className="divide-y divide-neutral-800">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-neutral-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-sm">{item.name}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            Qty: <span className="text-neutral-300 font-semibold">{item.quantity}</span>
                                            {" · "}${Number(item.price).toFixed(2)} each
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-black text-white">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial summary */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                        <h3 className="text-sm font-black text-white mb-4">Financial Hearth</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-neutral-400">
                                <span>Subtotal</span>
                                <span className="text-neutral-300 font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Delivery Fee</span>
                                <span className="text-neutral-300 font-semibold">$5.50</span>
                            </div>
                        </div>
                        <div className="border-t border-neutral-800 mt-4 pt-4">
                            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-2xl font-black text-white">${Number(order.total).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Client info */}
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                        <div className="px-5 py-3 border-b border-neutral-800">
                            <p className="text-sm font-black text-white">Client</p>
                        </div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-neutral-800">
                                <tr>
                                    <td className="px-5 py-3 text-neutral-500 w-36">Customer ID</td>
                                    <td className="px-5 py-3 font-mono text-xs text-neutral-300 break-all">{order.userId}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 text-neutral-500">Session ID</td>
                                    <td className="px-5 py-3 font-mono text-xs text-neutral-500 break-all">{order.stripeSessionId}</td>
                                </tr>
                                {order.stripePaymentIntent && (
                                    <tr>
                                        <td className="px-5 py-3 text-neutral-500">Payment Intent</td>
                                        <td className="px-5 py-3 font-mono text-xs text-neutral-500 break-all">{order.stripePaymentIntent}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ── Main table ────────────────────────────────────────────────────────────────

export function OrdersTable({ orders }: { orders: AdminOrderWithItems[] }) {
    const [selectedOrder, setSelectedOrder] = useState<AdminOrderWithItems | null>(null);

    return (
        <>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500 dark:text-neutral-400 uppercase text-xs tracking-wider">
                            <th className="px-4 py-3 font-medium">Order ID</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Items</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400 dark:text-neutral-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-neutral-100 dark:border-neutral-900 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                            >
                                <td className="px-4 py-3 font-mono font-bold text-sm text-neutral-900 dark:text-white">
                                    #PC-{order.id.slice(0, 4).toUpperCase()}
                                </td>
                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">
                                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric", month: "short", day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                                    {order.userId.slice(0, 12)}…
                                </td>
                                <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 text-xs">
                                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                </td>
                                <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white">
                                    ${Number(order.total).toFixed(2)}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={order.status ?? "pending"} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    open={!!selectedOrder}
                    onOpenChange={(v) => !v && setSelectedOrder(null)}
                />
            )}
        </>
    );
}