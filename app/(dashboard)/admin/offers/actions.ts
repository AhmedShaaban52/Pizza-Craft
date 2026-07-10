"use server";

import { db } from "@/lib/db";
import { offersTable } from "@/lib/schema";
import { offerSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getOffers() {
  try {
    const data = await db
      .select()
      .from(offersTable)
      .orderBy(offersTable.createdAt);

    return { success: true as const, data };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to fetch offers" };
  }
}

export async function getOfferById(
  id: string,
): Promise<ActionResult<typeof offersTable.$inferSelect>> {
  try {
    const [data] = await db
      .select()
      .from(offersTable)
      .where(eq(offersTable.id, id));
    if (!data) return { success: false, error: "Offer not found" };
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to fetch offer" };
  }
}

export async function createOffer(formData: FormData): Promise<ActionResult> {
  try {
    const imageVal = formData.get("image");
    const imageUrl = typeof imageVal === "string" ? imageVal : "";

    if (!imageUrl) {
      return { success: false, error: "Image is required" };
    }

    const raw = {
      name: formData.get("name"),
      nameAr: formData.get("nameAr"),
      description: formData.get("description"),
      descriptionAr: formData.get("descriptionAr"),
      image: imageUrl,
      discount: formData.get("discount"),
      startDate: formData.get("startDate") || undefined,
      endDate: formData.get("endDate") || undefined,
    };

    const parsed = offerSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    await db.insert(offersTable).values({
      name: parsed.data.name,
      nameAr: parsed.data.nameAr || null,
      description: parsed.data.description || null,
      descriptionAr: parsed.data.descriptionAr || null,
      image: imageUrl,
      discount: parsed.data.discount,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    });

    revalidatePath("/admin/offers");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create offer" };
  }
}

export async function updateOffer(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const imageVal = formData.get("image");
    const imageUrl =
      typeof imageVal === "string" && imageVal ? imageVal : undefined;

    const raw = {
      name: formData.get("name"),
      nameAr: formData.get("nameAr"),
      description: formData.get("description"),
      descriptionAr: formData.get("descriptionAr"),
      image: imageUrl || "temporary_bypass_value",
      discount: formData.get("discount"),
      startDate: formData.get("startDate") || undefined,
      endDate: formData.get("endDate") || undefined,
    };

    const parsed = offerSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    await db
      .update(offersTable)
      .set({
        name: parsed.data.name,
        nameAr: parsed.data.nameAr || null,
        description: parsed.data.description || null,
        descriptionAr: parsed.data.descriptionAr || null,
        ...(imageUrl ? { image: imageUrl } : {}),
        discount: parsed.data.discount,
        startDate: parsed.data.startDate
          ? new Date(parsed.data.startDate)
          : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(offersTable.id, id));

    revalidatePath("/admin/offers");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update offer" };
  }
}

export async function deleteOffer(id: string): Promise<ActionResult> {
  try {
    await db.delete(offersTable).where(eq(offersTable.id, id));
    revalidatePath("/admin/offers");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete offer" };
  }
}
