"use server";

import { db } from "@/lib/db";
import { productsTable, categoriesTable } from "@/lib/schema";
import { productSchema } from "@/lib/types";
import { and, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getProducts() {
  try {
    const data = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        thumbnails: productsTable.thumbnails,
        price: productsTable.price,
        discountType: productsTable.discountType,
        discountValue: productsTable.discountValue,
        categoryId: productsTable.categoryId,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          description: categoriesTable.description,
          image: categoriesTable.image,
          isActive: categoriesTable.isActive,
          createdAt: categoriesTable.createdAt,
          updatedAt: categoriesTable.updatedAt,
        },
      })
      .from(productsTable)
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .orderBy(productsTable.createdAt);

    return { success: true as const, data };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to fetch products" };
  }
}

export async function getProductById(
  id: string,
): Promise<ActionResult<typeof productsTable.$inferSelect>> {
  try {
    const [data] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!data) return { success: false, error: "Product not found" };
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    const raw = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      thumbnails: formData.get("thumbnails"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId"),
      discountType: formData.get("discountType") || undefined,
      discountValue: formData.get("discountValue") || undefined,
      isActive: formData.get("isActive"),
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    const imageUrl = typeof raw.image === "string" ? raw.image : "";
    if (!imageUrl) {
      return { success: false, error: "Image is required" };
    }

    let thumbnailsArr: string[] | null = null;
    if (typeof raw.thumbnails === "string" && raw.thumbnails.trim()) {
      thumbnailsArr = raw.thumbnails
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    await db.insert(productsTable).values({
      name: parsed.data.name,
      description: parsed.data.description || null,
      image: imageUrl,
      thumbnails: thumbnailsArr,
      price: parsed.data.price.toString(),
      categoryId: parsed.data.categoryId,
      discountType: parsed.data.discountType ?? null,
      discountValue:
        parsed.data.discountValue !== undefined
          ? parsed.data.discountValue.toString()
          : null,
      isActive: parsed.data.isActive !== "false",
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const raw = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      thumbnails: formData.get("thumbnails"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId"),
      discountType: formData.get("discountType") || undefined,
      discountValue: formData.get("discountValue") || undefined,
      isActive: formData.get("isActive"),
    };

    const parsed = productSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    const imageUrl =
      typeof raw.image === "string" && raw.image ? raw.image : undefined;

    let thumbnailsArr: string[] | undefined;
    if (typeof raw.thumbnails === "string") {
      thumbnailsArr = raw.thumbnails.trim()
        ? raw.thumbnails
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    }

    await db
      .update(productsTable)
      .set({
        name: parsed.data.name,
        description: parsed.data.description || null,
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(thumbnailsArr !== undefined ? { thumbnails: thumbnailsArr } : {}),
        price: parsed.data.price.toString(),
        categoryId: parsed.data.categoryId,
        discountType: parsed.data.discountType ?? null,
        discountValue:
          parsed.data.discountValue !== undefined
            ? parsed.data.discountValue.toString()
            : null,
        isActive: parsed.data.isActive !== "false",
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id));

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete product" };
  }
}

export interface SearchResult {
  id: string;
  name: string;
  image: string;
  price: string;
  categoryName: string | null;
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const results = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        image: productsTable.image,
        price: productsTable.price,
        categoryName: categoriesTable.name,
      })
      .from(productsTable)
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(
        and(
          eq(productsTable.isActive, true),
          or(
            ilike(productsTable.name, `%${trimmed}%`),
            ilike(productsTable.description, `%${trimmed}%`),
          ),
        ),
      )
      .limit(8);

    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getProductsBySearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return { success: true as const, data: [] };

  try {
    const results = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        thumbnails: productsTable.thumbnails,
        price: productsTable.price,
        discountType: productsTable.discountType,
        discountValue: productsTable.discountValue,
        categoryId: productsTable.categoryId,
        isActive: productsTable.isActive,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          description: categoriesTable.description,
          image: categoriesTable.image,
          isActive: categoriesTable.isActive,
          createdAt: categoriesTable.createdAt,
          updatedAt: categoriesTable.updatedAt,
        },
      })
      .from(productsTable)
      .leftJoin(
        categoriesTable,
        eq(productsTable.categoryId, categoriesTable.id),
      )
      .where(
        and(
          eq(productsTable.isActive, true),
          or(
            ilike(productsTable.name, `%${trimmed}%`),
            ilike(productsTable.description, `%${trimmed}%`),
          ),
        ),
      )
      .orderBy(productsTable.createdAt);

    return { success: true as const, data: results };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to search products" };
  }
}
