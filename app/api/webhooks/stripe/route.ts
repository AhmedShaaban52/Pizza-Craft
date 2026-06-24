import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { ordersTable, orderItemsTable, cartsTable, couponsTable } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err: unknown) {
        return new Response(
            `Webhook Error: ${err instanceof Error ? err.message : "Unknown"}`,
            { status: 400 },
        );
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const couponCode = session.metadata?.couponCode;
        const items = JSON.parse(session.metadata?.items || "[]");

        if (!userId) return new Response("Missing userId", { status: 400 });

        // Idempotency check
        const existing = await db
            .select({ id: ordersTable.id })
            .from(ordersTable)
            .where(eq(ordersTable.stripeSessionId, session.id));

        if (existing.length > 0) return new Response(null, { status: 200 });

        const [order] = await db
            .insert(ordersTable)
            .values({
                userId,
                stripeSessionId: session.id,
                stripePaymentIntent: session.payment_intent as string,
                total: ((session.amount_total ?? 0) / 100).toFixed(2),
                status: "paid",
            })
            .returning();

        await db.insert(orderItemsTable).values(
            items.map((item: { productId: string; name: string; image: string; price: string; quantity: number }) => ({
                orderId: order.id,
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
            })),
        );

        await db.delete(cartsTable).where(eq(cartsTable.userId, userId));

        if (couponCode) {
            await db
                .update(couponsTable)
                .set({ usedCount: sql`${couponsTable.usedCount} + 1` })
                .where(eq(couponsTable.code, couponCode));
        }
    }

    return new Response(null, { status: 200 });
}