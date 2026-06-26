import { getOrders } from "./actions";
import { OrdersTable } from "./_components/OrdersTable";

export const revalidate = 0;

export default async function OrdersPage() {
    const result = await getOrders();
    const orders = result.success ? result.data ?? [] : [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Orders
            </h1>
            <OrdersTable orders={orders} />
        </div>
    );
}