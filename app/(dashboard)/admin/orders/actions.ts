"use server";

import { db } from "@/lib/db";
import { ordersTable, orderItemsTable } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type AdminOrder } from "@/utils/OrdersFields";

type ActionResult = { success: true } | { success: false; error: string };

export type AdminOrderWithItems = AdminOrder & {
    items: {
        id: string;
        name: string;
        image: string;
        price: string;
        quantity: number;
    }[];
};

export async function getOrders(): Promise<
    { success: true; data: AdminOrderWithItems[] } | { success: false; error: string }
> {
    try {
        const orders = await db
            .select()
            .from(ordersTable)
            .orderBy(desc(ordersTable.createdAt));

        const items = await db.select().from(orderItemsTable);

        const data: AdminOrderWithItems[] = orders.map((order) => ({
            ...order,
            items: items.filter((item) => item.orderId === order.id).map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
            })),
        }));

        return { success: true, data };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to fetch orders" };
    }
}

export async function updateOrder(id: string, formData: FormData): Promise<ActionResult> {
    try {
        const status = formData.get("status") as string;
        if (!status) return { success: false, error: "Status is required" };

        const [order] = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.id, id));

        if (!order) return { success: false, error: "Order not found" };

        await db
            .update(ordersTable)
            .set({ status, updatedAt: new Date() })
            .where(eq(ordersTable.id, id));

        if (status === "refunded" && order.stripePaymentIntent) {
            try {
                await stripe.refunds.create({ payment_intent: order.stripePaymentIntent });
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "";
                if (!msg.includes("already been refunded") && !msg.includes("charge_already_refunded")) {
                    return { success: false, error: `Stripe refund failed: ${msg}` };
                }
            }
        }

        if (status === "cancelled" && order.stripePaymentIntent) {
            try {
                await stripe.paymentIntents.cancel(order.stripePaymentIntent);
            } catch {
            }
        }

        revalidatePath("/admin/orders");
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Failed to update order" };
    }
}

export async function createOrder(): Promise<ActionResult> {
    return { success: false, error: "Orders are created automatically via Stripe." };
}

export async function deleteOrder(): Promise<ActionResult> {
    return { success: false, error: "Orders cannot be deleted." };
}