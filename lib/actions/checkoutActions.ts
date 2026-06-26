"use server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/requireUser";
import { desc, eq, sql } from "drizzle-orm";
import { getCartItems } from "@/lib/cart-actions";
import {
  cartsTable,
  couponsTable,
  orderItemsTable,
  ordersTable,
} from "../schema";
import { OrderWithItems } from "../types";

function getFinalPrice(item: {
  price: string;
  discountType?: string | null;
  discountValue?: string | null;
}): number {
  const price = parseFloat(item.price);
  if (!item.discountType || !item.discountValue) return price;
  const discount = parseFloat(item.discountValue);
  if (item.discountType === "percent") return price - (price * discount) / 100;
  if (item.discountType === "amount") return Math.max(0, price - discount);
  return price;
}

export async function createCheckoutSession(
  couponCode?: string,
  couponDiscount?: number,
) {
  const user = await requireUser();

  const cartResult = await getCartItems();
  if (!cartResult.success || !cartResult.data?.length) {
    return { error: "Cart is empty" };
  }

  const items = cartResult.data.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    discountType: item.product.discountType,
    discountValue: item.product.discountValue,
  }));

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(getFinalPrice(item) * 100),
    },
    quantity: item.quantity,
  }));

  const discounts: { coupon: string }[] = [];
  if (couponDiscount && couponDiscount > 0) {
    try {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(couponDiscount * 100),
        currency: "usd",
        duration: "once",
        name: `Coupon: ${couponCode}`,
      });
      discounts.push({ coupon: stripeCoupon.id });
    } catch (err) {
      console.error("Stripe coupon error:", err);
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    discounts,
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      userId: user.id,
      couponCode: couponCode || "",
      items: JSON.stringify(
        items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
          image: i.image,
        })),
      ),
    },
  });

  return { url: session.url };
}

export async function confirmOrder(sessionId: string) {
  const existing = await db
    .select({ id: ordersTable.id })
    .from(ordersTable)
    .where(eq(ordersTable.stripeSessionId, sessionId));

  if (existing.length > 0) return { success: true };

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    return { success: false, error: "Payment not completed" };
  }

  const userId = session.metadata?.userId;
  const miniItems = JSON.parse(session.metadata?.items || "[]");
  const couponCode = session.metadata?.couponCode;

  if (!userId) return { success: false, error: "Missing user data" };

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId,
      stripeSessionId: sessionId,
      stripePaymentIntent: session.payment_intent as string,
      total: ((session.amount_total ?? 0) / 100).toFixed(2),
      status: "paid",
    })
    .returning();

  const lineItems = session.line_items?.data || [];

  await db.insert(orderItemsTable).values(
    miniItems.map(
      (
        item: { productId: string; quantity: number; image: string },
        index: number,
      ) => {
        const stripeLineItem = lineItems[index];
        return {
          orderId: order.id,
          productId: item.productId,
          name: stripeLineItem?.description || "Product",
          image: item.image || "",
          price: (
            (stripeLineItem?.amount_total ?? 0) /
            (item.quantity * 100)
          ).toFixed(2),
          quantity: item.quantity,
        };
      },
    ),
  );

  await db.delete(cartsTable).where(eq(cartsTable.userId, userId));

  if (couponCode) {
    await db
      .update(couponsTable)
      .set({ usedCount: sql`${couponsTable.usedCount} + 1` })
      .where(eq(couponsTable.code, couponCode));
  }

  return { success: true };
}

export async function getUserOrders(): Promise<{
  success: boolean;
  data: OrderWithItems[];
}> {
  try {
    const user = await requireUser();

    const rows = await db
      .select()
      .from(ordersTable)
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .where(eq(ordersTable.userId, user.id))
      .orderBy(desc(ordersTable.createdAt));

    const ordersMap = rows.reduce(
      (acc, row) => {
        const order = row.orders;
        const item = row.order_items;

        if (!acc[order.id]) {
          acc[order.id] = { ...order, items: [] };
        }

        if (item) {
          acc[order.id].items.push(item);
        }

        return acc;
      },
      {} as Record<string, OrderWithItems>,
    );

    return { success: true, data: Object.values(ordersMap) };
  } catch {
    return { success: false, data: [] };
  }
}
