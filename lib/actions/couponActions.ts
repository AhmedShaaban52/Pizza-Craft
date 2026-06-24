"use server";

import { db } from "@/lib/db";
import { couponsTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function validateCoupon(code: string, subtotal: number) {
  const [coupon] = await db
    .select()
    .from(couponsTable)
    .where(eq(couponsTable.code, code.toUpperCase()));

  if (!coupon || !coupon.isActive) {
    return { valid: false, error: "Invalid or inactive coupon" };
  }

  const now = new Date();
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    return { valid: false, error: "Coupon not yet active" };
  }
  if (coupon.endDate && new Date(coupon.endDate) < now) {
    return { valid: false, error: "Coupon has expired" };
  }
  if (coupon.maxUses && (coupon.usedCount ?? 0) >= coupon.maxUses) {
    return { valid: false, error: "Coupon usage limit reached" };
  }
  if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
    return {
      valid: false,
      error: `Minimum order amount is $${coupon.minOrderAmount}`,
    };
  }

  let discount = 0;
  if (coupon.discountType === "percent") {
    discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
  } else {
    discount = parseFloat(coupon.discountValue);
  }

  return { valid: true, discount: parseFloat(discount.toFixed(2)), coupon };
}
