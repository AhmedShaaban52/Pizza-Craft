import { getUserOrders, reorderOrder } from "@/lib/actions/checkoutActions";
import { requireUser } from "@/lib/requireUser";
import { ShoppingBag, RotateCcw, ChevronRight, Zap, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { OrderItem, OrderWithItems } from "@/lib/types";

export const revalidate = 0;

function StatusBadge({
  status,
  labels,
}: {
  status: string;
  labels: { delivered: string; inProgress: string };
}) {
  if (status === "paid" || status === "delivered") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400" />
        {status === "paid" ? labels.delivered : status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/30 dark:border-yellow-500/40 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
      <Clock className="w-3 h-3" />
      {labels.inProgress}
    </span>
  );
}

export default async function OrdersPage() {
  await requireUser();
  const t = await getTranslations("Orders");

  const result = await getUserOrders();
  const orders = result.success ? result.data ?? [] : [];

  const statusLabels = {
    delivered: t("statusDelivered"),
    inProgress: t("statusInProgress"),
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[75vh] bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="w-20 h-20 text-neutral-300 dark:text-neutral-700" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{t("emptyTitle")}</h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-sm">
          {t("emptySubtitle")}
        </p>
        <Link
          href="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white dark:text-black font-bold px-6 py-3 rounded-xl transition-colors"
        >
          {t("exploreMenu")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 md:px-12 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-neutral-900 dark:text-white">
          {t("titlePart1")} <span className="text-orange-500">{t("titlePart2")}</span>
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm max-w-md">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {orders.map((order: OrderWithItems) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const shortId = `#PC-${order.id.slice(0, 4).toUpperCase()}`;
          const isPaid = order.status === "paid";
          const itemCount = order.items?.length ?? 0;
          const extraCount = itemCount - 3;

          return (
            <div
              key={order.id}
              className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:border-neutral-200 dark:hover:border-neutral-700 duration-500 transition-all shadow-sm"
            >
              <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-2">
                <div>
                  <StatusBadge status={order.status ?? "pending"} labels={statusLabels} />
                  <h2 className="text-xl font-black text-neutral-900 dark:text-white mt-2">{shortId}</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {formattedDate} · {t("itemsCount", { count: itemCount })}
                  </p>
                </div>
                <span className="text-lg font-black text-neutral-900 dark:text-white shrink-0">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>

              <div className="px-5 pb-3 space-y-2">
                {order.items?.slice(0, 3).map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {item.image ? (
                      <div className="relative w-7 h-7 rounded-md overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-neutral-400 dark:text-neutral-600" />
                      </div>
                    )}
                    <span>
                      <span className="text-neutral-800 dark:text-neutral-300 font-medium">{item.quantity}x</span>{" "}
                      {item.name}
                    </span>
                  </div>
                ))}
                {extraCount > 0 && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-600 pl-9">
                    {t("moreItems", { count: extraCount })}
                  </p>
                )}
              </div>

              <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                <Link
                  href={`/profile/orders/${order.id}`}
                  className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold transition-colors"
                >
                  {t("viewDetails")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                {isPaid && (
                  <form action={reorderOrder}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white dark:text-white text-xs font-black px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t("reorder")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}