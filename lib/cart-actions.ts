"use server";

import { db } from "@/lib/db";
import { cartsTable, productsTable, categoriesTable } from "@/lib/schema";
import { requireUser } from "@/lib/requireUser";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function addToCart(
  productId: string,
  quantity: number = 1,
): Promise<ActionResult> {
  try {
    const user = await requireUser();

    const existing = await db
      .select()
      .from(cartsTable)
      .where(
        and(
          eq(cartsTable.userId, user.id),
          eq(cartsTable.productId, productId),
        ),
      );

    if (existing.length > 0) {
      await db
        .update(cartsTable)
        .set({
          quantity: existing[0].quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartsTable.id, existing[0].id));
    } else {
      await db.insert(cartsTable).values({
        userId: user.id,
        productId,
        quantity,
      });
    }

    revalidatePath("/cart");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function updateCartQuantity(
  cartId: string,
  quantity: number,
): Promise<ActionResult> {
  try {
    if (quantity < 1) {
      return removeFromCart(cartId);
    }

    await db
      .update(cartsTable)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartsTable.id, cartId));

    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update quantity" };
  }
}

export async function removeFromCart(cartId: string): Promise<ActionResult> {
  try {
    await db.delete(cartsTable).where(eq(cartsTable.id, cartId));
    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to remove from cart" };
  }
}

export async function getCartItems() {
  try {
    const user = await requireUser();

    const data = await db
      .select({
        id: cartsTable.id,
        quantity: cartsTable.quantity,
        product: {
          id: productsTable.id,
          name: productsTable.name,
          image: productsTable.image,
          price: productsTable.price,
          discountType: productsTable.discountType,
          discountValue: productsTable.discountValue,
        },
        category: {
          name: categoriesTable.name,
        },
      })
      .from(cartsTable)
      .innerJoin(productsTable, eq(cartsTable.productId, productsTable.id))
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(eq(cartsTable.userId, user.id))
      .orderBy(cartsTable.createdAt);

    return { success: true as const, data };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to fetch cart" };
  }
}

export async function getCartCount(): Promise<number> {
  try {
    const user = await requireUser();
    const items = await db
      .select({ quantity: cartsTable.quantity })
      .from(cartsTable)
      .where(eq(cartsTable.userId, user.id));
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

export async function getCartQuantityForProduct(
  productId: string,
): Promise<{ cartId: string | null; quantity: number }> {
  try {
    const user = await requireUser();
    const [existing] = await db
      .select({ id: cartsTable.id, quantity: cartsTable.quantity })
      .from(cartsTable)
      .where(
        and(
          eq(cartsTable.userId, user.id),
          eq(cartsTable.productId, productId),
        ),
      );

    if (!existing) return { cartId: null, quantity: 0 };
    return { cartId: existing.id, quantity: existing.quantity };
  } catch {
    return { cartId: null, quantity: 0 };
  }
}
