"use server";

import { db } from "@/lib/db";
import { categoriesTable } from "@/lib/schema";
import { categorySchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getCategories(): Promise<
  ActionResult<(typeof categoriesTable.$inferSelect)[]>
> {
  try {
    const data = await db
      .select()
      .from(categoriesTable)
      .orderBy(categoriesTable.createdAt);
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(
  id: string,
): Promise<ActionResult<typeof categoriesTable.$inferSelect>> {
  try {
    const [data] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id));
    if (!data) return { success: false, error: "Category not found" };
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function createCategory(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const raw = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      isActive: formData.get("isActive"),
    };

    const parsed = categorySchema.safeParse(raw);
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

    await db.insert(categoriesTable).values({
      name: parsed.data.name,
      description: parsed.data.description || null,
      image: imageUrl,
      isActive: parsed.data.isActive !== "false",
    });

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const raw = {
      name: formData.get("name"),
      description: formData.get("description"),
      image: formData.get("image"),
      isActive: formData.get("isActive"),
    };

    const parsed = categorySchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    const imageUrl =
      typeof raw.image === "string" && raw.image ? raw.image : undefined;

    await db
      .update(categoriesTable)
      .set({
        name: parsed.data.name,
        description: parsed.data.description || null,
        ...(imageUrl ? { image: imageUrl } : {}),
        isActive: parsed.data.isActive !== "false",
        updatedAt: new Date(),
      })
      .where(eq(categoriesTable.id, id));

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete category" };
  }
}
