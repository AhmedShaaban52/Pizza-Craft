import { requireUser } from "@/lib/requireUser";
import { redirect, notFound } from "next/navigation";
import { getUserOrders, reorderOrder } from "@/lib/actions/checkoutActions";
import { OrderWithItems, OrderItem } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Zap,
  MapPin,
  Download,
  MessageCircle,
  RotateCcw,
} from "lucide-react";

export const revalidate = 0;

function getActiveStep(status: string) {
  if (status === "delivered") return 3;
  if (status === "in_transit") return 2;
  if (status === "prepared") return 1;
  return 1;
}

function OrderStatusTracker({
  status,
  t,
}: {
  status: string;
  t: Awaited<ReturnType<typeof getTranslations<"OrderDetail">>>;
}) {
  const activeStep = getActiveStep(status);

  const steps = [
    { key: "placed", label: t("stepPlaced") },
    { key: "prepared", label: t("stepPrepared") },
    { key: "in_transit", label: t("stepInTransit") },
    { key: "delivered", label: t("stepDelivered") },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
      <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-orange-500" />
        {t("orderStatus")}
      </h2>

      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-700" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-orange-500 transition-all"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative grid grid-cols-4">
          {steps.map((step, i) => {
            const isDone = i <= activeStep;
            const isCurrent = i === activeStep;
            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10 ${isDone
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                    }`}
                >
                  {isDone && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!isDone && <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />}
                </div>
                <span className={`text-xs font-bold text-center ${isCurrent ? "text-orange-500 dark:text-orange-400" : isDone ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600"}`}>
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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const t = await getTranslations("OrderDetail");

  const result = await getUserOrders();
  if (!result.success) redirect("/profile/orders");

  const order = (result.data ?? []).find((o: OrderWithItems) => o.id === id);
  if (!order) notFound();

  const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const shortId = `#PC-${order.id.slice(0, 4).toUpperCase()}`;
  const subtotal = order.items?.reduce(
    (acc: number, item: OrderItem) => acc + Number(item.price) * item.quantity,
    0
  ) ?? Number(order.total);
  const deliveryFee = 5.5;
  const estimatedTax = +(subtotal * 0.08).toFixed(2);
  const totalAmount = +(subtotal + deliveryFee + estimatedTax).toFixed(2);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-12 py-10 text-neutral-900 dark:text-neutral-100">

      {/* Top bar */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <Link
            href="/profile/orders"
            className="text-xs text-neutral-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-2 inline-block"
          >
            {t("backToOrders")}
          </Link>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white">{t("title")} {shortId}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{t("placedOn", { date: formattedDate })}</p>
        </div>

        <Link
          href={`/checkout/success?session_id=${order.stripeSessionId}`}
          className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors bg-white dark:bg-transparent shadow-sm"
        >
          <Download className="w-4 h-4" />
          {t("downloadInvoice")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 flex flex-col gap-5">

          <OrderStatusTracker status={order.status ?? "pending"} t={t} />

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-5">{t("yourSelection")}</h2>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {order.items?.map((item: OrderItem) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-neutral-400 dark:text-neutral-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 dark:text-white text-base">{item.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {t("qty")} <span className="text-neutral-800 dark:text-neutral-300 font-semibold">{item.quantity}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-black text-neutral-900 dark:text-white">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      ${Number(item.price).toFixed(2)} {t("each")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
              {t("deliveryAddress")}
            </p>
            <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span className="text-neutral-700 dark:text-neutral-300">
                {t("deliveredToAddress")}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">
              {t("paymentMethod")}
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-widest">
                VISA
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">{t("visaEnding")}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-600">{t("viaStripe")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
            <h3 className="text-base font-black text-neutral-900 dark:text-white mb-4">{t("financialHearth")}</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{t("subtotal")}</span>
                <span className="text-neutral-800 dark:text-neutral-300 font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{t("deliveryFee")}</span>
                <span className="text-neutral-800 dark:text-neutral-300 font-semibold">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>{t("estimatedTax")}</span>
                <span className="text-neutral-800 dark:text-neutral-300 font-semibold">${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4">
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">{t("totalAmount")}</p>
              <p className="text-3xl font-black text-neutral-900 dark:text-white">${totalAmount.toFixed(2)}</p>
            </div>

            <form action={reorderOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <button
                type="submit"
                className="mt-5 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white dark:text-white font-black py-3 rounded-xl transition-colors text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {t("reorderThisMeal")}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">{t("needHelp")}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("speakSpecialists")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}