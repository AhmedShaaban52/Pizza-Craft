"use server";

import { db } from "@/lib/db";
import { couponsTable } from "@/lib/schema";
import { couponSchema } from "@/lib/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getCoupons() {
  try {
    const data = await db
      .select()
      .from(couponsTable)
      .orderBy(couponsTable.createdAt);

    return { success: true as const, data };
  } catch (err) {
    console.error(err);
    return { success: false as const, error: "Failed to fetch coupons" };
  }
}

export async function getCouponById(
  id: string,
): Promise<ActionResult<typeof couponsTable.$inferSelect>> {
  try {
    const [data] = await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.id, id));
    if (!data) return { success: false, error: "Coupon not found" };
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to fetch coupon" };
  }
}

export async function createCoupon(formData: FormData): Promise<ActionResult> {
  try {
    const raw = {
      code: formData.get("code"),
      discountType: formData.get("discountType") || undefined,
      discountValue: formData.get("discountValue"),
      minOrderAmount: formData.get("minOrderAmount") || undefined,
      maxUses: formData.get("maxUses") || undefined,
      startDate: formData.get("startDate") || undefined,
      endDate: formData.get("endDate") || undefined,
      isActive: formData.get("isActive"),
    };

    const parsed = couponSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    await db.insert(couponsTable).values({
      code: parsed.data.code.toUpperCase(),
      discountType: parsed.data.discountType,
      discountValue: parsed.data.discountValue.toString(),
      minOrderAmount:
        parsed.data.minOrderAmount !== undefined
          ? parsed.data.minOrderAmount.toString()
          : "0",
      maxUses: parsed.data.maxUses ?? null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      isActive: parsed.data.isActive !== "false",
    });

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to create coupon" };
  }
}

export async function updateCoupon(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const raw = {
      code: formData.get("code"),
      discountType: formData.get("discountType") || undefined,
      discountValue: formData.get("discountValue"),
      minOrderAmount: formData.get("minOrderAmount") || undefined,
      maxUses: formData.get("maxUses") || undefined,
      startDate: formData.get("startDate") || undefined,
      endDate: formData.get("endDate") || undefined,
      isActive: formData.get("isActive"),
    };

    const parsed = couponSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      };
    }

    await db
      .update(couponsTable)
      .set({
        code: parsed.data.code.toUpperCase(),
        discountType: parsed.data.discountType,
        discountValue: parsed.data.discountValue.toString(),
        minOrderAmount:
          parsed.data.minOrderAmount !== undefined
            ? parsed.data.minOrderAmount.toString()
            : "0",
        maxUses: parsed.data.maxUses ?? null,
        startDate: parsed.data.startDate
          ? new Date(parsed.data.startDate)
          : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        isActive: parsed.data.isActive !== "false",
        updatedAt: new Date(),
      })
      .where(eq(couponsTable.id, id));

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update coupon" };
  }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  try {
    await db.delete(couponsTable).where(eq(couponsTable.id, id));
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete coupon" };
  }
}
