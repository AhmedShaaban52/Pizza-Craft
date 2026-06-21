interface PriceInput {
  price: string | number;
  discountType: "percent" | "amount" | null;
  discountValue: string | number | null;
}

export function getFinalPrice(item: PriceInput): number {
  const base = Number(item.price);
  if (!item.discountType || !item.discountValue) return base;
  const discount = Number(item.discountValue);
  return item.discountType === "percent"
    ? base - (base * discount) / 100
    : Math.max(0, base - discount);
}
