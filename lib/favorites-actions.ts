"use server";

import { db } from "@/lib/db";
import { favoritesTable, productsTable, categoriesTable } from "@/lib/schema";
import { requireUser } from "@/lib/requireUser";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function toggleFavorite(
  productId: string,
): Promise<ActionResult<{ favorited: boolean }>> {
  try {
    const user = await requireUser();

    const existing = await db
      .select()
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, user.id),
          eq(favoritesTable.productId, productId),
        ),
      );

    if (existing.length > 0) {
      await db
        .delete(favoritesTable)
        .where(eq(favoritesTable.id, existing[0].id));
      revalidatePath("/favorites");
      revalidatePath("/products");
      return { success: true, data: { favorited: false } };
    } else {
      await db.insert(favoritesTable).values({ userId: user.id, productId });
      revalidatePath("/favorites");
      revalidatePath("/products");
      return { success: true, data: { favorited: true } };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update favorites" };
  }
}

export async function getFavorites() {
  try {
    const user = await requireUser();

    const data = await db
      .select({
        id: favoritesTable.id,
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
      .from(favoritesTable)
      .innerJoin(productsTable, eq(favoritesTable.productId, productsTable.id))
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(eq(favoritesTable.userId, user.id))
      .orderBy(favoritesTable.createdAt);

    return { success: true as const, data };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to fetch favorites" };
  }
}

export async function getUserFavoriteIds(): Promise<string[]> {
  try {
    const user = await requireUser();
    const data = await db
      .select({ productId: favoritesTable.productId })
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, user.id));
    return data.map((d) => d.productId);
  } catch {
    return [];
  }
}

export async function getFavoritesCount(): Promise<number> {
  try {
    const user = await requireUser();
    const data = await db
      .select({ id: favoritesTable.id })
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, user.id));
    return data.length;
  } catch {
    return 0;
  }
}

export async function isProductFavorited(productId: string): Promise<boolean> {
  try {
    const user = await requireUser();
    const existing = await db
      .select({ id: favoritesTable.id })
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, user.id),
          eq(favoritesTable.productId, productId),
        ),
      );
    return existing.length > 0;
  } catch {
    return false;
  }
}